#!/usr/bin/env python3
"""Import the leaderboard history CSV into data/leaderboard/leaderboard.json.

Usage: python3 -I scripts/import_leaderboard.py <leaderboard_history.csv>

The CSV is the append-only record: top 3 funds per category x period (3/5/10
years) per quarter, from the Disclose Register. History is append only; this
importer never reorders or rewrites published quarters, it only re-expresses
the CSV as the page's data contract (leaderboard-data v3 shape: per-category
funds {id: {name, colour}}, pods, rib arrays, quarter label arrays).

Colours: one colour per fund within its category, identical across ribbon,
podium bars and legend. Assignments are pinned in scripts/leaderboard_colours.json
(the approved design's map); a fund not yet in the seed gets the next palette
colour not used in its category, and the seed should then be updated so the
assignment stays stable quarter to quarter.
"""
import csv, json, os, re, sys

CSV_PATH = sys.argv[1]
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'data', 'leaderboard')
SEED_PATH = os.path.join(HERE, 'leaderboard_colours.json')

CATS = [('def', 'Defensive'), ('con', 'Conservative'), ('bal', 'Balanced'),
        ('gro', 'Growth'), ('agg', 'Aggressive')]
PERIODS = [('p3', '3'), ('p5', '5'), ('p10', '10')]

# Anchored provider colours (design system), then the secondary palette for
# everyone else, in assignment order.
ANCHORS = {
    'Milford': '#783CF0', 'Simplicity': '#00A356', 'Generate': '#F6862A',
    'Fisher Funds': '#0150EB', 'Pathfinder': '#F1375C', 'Kernel': '#FFB236',
    'Booster': '#339CFD',
}
PALETTE = ['#00D671', '#E8795A', '#4C6FFF', '#8A5A2B', '#5E6E9E', '#D14FA2',
           '#2E8B8B', '#C9A227', '#B05BD6', '#0E8577', '#A8323E', '#6B8E23',
           '#B86B00', '#4169E1', '#8B5F8F', '#2F6F4F']


def short_name(scheme):
    return re.sub(r'\s+KiwiSaver\s+(Superannuation\s+)?(Scheme|Plan)$', '', scheme).strip()


def display_name(r):
    f = r['fund'].strip()
    p = short_name(r['provider'])
    if not f.lower().startswith(p.lower()):
        f = p + ' ' + f
    return re.sub(r'\s+Fund$', '', f)


rows = list(csv.DictReader(open(CSV_PATH, newline='', encoding='utf-8-sig')))
quarters = sorted({r['quarter_end'] for r in rows})
latest = quarters[-1]
by_id = {}
for r in rows:
    by_id.setdefault(r['fund_id'], r)

seed = json.load(open(SEED_PATH)) if os.path.exists(SEED_PATH) else {}

y0, m0 = int(quarters[0][:4]), int(quarters[0][5:7])
q0 = (m0 + 2) // 3
labels, labels_full = [], []
for i in range(len(quarters)):
    t = (y0 * 4 + q0 - 1) + i
    q, y = t % 4 + 1, t // 4
    labels.append(f"Q{q} {str(y)[2:]}")
    labels_full.append(f"Q{q} {y}")

cats_out = []
for cid, clabel in CATS:
    sub = [r for r in rows if r['category'] == clabel]
    pods, rib = {}, {}
    used_ids = []  # order of first appearance: ribbons oldest-first, then podiums
    for pk, py in PERIODS:
        prs = [r for r in sub if r['period_yrs'] == py]
        seq = []
        for q in quarters:
            win = next(r for r in prs if r['quarter_end'] == q and r['rank'] == '1')
            seq.append(win['fund_id'])
            if win['fund_id'] not in used_ids:
                used_ids.append(win['fund_id'])
        rib[pk] = ' '.join(seq)
        cur = sorted((r for r in prs if r['quarter_end'] == latest), key=lambda r: int(r['rank']))
        pod = []
        for r in cur:
            e = [r['fund_id'], float(r['return_pa_pct']), float(r['fee_now_pct'])]
            pod.append(e)
            if r['fund_id'] not in used_ids:
                used_ids.append(r['fund_id'])
        pods[pk] = pod

    cat_seed = seed.get(cid, {})
    funds = {}
    taken = set(cat_seed.get(f) for f in used_ids if f in cat_seed)
    for fid in used_ids:
        colour = cat_seed.get(fid)
        if not colour:
            r = by_id[fid]
            p = short_name(r['provider'])
            if p in ANCHORS and ANCHORS[p] not in taken:
                colour = ANCHORS[p]
            else:
                colour = next(c for c in PALETTE if c not in taken)
            taken.add(colour)
            print(f"NOTE: new fund {fid} ({display_name(r)}) in {clabel}: assigned {colour}; pin it in leaderboard_colours.json")
        funds[fid] = {'name': display_name(by_id[fid]), 'colour': colour}

    eligible = int(next(r for r in sub if r['quarter_end'] == latest and r['period_yrs'] == '3')['eligible_funds'])
    notes = {r['fund_id']: r['note'].strip() for r in sub
             if r['quarter_end'] == latest and (r['note'] or '').strip()}
    cat = {'id': cid, 'label': clabel, 'eligible': eligible, 'funds': funds,
           'pods': pods, 'rib': rib}
    if notes:
        cat['notes'] = notes
    cats_out.append(cat)

out = {
    'asOf': latest,
    'quarters': len(quarters),
    'firstQuarter': {'q': q0, 'year': y0},
    'quarterLabels': labels,
    'quarterLabelsFull': labels_full,
    'categories': cats_out,
}

os.makedirs(OUT, exist_ok=True)
json.dump(out, open(os.path.join(OUT, 'leaderboard.json'), 'w'), indent=1)
print(f"quarters: {len(quarters)} ({quarters[0]} -> {latest})")
for c in cats_out:
    print(' ', c['label'], 'funds:', len(c['funds']))

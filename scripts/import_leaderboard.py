#!/usr/bin/env python3
"""Import the leaderboard history CSV into data/leaderboard/leaderboard.json.

Usage: python3 -I scripts/import_leaderboard.py <leaderboard_history.csv>

The CSV is the append-only record: top 3 funds per category x period (3/5/10
years) per quarter, from the Disclose Register. History is append only; this
importer never reorders or rewrites published quarters, it only re-expresses
the CSV as the page's data contract.

Colours: one colour per fund, stable across ribbon, podium bars and legend.
Each provider gets a base colour (the nine design-system assignments are
anchored); additional funds of the same provider take lightness variants of
the provider's base so reigns remain distinguishable within a category.
"""
import csv, json, os, sys, colorsys

CSV_PATH = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'data', 'leaderboard')

# Design-system provider colours (from the approved data contract).
ANCHORS = {
    'Milford': '#783CF0', 'Simplicity': '#00A356', 'Generate': '#F6862A',
    'Fisher Funds': '#0150EB', 'Pathfinder': '#F1375C', 'Kernel': '#FFB236',
    'Booster': '#339CFD', 'ANZ': '#242E54', 'Mercer': '#7DBEFF',
}

CATS = [('def', 'Defensive'), ('con', 'Conservative'), ('bal', 'Balanced'),
        ('gro', 'Growth'), ('agg', 'Aggressive')]
PERIODS = [('p3', '3'), ('p5', '5'), ('p10', '10')]


def short_name(scheme):
    import re
    return re.sub(r'\s+KiwiSaver\s+(Superannuation\s+)?(Scheme|Plan)$', '', scheme).strip()


def hex_to_hls(h):
    h = h.lstrip('#')
    r, g, b = (int(h[i:i+2], 16)/255 for i in (0, 2, 4))
    return colorsys.rgb_to_hls(r, g, b)


def hls_to_hex(h, l, s):
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return '#%02X%02X%02X' % (round(r*255), round(g*255), round(b*255))


rows = list(csv.DictReader(open(CSV_PATH, newline='', encoding='utf-8-sig')))
for r in rows:
    r['_short'] = short_name(r['provider'])

quarters = sorted({r['quarter_end'] for r in rows})
latest = quarters[-1]

# --- provider base colours ---
providers = sorted({r['_short'] for r in rows})
base = {}
anchor_hues = [hex_to_hls(v)[0] for v in ANCHORS.values()]
golden = 0.381966
hue = 0.08
for p in providers:
    if p in ANCHORS:
        base[p] = hex_to_hls(ANCHORS[p])
        continue
    # next hue not too close to an anchor hue
    for _ in range(20):
        hue = (hue + golden) % 1.0
        if all(min(abs(hue-a), 1-abs(hue-a)) > 0.035 for a in anchor_hues):
            break
    base[p] = (hue, 0.46, 0.62)

# --- fund colours: provider base, siblings take lightness variants ---
fund_meta = {}   # fund_id -> dict
per_provider = {}
for r in rows:
    fid = r['fund_id'].lower()
    if fid in fund_meta:
        continue
    k = len(per_provider.setdefault(r['_short'], []))
    per_provider[r['_short']].append(fid)
    h, l, s = base[r['_short']]
    # variant 0 = base; then darker, lighter, darker still, lighter still
    steps = [0, -0.16, 0.16, -0.28, 0.26, -0.08, 0.08]
    l2 = min(0.80, max(0.20, l + steps[k % len(steps)]))
    label = r['fund'].strip()
    if not label.lower().startswith(r['_short'].lower()):
        label = f"{r['_short']} {label}"
    fund_meta[fid] = {'name': label, 'colour': hls_to_hex(h, l2, s)}

# --- categories ---
cats_out = []
for cid, clabel in CATS:
    sub = [r for r in rows if r['category'] == clabel]
    funds_in_cat = {}
    podium, history, eligible = {}, {}, {}
    for pk, py in PERIODS:
        prs = [r for r in sub if r['period_yrs'] == py]
        hist = []
        for q in quarters:
            win = next(r for r in prs if r['quarter_end'] == q and r['rank'] == '1')
            hist.append(win['fund_id'].lower())
        history[pk] = hist
        cur = sorted((r for r in prs if r['quarter_end'] == latest), key=lambda r: int(r['rank']))
        pod = []
        for r in cur:
            e = {'fund': r['fund_id'].lower(),
                 'returnPct': float(r['return_pa_pct']),
                 'feePct': float(r['fee_now_pct'])}
            if (r['note'] or '').strip():
                e['note'] = r['note'].strip()
            pod.append(e)
        podium[pk] = pod
        eligible[pk] = int(cur[0]['eligible_funds'])
        for r in prs:
            funds_in_cat[r['fund_id'].lower()] = fund_meta[r['fund_id'].lower()]['name']
    cats_out.append({'id': cid, 'label': clabel, 'funds': funds_in_cat,
                     'podium': podium, 'history': history, 'eligible': eligible})

# --- legibility pass: within each category, winners' colours must be clearly
# distinct; nudge lightness apart until every pair is readable ---
def _rgb(hx):
    hx = hx.lstrip('#')
    return tuple(int(hx[i:i+2], 16) for i in (0, 2, 4))

def _dist(a, b):
    return sum((x-y)**2 for x, y in zip(_rgb(a), _rgb(b))) ** 0.5

fund_hls = {}
for c in cats_out:
    winners = sorted({f for p in ('p3', 'p5', 'p10') for f in c['history'][p]})
    for _ in range(12):
        moved = False
        for i in range(len(winners)):
            for j in range(i+1, len(winners)):
                a, b = winners[i], winners[j]
                if _dist(fund_meta[a]['colour'], fund_meta[b]['colour']) < 70:
                    h, l, s = fund_hls.get(b) or hex_to_hls(fund_meta[b]['colour'])
                    l = l + 0.20 if l < 0.5 else l - 0.20
                    l = min(0.82, max(0.18, l))
                    h = (h + 0.06) % 1.0
                    fund_hls[b] = (h, l, s)
                    fund_meta[b]['colour'] = hls_to_hex(h, l, s)
                    moved = True
        if not moved:
            break

fy, fq = quarters[0].split('-')[0], quarters[0].split('-')[1]
first_q = {'q': (int(fq) + 2) // 3, 'year': int(fy)}

out = {
    'asOf': latest,
    'quarters': len(quarters),
    'firstQuarter': first_q,
    'providers': {fid: m for fid, m in fund_meta.items()},
    'categories': cats_out,
}

os.makedirs(OUT, exist_ok=True)
json.dump(out, open(os.path.join(OUT, 'leaderboard.json'), 'w'), indent=1)

print(f"quarters: {len(quarters)} ({quarters[0]} -> {latest}), funds: {len(fund_meta)}, providers: {len(providers)}")
for c in cats_out:
    n1 = {len(set(c['history'][p])) for p in ('p3', 'p5', 'p10')}
    print(' ', c['label'], 'funds in cat:', len(c['funds']), '#1 funds per period:', sorted(n1))

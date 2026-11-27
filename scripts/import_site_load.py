#!/usr/bin/env python3
"""Import the BetterSaver site-load CSV into data/finder/*.json.

Usage: python3 -I scripts/import_site_load.py <site_load.csv> <data_as_at YYYY-MM-DD>

Generates schemes.json, funds.json, categories.json and updates review.json's
data_as_at. Restricted flags are carried over from the existing schemes.json
(the CSV doesn't carry them); new schemes default to not restricted.
"""
import csv, json, re, sys, os
from datetime import datetime

CSV_PATH, AS_AT = sys.argv[1], sys.argv[2]
OUT = os.path.join(os.path.dirname(__file__), '..', 'data', 'finder')

CAT_ORDER = ['Aggressive', 'Growth', 'Balanced', 'Conservative', 'Defensive', 'Other']
# Single-sector funds roll into Other on the public pages (v3 design)

def slugify(s):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

def short_name(scheme):
    return re.sub(r'\s+KiwiSaver\s+(Superannuation\s+)?(Scheme|Plan)$', '', scheme).strip()

def money(n):
    if n >= 1e9: return f"${n/1e9:.1f} billion".replace('.0 billion', ' billion')
    return f"${n/1e6:.0f} million"

def no_emdash(t):
    """Site-wide copy rule: no em dashes. Split into sentences instead."""
    import re as _re
    t = _re.sub(r'\s+\u2014\s+(\w)', lambda m: '. ' + m.group(1).upper(), t)
    return t.replace('\u2014', '-')


def num(v):
    v = (v or '').strip()
    try:
        return float(v) if v else None
    except ValueError:
        return None

rows = list(csv.DictReader(open(CSV_PATH, newline='', encoding='utf-8-sig')))

# --- categories ---
cats = []
for label in CAT_ORDER:
    sub = [r for r in rows if (('Other' if r['category'].strip() in ('', 'Single-sector') else r['category'].strip())) == label]
    ret = next((num(r['peer_avg_return_5yr']) for r in sub if num(r['peer_avg_return_5yr']) is not None), None)
    fee = next((num(r['peer_avg_fee_pct']) for r in sub if num(r['peer_avg_fee_pct']) is not None), None)
    cats.append({'risk_type': slugify(label), 'label': label, 'fund_count': len(sub),
                 'group_avg_ret5': ret, 'group_avg_fee': fee})

# --- restricted carry-over ---
restricted_slugs = set()
old_path = os.path.join(OUT, 'schemes.json')
if os.path.exists(old_path):
    for s in json.load(open(old_path)):
        if s.get('restricted'):
            restricted_slugs.add(s['scheme_slug'])

# --- funds + schemes ---
funds, schemes = [], {}
for r in rows:
    scheme = r['provider'].strip()
    sslug = slugify(scheme)
    prov = short_name(scheme)
    cat_label = r['category'].strip()
    if cat_label in ('', 'Single-sector'): cat_label = 'Other'
    rtype = slugify(cat_label)
    rec = r['bettersaver_rating'].strip() == 'Recommended'
    ret5 = num(r['return_5yr_pct'])
    peer = num(r['peer_avg_return_5yr'])
    fee = num(r['fee_pct'])

    name = r['fund_name'].strip()
    label = name
    if name.lower() == scheme.lower():
        # named-after-scheme fund: display as provider + generic label
        name = ''
        label = re.sub(r'^.*?(KiwiSaver\s+(Superannuation\s+)?(Scheme|Plan))$', r'\1', scheme)
    elif name.lower().startswith(prov.lower() + ' '):
        name = name[len(prov) + 1:]
        label = name

    variant = ''
    launch_label = expected_label = None
    if not rec:
        if peer is None:
            variant = 'no_group'
        elif ret5 is not None:
            variant = 'failed_check'
        else:
            variant = 'under_5_years'
            d = (r['inception_date'] or '').strip()
            if d:
                try:
                    dt = datetime.strptime(d.split()[0], '%d/%m/%Y')
                    launch_label = dt.strftime('%B %Y')
                    expected_label = dt.replace(year=dt.year + 5, day=1).strftime('%B %Y')
                except ValueError:
                    pass

    growth = num(r.get('growth_target_pct')) 
    if growth is None: growth = num(r.get('growth_actual_pct'))
    risk = (r.get('risk_indicator') or '').strip()
    f = {
        'fund_slug': slugify(r['fund_name']),
        'scheme_slug': sslug,
        'fund_name': name,
        'fund_label': label,
        'risk_type': rtype,
        'public_rating': 'recommended' if rec else 'not_recommended',
        'verdict_variant': variant,
        'fee_pct': fee,
        'ret5_pct': ret5,
        'partnered': r['is_partner'].strip() == 'yes',
        'growth_pct': (round(growth) if growth is not None else None),
        'risk': (int(risk) if risk.isdigit() else None),
        'restricted': sslug in restricted_slugs,
        'status': 'open',
    }
    if launch_label: f['launch_label'] = launch_label
    if expected_label: f['rating_expected_label'] = expected_label
    reason = no_emdash((r.get('fund_list_reason') or '').strip())
    if reason: f['reason'] = reason
    funds.append(f)

    s = schemes.setdefault(sslug, {
        'scheme_slug': sslug, 'scheme_name': scheme, 'provider_name': prov,
        'members': 0, 'value_nzd': 0.0, 'about': no_emdash(r['provider_description'].strip()),
        'partner_flags': [], 'restricted': sslug in restricted_slugs, 'status': 'open',
    })
    s['members'] += int(num(r['num_investors']) or 0)
    s['value_nzd'] += num(r['total_fund_value_nzd']) or 0.0
    s['partner_flags'].append(r['is_partner'].strip() == 'yes')

out_schemes = []
for s in sorted(schemes.values(), key=lambda x: x['scheme_name']):
    flags = s.pop('partner_flags')
    s['partner_state'] = 'all' if all(flags) else ('some' if any(flags) else 'none')
    s['partnered'] = any(flags)
    v = s.pop('value_nzd')
    s['total_value'] = money(v)
    s['total_value_m'] = round(v / 1e6, 1)
    out_schemes.append(s)


# --- ethics / sustainability (simple average of normalised scores across funds) ---
ETHICS = [
    ('Adult entertainment', 'adult_entertainment'),
    ('Alcohol', 'alcohol'),
    ('Animal testing', 'animal_testing'),
    ('Civilian weapons', 'small_arms'),
    ('Gambling', 'gambling'),
    ('Nuclear power', 'nuclear'),
    ('Tobacco', 'tobacco'),
    ('Weapons of war', 'controversial_weapons'),
]

def band_of(avg):
    if avg is None: return None
    if avg <= 0.0: return 'None'
    if avg <= 25.0: return 'Low'
    if avg <= 50.0: return 'Medium'
    if avg <= 75.0: return 'High'
    return 'Highest'

def mean(vals):
    vals = [v for v in vals if v is not None]
    return sum(vals) / len(vals) if vals else None

def sus_score(r):
    v = (r.get('sustainability_score') or '').strip()
    try: return float(v)
    except ValueError: return None

def norm_score(r, prefix):
    v = (r.get(prefix + '_score_normalised') or '').strip()
    try: return float(v)
    except ValueError: return None

market = {'ethics': {}, 'avg_fee_pct': round(mean([num(r['fee_pct']) for r in rows]), 2)}
for label, prefix in ETHICS:
    market['ethics'][label] = band_of(mean([norm_score(r, prefix) for r in rows]))
market_sus_mean = mean([sus_score(r) for r in rows])
market['sustainability_mean'] = round(market_sus_mean, 1) if market_sus_mean is not None else None

by_scheme = {}
for r in rows:
    by_scheme.setdefault(slugify(r['provider'].strip()), []).append(r)

for s in out_schemes:
    sub = by_scheme.get(s['scheme_slug'], [])
    eth = {}
    for label, prefix in ETHICS:
        eth[label] = band_of(mean([norm_score(r, prefix) for r in sub]))
    s['ethics'] = eth
    sus = [sus_score(r) for r in sub]
    sus_rated = [v for v in sus if v is not None]
    s['sus_band'] = band_of(mean(sus_rated)) if sus_rated else None
    s['sus_rated'] = len(sus_rated)
    s['sus_above'] = sum(1 for v in sus_rated if market_sus_mean is not None and v > market_sus_mean)
    # optional provider fact columns, pass through when the CSV gains them
    first = sub[0] if sub else {}
    for col, key in (('provider_started', 'provider_started'), ('provider_nz_owned', 'nz_owned')):
        v = (first.get(col) or '').strip()
        if v:
            s[key] = v
    # a scheme is a default provider when any of its funds is a default fund
    if any((r.get('is_default_fund') or '').strip() == 'yes' for r in sub):
        s['default_provider'] = 'yes'


# --- v4: per-scheme stats, Stands out / Worth weighing bullets, consider list ---
funds_by_scheme = {}
for f in funds:
    funds_by_scheme.setdefault(f['scheme_slug'], []).append(f)
cat_fee = {c['label']: c['group_avg_fee'] for c in cats}
mkt_fee = market['avg_fee_pct']

def fmt_pct(v):
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return s + '%'

def sus_band_row(r):
    return band_of(sus_score(r))

for s in out_schemes:
    sub = by_scheme.get(s['scheme_slug'], [])
    sf = funds_by_scheme.get(s['scheme_slug'], [])
    M = len(sf)
    rec_count = sum(1 for f in sf if f['public_rating'] == 'recommended')
    fees = [f['fee_pct'] for f in sf if f['fee_pct'] is not None]
    avg_fee = round(mean(fees), 2) if fees else None
    s['fund_count'] = M
    s['rec_count'] = rec_count
    s['avg_fee_pct'] = avg_fee

    # performance vs category average (rows with both numbers)
    perf = []
    for r, f in zip(sub, sf):
        ret5, peer = num(r['return_5yr_pct']), num(r['peer_avg_return_5yr'])
        if ret5 is not None and peer is not None:
            perf.append((f['fund_label'], ret5, peer))
    rated = len(perf)
    beats = [p for p in perf if p[1] > p[2]]
    trails = [p for p in perf if p[1] < p[2]]
    under5 = sum(1 for f in sf if f['verdict_variant'] == 'under_5_years')

    # fund-level sustainability bands
    sus_bands = [sus_band_row(r) for r in sub]
    sus_rated = [b for b in sus_bands if b is not None]
    sus_high = sum(1 for b in sus_rated if b in ('High', 'Highest'))
    s['sus_high'] = sus_high

    first = sub[0] if sub else {}

    def norm_bullet(t):
        # marketing rules: one five-level scale, singular variants
        t = no_emdash(t.rstrip('.')).replace('Very High', 'Highest').replace('Very high', 'Highest')
        t = t.replace('1 of its 1 funds with a sustainability rating score',
                      'Its only fund with a sustainability rating scores')
        t = re.sub(r'\b1 of its 1 funds\b', 'its only fund', t)
        return t

    s['sw_good'] = [norm_bullet(v) for i in (1, 2, 3)
                    if (v := (first.get(f'provider_positive_{i}') or '').strip())]
    s['sw_warn'] = [norm_bullet(v) for i in (1, 2, 3)
                    if (v := (first.get(f'provider_negative_{i}') or '').strip())]
    # a metric appears on one side only: drop the weaker complementary perf claim
    if any('five-year record trail' in w for w in s['sw_warn']):
        s['sw_good'] = [g for g in s['sw_good'] if 'five-year record beat' not in g]

# consider: partner schemes, ranked by recommendation rate then size
partners = [s for s in out_schemes if s['partnered']]
partners.sort(key=lambda s: (-(s['rec_count'] / s['fund_count'] if s['fund_count'] else 0), -s['members']))
for s in out_schemes:
    s['consider'] = [p['scheme_slug'] for p in partners if p['scheme_slug'] != s['scheme_slug']][:3]


market['sus_band'] = band_of(market_sus_mean)
json.dump(market, open(os.path.join(OUT, 'market.json'), 'w'), indent=1)

os.makedirs(OUT, exist_ok=True)
json.dump(out_schemes, open(os.path.join(OUT, 'schemes.json'), 'w'), indent=1)
json.dump(funds, open(os.path.join(OUT, 'funds.json'), 'w'), indent=1)
json.dump(cats, open(os.path.join(OUT, 'categories.json'), 'w'), indent=1)

review_path = os.path.join(OUT, 'review.json')
review = json.load(open(review_path)) if os.path.exists(review_path) else {}
review['data_as_at'] = AS_AT
json.dump(review, open(review_path, 'w'), indent=1)

rec_n = sum(1 for f in funds if f['public_rating'] == 'recommended')
print(f"schemes: {len(out_schemes)}, funds: {len(funds)}, recommended: {rec_n}, data_as_at: {AS_AT}")
for c in cats: print(' ', c['label'], c['fund_count'], c['group_avg_ret5'], c['group_avg_fee'])

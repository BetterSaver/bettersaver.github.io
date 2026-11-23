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

CAT_ORDER = ['Defensive', 'Conservative', 'Balanced', 'Growth', 'Aggressive', 'Single-sector', 'Other']

def slugify(s):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

def short_name(scheme):
    return re.sub(r'\s+KiwiSaver\s+(Superannuation\s+)?(Scheme|Plan)$', '', scheme).strip()

def money(n):
    if n >= 1e9: return f"${n/1e9:.1f} billion".replace('.0 billion', ' billion')
    return f"${n/1e6:.0f} million"

def num(v):
    v = (v or '').strip()
    return float(v) if v else None

rows = list(csv.DictReader(open(CSV_PATH, newline='', encoding='utf-8-sig')))

# --- categories ---
cats = []
for label in CAT_ORDER:
    sub = [r for r in rows if (r['category'].strip() or 'Other') == label]
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
    cat_label = r['category'].strip() or 'Other'
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
                    expected_label = dt.replace(year=dt.year + 5).strftime('%B %Y')
                except ValueError:
                    pass

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
        'restricted': sslug in restricted_slugs,
        'status': 'open',
    }
    if launch_label: f['launch_label'] = launch_label
    if expected_label: f['rating_expected_label'] = expected_label
    funds.append(f)

    s = schemes.setdefault(sslug, {
        'scheme_slug': sslug, 'scheme_name': scheme, 'provider_name': prov,
        'members': 0, 'value_nzd': 0.0, 'about': r['provider_description'].strip(),
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
    return 'Very high'

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
    for col in ('provider_started', 'nz_owned', 'default_provider'):
        v = (first.get(col) or '').strip()
        if v:
            s[col] = v

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

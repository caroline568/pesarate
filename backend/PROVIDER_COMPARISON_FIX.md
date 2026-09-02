# PesaRate Provider Comparison Fix

## Purpose

This backend patch fixes the core PesaRate issue where the `channel` selector (Remitly/Wise/Bank/Cash pickup) was saved as a label but never affected the conversion result.

## What changed

- Added `GET /api/conversions/compare` as a public read-only endpoint.
- Fetches PesaRate's current reference rate from ExchangeRate-API.
- Sends `sourceCurrency`, `targetCurrency`, `sendAmount`, and the same mid-market benchmark to Wise `/v4/comparisons`.
- Selects the requested provider from Wise's returned `providers` list.
- Uses the provider's `receivedAmount` as the actual channel-specific conversion result.
- Returns provider rate, fee, markup, mid-market result, provider result, difference, cost percentage, delivery estimate, and country dimensions.
- Keeps Wise credentials server-side through optional `WISE_API_TOKEN`.
- Does not invent a cash-pickup markup. Wise currently documents comparison estimates as bank-transfer pay-in/pay-out.
- Added unit tests covering Wise selection, bank selection, provider-vs-mid-market calculation, and cash-pickup safety behavior.
- No database migration is required because the existing `SavedConversion.channel` column is already present.

## Endpoint example

```text
GET /api/conversions/compare?from_currency=GBP&to_currency=EUR&amount=10000&channel=Wise
```

## Environment

Add to the backend `.env` only when required by the Wise environment/account:

```env
WISE_API_TOKEN=
```

Never expose the token through a `VITE_*` variable.

## Important frontend follow-up

The frontend must call this endpoint whenever `amount`, `from`, `to`, or `channel` changes. The returned `comparison.providerResult` should become the displayed conversion result, while `comparison.midMarketResult` remains the benchmark.

## Verification

Python syntax compilation was run successfully with:

```bash
python3 -m compileall -q backend/app backend/tests
```

The unit-test suite is included, but this packaging environment does not have the project's Flask dependencies installed and cannot download them, so the tests could not be executed here. Run them locally inside the project's existing virtual environment:

```bash
cd backend
source ../.venv/bin/activate
PYTHONPATH=. python -m unittest discover -s tests -p 'test_*.py' -v
```

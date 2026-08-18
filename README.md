# PesaRate

**Live demo:** [add link after deploying]

## Description
Sending or receiving money across currencies? Banks and mobile money channels
often quote exchange rates marked up above the real market rate — and there's
no easy way to see how much that markup actually costs you. PesaRate fetches
the live mid-market exchange rate and compares it against what your channel
quoted you, showing the real KES difference. It also displays typical markup
ranges across common remittance channels for context.

## Features
- **Home** — explains the problem and links to the calculator
- **Calculator** — enter an amount and currency, see the live mid-market rate, compare it against a quoted rate to see the real KES difference
- Static comparison table of typical markup ranges across common channels

## Setup Instructions
1. Clone the repo: `git clone https://github.com/caroline568/pesarate.git`
2. Navigate into the project: `cd pesarate`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`
5. Open the local URL shown in your terminal (typically `http://localhost:5173`)

## API Used
[ExchangeRate-API Open Access](https://www.exchangerate-api.com/docs/free) — a free, no-key currency exchange rate API covering 161 currencies.

Endpoint: `https://open.er-api.com/v6/latest/{baseCurrency}`

Example: `https://open.er-api.com/v6/latest/USD` returns live rates for USD against all supported currencies, including KES.

Attribution: rate data provided by exchangerate-api.com.

## Known Issues / Challenges
- The channel markup percentages shown (bank, mobile money, Western Union) are illustrative estimates, not live data from those providers.
- No caching — every rate check triggers a fresh API call.
- Originally built against the Frankfurter API, but switched to ExchangeRate-API after discovering Frankfurter doesn't support KES (ECB-sourced currencies only).
# Markdown Signal

Markdown Signal is a lightweight A2 research prototype for the Brown Jaguars HCI evaluation. It explores how a near-expiry fresh food markdown system can support staff worklists and customer price transparency.

This is a browser-based prototype for generating evaluation evidence, not a production inventory or retail system.

## Prototype flows

### Staff checks

- Shows a ranked list of produce requiring a markdown check.
- Displays item name, shelf location, and days remaining.
- Opens a detail view with a suggested markdown action.
- Removes an item after `Confirm checked`.
- Includes a reset control for repeated test sessions.

### Customer preview

- Shows a manually triggered nearby flash-discount notification.
- Displays the discounted price and shelf location.
- Opens a transparency screen explaining why the price was reduced.
- Shows a plain-language freshness message and status.

The customer notification is a Wizard-of-Oz interaction. It does not use real GPS or push notifications.

## Markdown rules

The current prototype uses these simple rules:

| Days left | Output |
| --- | --- |
| 1 day or less | 50% markdown |
| 2-3 days | Review |
| More than 3 days | No markdown |

The rule is implemented in `getMarkdownTier()` in `app.js`.

## Scenario verification

`app.js` contains a hardcoded table of 9 scenarios with:

- Item name
- Delivery date
- Expiry date
- Days in stock
- Expected markdown output

The scenarios are checked automatically when the page loads. Results are logged to the browser console and exposed at:

```js
window.markdownSignalVerification
```

The `allPassed` property indicates whether every scenario matches the current markdown logic.

## Run locally

No package installation or build step is required.

```bash
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173) in a browser.

For a mobile-sized view, use the browser's device emulation tools or open the page on a phone connected to the same network.

## Project structure

```text
index.html   Page structure and screen markup
styles.css   Responsive mobile-first styling
app.js       Mock data, interaction logic, ranking, and scenario checks
```

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- In-memory mock data
- Google Fonts: Manrope and DM Mono

## Out of scope

This prototype intentionally does not include:

- Login, accounts, or user profiles
- Backend services or a database
- Live inventory synchronisation
- POS or checkout integration
- Barcode scanning or GS1 2D barcode support
- Real GPS or location-triggered notifications
- Real push notifications

## Research context

The prototype is designed to support evaluation questions about:

- Whether staff can identify which produce needs attention
- Whether the ranked worklist supports efficient checking
- Whether customers understand the reason for a markdown
- Whether customers can locate the discounted item

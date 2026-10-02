# NO1 app

React + Vite + TypeScript build of the `NO1 App.dc.html` design in `../project`.
It is a marketplace with a retail / wholesale switch.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle in dist/
```

On desktop the app renders inside the phone frame, next to the "Jump to" showcase panel.
Below 480px wide it fills the viewport like a native app.

## Options

The cart, wishlist, followed store, coupon, saved addresses, default payment method, language, currency and mode are saved in `localStorage` (`no1:v1`), so they survive a reload.

You can set the starting language, currency and mode with URL parameters. These replace the design's component props:

`/?lang=en&currency=EGP&mode=wholesale`

- `lang`: `ar` (default, RTL), `en`, `fr`, `es`, `tr`, `ur` (RTL), `hi`, `zh`
- `currency`: `KWD` (default), `EGP`, `SAR`, `AED`, `QAR`, `BHD`, `OMR`, `JOD`, `IQD`, `MAD`, `USD`, `EUR`, `GBP`, `TRY`, `INR`, `PKR`, `CNY`
- `mode`: `retail` (default) or `wholesale`

## Layout

- `src/store.tsx`: app state, navigation stack, price, currency and tier logic, and the toast
- `src/data/`: products, categories, languages, currencies and UI strings (`lang/` has one pack per extra language)
- `src/ui.tsx`: design tokens and shared pieces (image placeholder, back header, mode switch)
- `src/screens/`: one component per screen (18 in total, including Addresses, Payment methods and Help center from the account menu)

Prices are stored in KWD and converted at the indicative rates in `data/locale.ts`.
Product images are striped placeholders, as in the design.
All 8 languages are complete: every UI string, plus category, colour and product names. English and Arabic live in `data/locale.ts`, the other six in `data/lang/*.ts`, and the account screens' strings for all 8 in `data/lang/account.ts`. TypeScript rejects a language pack that is missing a string. For languages other than English and Arabic, currency names come from the browser's `Intl.DisplayNames`.

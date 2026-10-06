# NO1 app

React + Vite + TypeScript build of the `NO1 App.dc.html` design in `../project`.
It is a marketplace with a retail / wholesale switch.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle in dist/
npm test         # unit tests: prices, tiers, currency, cart totals, saved data, translations
```

On desktop the app renders inside the phone frame, next to the "Jump to" showcase panel.
Below 480px wide it fills the viewport like a native app.

Once hosted over HTTPS it can be installed to a phone's home screen ("Add to Home Screen" / "Install app") with the NO1 icon, and it opens full screen.
The manifest is `public/manifest.webmanifest`; icons are in `public/icons/` (`icon.svg` is the source for the PNGs).

## Hosting (GitHub Pages)

Every push to the `no1-app` branch runs `.github/workflows/deploy-pages.yml`: it runs the tests, builds the app and publishes `app/dist` to the `gh-pages` branch.
To serve it, turn Pages on once: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `gh-pages`, folder `/ (root)` → Save**.
The site is then at https://hrwork20241-droid.github.io/tamerfathyno1/ and can be installed from a phone's browser.

## Control panel (products)

Products can be managed from the control panel at `<app link>#admin` (Arabic): add, edit, hide or delete products, with photo upload.
It stores them in Supabase. Setup steps are in `../supabase/README.md`, the database script is `../supabase/setup.sql`, and the connection settings go in `src/config.ts`.
Until it is connected, or while the database has no products, the shop shows the built-in samples.

## Options

The cart, wishlist, followed store, coupon, saved addresses, default payment method, language, currency and mode are saved in `localStorage` (`no1:v1`), so they survive a reload.

You can set the starting language, currency and mode with URL parameters. These replace the design's component props:

`/?lang=en&currency=EGP&mode=wholesale`

- `lang`: `ar` (default, RTL), `en`, `fr`, `es`, `tr`, `ur` (RTL), `hi`, `zh`
- `currency`: `KWD` (default), `EGP`, `SAR`, `AED`, `QAR`, `BHD`, `OMR`, `JOD`, `IQD`, `MAD`, `USD`, `EUR`, `GBP`, `TRY`, `INR`, `PKR`, `CNY`
- `mode`: `retail` (default) or `wholesale`

## Layout

- `src/store.tsx`: app state, navigation stack, saved-data validation and the toast
- `src/pricing.ts`: wholesale tiers, unit prices, currency formatting and cart totals (pure, unit-tested)
- `src/data/`: products, categories, languages, currencies and UI strings (`lang/` has one pack per extra language)
- `src/ui.tsx`: design tokens and shared pieces (image placeholder, back header, mode switch)
- `src/screens/`: one component per screen (18 in total, including Addresses, Payment methods and Help center from the account menu)

Prices are stored in KWD and converted at the indicative rates in `data/locale.ts`.
Product images, the Mega Sale card and the store cover use temporary illustrations from `public/images/`. The profile photo on the Me screen is `public/images/avatar.jpg`; it is kept out of git, and without it the screen shows the name's initials.

### Replacing the images

1. Put your photo in `public/images/` (jpg, png, webp or svg). Square photos of at least 800×800 work best for products.
2. In `src/data/images.ts`, change that product's path, e.g. `1: 'images/products/earbuds.jpg'`.

Images are cropped to fill their box, so keep the product centred with some margin.
All 8 languages are complete: every UI string, plus category, colour and product names. English and Arabic live in `data/locale.ts`, the other six in `data/lang/*.ts`, and the account screens' strings for all 8 in `data/lang/account.ts`. TypeScript rejects a language pack that is missing a string. For languages other than English and Arabic, currency names come from the browser's `Intl.DisplayNames`.

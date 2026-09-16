# Loan Application — Multi-Step Form

A production-style, multi-step loan application built with **React + Vite + Tailwind CSS**, supporting Personal, Home, and Business loans with conditional fields, client-side validation, document upload, simulated KYC (PAN/Aadhaar), e-signature, EMI/pre-approval calculation, auto-save, and resume-in-progress.

> This is a front-end demo. PAN/Aadhaar verification, address lookup, and loan submission are **simulated** in the browser — there is no backend. Swap the functions in `src/utils/validation.js` for real API calls when you're ready to go live.

## Features

- 10-step guided form: loan type → personal → contact → address → employment/income → loan details → documents → verification → e-signature → review & submit
- Loan-type-aware conditional fields (business fields for Business loans, property fields for Home loans)
- **React Hook Form** + **Zod** for per-step schema validation, with a dedicated **cross-step validation** pass at Review (EMI-to-income ratio, loan-to-value limit, age-at-maturity check)
- Progress bar with clickable, already-visited steps
- **Auto-save** to `localStorage` on every field change (via Zustand's `persist` middleware) and **resume** banner on return visits
- Document upload with drag-and-drop, image preview, and client-side **image compression** (`browser-image-compression`)
- Simulated PAN & Aadhaar verification with loading / success / error states
- PIN-code based address auto-fill (mock directory, easy to swap for the India Post API)
- **E-signature** capture via canvas (`react-signature-canvas`)
- Live **EMI calculator** and a simple **pre-approval** scoring engine
- Fully responsive (mobile-first) layout
- **Playwright** end-to-end tests covering validation, the full happy path, and auto-save/resume

## Tech stack

| Layer          | Choice                                   |
|----------------|-------------------------------------------|
| Build tool     | Vite                                      |
| UI framework   | React 18                                  |
| Styling        | Tailwind CSS                              |
| Forms          | React Hook Form                           |
| Validation     | Zod (`@hookform/resolvers`)               |
| State/persist  | Zustand (`persist` middleware → localStorage) |
| Icons          | lucide-react                              |
| Image handling | browser-image-compression                 |
| E-signature    | react-signature-canvas                    |
| E2E testing    | Playwright                                |

## Project structure

```
loan-application/
├── src/
│   ├── components/       # Reusable UI: ProgressBar, InputField, FileUpload,
│   │                        AddressAutocomplete, SignaturePad, StepShell
│   ├── pages/             # One component per wizard step
│   ├── validation/        # Zod schemas + cross-step validation + EMI math
│   ├── store/             # Zustand store (wizard state, auto-save, resume)
│   ├── utils/              # EMI calculator, image compression, mock verification/PIN lookup
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tests/
│   └── loan-application.spec.js
├── playwright.config.js
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── README.md
```

## Getting started

**Requirements:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Other scripts

```bash
npm run build          # production build → dist/
npm run preview        # preview the production build locally
npm run test:e2e       # run Playwright tests (starts the dev server automatically)
npm run test:e2e:ui    # run Playwright in interactive UI mode
```

The first time you run Playwright, install its browser binaries:

```bash
npx playwright install
```

## How auto-save & resume work

The Zustand store is wrapped in `persist`, which writes the wizard's step index and all collected field values to `localStorage` under the key `loan-application-draft` on every change — no debounce/timers needed. On the next visit, the store rehydrates from that key automatically and the app shows a "Welcome back" banner. Use the **"Clear saved draft and start over"** link in the footer to wipe it.

## Testing the simulated verification flows

- Any syntactically valid PAN except one starting with `AAAAA` will "verify" successfully.
- Any syntactically valid 12-digit Aadhaar except one starting with `000000` will "verify" successfully.
- Try PIN codes `110001`, `400001`, `560001`, `600001`, `700001`, `380001`, `226001`, `500001`, `411001`, or `302001` to see address auto-fill in action (see `src/utils/validation.js` to add more).

## Deployment

### Vercel
1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy — no environment variables are required for this demo.

### Netlify
1. Push the project to GitHub.
2. In Netlify, "Add new site → Import an existing project".
3. Build command: `npm run build`. Publish directory: `dist`.
4. Deploy.

### Any static host (GitHub Pages, S3, etc.)
```bash
npm run build
# upload the contents of dist/ to your host
```

## Next steps for a real production build

- Replace `verifyPAN` / `verifyAadhaar` / `lookupPincode` in `src/utils/validation.js` with real API integrations (NSDL/UIDAI-authorised KYC provider, India Post PIN API).
- Replace the simulated `handleSubmit` in `src/pages/Review.jsx` with a real API call to your loan-origination backend, and upload documents to object storage instead of keeping them as data URLs in the browser.
- Add authentication if applications should be tied to a logged-in user rather than a browser-local draft.
- Add server-side re-validation — never trust client-side Zod checks alone for a financial product.

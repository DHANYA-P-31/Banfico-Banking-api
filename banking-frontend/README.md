# Frontend

React + Vite frontend for the Banfico banking application. Consumes the
Spring Boot API in the sibling `banking-api` backend.

## Tech Stack

- React 19 + Vite
- React Router 7
- lucide-react (icons)
- Plain CSS with design tokens 

## Setup

```
npm install
```

Create a `.env` file (see `.env.example`):

```
VITE_API_BASE_URL=http://localhost:8080
```

Run the dev server:

```
npm run dev
```

The app runs at `http://localhost:5173`. The backend's CORS config
(`CorsConfig.java`) only allows this origin — if you run the frontend
on a different port, update that file too.

## Project Structure

```
src/
  components/
    ui/              Shared design-system components
    Navbar.jsx        Top navigation bar
    ErrorBoundary.jsx Catches render crashes, shows a recovery screen
  pages/               One file per route/screen
  services/
    api.js             API base URL + parseErrorMessage() helper
  utils/
    format.js           formatCurrency() — INR formatting
  index.css              Design tokens + all shared styles
  App.jsx                 Routes
```

## Design System

Tokens live at the top of `index.css` as CSS custom properties:

- Charcoal (`--charcoal-900/800/700`) — used for the navbar
- Gold accent (`--primary`, `--primary-hover`, `--primary-bg`) — buttons,
  links, active nav state
- Semantic colors (`--success`, `--danger`, `--warning`) — kept visually
  distinct from the gold brand accent so status badges don't get confused
  with branding
- Spacing scale `--space-1` through `--space-7` (4px–48px)

Money values always use `.amount` / `.num` (tabular-nums) so digits align
in columns, and go through `formatCurrency()` from `utils/format.js`
rather than being interpolated raw.

## Shared Components (`src/components/ui/`)

| Component | Purpose |
|---|---|
| `Button` | `variant="primary\|secondary\|danger"`, `size="sm"`, `as={Link}` to render as a router link with button styling |
| `Card` | `.card` wrapper, optional `title` + `action` |
| `Input` | Styled input, auto-adds error state |
| `FormField` | Label + hint/error wrapper around any input |
| `Badge` | Status pill — `variant="success\|danger\|warning\|neutral\|gold"` |
| `Banner` | Error/success message bar, renders nothing if empty |
| `EmptyState` | "No data" placeholder |
| `LoadingState` | Loading placeholder |
| `PageHeader` | Title + description + action button row |

Use these instead of writing new raw markup for the same patterns.

## Error Handling

`services/api.js` exports `parseErrorMessage(response, fallback)`, which
reads the backend's actual JSON error body
(`{ message: "..." }` or `{ messages: { field: "reason" } } }` for
validation errors) instead of showing a generic hardcoded string. All
create/update forms use this — if you add a new form that calls the API,
use the same pattern:

```js
if (!response.ok) {
  throw new Error(await parseErrorMessage(response, "Fallback message"));
}
```

## Routes

| Path | Page |
|---|---|
| `/` | Dashboard |
| `/customers` | Customer list |
| `/customers/create` | Create customer |
| `/accounts` | Account list |
| `/accounts/create` | Create account |
| `/accounts/:id` | Account details |
| `/accounts/:id/transactions` | Transaction history + create transaction |
| `/beneficiaries` | Beneficiary list |
| `/beneficiaries/add` | Add beneficiary |
| `*` | 404 page |

# MediConnect Project Guidelines

## Code Organization

- **Common/reusable components** → `src/components/` (DataTable, Loader, cards, forms)
- **Page-specific components** → co-located in the page folder (e.g., `pages/admin/Hospitals/componets/`)
- **Feature logic** → `src/features/<name>/` with `Slice.js`, `Saga.js`, `Selectors.js`
- Keep code **clean and modular** — extract when reused, co-locate when page-specific

## Code Formatting

- **Prettier** for all code formatting — single quotes, no semicolons, trailing commas
- Always format generated/edited code to match Prettier output
- Do not override Prettier rules with manual formatting

## Frontend — UI Rules

- **Chakra UI only** — no custom CSS files, no `styled-components`, no Tailwind
- **React Icons only** (`react-icons/md` preferred) — no other icon libraries
- **Responsive**: mobile-first with `{ base, md, lg }` breakpoints
- Healthcare teal theme: use `colorPalette="teal"` for primary actions
- **Page width**: every page's outermost `<Stack>` must use `w="100%"` — no `maxW` constraints on page-level containers

## Frontend — Component Patterns

- **Functional components only** — no class components
- **Default export** for page components; **named exports** for slices, selectors, sagas
- **Shared form for create & edit**: single `<EntityForm mode="create" | "edit" />` component; conditionally render create-only sections with `{mode === 'create' && <Section />}`
- **DataTable** for all list/table views (`src/components/common/DataTable`)
- **Lazy-loaded pages** via `React.lazy()` + `<Suspense>`
- Use `@/` alias for all imports (e.g., `@/features/hospitals/hospitalSlice`)

## Frontend — State Management

- **Redux Toolkit** for slices — action triplet: `actionRequest`, `actionSuccess`, `actionFailure`
- **Redux Saga** for all async — no thunks
  - `takeLatest` for all watchers
  - Worker sagas: `function* handleAction(action) { try/catch with call + put }`
  - Unwrap data: `response.data.data` (Axios → API wrapper)

## Frontend — Routing

- **Static routes before dynamic `:id` routes** (e.g., `/hospitals/new` before `/hospitals/:id`)
- **Add new routes in BOTH** `AppRoutes.jsx` AND the role-specific routes file (`AdminRoutes.jsx`, `HospitalRoutes.jsx`, `PatientRoutes.jsx`)
- Route pattern: `/<role>/<resource>/<action?>/<:param?>`
  - List: `/admin/hospitals`
  - Create: `/admin/hospitals/new`
  - Detail: `/admin/hospitals/:id`
  - Edit: `/admin/hospitals/edit/:id`

## Backend — API Design

- Base path: `/api/v1/<resource>`
- Response wrapper: `{ success: true, message, data }` via `apiResponse` utility
- Pagination: `{ success, message, data, pagination: { total, page, limit, totalPages } }`
- Error response: `{ success: false, message }` — no `data` field on errors

## Backend — Controller Pattern

```js
const action = async (req, res, next) => {
  try {
    // business logic
    success(res, data, 'Message')
  } catch (error) {
    next(error)
  }
}
```

- All controllers are `async` with `try/catch` + `next(error)`
- Business-logic errors: inline `res.status(4xx).json({ success: false, message })`
- Unexpected errors: delegate to global `errorHandler` via `next(error)`

## Backend — Middleware Chain

Protected routes follow this order:

```
auth → roleCheck(...roles) → validatorRules[] → validate → controller
```

- `auth` — JWT verification, attaches `req.user`
- `roleCheck` — variadic roles (`'super_admin'`, `'hospital_admin'`, `'patient'`)
- Validator rules — `express-validator` arrays in `validators/`
- `validate` — runs `validationResult()`, returns 400 on failure

## Backend — Mongoose Models

- Always use `{ timestamps: true }`
- String fields: `trim: true`, `lowercase: true` where appropriate
- Constrained values: `enum` arrays with explicit options
- Refs: `type: Schema.Types.ObjectId, ref: 'ModelName'`
- Required fields: `required: [true, 'Descriptive message']`

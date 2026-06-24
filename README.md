# Skyline Maintenance System — Frontend

> Integrated Maintenance Management System (نظام إدارة الصيانة المتكامل)

Angular single-page application for **Skyline Innovation**'s maintenance operation:
maintenance requests, scheduling, technicians, warehouses/inventory, customers,
billing/receipts, and master data — with role-based access and Arabic (RTL) UI.

The UI is built on the [Material Dashboard Angular](https://www.creative-tim.com/product/material-dashboard-angular2)
template and talks to an ASP.NET (.NET 8) Web API backed by SQL Server.

## Tech stack

- **Angular 14** (CLI 14.2) — hash-routed SPA
- **Angular Material** + Bootstrap 4 + Material Dashboard theme
- **JWT auth** via `@auth0/angular-jwt` (token stored in `localStorage`)
- **ngx-translate** for i18n, **ngx-toastr** / **sweetalert2** for notifications
- **Leaflet** maps, **Chartist** charts, **pdf-lib** for document generation

## Prerequisites

- Node.js (a current LTS) and npm
- Angular CLI 14: `npm install -g @angular/cli@14`

> Note: the `engines` field in `package.json` lists very old node/npm versions
> inherited from the template; ignore it and use a current LTS.

## Getting started

```bash
npm install      # install dependencies
npm start        # ng serve -> http://localhost:4200
```

If port 4200 is taken, serve on another port:

```bash
npm start -- --port 4201
```

### Configuration

API endpoints and environment flags live in:

- `src/environments/environment.ts` — local / development
- `src/environments/environment.prod.ts` — production

Update the API base URL there before running against a backend.

## Common scripts

| Command         | Description                                  |
|-----------------|----------------------------------------------|
| `npm start`     | Run the dev server (`ng serve`)              |
| `npm run build` | Production build into `dist/`                |
| `npm test`      | Run unit tests (Karma + Jasmine)             |
| `npm run lint`  | Lint the project                             |

## Project structure

```
src/
  app/
    auth/            Login, register, guards (route protection)
    layouts/         Admin / public layout shells
    components/      Shared UI (sidebar, navbar, footer)
    services/        API + auth services
    dashboard/       Landing dashboard
    maintenance-*/   Maintenance requests, scheduling, follow-up
    customers/ ...   Customers, representatives, exhibitions
    warehouse/ item/ Inventory & warehouses
    bills/ tax-*/    Billing, receipts, tax configuration
    logs/            Operation logs
    ...              add-/edit-/view- CRUD screens per entity
  assets/            Images, SCSS theme, i18n files
  environments/      Environment configuration
docs/                Use cases & diagrams (see docs/USE_CASES.md)
```

## Roles

The system supports several roles (System Administrator, Maintenance Manager,
Technician, Accountant, Follow-up Officer, Enquiry Officer) plus a sandboxed
public demo visitor. See [docs/USE_CASES.md](docs/USE_CASES.md) for the full
actor/use-case breakdown.

## License

MIT — see the template's original license. Application code © Skyline Innovation.

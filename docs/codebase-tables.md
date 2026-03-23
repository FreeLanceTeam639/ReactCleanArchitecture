# Codebase Tables

## Folder Roles

| Area | Path | Responsibility |
|---|---|---|
| App shell | `src/app` | Application entry, global styles, route selection |
| Pages | `src/pages` | Screen-level composition for each route |
| Features | `src/features` | Use-case logic, hooks, and service calls |
| Shared | `src/shared` | API client, constants, helpers, reusable UI |
| Widgets | `src/widgets` | Large presentational sections reused by pages |
| Docs | `docs` | Internal notes and refactor documentation |

## Main Route Flow

| Route | Page | Main hook/service chain |
|---|---|---|
| `/` | `HomePage` | `useHomePageData -> homeContentService -> httpClient` |
| `/login` | `LoginPage` | `useLoginForm -> authService -> httpClient` |
| `/forgot-password` | `ForgotPasswordPage` | `useForgotPasswordForm -> authService -> httpClient` |
| `/register` | `RegisterPage` | `useRegisterForm -> authService -> httpClient` |
| `/profile` | `ProfilePage` | `useProfilePage -> profileService -> httpClient` |
| `/admin/*` | Admin pages | Page hook -> `adminService` -> `httpClient` or local fallback |

## Architecture Notes

| Topic | Current approach | Why it matters |
|---|---|---|
| Routing | Custom `usePathname` with `history.pushState` | Small and simple, but less scalable than a router library |
| API layer | Shared `httpClient` and centralized endpoint map | Keeps request config in one place |
| Fallback data | Strong fallback usage in home/admin/profile areas | UI keeps working when backend is incomplete |
| Auth flows | Direct API calls without demo fallback | Better for real auth validation and security behavior |
| Styling | Single large `main.css` file | Easy to find global rules, harder to scale over time |

## First Technical Risks

| Priority | Area | Risk |
|---|---|---|
| High | `src/app/App.jsx` | Route selection is growing with many `if` blocks |
| High | `src/features/admin/services/adminService.js` | Service is very large and mixes API, fallback store, normalization, and mutations |
| Medium | `src/features/home/hooks/useHomePageData.js` | One hook owns loading, filtering, pagination, and testimonial UI state |
| Medium | `src/app/styles/main.css` | Global stylesheet is large, so unrelated changes can collide more easily |
| Medium | Text content | Some existing strings and docs have encoding issues that should be cleaned later |

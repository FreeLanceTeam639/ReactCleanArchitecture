# FreelanceAze Frontend

## Run

```bash
npm install
npm run dev
```

## Env

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_LOGIN_ENDPOINT=/auth/login
```

## Fetch endpoints used

- GET /categories/popular
- GET /categories/overview
- GET /testimonials/featured
- GET /freelancers/featured/categories
- GET /freelancers/featured?category=AI
- GET /plans
- GET /blogs/latest?limit=3
- POST /auth/login

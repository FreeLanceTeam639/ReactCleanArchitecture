# React Clean Refactor Report

## Məqsəd
Mövcud UI/UX-i dəyişmədən layihənin daxili quruluşu təmizləndi, fetch hissələri mərkəzləşdirildi və səhifə kompozisiyası daha oxunaqlı hala gətirildi.

## Yeni folder strukturu
```text
src
├── app
│   ├── App.jsx
│   └── styles/main.css
├── features
│   ├── auth
│   │   ├── hooks/useLoginForm.js
│   │   └── services/authService.js
│   └── home
│       ├── data/fallbackHomeContent.js
│       ├── hooks/useHomePageData.js
│       └── services/homeContentService.js
├── pages
│   ├── home/HomePage.jsx
│   └── login/LoginPage.jsx
├── shared
│   ├── api/{endpoints.js,httpClient.js}
│   ├── constants/{navigationLinks.js,routes.js,storageKeys.js}
│   ├── hooks/usePathname.js
│   ├── lib/navigation/navigateWithScroll.js
│   ├── lib/response/extractCollection.js
│   ├── lib/storage/authStorage.js
│   ├── types/{auth.js,home.js}
│   └── ui/{BrandLogo.jsx,NoticeBanner.jsx}
└── widgets
    └── home/{HomeHeader,HeroSection,ServicesSection,TestimonialSection,TalentSection,PricingSection,BlogSection,CtaSection,HomeFooter}.jsx
```

## Clean architecture bölgüsü
- **app**: tətbiqin giriş nöqtəsi, route seçimi və qlobal style importu.
- **pages**: ekranda görünən səhifələrin kompozisiyası.
- **widgets**: görünüşü dəyişmədən ayrılmış böyük UI blokları.
- **features**: konkret use-case məntiqi (home data loading, login submit flow).
- **shared**: ümumi fetch infrastrukturu, constants, helpers, hooks, UI hissələri.

## Endpoint analizi
Bütün fetch hissələri `shared/api/endpoints.js` və service fayllarında cəmləndi.

### İstifadə olunan endpointlər
| Method | Route | Params / Body | Headers | Qeyd |
|---|---|---|---|---|
| GET | `/categories/popular` | yoxdur | `Accept: application/json` | popular categories üçün |
| GET | `/categories/overview` | yoxdur | `Accept: application/json` | service cards üçün |
| GET | `/testimonials/featured` | yoxdur | `Accept: application/json` | featured testimonial |
| GET | `/freelancers/featured/categories` | yoxdur | `Accept: application/json` | talent tab-ları |
| GET | `/freelancers/featured` | `category` query param | `Accept: application/json` | seçilən tab-a görə freelancerlər |
| GET | `/plans` | yoxdur | `Accept: application/json` | pricing cards |
| GET | `/blogs/latest?limit=3` | `limit=3` query string daxilindədir | `Accept: application/json` | latest blogs |
| POST | `/auth/login` | `{ email, password, rememberMe }` | `Accept: application/json`, `Content-Type: application/json` | login form submit |

### Qeydlər
- `VITE_API_BASE_URL` və `VITE_LOGIN_ENDPOINT` env ilə idarə olunur.
- Token / Authorization məntiqi hazır layihədə yoxdur. Əgər backend bunu tələb edirsə `shared/api/httpClient.js` daxilində mərkəzləşdirilməlidir.
- Mövcud endpointlər əvvəlki kod bazasından götürülüb. Route-lar backend ilə təsdiqlənməlidir.

## Dəyişən əsas fayllar və səbəb
- `src/App.jsx` -> `src/app/App.jsx`: route seçimi ayrıca app layer-ə daşındı.
- `src/api.js` -> `src/shared/api/*` və `src/features/*/services/*`: fetch logic mərkəzləşdirildi və use-case-lərə bölündü.
- `src/App.jsx` içindəki böyük Home/Login JSX blokları -> `pages` və `widgets` qovluqlarına ayrıldı.
- `src/index.css` -> `src/app/styles/main.css`: vizual nəticə eyni saxlanıldı, import yeri app layer-ə daşındı.
- `src/main.jsx`: yeni app girişinə uyğun sadələşdirildi.

## Risk qeydləri
- Custom routing hələ də `history.pushState` əsaslıdır; `react-router-dom` əlavə edilmədi ki, UI/axın minimal risklə qalsın.
- API response formatı hələ də array / `items` / `data` şəklində qəbul olunur. Backend fərqli payload qaytarırsa `extractCollection.js` yenilənməlidir.
- Login cavabı storage-a olduğu kimi yazılır. Token və ya user shape backend-dən asılı olaraq dəyişə bilər.

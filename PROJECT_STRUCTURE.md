```markdown
# NutriTrack Project Structure

```
NutriTrack/
├── Backend/
│   ├── package.json
│   ├── test-db.js
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── constants/
│   │   │   └── messages.js
│   │   ├── middlewares/
│   │   │   └── error.middleware.js
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.routes.js
│   │   │   │   └── auth.service.js
│   │   │   └── food/
│   │   │       ├── food.controller.js
│   │   │       ├── food.routes.js
│   │   │       └── food.service.js
│   │   └── utils/
│   │       └── logger.js
│   └── node_modules/
│
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── README.md
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── components/
│       │   └── Card.jsx
│       ├── middlewares/
│       │   └── auth.middleware.js
│       ├── pages/
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       └── services/
│           ├── api.js
│           └── auth.js
│           └── authStorage.js
│
├── Query/
│   ├── Initial Creation.sql
│   └── Users.sql
│
├── NutriTrack.txt
└── PROJECT_STRUCTURE.md

## Directory Descriptions

**Backend/**
- `package.json`: Node dependencies and scripts
- `test-db.js`: small script to verify DB connectivity
- `src/`: source code
  - `app.js`: builds and exports the Express app (middleware, routes)
  - `server.js`: starts the HTTP server (imports `app.js`)
  - `config/db.js`: PostgreSQL pool configuration
  - `constants/messages.js`: shared constant messages
  - `middlewares/error.middleware.js`: error handling middleware
  - `modules/`: feature modules (organized by domain)
    - `auth/`: authentication endpoints and logic
    - `food/`: food-related endpoints and logic
  - `utils/logger.js`: logging helpers

**Frontend/**
- React + Vite application
- `src/` contains components, pages and service helpers

**Query/**
- SQL scripts for schema and initial data

## Module Structure Pattern

Each feature module follows a simple pattern:
- `*.controller.js` — Express route handlers
- `*.routes.js` — Express Router definitions
- `*.service.js` — Business logic and DB access

---
*Last Updated: February 13, 2026*

``` 

# Sistema de Informes Diarios

Proyecto web para la elaboración, consulta y gestión de informes diarios de auxiliares de laboratorio.

## Estructura

- `frontend/` — prototipo actual de Figma Make, migrado a React + TypeScript + Vite.
- `backend/` — API Node.js + Express + TypeScript.
- `backend/prisma/` — esquema y futuras migraciones de PostgreSQL.
- `.gitignore` — evita subir dependencias, builds y secretos.

## Equipo

- Frontend: Lesly
- Backend / Base de datos: responsable de backend y PostgreSQL

## Ramas recomendadas

- `main` — versión estable.
- `develop` — integración del equipo.
- `feature/frontend-*` — trabajo del frontend.
- `feature/backend-*` — trabajo del backend.

## Arranque del frontend

```bash
cd frontend
npm install
npm run dev
```

## Arranque del backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

En Linux/macOS, para copiar el archivo de entorno:

```bash
cp .env.example .env
```

Backend: `http://localhost:3000/api/health`

## PostgreSQL + Prisma

1. Crear la base de datos local.
2. Copiar `backend/.env.example` a `backend/.env`.
3. Colocar la cadena real en `DATABASE_URL`.
4. Ejecutar:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name inicial
```

> El esquema Prisma incluido es solamente una base inicial. No ejecutar migraciones definitivas hasta acordar las entidades y relaciones del sistema.

## Conectar esta carpeta con el repositorio GitHub existente

Desde la carpeta raíz:

```bash
git init
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git add .
git commit -m "chore: estructura inicial del sistema"
git push -u origin main
```

Después, para crear la rama de integración:

```bash
git checkout -b develop
git push -u origin develop
```

Si el repositorio de GitHub YA tiene commits (por ejemplo README), primero conviene clonar el repositorio y copiar esta estructura dentro de esa copia, en lugar de hacer `git init` sobre una carpeta independiente.

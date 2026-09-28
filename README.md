# SOPHENA

`sophena.online` · Entiende. Decide. Avanza.

PWA mobile-first para seguimiento de hábitos, impulsos, recaídas, ahorro, logros y recompensas.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Sin variables de entorno la app usa un fallback local en `localStorage`, útil para revisar los flujos de demo.

## Conectar Supabase

1. Crea un proyecto en Supabase.
2. Copia `.env.example` a `.env`.
3. Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Ejecuta las migraciones desde el proyecto:

   ```bash
   npx supabase login
   npx supabase link --project-ref TU_PROJECT_REF
   npx supabase db push
   ```

5. En Authentication configura el proveedor Email.
6. En Authentication → URL Configuration agrega `http://localhost:5173/reset-password` a Redirect URLs. En producción agrega también la URL HTTPS final de la aplicación.

El esquema crea perfiles automáticamente cuando se registra un usuario, tablas para hábitos, metas, check-ins, impulsos, recaídas, ahorros, logros, recompensas y preferencias, además de políticas RLS para que cada usuario solo pueda acceder a sus datos.

## Flujos conectados

- Registro y login con Supabase Auth.
- Creación de perfil y hábitos desde onboarding.
- Check-in diario.
- Registro de impulsos con intensidad, detonante y resultado.
- Registro de recaídas sin borrar histórico.
- Registro y eliminación de dinero ahorrado.
- Creación y eliminación de recompensas.
- Recuperación segura de contraseña por email y actualización mediante el token de Supabase.

La migración inicial está en `supabase/migrations/20260928030154_initial_schema.sql`. `supabase/schema.sql` se conserva como referencia. La capa de acceso está en `src/services/api.js`; los componentes visuales no hacen llamadas Supabase directamente.

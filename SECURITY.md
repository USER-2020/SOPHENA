# Seguridad

<p align="right"><a href="SECURITY.md">🇪🇸 Español</a> · <a href="SECURITY.en.md">🇬🇧 English</a></p>

La seguridad y la privacidad son especialmente importantes para SOPHENA porque la aplicación puede manejar información relacionada con hábitos y bienestar.

## Reportar una vulnerabilidad

No abras un Issue público para una vulnerabilidad. Contacta a los mantenedores mediante el canal privado de seguridad configurado en el repositorio o, si está disponible, usa **Security → Advisories → Report a vulnerability** en GitHub.

Incluye:

- descripción del problema y su impacto;
- pasos mínimos para reproducirlo;
- componente o archivo afectado;
- versión, commit o entorno donde lo observaste;
- una posible mitigación, si la conoces.

Elimina tokens, credenciales, datos personales y cualquier información de usuarios reales. Si el reporte implica una cuenta o base de datos real, detente y avisa únicamente por el canal privado.

## Qué puedes esperar

Confirmaremos la recepción cuando sea posible, investigaremos el impacto, coordinaremos una corrección y comunicaremos la resolución cuando exista una mitigación. No garantizamos un plazo fijo mientras el proyecto siga en desarrollo voluntario.

## Buenas prácticas para contribuidores

- Usa solo las claves públicas `anon` en el frontend.
- Nunca subas `.env`, claves de servicio, contraseñas o tokens.
- Verifica las políticas RLS cuando cambies tablas o consultas.
- Usa datos sintéticos y cuentas de prueba.
- Evita incluir información sensible en logs, capturas y mensajes de error.

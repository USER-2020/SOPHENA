# Guía de contribución

<p align="right"><a href="CONTRIBUTING.md">🇪🇸 Español</a> · <a href="CONTRIBUTING.en.md">🇬🇧 English</a></p>

Gracias por querer mejorar SOPHENA. Queremos que contribuir sea claro, seguro y amable, especialmente porque el producto trata temas de hábitos, bienestar y datos personales.

## Antes de empezar

1. Revisa los Issues existentes y busca duplicados.
2. Para cambios grandes, abre primero un Issue para acordar el alcance.
3. Nunca uses datos reales de usuarios en desarrollo, capturas, fixtures o ejemplos.
4. Lee el [Código de Conducta](CODE_OF_CONDUCT.md) y la guía de [seguridad](SECURITY.md).

## Preparar el entorno

```bash
npm install
npm run dev
```

Puedes trabajar con el fallback local o configurar Supabase siguiendo el README. El modo local es suficiente para cambios de UI y la mayoría de flujos del frontend.

## Flujo recomendado

1. Crea una rama descriptiva desde la rama principal:

   ```bash
   git switch -c feat/nombre-corto
   ```

2. Haz cambios pequeños y enfocados.
3. Mantén la separación entre UI y acceso a datos: las llamadas a Supabase deben pasar por `src/services/api.js`.
4. Si cambias la base de datos, añade una migración nueva en `supabase/migrations`; no edites una migración ya aplicada.
5. Comprueba el comportamiento en móvil y escritorio, y revisa estados de carga, error y vacío.
6. Ejecuta la verificación antes de enviar el PR:

   ```bash
   npm run build
   ```

7. Abre un Pull Request usando la plantilla y describe qué cambió, cómo probarlo y qué queda pendiente.

## Convenciones

- Usa nombres claros y consistentes con el código existente.
- Conserva el idioma y el tono de la interfaz cuando añadas copy en español.
- Prioriza HTML semántico, navegación por teclado, foco visible, contraste suficiente y etiquetas accesibles.
- Evita introducir dependencias si una solución existente cubre la necesidad.
- No añadas secretos ni valores específicos de un entorno.
- Para commits, usa un prefijo breve cuando ayude a entender el historial: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.

## Issues

Incluye siempre el contexto mínimo para reproducir el problema: navegador y versión, dispositivo, pasos, resultado esperado, resultado actual y una captura anonimizada si aporta valor.

Usa `good first issue` para tareas acotadas que una persona nueva pueda abordar, `help wanted` cuando buscamos ayuda explícita, y las etiquetas de área (`frontend`, `backend`, `documentation`) para facilitar el triage.

## Pull Requests

Un buen PR:

- explica el problema y la solución;
- enlaza el Issue relacionado;
- incluye pasos de prueba;
- muestra capturas o un vídeo corto cuando cambia la UI;
- declara cambios de esquema, migraciones o variables de entorno;
- mantiene el alcance revisable.

El equipo puede pedir cambios, pruebas adicionales o dividir el PR. Las revisiones buscan mejorar el producto, no evaluar a la persona que contribuye.

## Preguntas

Si no estás seguro de una decisión, abre un Issue con el contexto o deja una pregunta en tu PR. Es preferible hacer visible una duda temprano a invertir tiempo en una dirección difícil de revertir.

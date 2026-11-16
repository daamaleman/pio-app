# Pendientes para revisión

## Contenido y lenguas

- La interfaz ofrece español, inglés y miskitu desde el primer acceso. El modo miskitu ya tiene un borrador aplicado a los textos comunes, pantallas y contenido local de lecciones. El archivo `src/lib/miskitu-draft.ts` es generado por `scripts/build-miskitu-draft.mjs` a partir de un glosario de referencia; una persona hablante debe revisar y sustituir cada frase antes de publicar.
- Los textos visibles escritos directamente en las pantallas también pasan por `src/components/localized-native.tsx`; este cubre acceso, estudiante, familia, docente, tarjetas, chat, estados sin conexión, minijuegos y placeholders. No traduce lo que una persona escribe en un campo.
- La referencia visual correcta es `C:\Users\jgcan\OneDrive\Desktop\Siento y Crezco · Manual de Marca (UNICEF Nicaragua).pdf`, el manual exportado desde Figma de 17 páginas. Sus páginas 3–17 contienen flujos y mockups; el documento pequeño de 12 páginas en `Documentacion` no es la guía de pantallas.
- El manual completo describe 111 pantallas: acceso, primaria, secundaria, familia, lecciones, calma, chat y panel docente. Las páginas 3–17 son ahora la referencia; no se deben excluir sus mockups.
- La bienvenida ya usa una ilustración recortada de la pantalla de inicio del PDF completo. Revisar y reemplazar el resto de ilustraciones/iconos según las pantallas específicas, incluyendo modo oscuro de secundaria.
- Falta el audio por lengua y la validación lingüística final del borrador miskitu, incluidos mensajes del backend y notificaciones.

## Seguridad y salvaguarda

- UNICEF/equipo legal debe aprobar el texto de consentimiento familiar y los textos de salvaguarda. No se publicarán teléfonos o líneas de ayuda inventadas.
- Confirmar responsables, horarios y protocolo escolar para alertas de riesgo antes de habilitar el chat IA.

## Integraciones

- Confirmar que las migraciones recientes de chat y push ya se desplegaron a staging; el pull local no las publica automáticamente.
- La Edge Function `pio-chat` aún no está lista; las pantallas pueden quedar detrás de un interruptor hasta entonces.
- Para push se requiere un proyecto EAS, `projectId` y configuración FCM; el backend aún no contiene texto miskitu para notificaciones.

## Datos y pruebas

- Confirmar con contenido si la lección `p3-w1` puede usarse como fuente de verdad para el primer flujo o sigue siendo borrador. La app ya consulta `my_week`, sincroniza el progreso con `sync_progress` y obtiene el contenido versionado desde `lesson_contents`; falta validar el contrato con el backend desplegado y cargar los contenidos faltantes.
- Probar en Expo Go: `3B·AN·27` → María Rivera → PIN `3714`.
- Comparar cada ruta con las pantallas correspondientes del PDF completo y revisar tamaños de toque en el dispositivo.

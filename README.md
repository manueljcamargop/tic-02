# TIC 02

Plataforma estática de experimentación musical y observación pedagógica para Informática Musical, formación universitaria de profesores de música en Colombia. Rediseño de la aplicación existente «Laboratorio del Docente Musical», en su misma carpeta y sin modificar Synth FX ni otros proyectos.

## Uso rápido

1. Selecciona uno de los 12 ejercicios.
2. Escucha el ejemplo; repite o detén el audio cuando lo necesites.
3. Aplica la consigna con estudiantes de colegio. La respuesta se realiza después de la escucha.
4. Abre «Registro docente», marca que lo aplicaste, elige las tres valoraciones y escribe una justificación breve. Añade una propuesta de mejora si corresponde.
5. Pulsa «Guardar valoración» o «Guardar y continuar».
6. En «Resultados» escribe tu identificación y reflexión; descarga tu informe PDF.

No se pide programar, usar IA ni crear nuevos recursos educativos. La aplicación trae las secuencias musicales. No graba audio o video, no pide micrófono/cámara y no evalúa interpretaciones. El universitario toma todas las decisiones de valoración mediante escucha y observación directa.

## Estructura conservada y cambios

Se conservaron HTML/CSS/JavaScript estáticos, archivos relativos, controles de audio nativos, avisos de estado, navegación por vistas, guardado local, validación de respaldos y descarga mediante archivos locales. Se reemplazó el contenido de diseño de proyectos por 12 ejercicios aplicables, se rediseñó la identidad visual y se añadió observación docente, resumen e informe.

- `index.html`: estructura, catálogo, resultados, respaldo y evidencia.
- `styles.css`: identidad azul noche, turquesa, violeta y coral; responsive; presentación de informe e impresión.
- `exercises.js`: objetivos, instrucciones, referencias docentes y secuencias de los 12 ejercicios.
- `app.js`: navegación, reproducción, observaciones, persistencia, resultados y respaldo.
- `pdf-export.js`: informe PDF generado íntegramente en el navegador.
- `assets/audio/`: 19 frases WAV y cinco muestras de instrumentos.
- `assets/vendor/`: jsPDF 4.2.1 (MIT) y Noto Sans Regular (SIL OFL), incluidos localmente. La exportación no solicita archivos a un CDN.
- `assets/licenses/`: licencias, créditos y procedencia exacta de las muestras.

Los archivos de audio heredados de la primera versión se conservan en `assets/` por continuidad del proyecto, pero TIC 02 reproduce exclusivamente los archivos de `assets/audio/`.

## Bloques

| Bloque | Ejercicios progresivos |
|---|---|
| Imitación rítmica | Escucha y repite; Percusión combinada; Memoria rítmica |
| Análisis rítmico | Reconoce el patrón; ¿Qué cambió?; Detecta el error |
| Imitación melódica | Repite tres notas; Escucha e imita; Memoria melódica |
| Análisis melódico | ¿Sube o baja?; Compara las melodías; Encuentra el cambio |

Cada reproducción dura entre 2,6 y 5,5 segundos. El indicador de pulsos es orientador. Las secuencias se renderizaron en audio a 44.1 kHz con separación exacta de los ataques; su temporización no depende de los temporizadores de animación. El bucle opcional usa el ciclo completo sin silencio añadido. Su continuidad final depende del navegador y dispositivo; detén el bucle para aplicar los ejercicios de memoria.

Las muestras de marimba se etiquetan por su sonido real en notación científica, aunque la biblioteca fuente usa otra convención de octavas. Se permite una octava cómoda para la respuesta vocal: no se evalúa forzar un registro.

## Observación y resultados

Tres preguntas de selección: logro (Sí / Parcialmente / No), ayuda (No / Un poco / Mucha) y utilidad de la tecnología (Sí, ayudó / No hubo diferencia evidente / Dificultó la actividad). Una observación breve es necesaria para confirmar; la mejora es un campo breve libre.

Cambiar un campo conserva un borrador. Solo una valoración confirmada con aplicación declarada, las tres respuestas y justificación cuenta como evaluada. Los resultados distinguen ejercicios aplicados, evaluados y borradores. Editar valores reales exige volver a confirmar. No se asignan notas ni puntuaciones automáticas.

El PDF incluye identificación del universitario, fecha de la experiencia, estado de los 12 ejercicios, recuentos, valoraciones, observaciones, mejoras, reflexión y referencia a evidencia externa si existe. Los informes incompletos se identifican como parciales y no inventan resultados. También puede descargarse un HTML autónomo del informe; puede abrirse e imprimirse en un navegador habitual.

Los resultados son observaciones de una experiencia concreta y no pruebas científicas de eficacia tecnológica. No se incluyen nombres, imágenes ni otros datos personales de los estudiantes de colegio.

## Video externo

La app orienta a grabar externamente con celular: ejercicio utilizado, participación musical e intervención docente. El archivo se entrega por separado. Antes de grabar menores se debe contar con las autorizaciones de sus responsables y la institución. Es posible usar evidencia sin rostros, nombres ni datos identificables. TIC 02 solo conserva un enlace opcional y no controla su acceso.

## Guardado y privacidad

Sin cuentas, backend, claves, servicios pagos o IA. `localStorage` guarda una experiencia por navegador y origen, bajo la clave `tic02-experience-v2`. No se envían datos al profesor. Los datos de la antigua guía se mantienen bajo su clave anterior y no se borran ni se convierten en observaciones.

Descarga un JSON para respaldo. Recuperarlo valida versión, tamaño, identificadores y valores y solicita confirmación antes de reemplazar la experiencia. Vaciar los datos también pide confirmación. El PDF, HTML y respaldo permanecen en el dispositivo hasta que decidas compartirlos. Las notas se muestran como texto para evitar ejecutar HTML escrito en ellas.

No confíes en el navegador como único respaldo: borrar sus datos o cambiar de dispositivo/origen puede perder la experiencia. Si no se permite almacenamiento local, descarga el JSON antes de salir.

## Abrir sin instalación

Extrae toda la carpeta y abre `index.html` en un navegador moderno. Mantén los archivos y `assets` juntos. No necesita servidor para su arquitectura ni instalaciones. La apertura directa y persistencia de archivos locales dependen del navegador; en la prueba integrada se utilizó un servidor estático porque el navegador no admite file://.

Para una vista previa local opcional: `python3 -m http.server 4173` desde esta carpeta y abre `http://localhost:4173/`.

No es una PWA: para usar sin internet, descarga la carpeta completa previamente. Un sitio visitado no se considera disponible offline por ese solo hecho. El enlace al video externo sí puede requerir conexión.

## GitHub Pages

Sube el contenido completo de esta carpeta a un repositorio dedicado, con `index.html` y `.nojekyll` en la raíz. En Settings → Pages selecciona la publicación desde la rama y carpeta donde subiste los archivos. No requiere compilación ni GitHub Actions personalizado. Las rutas relativas admiten el prefijo de un repositorio.

Consulta la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site). GitHub Free permite Pages desde repositorios públicos. Antes de compartir la URL, verifica audio, registro, respaldo y descarga PDF en el dispositivo del curso.

El historial de despliegues de GitHub Pages permite comprobar la versión publicada. Este proyecto es independiente: no se alteró ningún repositorio de Synth FX.

## Créditos

Audio: [Virtuosity Drums](https://github.com/sfzinstruments/virtuosity_drums) y [VCSL](https://github.com/sgossner/VCSL), CC0. Detalles en `assets/licenses/CREDITOS.md` y `sources.json`. Biblioteca PDF: [jsPDF](https://github.com/parallax/jsPDF), MIT; fuente Noto Sans, SIL OFL. Textos completos incluidos. Ver `VERIFICACION.md` para pruebas y límites.

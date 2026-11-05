# TIC 02 · Verificación del rediseño

5 de noviembre de 2026. Pruebas en navegador integrado de Codex, servido como sitio estático local. Se usaron registros ficticios identificados como PRUEBA DE INTERFAZ, no datos de una práctica real.

## Comprobado

- Se inspeccionó la app anterior y se modificó su misma carpeta. Se conservaron arquitectura estática, controles nativos de audio, patrones de navegación, guardado local y respaldo. La clave anterior de almacenamiento se mantiene intacta.
- Existen cuatro bloques y 12 ejercicios, con tres progresiones por bloque. Cada ejercicio tiene objetivo, consigna, audio, referencia docente y registro propio. No se exige selección de grados o edades ni construcción de recursos nuevos.
- Se probaron los 19 reproductores de los 12 ejercicios: todos alcanzaron readyState 4 y estado de reproducción, sin errores. Se comprobaron botones de detener y correspondencia de src con el ejercicio. El registro docente estuvo oculto al abrir cada uno.
- Los WAV tienen señal, sin saturación digital. Pico de las frases rítmicas: aproximadamente 0,623; melódicas: 0,394. Duraciones entre 2,609 y 5,455 segundos. La mezcla de percusión usa muestras acústicas de kick, snare y clap; la melodía usa marimba muestreada.
- Temporización: frases renderizadas completas a 44.1 kHz; longitud de ciclo igual a pulsos × 60/tempo, con tolerancia de una muestra. No hay silencio extra añadido entre ciclos. Todos los ataques están en la línea de tiempo del archivo, no en temporizadores de la interfaz.
- Se verificó el contenido de comparación: ar1 añade un golpe; ar2 desplaza el último ataque sin cambiar cantidad ni tempo; ar3 omite un ataque. am1 asciende/desciende/repite; am2 usa dos archivos iguales; am3 cambia la tercera altura.
- Revisión espectral de las muestras de marimba: Do alrededor de 523 Hz y Sol alrededor de 784 Hz. Se corrigieron referencias de octava para que correspondan al sonido real. El registro vocal puede adaptarse a una octava cómoda.
- Abrir el registro docente detiene la reproducción. Recargar o cambiar de ejercicio mantiene las observaciones y vuelve a ocultar el registro. No hay petición de micrófono o cámara ni análisis de interpretaciones.
- Guardar sin declarar aplicación muestra un aviso. Confirmar requiere las tres selecciones y una observación breve. Se verificaron tres registros de distinto logro, ayuda y utilidad: 3 evaluados, 1 logrado, 1 parcial, 1 no logrado; una valoración por categoría de tecnología.
- Se verificó el caso de los 12 registros: 12 aplicados y evaluados; 4 completos, 4 parciales y 4 no logrados; 4 por categoría de tecnología. Todos figuran por separado en los resultados e informe.
- Edición: un cambio real devuelve el registro a borrador y lo excluye de los recuentos hasta confirmar de nuevo. Se corrigió un caso de invalidación por eventos tardíos sin cambios reales. Guardar y navegar conservó los 12 registros confirmados.
- Persistencia tras recarga de observaciones y estado confirmado. Descarga JSON y recuperación del respaldo inicial verificadas: volvió a 0 ejercicios, identificación y reflexión vacías. Los datos ficticios no quedan en la experiencia presentada para revisión.
- Exportación HTML autónoma descargada. Exportación PDF directa descargada, sin servicios remotos ni diálogo de impresión. Se añadió porque el diálogo nativo del navegador integrado bloqueó la primera prueba de impresión; se retiró de la interfaz ese flujo como requisito para obtener PDF.
- PDF A4 con fuente Noto Sans local: se renderizaron y revisaron todas las páginas. Se corrigieron cortes de tabla, un rótulo huérfano y la separación de registros breves. Se probó una observación de 600 caracteres y reflexión de 3000. Se verificaron acentos, presencia de los 12 ejercicios, numeración y anotación de enlace clicable a una evidencia ficticia. No se incluyen esos datos de prueba en el ZIP ni como informe final del usuario.
- Responsive: los 12 registros docentes a 320 px CSS, y las vistas inicio, ejercicio de comparación, resultados, informe y respaldo a 393, 768 y 1280 px. Sin desbordamiento horizontal de página. Se añadió desplazamiento interno a la barra lateral para mantener accesibles sus enlaces en ventanas bajas.
- Revisión de sintaxis de app.js y pdf-export.js con Node. Sin errores o advertencias de consola en los flujos principales. Notas insertadas como texto; HTML exportado con escape; enlace de evidencia restringido a http/https.
- Licencias locales CC0 para muestras; MIT para jsPDF; SIL OFL para Noto Sans. Procedencia exacta y hash de originales incluidos en assets/licenses/sources.json. El uso de la app no requiere descargas de terceros.

## Límites de verificación

- La carga y entrada en reproducción no equivalen a una evaluación auditiva humana en los altavoces y audífonos del curso. Las muestras son acústicas con licencia documentada; conviene comprobar balance y comodidad de volumen en los dispositivos que se usarán.
- La continuidad final del bucle HTML nativo depende del navegador y dispositivo. El archivo no añade silencios entre ciclos; no se promete precisión de interpretación o latencia de un secuenciador profesional. Las actividades de memoria requieren detener el audio antes de responder.
- No se ha realizado una prueba pedagógica con estudiantes de colegio ni universitarios reales. Deben ajustarse repeticiones y apoyos según observación docente.
- Faltan pruebas en dispositivos Android/iOS reales, Safari/Firefox/Chrome externos, lectores de pantalla y recorrido completo de teclado. No se declara certificación de accesibilidad.
- El PDF descargado tiene texto seleccionable y fuente incorporada, pero no es un PDF etiquetado para accesibilidad documental. El informe HTML conserva encabezados y tablas semánticas como alternativa.
- Apertura directa file://, condiciones de almacenamiento bloqueado y borrado por el navegador no se simularon de principio a fin. El navegador integrado no permite ese protocolo. La arquitectura no depende de servidor; se verificó a través de HTTP local.
- Estas pruebas se realizaron localmente antes del despliegue. La verificación de la URL publicada se realiza por separado durante la publicación. No se modificó Synth FX ni ningún otro proyecto.

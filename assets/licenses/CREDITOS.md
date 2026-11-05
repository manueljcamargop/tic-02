# Audio de TIC 02

Las secuencias rítmicas y melódicas son originales de este proyecto. Se prepararon 19 frases para 12 ejercicios a partir de cinco muestras acústicas con licencia CC0-1.0. No se solicita audio a servicios remotos al usar la aplicación.

## Muestras

- **Kick / snare:** [Virtuosity Drums](https://github.com/sfzinstruments/virtuosity_drums), Versilian Studios y Karoryfer Samples; batería interpretada por Austin McMahon y grabada en Virtuosity Musical Instruments, Boston. Se seleccionaron `Samples/mid/kick/mid_kick_snoff_vl3_rr1.flac` y `Samples/mid/snare/mid_snare_center_vl7.flac`. Revisión `9f04cf9a734527edfbb0a4eee1f674e45bbf71bc`.
- **Clap y marimba:** [Versilian Community Sample Library (VCSL)](https://github.com/sgossner/VCSL), Versilian Studios. Se seleccionaron `SoloClap_vl3.wav`, `Marimba_hit_Outrigger_C4_med_01.wav` y `Marimba_hit_Outrigger_G4_med_01.wav`.

Los enlaces exactos de cada archivo, la revisión de origen y las huellas SHA-256 están en `sources.json`. Se incluyen los textos completos de licencia CC0 de ambos repositorios.

## Preparación

Conversión a WAV PCM mono, 16 bit, 44.1 kHz. Recorte del silencio inicial con un margen de ataque, ajuste de nivel y cola máxima de dos segundos con fundido final de 50 ms. Las notas de marimba se obtuvieron de las muestras de archivo C4 y G4 (que suenan como Do5 y Sol5 en notación científica) mediante transposición cercana (máximo cuatro semitonos) y corte con fundido para las duraciones indicadas. No se añaden sonidos sintetizados como sustitutos de kick, snare o clap.

Las frases están renderizadas completas: la separación entre ataques depende de la línea de tiempo de audio, no de temporizadores de la interfaz. El indicador de pulsos es orientador y no sustituye la escucha. Se evita reproducción automática y se detiene el sonido al cambiar de vista o abrir el registro docente. El bucle es opcional y se desactiva al abrir otro ejercicio. Para imitación de memoria, el docente debe detener el bucle antes de la respuesta.

La reproducción de bucles en controles HTML nativos puede variar ligeramente entre navegadores y dispositivos. Los ejercicios son frases cortas; la respuesta se realiza después de la escucha. Es recomendable comprobar el resultado en los altavoces o audífonos que se utilizarán en la práctica.

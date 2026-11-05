/* Original instructional sequences; see assets/licenses for sample credits. */
window.TIC_EXERCISES = [
  {
    "id": "ir1",
    "block": 0,
    "title": "Escucha y repite",
    "objective": "Reproducir un patrón corto conservando el orden de golpes y el pulso.",
    "instruction": "Escucha hasta el final. Después repite con palmas. Puedes volver a escuchar.",
    "bpm": 88,
    "beats": 4,
    "clips": [
      {
        "label": "Patrón",
        "file": "ir1-1.wav",
        "events": [
          [
            0,
            "clap"
          ],
          [
            1,
            "clap"
          ],
          [
            2,
            "clap"
          ],
          [
            2.5,
            "clap"
          ],
          [
            3,
            "clap"
          ]
        ],
        "duration": 2.727
      }
    ],
    "criterion": "Conserva los cinco golpes, el par más rápido y un pulso estable.",
    "answer": "Cinco golpes: 1, 2, 3, «y» de 3, 4.",
    "guide": "Un ciclo de cuatro pulsos. La respuesta se realiza después del audio.",
    "tip": ""
  },
  {
    "id": "ir2",
    "block": 0,
    "title": "Percusión combinada",
    "objective": "Imitar una secuencia diferenciando tres timbres mediante sonidos corporales.",
    "instruction": "Escucha los tres sonidos. Acuerda un gesto para cada uno y repite el patrón cuando termine.",
    "bpm": 88,
    "beats": 4,
    "clips": [
      {
        "label": "Patrón",
        "file": "ir2-1.wav",
        "events": [
          [
            0,
            "kick"
          ],
          [
            1,
            "snare"
          ],
          [
            2,
            "kick"
          ],
          [
            2.5,
            "clap"
          ],
          [
            3,
            "snare"
          ]
        ],
        "duration": 2.727
      }
    ],
    "criterion": "Respeta el orden y la ubicación de kick, snare y clap; los gestos pueden adaptarse.",
    "answer": "Kick en 1 y 3; snare en 2 y 4; clap en «y» de 3.",
    "guide": "Kick → muslos; snare → palma sobre mano; clap → palmas. Son sugerencias, no requisitos corporales.",
    "tip": ""
  },
  {
    "id": "ir3",
    "block": 0,
    "title": "Memoria rítmica",
    "objective": "Recordar y reproducir dos ciclos con silencios y una variación final.",
    "instruction": "Escucha la frase completa. Espera el silencio y repítela de memoria. Pide otra escucha si la necesitas.",
    "bpm": 92,
    "beats": 8,
    "clips": [
      {
        "label": "Secuencia",
        "file": "ir3-1.wav",
        "events": [
          [
            0,
            "clap"
          ],
          [
            1,
            "clap"
          ],
          [
            1.5,
            "clap"
          ],
          [
            3,
            "clap"
          ],
          [
            4,
            "clap"
          ],
          [
            5,
            "clap"
          ],
          [
            6.5,
            "clap"
          ],
          [
            7,
            "clap"
          ]
        ],
        "duration": 5.217
      }
    ],
    "criterion": "Mantiene ocho pulsos, pausas y la diferencia entre las dos mitades.",
    "answer": "Golpes en 1, 2, «y» de 2, 4; luego 1, 2, «y» de 3, 4.",
    "guide": "Dos ciclos. Observa si conserva los silencios al responder sin audio.",
    "tip": ""
  },
  {
    "id": "ar1",
    "block": 1,
    "title": "Reconoce el patrón",
    "objective": "Distinguir dos patrones que difieren en la cantidad de golpes.",
    "instruction": "Escucha A y B. ¿Son iguales? Explica qué diferencia escuchas.",
    "bpm": 88,
    "beats": 4,
    "clips": [
      {
        "label": "A · Patrón",
        "file": "ar1-1.wav",
        "events": [
          [
            0,
            "clap"
          ],
          [
            1,
            "clap"
          ],
          [
            2,
            "clap"
          ],
          [
            3,
            "clap"
          ]
        ],
        "duration": 2.727
      },
      {
        "label": "B · Patrón",
        "file": "ar1-2.wav",
        "events": [
          [
            0,
            "clap"
          ],
          [
            1,
            "clap"
          ],
          [
            2,
            "clap"
          ],
          [
            2.5,
            "clap"
          ],
          [
            3,
            "clap"
          ]
        ],
        "duration": 2.727
      }
    ],
    "criterion": "Distingue la diferencia y la describe de forma sonora o corporal.",
    "answer": "B añade un golpe en la segunda mitad del pulso 3. A tiene 4 golpes y B tiene 5.",
    "guide": "No muestres esta referencia antes de la respuesta.",
    "tip": ""
  },
  {
    "id": "ar2",
    "block": 1,
    "title": "¿Qué cambió?",
    "objective": "Reconocer el desplazamiento de un golpe con la misma cantidad de ataques.",
    "instruction": "Compara el original con la variación. ¿Se añadió o quitó un golpe, o cambió de lugar?",
    "bpm": 92,
    "beats": 4,
    "clips": [
      {
        "label": "A · Original",
        "file": "ar2-1.wav",
        "events": [
          [
            0,
            "clap"
          ],
          [
            1,
            "clap"
          ],
          [
            2,
            "clap"
          ],
          [
            3,
            "clap"
          ]
        ],
        "duration": 2.609
      },
      {
        "label": "B · Variación",
        "file": "ar2-2.wav",
        "events": [
          [
            0,
            "clap"
          ],
          [
            1,
            "clap"
          ],
          [
            2,
            "clap"
          ],
          [
            3.5,
            "clap"
          ]
        ],
        "duration": 2.609
      }
    ],
    "criterion": "Reconoce que el último golpe cambia de lugar y no cambia la cantidad.",
    "answer": "El golpe del pulso 4 se retrasa a la segunda mitad de ese pulso. Queda silencio al comienzo del 4.",
    "guide": "Ambas secuencias tienen cuatro golpes; no es un cambio de tempo.",
    "tip": ""
  },
  {
    "id": "ar3",
    "block": 1,
    "title": "Detecta el error",
    "objective": "Localizar una omisión en la segunda mitad de una secuencia rítmica.",
    "instruction": "Escucha el modelo y la segunda versión. Señala dónde falta un golpe; puedes contarlo o reproducir ese fragmento.",
    "bpm": 96,
    "beats": 8,
    "clips": [
      {
        "label": "A · Modelo",
        "file": "ar3-1.wav",
        "events": [
          [
            0,
            "clap"
          ],
          [
            1,
            "clap"
          ],
          [
            1.5,
            "clap"
          ],
          [
            3,
            "clap"
          ],
          [
            4,
            "clap"
          ],
          [
            5,
            "clap"
          ],
          [
            6,
            "clap"
          ],
          [
            6.5,
            "clap"
          ],
          [
            7,
            "clap"
          ]
        ],
        "duration": 5.0
      },
      {
        "label": "B · Segunda versión",
        "file": "ar3-2.wav",
        "events": [
          [
            0,
            "clap"
          ],
          [
            1,
            "clap"
          ],
          [
            1.5,
            "clap"
          ],
          [
            3,
            "clap"
          ],
          [
            4,
            "clap"
          ],
          [
            5,
            "clap"
          ],
          [
            6.5,
            "clap"
          ],
          [
            7,
            "clap"
          ]
        ],
        "duration": 5.0
      }
    ],
    "criterion": "Localiza la omisión en la segunda mitad y la demuestra al contar o repetir.",
    "answer": "En B falta el golpe del pulso 3 del segundo ciclo (pulso 7 de toda la frase).",
    "guide": "Compara primero cada mitad. No se evalúa el vocabulario técnico si puede mostrar lo que oye.",
    "tip": ""
  },
  {
    "id": "im1",
    "block": 2,
    "title": "Repite tres notas",
    "objective": "Imitar tres alturas manteniendo el contorno ascendente.",
    "instruction": "Escucha las tres notas. Después cántalas con «la» o repítelas con un instrumento.",
    "bpm": 84,
    "beats": 4,
    "clips": [
      {
        "label": "Tres notas",
        "file": "im1-1.wav",
        "events": [
          [
            0,
            "72",
            0.75
          ],
          [
            1,
            "74",
            0.75
          ],
          [
            2,
            "76",
            1
          ]
        ],
        "duration": 2.857
      }
    ],
    "criterion": "Mantiene el movimiento ascendente y la relación entre las notas; puede usar una octava cómoda.",
    "answer": "Do5–Re5–Mi5. Tres ataques de igual separación.",
    "guide": "El universitario puede dar una nota inicial cómoda. No exijas el registro exacto de la muestra.",
    "tip": ""
  },
  {
    "id": "im2",
    "block": 2,
    "title": "Escucha e imita",
    "objective": "Reproducir una frase que asciende y luego desciende.",
    "instruction": "Escucha la frase completa. Al terminar, imítala con voz o instrumento y conserva su recorrido.",
    "bpm": 84,
    "beats": 6,
    "clips": [
      {
        "label": "Frase",
        "file": "im2-1.wav",
        "events": [
          [
            0,
            "72",
            0.8
          ],
          [
            1,
            "74",
            0.8
          ],
          [
            2,
            "76",
            0.8
          ],
          [
            3,
            "79",
            0.8
          ],
          [
            4,
            "76",
            0.8
          ],
          [
            5,
            "72",
            0.8
          ]
        ],
        "duration": 4.286
      }
    ],
    "criterion": "Respeta la subida, el punto más alto y la bajada, con separación regular.",
    "answer": "Do5–Re5–Mi5–Sol5–Mi5–Do5.",
    "guide": "Seis pulsos. Permite otra escucha sin cantar encima del modelo.",
    "tip": ""
  },
  {
    "id": "im3",
    "block": 2,
    "title": "Memoria melódica",
    "objective": "Recordar una frase con cambios de altura, duraciones y un silencio.",
    "instruction": "Escucha y espera a que termine. Luego repite de memoria, dejando también el espacio sin sonido.",
    "bpm": 88,
    "beats": 8,
    "clips": [
      {
        "label": "Frase completa",
        "file": "im3-1.wav",
        "events": [
          [
            0,
            "72",
            0.8
          ],
          [
            1,
            "76",
            0.4
          ],
          [
            1.5,
            "79",
            0.4
          ],
          [
            2,
            "81",
            1
          ],
          [
            4,
            "79",
            0.8
          ],
          [
            5,
            "76",
            0.8
          ],
          [
            6,
            "74",
            0.8
          ],
          [
            7,
            "72",
            0.8
          ]
        ],
        "duration": 5.455
      }
    ],
    "criterion": "Conserva el contorno, el par de notas rápidas y el silencio del cuarto pulso.",
    "answer": "Do5–Mi5–Sol5–La5; silencio en 4; Sol5–Mi5–Re5–Do5.",
    "guide": "Dos ciclos. Observa por separado memoria de alturas, duración y pausa.",
    "tip": ""
  },
  {
    "id": "am1",
    "block": 3,
    "title": "¿Sube o baja?",
    "objective": "Reconocer la dirección ascendente, descendente o repetida de tres secuencias.",
    "instruction": "Escucha cada secuencia. Di si sube, baja o se queda en la misma altura; puedes acompañar con un gesto.",
    "bpm": 88,
    "beats": 4,
    "clips": [
      {
        "label": "A",
        "file": "am1-1.wav",
        "events": [
          [
            0,
            "72",
            0.7
          ],
          [
            1,
            "74",
            0.7
          ],
          [
            2,
            "76",
            0.7
          ]
        ],
        "duration": 2.727
      },
      {
        "label": "B",
        "file": "am1-2.wav",
        "events": [
          [
            0,
            "79",
            0.7
          ],
          [
            1,
            "76",
            0.7
          ],
          [
            2,
            "72",
            0.7
          ]
        ],
        "duration": 2.727
      },
      {
        "label": "C",
        "file": "am1-3.wav",
        "events": [
          [
            0,
            "76",
            0.7
          ],
          [
            1,
            "76",
            0.7
          ],
          [
            2,
            "76",
            0.7
          ]
        ],
        "duration": 2.727
      }
    ],
    "criterion": "Identifica las tres direcciones por escucha. Registra cuáles distinguió.",
    "answer": "A sube; B baja; C repite la misma altura.",
    "guide": "Acepta descripción verbal o gestual, sin exigir nombres de notas.",
    "tip": ""
  },
  {
    "id": "am2",
    "block": 3,
    "title": "Compara las melodías",
    "objective": "Determinar si dos frases melódicas conservan alturas y ritmo.",
    "instruction": "Escucha A y B completas. ¿Son iguales o diferentes? Explica en qué te fijaste.",
    "bpm": 88,
    "beats": 4,
    "clips": [
      {
        "label": "A",
        "file": "am2-1.wav",
        "events": [
          [
            0,
            "72",
            0.7
          ],
          [
            1,
            "76",
            0.7
          ],
          [
            2,
            "79",
            0.7
          ],
          [
            3,
            "76",
            0.7
          ]
        ],
        "duration": 2.727
      },
      {
        "label": "B",
        "file": "am2-2.wav",
        "events": [
          [
            0,
            "72",
            0.7
          ],
          [
            1,
            "76",
            0.7
          ],
          [
            2,
            "79",
            0.7
          ],
          [
            3,
            "76",
            0.7
          ]
        ],
        "duration": 2.727
      }
    ],
    "criterion": "Reconoce que son iguales en alturas y ritmo; puede repetirlas para justificar.",
    "answer": "A y B son iguales: Do5–Mi5–Sol5–Mi5.",
    "guide": "No todas las comparaciones contienen un error. Evita sugerir la respuesta.",
    "tip": ""
  },
  {
    "id": "am3",
    "block": 3,
    "title": "Encuentra el cambio",
    "objective": "Localizar una altura modificada dentro de una frase.",
    "instruction": "Compara el original con la segunda melodía. ¿En qué parte cambia? Puedes señalar el momento o cantar el fragmento.",
    "bpm": 92,
    "beats": 6,
    "clips": [
      {
        "label": "A · Original",
        "file": "am3-1.wav",
        "events": [
          [
            0,
            "72",
            0.8
          ],
          [
            1,
            "74",
            0.8
          ],
          [
            2,
            "76",
            0.8
          ],
          [
            3,
            "79",
            0.8
          ],
          [
            4,
            "76",
            0.8
          ],
          [
            5,
            "72",
            0.8
          ]
        ],
        "duration": 3.913
      },
      {
        "label": "B · Modificada",
        "file": "am3-2.wav",
        "events": [
          [
            0,
            "72",
            0.8
          ],
          [
            1,
            "74",
            0.8
          ],
          [
            2,
            "77",
            0.8
          ],
          [
            3,
            "79",
            0.8
          ],
          [
            4,
            "76",
            0.8
          ],
          [
            5,
            "72",
            0.8
          ]
        ],
        "duration": 3.913
      }
    ],
    "criterion": "Localiza el tercer sonido y reconoce el cambio de altura, sin atribuirlo al tempo.",
    "answer": "El tercer sonido cambia de Mi5 a Fa5; ritmo y resto de notas permanecen iguales.",
    "guide": "Permite volver a escuchar y comparar fragmentos sin revelar antes dónde está el cambio.",
    "tip": ""
  }
];

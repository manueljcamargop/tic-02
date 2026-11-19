"use strict";
// TIC · Taller de creación. Secuenciador propio con las muestras locales (CC0) de la app.
// Los escolares crean con la guía del universitario; luego el universitario revisa y registra.
(function () {
  const NOTES = [
    { name: "Do", sample: "marimba", rate: 1 },
    { name: "Re", sample: "marimba", rate: Math.pow(2, 2 / 12) },
    { name: "Mi", sample: "marimba", rate: Math.pow(2, 4 / 12) },
    { name: "Sol", sample: "marimbaG", rate: 1 },
    { name: "La", sample: "marimbaG", rate: Math.pow(2, 2 / 12) },
    { name: "Do agudo", short: "Do'", sample: "marimbaG", rate: Math.pow(2, 5 / 12) },
  ];
  const DRUMS = [
    { key: "kick", name: "Bombo", hint: "grave" },
    { key: "snare", name: "Caja", hint: "seco" },
    { key: "clap", name: "Hi-hat", hint: "cerrado" },
  ];
  const FILES = {
    kick: "kick-pop.wav",
    snare: "snare-pop.wav",
    hat: "hat.wav",
    clave: "clave.wav", claveHi: "clave-hi.wav",
    marimba: "marimba-c.wav",
    marimbaG: "marimba-g.wav",
  };
  const GROUPS = [
    { title: "Creación rítmica", icon: "✣", short: "Crea ritmos" },
    { title: "Creación melódica", icon: "✦", short: "Crea melodías" },
  ];
  const rhythm = (p, rows) => rows.map((r) => p[r] || []);
  const anyOn = (a) => a.some(Boolean);
  const count = (a) => a.filter(Boolean).length;
  const melodyNotes = (p) => (p.melody || []).filter((n) => n !== null && n !== undefined);
  // Silabeo y acento prosódico del español (aproximado, suficiente para palabras sueltas)
  function silabear(word) {
    const w = (word || "").toLowerCase().normalize("NFC").replace(/[^a-záéíóúüñ]/g, "");
    if (!w) return { syl: [], tonic: -1 };
    const STRONG = "aeoáéóíú", WEAK = "iuü";
    const isV = (s, i) => {
      const ch = s[i];
      if (ch === "y") return i === s.length - 1 && i > 0 && "aeiou".includes(s[i - 1]);
      if (ch === "u" && i > 0 && (s[i - 1] === "q" || (s[i - 1] === "g" && "eéií".includes(s[i + 1] || "")))) return false;
      return "aeiouáéíóúü".includes(ch);
    };
    const vv = (a, b) => {
      a = a === "y" ? "i" : a; b = b === "y" ? "i" : b;
      if (a === b) return false;
      return (WEAK.includes(a) || WEAK.includes(b)) && !"íú".includes(a) && !"íú".includes(b);
    };
    // núcleos
    const nuc = [];
    for (let i = 0; i < w.length; i++) {
      if (!isV(w, i)) continue;
      const last = nuc[nuc.length - 1];
      if (last && last[1] === i - 1 && vv(w[i - 1], w[i])) last[1] = i;
      else if (last && last[1] === i - 2 && w[i - 1] === "h" && vv(w[i - 2], w[i])) last[1] = i;
      else nuc.push([i, i]);
    }
    if (!nuc.length) return { syl: [w], tonic: 0 };
    const INSEP = ["pl", "bl", "fl", "cl", "gl", "kl", "pr", "br", "fr", "cr", "gr", "kr", "tr", "dr", "tl"];
    const units = (s) => s.match(/ch|ll|rr|qu|gu|./g) || [];
    const cuts = [];
    for (let k = 0; k < nuc.length - 1; k++) {
      const a = nuc[k][1] + 1, b = nuc[k + 1][0];
      const cons = units(w.slice(a, b));
      let take = 0; // consonantes que se quedan en la sílaba anterior
      if (cons.length === 2) take = INSEP.includes(cons.join("")) ? 0 : 1;
      else if (cons.length === 3) take = INSEP.includes(cons.slice(1).join("")) ? 1 : 2;
      else if (cons.length >= 4) take = 2;
      cuts.push(a + cons.slice(0, take).join("").length);
    }
    const syl = [];
    let from = 0;
    for (const c of cuts) { syl.push(w.slice(from, c)); from = c; }
    syl.push(w.slice(from));
    let tonic = syl.findIndex((s) => /[áéíóú]/.test(s));
    if (tonic < 0) tonic = syl.length === 1 ? 0 : /[aeiouns]$/.test(w) ? syl.length - 2 : syl.length - 1;
    return { syl, tonic };
  }
  function syllables(word) { return silabear(word).syl.length; }
  function wordInfo(c) {
    const r = silabear(c.word || "");
    const auto = r.tonic;
    const tonic = Number.isInteger(c.tonic) && c.tonic >= 0 && c.tonic < r.syl.length ? c.tonic : auto;
    return { syl: r.syl, tonic, auto };
  }
  function hitsInOrder(p) {
    const out = [];
    for (let i = 0; i < (p.clap || []).length; i++) {
      if ((p.snare || [])[i]) out.push({ step: i, snare: true });
      else if (p.clap[i]) out.push({ step: i, snare: false });
    }
    return out;
  }
  const RETOS = [
    {
      id: "rn", group: 0, type: "rhythm", rows: ["snare", "clap"], steps: 16, tempo: 76, word: true,
      title: "Mi nombre en ritmo",
      objective: "Descubrir que las palabras ya tienen ritmo: cada sílaba es un golpe y la sílaba fuerte se acentúa.",
      instruction: "Escribe una palabra que te guste: un apodo, un animal o tu comida favorita. Dila en voz alta varias veces. Pon un golpe por cada sílaba: la sílaba que suena más fuerte va con la caja y las demás con el hi-hat.",
      checks: (p, c) => {
        const { syl, tonic } = wordInfo(c);
        const hits = hitsInOrder(p);
        const snares = hits.filter((h) => h.snare);
        const strong = syl[tonic] || "";
        const onTonic = syl.length > 0 && snares.length === 1 && hits[tonic] && hits[tonic].snare;
        return [
          { text: "Escribe tu palabra", ok: syl.length > 0 },
          { text: syl.length ? `Pon un golpe por cada sílaba (${syl.join("-")} = ${syl.length} golpes)` : "Pon un golpe por cada sílaba", ok: syl.length > 0 && hits.length === syl.length },
          { text: strong ? `La caja va en la sílaba morada: ${strong.toUpperCase()}` : "La caja va en la sílaba morada", ok: !!onTonic },
          { text: "La caja va en un cuadro con número", ok: !!onTonic && hits[tonic].step % 4 === 0 },
        ];
      },
      observe: "Si dice la palabra con un pulso estable, si identifica la sílaba fuerte (acento prosódico) y si la hace coincidir con un tiempo del compás, como ocurre al cantar.",
      guide: "Que diga la palabra mientras aplaude. Pregunta: «¿en qué parte de la palabra pones más fuerza?». Activa el bucle y digan la palabra junto con la app. La app separa las sílabas y propone la sílaba fuerte. Si la palabra se pronuncia distinto (un apodo, un nombre extranjero), toca la sílaba correcta en el recuadro: la app calificará con tu decisión.",
    },
    {
      id: "rd", group: 0, type: "rhythm", rows: ["kick", "snare", "clap"], steps: 16, tempo: 92,
      base: { kick: [0, 4, 8, 12], snare: [3, 6, 11, 14] },
      title: "Ritmo de aquí",
      objective: "Reconocer en la cuadrícula un ritmo urbano conocido (el dembow) y transformarlo en un ritmo propio.",
      instruction: "El reguetón tiene un ritmo que todos reconocen: el dembow. Toca «Ritmo base» y escúchalo. Después hazlo tuyo: agrega hi-hat, mueve o quita golpes, hasta que suene a ti.",
      checks: (p) => {
        const on = (k, i) => !!(p[k] || [])[i];
        const changed = ["kick", "snare", "clap"].some((k) => (p[k] || []).some((v, i) => v !== ((k === "kick" && [0, 4, 8, 12].includes(i)) || (k === "snare" && [3, 6, 11, 14].includes(i)))));
        return [
          { text: "El bombo suena en los cuatro números", ok: [0, 4, 8, 12].every((i) => on("kick", i)) },
          { text: "La caja suena entre los números", ok: (p.snare || []).some((v, i) => v && i % 4 !== 0) },
          { text: "Le agregaste o cambiaste algo tuyo", ok: changed && anyOn([].concat(p.kick || [], p.snare || [], p.clap || [])) },
        ];
      },
      observe: "Si reconoce el ritmo base al escucharlo, si sus cambios mantienen el pulso del bombo y si puede explicar qué cambió y por qué.",
      guide: "Antes de cargar el ritmo base, pregunta qué música escuchan. Si prefieren cumbia o champeta, pueden construirla desde cero en lugar del dembow. Pide que muevan el cuerpo con el bombo: ese es el pulso. Luego: «¿qué le pondrías para que suene diferente?».",
    },
    {
      id: "cr3", group: 0, type: "rhythm", rows: ["kick", "snare", "clap"], steps: 32, tempo: 84,
      title: "Pregunta y respuesta",
      objective: "Construir dos frases rítmicas relacionadas: la segunda responde a la primera.",
      instruction: "Tu creación tiene dos partes. Crea una «pregunta» en la parte 1 y una «respuesta» en la parte 2: parecida, pero no igual.",
      checks: (p) => {
        const rows = rhythm(p, ["kick", "snare", "clap"]);
        const half = (h) => rows.map((r) => r.slice(h * 16, h * 16 + 16));
        const a = JSON.stringify(half(0).map((r) => r.map(Boolean)));
        const b = JSON.stringify(half(1).map((r) => r.map(Boolean)));
        return [
          { text: "Pon sonidos en la parte 1 (izquierda)", ok: half(0).some(anyOn) },
          { text: "Pon sonidos en la parte 2 (derecha)", ok: half(1).some(anyOn) },
          { text: "La parte 2 tiene algo distinto a la parte 1", ok: half(0).some(anyOn) && half(1).some(anyOn) && a !== b },
        ];
      },
      observe: "Si explica en qué se parecen y en qué se diferencian sus dos partes, y si la respuesta guarda relación con la pregunta.",
      guide: "Una estrategia: copiar la pregunta en la parte 2 y cambiar solo uno o dos golpes. Pide que lo diga con palabras: «mi respuesta cambia al final».",
    },
    {
      id: "cm1", group: 1, type: "melody", notes: [0, 1, 2], steps: 16, tempo: 72,
      title: "Tres notas",
      objective: "Crear una melodía breve con tres alturas y cantarla.",
      instruction: "Usa solo Do, Re y Mi. Toca un cuadro para poner una nota; tócalo otra vez para quitarla. Después canta tu melodía.",
      checks: (p) => {
        const n = melodyNotes(p);
        return [
          { text: "Pon al menos 4 notas", ok: n.length >= 4 },
          { text: "Usa las tres notas: Do, Re y Mi", ok: [0, 1, 2].every((x) => n.includes(x)) },
          { text: "La última nota es Do", ok: n.length > 0 && n[n.length - 1] === 0 },
        ];
      },
      observe: "Si canta su melodía con alturas aproximadas, si reconoce cuándo sube o baja y si la ajusta después de escucharla.",
      guide: "Canta con él la primera vez. Si cantar le da pena, puede tararear o señalar con la mano la altura. Acepta otra octava.",
    },
    {
      id: "cm2", group: 1, type: "melody", notes: [0, 1, 2, 3, 4], steps: 16, tempo: 76,
      title: "Sube y baja",
      objective: "Dar forma al contorno de una melodía pentatónica: que suba y baje.",
      instruction: "Ahora tienes cinco notas. Crea una melodía que suba y luego baje, como una montaña o una ola. Dibuja el camino con tu mano mientras suena.",
      checks: (p) => {
        const n = melodyNotes(p);
        let up = false, down = false;
        for (let i = 1; i < n.length; i++) { if (n[i] > n[i - 1]) up = true; if (n[i] < n[i - 1]) down = true; }
        return [
          { text: "Pon al menos 5 notas", ok: n.length >= 5 },
          { text: "En algún momento la melodía sube (la nota siguiente está más arriba)", ok: up },
          { text: "En algún momento la melodía baja (la nota siguiente está más abajo)", ok: down },
        ];
      },
      observe: "Si relaciona lo que ve en la cuadrícula con lo que escucha, y si describe el recorrido (sube, baja, se queda).",
      guide: "Pregunta antes de escuchar: «¿cómo crees que va a sonar?». Después compara. La cuadrícula ayuda: arriba es más agudo.",
    },
    {
      id: "cm3", group: 1, type: "melody", notes: [0, 1, 2, 3, 4, 5], steps: 32, tempo: 76,
      title: "Melodía con final",
      objective: "Crear una melodía de dos frases con un silencio que respira y un final que suena a cierre.",
      instruction: "Crea una melodía larga en dos partes. Deja al menos un silencio para respirar y termina en Do (grave o agudo) para que suene a final.",
      checks: (p) => {
        const m = p.melody || [];
        const n = melodyNotes(p);
        let last = -1; m.forEach((x, i) => { if (x !== null && x !== undefined) last = i; });
        const rest = m.slice(0, last).some((x) => x === null || x === undefined);
        return [
          { text: "Pon al menos 8 notas", ok: n.length >= 8 },
          { text: "Pon notas en la parte 1 y en la parte 2", ok: m.slice(0, 16).some((x) => x !== null && x !== undefined) && m.slice(16).some((x) => x !== null && x !== undefined) },
          { text: "Deja al menos un cuadro vacío en medio de la melodía", ok: n.length > 0 && rest },
          { text: "La última nota es Do (abajo o arriba)", ok: n.length > 0 && (n[n.length - 1] === 0 || n[n.length - 1] === 5) },
        ];
      },
      observe: "Si percibe la diferencia entre un final en Do y uno en otra nota, y si puede justificar dónde puso el silencio.",
      guide: "Prueba con él terminar en otra nota y luego en Do: «¿cuál suena a final?». Que decida por el oído, no por la regla.",
    },
  ];
  const CREATE_QUESTIONS = {
    achievement: "¿El escolar logró crear y escuchar su composición?",
    help: "¿Necesitó ayuda?",
    technology: "¿La app facilitó la creación?",
  };
  const blankPattern = (r) =>
    r.type === "rhythm"
      ? Object.fromEntries(r.rows.map((k) => [k, Array(r.steps).fill(false)]))
      : { melody: Array(r.steps).fill(null) };
  const blankCreation = (r) => ({
    pattern: blankPattern(r), tempo: r.tempo, title: "", word: "", tonic: null,
    applied: false, achievement: "", help: "", technology: "", observed: "", improve: "", confirmed: false,
  });
  const txt = (v, max) => (typeof v === "string" ? v.slice(0, max) : "");
  const CHOICE_SETS = {
    achievement: ["Sí", "Parcialmente", "No"],
    help: ["No", "Un poco", "Mucha"],
    technology: ["Sí, ayudó", "No hubo diferencia evidente", "Dificultó la actividad"],
  };
  function clean(raw) {
    const out = {};
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
    for (const r of RETOS) {
      const c = raw[r.id];
      if (!c || typeof c !== "object") continue;
      const o = blankCreation(r);
      const p = c.pattern || {};
      if (r.type === "rhythm") {
        for (const k of r.rows)
          if (Array.isArray(p[k])) {
            const f = p[k].length * 2 === r.steps ? 2 : 1;
            o.pattern[k] = o.pattern[k].map((_, i) => i % f === 0 && p[k][i / f] === true);
          }
      } else if (Array.isArray(p.melody)) {
        const f = p.melody.length * 2 === r.steps ? 2 : 1;
        o.pattern.melody = o.pattern.melody.map((_, i) => { const v = i % f === 0 ? p.melody[i / f] : null; return Number.isInteger(v) && r.notes.includes(v) ? v : null; });
      }
      if (Number.isFinite(c.tempo)) o.tempo = Math.min(120, Math.max(60, Math.round(c.tempo)));
      o.title = txt(c.title, 80);
      o.word = txt(c.word, 30);
      o.tonic = Number.isInteger(c.tonic) && c.tonic >= 0 && c.tonic < 12 ? c.tonic : null;
      o.applied = c.applied === true;
      o.confirmed = c.confirmed === true;
      for (const k of Object.keys(CHOICE_SETS)) if (CHOICE_SETS[k].includes(c[k])) o[k] = c[k];
      o.observed = txt(c.observed, 600);
      o.improve = txt(c.improve, 600);
      out[r.id] = o;
    }
    return out;
  }
  // --- helpers that rely on app.js globals at call time ---
  const S = () => (state.creations || (state.creations = {}));
  const rec = (id) => S()[id] || (S()[id] = blankCreation(RETOS.find((r) => r.id === id)));
  const notesUsed = (r, c) => (r.type === "rhythm" ? r.rows.reduce((t, k) => t + count(c.pattern[k]), 0) : melodyNotes(c.pattern).length);
  const validC = (r, c) => c.applied && Object.keys(CHOICE_SETS).every((k) => CHOICE_SETS[k].includes(c[k])) && c.observed.trim().length > 0 && notesUsed(r, c) > 0;
  const evaluatedC = (id) => { const c = S()[id], r = RETOS.find((x) => x.id === id); return !!c && c.confirmed && validC(r, c); };
  const draftC = (id) => { const c = S()[id], r = RETOS.find((x) => x.id === id); return !!c && (c.applied || c.title.trim() || c.observed.trim() || c.improve.trim() || notesUsed(r, c) > 0 || Object.keys(CHOICE_SETS).some((k) => c[k])); };
  const statusC = (id) => (evaluatedC(id) ? "Evaluado" : draftC(id) ? "Borrador" : "Por crear");
  function notation(r, c) {
    if (r.type === "rhythm")
      return (r.word && c.word && c.word.trim() ? "Palabra: " + wordInfo(c).syl.map((x, i) => (i === wordInfo(c).tonic ? x.toUpperCase() : x)).join("-") + "\n" : "") + r.rows.map((k) => {
        const d = DRUMS.find((x) => x.key === k);
        const cells = c.pattern[k].map((on) => (on ? "X" : "·"));
        const groups = [];
        for (let i = 0; i < cells.length; i += 4) groups.push(cells.slice(i, i + 4).join(" "));
        return d.name.padEnd(7, " ") + " | " + groups.join(" | ") + " |";
      }).join("\n");
    const m = c.pattern.melody.map((n) => (n === null ? "—" : NOTES[n].short || NOTES[n].name).padEnd(3, " "));
    const groups = [];
    for (let i = 0; i < m.length; i += 4) groups.push(m.slice(i, i + 4).join(" "));
    return "| " + groups.join(" | ") + " |";
  }
  // --- audio ---
  let clapRR = 0, ctx = null, master = null, buffers = {}, loading = null, player = null, loopOn = false, metroOn = false;
  function decode(ab) {
    return new Promise((res, rej) => { const p = ctx.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
  }
  async function ensureAudio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) throw Error("Sin Web Audio");
      ctx = new AC();
      master = ctx.createGain();
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") await ctx.resume();
    if (!loading)
      loading = Promise.all(Object.entries(FILES).map(async ([k, f]) => {
        let ab;
        if (window.TIC_SAMPLES && window.TIC_SAMPLES[k]) {
          const bin = atob(window.TIC_SAMPLES[k]), u = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
          ab = u.buffer;
        } else {
          const r = await fetch("assets/audio/" + f);
          if (!r.ok) throw Error("No se encontró " + f);
          ab = await r.arrayBuffer();
        }
        buffers[k] = await decode(ab);
      })).catch((e) => { loading = null; throw e; });
    await loading;
    master.gain.value = (state.volume ?? 65) / 100;
  }
  function hit(c, dest, key, rate, time, gain) {
    if (key === "clap") key = "hat";
    const src = c.createBufferSource();
    src.buffer = buffers[key];
    src.playbackRate.value = rate || 1;
    const g = c.createGain();
    g.gain.value = gain;
    src.connect(g); g.connect(dest);
    src.start(time);
  }
  function scheduleStep(c, dest, r, pat, step, time) {
    if (r.type === "rhythm") {
      for (const k of r.rows) if (pat[k][step]) hit(c, dest, k, 1, time, k === "clap" ? 0.7 : 0.85);
    } else {
      const n = pat.melody[step];
      if (n !== null && n !== undefined) hit(c, dest, NOTES[n].sample, NOTES[n].rate, time, 0.95);
    }
  }
  function click(c, dest, time, accent) {
    hit(c, dest, accent ? "claveHi" : "clave", accent ? 1.5 : 1, time, accent ? 1 : 0.38);
  }
  async function preview(r, key, rate) {
    try { await ensureAudio(); hit(ctx, master, key, rate, ctx.currentTime + 0.01, 0.9); } catch (e) {}
  }
  function stop() {
    if (!player) return;
    clearInterval(player.timer);
    cancelAnimationFrame(player.raf);
    player = null;
    document.querySelectorAll(".seq-col.playing").forEach((el) => el.classList.remove("playing"));
    const b = document.getElementById("seq-play");
    if (b) b.textContent = "▶ Escuchar creación";
    const s = document.getElementById("seq-status");
    if (s) s.textContent = "Detenido · puedes cambiar y volver a escuchar";
  }
  async function play(r, c) {
    stop();
    if ((state.volume ?? 65) === 0) { toast("Sube el volumen para escuchar."); return; }
    if (notesUsed(r, c) === 0 && !metroOn) { toast("Todavía no hay sonidos. Toca algunos cuadros o enciende el metrónomo."); return; }
    try { await ensureAudio(); } catch (e) {
      document.getElementById("seq-status").textContent = "No se pudo cargar el audio. Comprueba que la carpeta assets acompañe al archivo index.html.";
      return;
    }
    const loop = loopOn;
    const gap = document.getElementById("seq-gap").checked;
    const stepDur = 60 / c.tempo / 4;
    const cycle = r.steps * (gap ? 2 : 1);
    const p = { r, c, start: ctx.currentTime + 0.08, next: 0, stepDur, cycle, loop, gap };
    player = p;
    const tick = () => {
      while (player === p && p.start + p.next * p.stepDur < ctx.currentTime + 0.12) {
        const pos = p.next % p.cycle;
        if (!p.loop && p.next >= p.cycle) break;
        const when = p.start + p.next * p.stepDur;
        if (pos < r.steps) scheduleStep(ctx, master, r, c.pattern, pos, when);
        if (metroOn && pos % 4 === 0) click(ctx, master, when, (pos % r.steps) % 16 === 0);
        p.next++;
      }
    };
    tick();
    p.timer = setInterval(tick, 25);
    document.getElementById("seq-play").textContent = "↺ Volver a empezar";
    const status = document.getElementById("seq-status");
    status.textContent = "Escuchando la creación";
    const draw = () => {
      if (player !== p) return;
      const t = ctx.currentTime - p.start;
      const idx = Math.floor(t / p.stepDur);
      if (!p.loop && idx >= p.cycle) {
        stop();
        status.textContent = gap ? "Terminó. Escucharon el modelo y el silencio para imitar." : "Terminó. ¿Quieres cambiar algo?";
        return;
      }
      const pos = idx < 0 ? -1 : idx % p.cycle;
      document.querySelectorAll(".seq-col").forEach((el) => el.classList.toggle("playing", Number(el.dataset.step) === pos));
      if (gap) status.textContent = pos >= r.steps ? "Silencio · ahora imitan de memoria" : "Escuchando la creación";
      p.raf = requestAnimationFrame(draw);
    };
    p.raf = requestAnimationFrame(draw);
  }
  function encodeWAV(buf) {
    const ch = buf.numberOfChannels, len = buf.length, rate = buf.sampleRate;
    const data = new DataView(new ArrayBuffer(44 + len * ch * 2));
    const w = (o, s) => { for (let i = 0; i < s.length; i++) data.setUint8(o + i, s.charCodeAt(i)); };
    w(0, "RIFF"); data.setUint32(4, 36 + len * ch * 2, true); w(8, "WAVE"); w(12, "fmt ");
    data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, ch, true);
    data.setUint32(24, rate, true); data.setUint32(28, rate * ch * 2, true); data.setUint16(32, ch * 2, true);
    data.setUint16(34, 16, true); w(36, "data"); data.setUint32(40, len * ch * 2, true);
    const chans = [...Array(ch)].map((_, i) => buf.getChannelData(i));
    let o = 44;
    for (let i = 0; i < len; i++) for (let j = 0; j < ch; j++) {
      const s = Math.max(-1, Math.min(1, chans[j][i]));
      data.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2;
    }
    return new Blob([data], { type: "audio/wav" });
  }
  async function exportWAV(r, c) {
    if (notesUsed(r, c) === 0) { toast("Todavía no hay sonidos para descargar."); return; }
    try {
      await ensureAudio();
      const stepDur = 60 / c.tempo / 4, rate = 44100;
      const gap = document.getElementById("seq-gap").checked;
      const total = r.steps * stepDur * (gap ? 2 : 1) + 1.2;
      const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      const off = new OAC(1, Math.ceil(total * rate), rate);
      const g = off.createGain(); g.gain.value = 0.8; g.connect(off.destination);
      for (let i = 0; i < r.steps; i++) scheduleStep(off, g, r, c.pattern, i, 0.02 + i * stepDur);
      const out = await new Promise((res, rej) => { off.oncomplete = (e) => res(e.renderedBuffer); const p = off.startRendering(); if (p && p.then) p.then(res, rej); });
      const name = "TIC-creacion-" + r.id + "-" + ((c.title || r.title).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "sin-nombre") + ".wav";
      download(name, encodeWAV(out), "audio/wav");
      toast("Audio descargado. Úsalo como modelo para que otros imiten o analicen.");
    } catch (e) {
      toast("No se pudo generar el audio en este navegador.");
    }
  }
  // --- rendering ---
  function catalog() {
    const blocks = GROUPS.map((g, gi) => {
      const list = RETOS.filter((r) => r.group === gi);
      return `<section class="block-section create-block"><div class="block-header"><h3><span>0${gi + 5}</span>${g.title}</h3><small>${list.filter((r) => evaluatedC(r.id)).length}/3 evaluados</small></div><div class="exercise-grid">${list.map((r, j) => {
        const c = S()[r.id];
        return `<article class="exercise-card create-card"><div class="card-meta"><span>Reto 0${j + 1} / 03 · ${r.steps} pasos</span><span class="${evaluatedC(r.id) ? "done" : ""}">${statusC(r.id)}</span></div><h4>${r.title}</h4><p>${r.objective}</p>${c && notesUsed(r, c) ? `<pre class="mini-notation" aria-label="Creación guardada">${escapeHTML(notation(r, c))}</pre>` : ""}<button data-reto="${r.id}">Abrir reto <span aria-hidden="true">↗</span></button></article>`;
      }).join("")}</div></section>`;
    }).join("");
    return `<div class="eyebrow"><span class="status-dot"></span> CREAR · ESCUCHAR · REVISAR</div><div class="hero create-hero"><div><h1 id="create-title" tabindex="-1">Ahora ellos<br><em>componen.</em></h1><p class="lead">Seis retos para que estudiantes de colegio de 10 a 15 años creen ritmos y melodías en la app, con tu guía. Después revisas su creación y registras lo que observaste.</p><button data-reto="cr1">Abrir primer reto <span aria-hidden="true">↗</span></button></div><div class="hero-art create-art" aria-hidden="true">${[...Array(32)].map((_, i) => `<i class="${[0, 3, 6, 9, 12, 13, 18, 21, 26, 28, 31].includes(i) ? "on" : ""}"></i>`).join("")}<div class="art-label">CREACIÓN GUIADA / REVISIÓN DOCENTE</div></div></div><div class="journey" aria-label="Recorrido del taller"><span><b>01</b> Explora</span><span><b>02</b> Crea</span><span><b>03</b> Escucha</span><span><b>04</b> Ajusta</span><span><b>05</b> Revisa</span></div><div class="notice"><span aria-hidden="true">◎</span><p><b>El escolar toma el control; tú guías.</b> Deja que toque la pantalla, escuche y decida. Pregunta en vez de corregir. Las pistas del reto orientan, no califican. Cuando termine, abre el registro docente para revisar.</p></div>${blocks}<div class="notice"><span aria-hidden="true">↻</span><p><b>Lo creado vuelve al aula.</b> Cada creación puede descargarse en audio y usarse como modelo de los ejercicios de imitación y análisis: lo que compone un estudiante lo imitan sus compañeros.</p></div>`;
  }
  function grid(r, c) {
    const cols = [...Array(r.steps).keys()];
    const header = `<div class="seq-row seq-head"><span class="seq-label"></span>${cols.map((i) => `<span class="seq-num ${i % 4 === 0 ? "beat" : ""}">${i % 4 === 0 ? (i % 16) / 4 + 1 : "·"}</span>`).join("")}</div>`;
    let rows;
    if (r.type === "rhythm") {
      rows = r.rows.map((k) => {
        const d = DRUMS.find((x) => x.key === k);
        return `<div class="seq-row" data-row="${k}"><button type="button" class="seq-label seq-preview" data-preview="${k}" title="Escuchar ${d.name}">${d.name}<small>${d.hint}</small></button>${cols.map((i) => `<button type="button" class="seq-cell seq-col drum-${k} ${i % 4 === 0 ? "beat" : ""} ${r.steps === 32 && i === 16 ? "half" : ""}" data-step="${i}" data-k="${k}" aria-pressed="${c.pattern[k][i]}" aria-label="${d.name}, paso ${i + 1}"></button>`).join("")}</div>`;
      });
    } else {
      rows = [...r.notes].reverse().map((n) => `<div class="seq-row" data-row="${n}"><button type="button" class="seq-label seq-preview note-${n}" data-preview-note="${n}" title="Escuchar ${NOTES[n].name}">${NOTES[n].name}</button>${cols.map((i) => `<button type="button" class="seq-cell seq-col note-${n} ${i % 4 === 0 ? "beat" : ""} ${r.steps === 32 && i === 16 ? "half" : ""}" data-step="${i}" data-n="${n}" aria-pressed="${c.pattern.melody[i] === n}" aria-label="${NOTES[n].name}, paso ${i + 1}"></button>`).join("")}</div>`);
    }
    const parts = r.steps === 32 ? `<div class="seq-parts" aria-hidden="true"><span>Parte 1 · pregunta</span><span>Parte 2 · respuesta</span></div>` : "";
    const sylRow = r.word ? `<div class="seq-row seq-sylrow" aria-hidden="true"><span class="seq-label syl-label">Sílabas</span><span id="seq-sylcells" style="display:contents">${hitLabels(r, c)}</span></div>` : "";
    rows = r.word ? [sylRow, ...rows] : rows;
    return `<div class="seq-wrap"><div class="seq ${r.type}" style="--steps:${r.steps}" data-steps="${r.steps}" role="group" aria-label="Cuadrícula de creación: ${r.steps} pasos">${parts}${header}${rows.join("")}</div></div>`;
  }
  function chips(c) {
    const { syl, tonic, auto } = wordInfo(c);
    if (!syl.length) return '<span class="syl-hint">Escribe una palabra para ver sus sílabas.</span>';
    return syl.map((x, i) => `<button type="button" class="syl-chip ${i === tonic ? "tonic" : ""}" data-syl="${i}" aria-pressed="${i === tonic}" title="Marcar «${escapeHTML(x)}» como sílaba fuerte">${escapeHTML(i === tonic ? x.toUpperCase() : x)}</button>`).join('<span class="syl-dash" aria-hidden="true">-</span>') + `<span class="syl-hint">${tonic === auto ? "La sílaba morada es la que suena más fuerte. Profe: si se dice distinto, toca la correcta." : "Sílaba fuerte elegida por el profe."}</span>`;
  }
  function hitLabels(r, c) {
    if (!r.word) return "";
    const { syl, tonic } = wordInfo(c);
    const at = {};
    hitsInOrder(c.pattern).forEach((h, k) => (at[h.step] = k < syl.length ? (k === tonic ? syl[k].toUpperCase() : syl[k]) : "?"));
    return [...Array(r.steps).keys()].map((i) => `<span class="seq-syl ${at[i] && at[i] !== "?" && at[i] === at[i].toUpperCase() ? "strong" : ""}">${escapeHTML(at[i] || "")}</span>`).join("");
  }
  function checksMarkup(r, c) {
    return r.checks(c.pattern, c).map((x) => `<li><span aria-hidden="true">•</span>${x.text}</li>`).join("");
  }
  function q(k, c) {
    return `<fieldset><legend>${CREATE_QUESTIONS[k]}</legend><div class="options">${CHOICE_SETS[k].map((v) => `<label class="option"><input type="radio" name="c-${k}" value="${escapeHTML(v)}" ${c[k] === v ? "checked" : ""}>${v}</label>`).join("")}</div></fieldset>`;
  }
  function reto(id) {
    const r = RETOS.find((x) => x.id === id), c = rec(id);
    const idx = RETOS.indexOf(r), within = RETOS.filter((x) => x.group === r.group);
    return `<div class="exercise-top"><a class="back-link" href="#crear">← Todos los retos de creación</a><span class="pill">${GROUPS[r.group].title}</span></div><div class="exercise-heading"><div><div class="eyebrow">RETO ${within.indexOf(r) + 1} DE 3 · BLOQUE 0${r.group + 5}</div><h1 id="create-title" tabindex="-1">${r.title}</h1></div><nav class="mini-progress" aria-label="Retos de este bloque">${within.map((x, j) => `<a href="#crear-${x.id}" ${x.id === id ? 'aria-current="step" class="active"' : ""} aria-label="Reto ${j + 1}: ${x.title}">${j + 1}</a>`).join("")}</nav></div><p class="objective"><b>Objetivo musical:</b> ${r.objective}</p>
<section class="panel student-panel"><div class="panel-label"><b>01</b> MOMENTO DEL ESTUDIANTE DE COLEGIO · CREA CON TU GUÍA</div><p class="instruction">${r.instruction}</p><p class="small">Toca el nombre de cada ${r.type === "rhythm" ? "sonido para escucharlo solo" : "nota para escucharla sola"}. Los números marcan los tiempos.</p>${r.word ? `<div class="word-box"><label for="seq-word">Tu palabra</label><input id="seq-word" maxlength="30" autocomplete="off" value="${escapeHTML(c.word)}" placeholder="Ej.: mariposa, arepa, Lucho…"><div class="syl-chips" id="seq-syl">${chips(c)}</div></div>` : ""}${grid(r, c)}
<div class="seq-buttons"><button type="button" id="seq-play">▶ Escuchar creación</button><button type="button" id="seq-stop" class="secondary">■ Detener</button><button type="button" id="seq-loop" class="toggle-btn" aria-pressed="${loopOn}" title="Repetir en bucle"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg><span>Bucle</span></button><button type="button" id="seq-metro" class="toggle-btn" aria-pressed="${metroOn}" title="Metrónomo"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l4 18H5z"/><path d="M12 16l6-10"/><path d="M7.5 16h9"/></svg><span>Metrónomo</span></button>${r.base ? '<button type="button" id="seq-base" class="toggle-btn base-btn">⤓ Ritmo base</button>' : ""}<button type="button" id="seq-clear" class="clear-btn">✕ Borrar todo</button></div><div class="listening-controls seq-controls"><label for="seq-tempo">Velocidad <input id="seq-tempo" type="range" min="60" max="120" step="2" value="${c.tempo}"><output id="seq-tempo-value" for="seq-tempo">${c.tempo} ppm</output></label><label for="seq-volume">Volumen <input id="seq-volume" type="range" min="0" max="100" value="${state.volume}"><output id="seq-volume-value" for="seq-volume">${state.volume} %</output></label><label><input type="checkbox" id="seq-gap"> Dejar silencio para imitar</label></div>
<div id="seq-status" class="audio-status" role="status">Listo para crear</div>
<div class="create-side"><div class="hints"><b>Lo que pide el reto</b><ul id="seq-checks">${checksMarkup(r, c)}</ul><p class="small">La app no califica. Cuando termine, el profe escucha la creación y decide en su registro.</p></div><div class="hints"><b>Nombre de la creación</b><label for="seq-title" class="sr-only">Nombre de la creación</label><input id="seq-title" maxlength="80" value="${escapeHTML(c.title)}" placeholder="Ej.: «Tambores del recreo»"><p class="small">Que el escolar le ponga nombre. No escribas su nombre ni datos personales.</p><div class="actions"><button type="button" id="seq-wav" class="secondary">Descargar audio (.wav)</button></div></div></div></section>
<div class="activity-actions"><p>Cuando el escolar termine y la haya escuchado, abre tu registro para revisar la creación. La orientación docente permanece oculta durante la actividad.</p><button id="c-teacher-toggle" class="teacher-toggle" aria-expanded="false" aria-controls="c-teacher-panel">Abrir registro docente <span aria-hidden="true">↗</span></button></div>
<section id="c-teacher-panel" class="panel teacher-panel" hidden><div class="teacher-top"><div><div class="panel-label">02 · REVISIÓN DEL UNIVERSITARIO</div><h2>¿Qué creó y cómo lo hizo?</h2><p>Revisa la creación con tu escucha. La app guarda lo que se compuso, pero tu observación del proceso es la evidencia.</p></div><button id="c-close-teacher" class="secondary">Ocultar registro</button></div><div class="review-box"><b>Creación guardada${c.title.trim() ? " · «" + escapeHTML(c.title.trim()) + "»" : ""}</b><pre id="c-notation" class="mini-notation">${escapeHTML(notation(r, c))}</pre><div class="criteria"><b>Lo que pedía el reto</b> <span class="small">· tú decides si se logró</span><ul>${r.checks(c.pattern, c).map((x) => `<li>${x.text}</li>`).join("")}</ul></div><span class="small">${c.tempo} ppm · ${notesUsed(r, c)} ${r.type === "rhythm" ? "golpes" : "notas"}</span></div><details><summary>Ver orientación docente</summary><div class="reference"><b>Qué observar</b>${r.observe}<b>Cómo acompañar</b>${r.guide}</div><p>Pregunta antes de sugerir. Registra la ayuda que diste.</p></details>
<form id="c-form" novalidate><label class="applied-check"><input type="checkbox" id="c-applied" ${c.applied ? "checked" : ""}> Un estudiante de colegio creó esta composición en la app con mi guía.</label><div class="observation-questions">${Object.keys(CREATE_QUESTIONS).map((k) => q(k, c)).join("")}</div><div class="form-columns"><label for="c-observed">¿Qué observaste en el proceso? <span class="optional">· justificación breve requerida</span><textarea id="c-observed" maxlength="600" rows="3" placeholder="Cómo exploró, qué decidió, qué cambió después de escuchar, cómo explicó su creación…">${escapeHTML(c.observed)}</textarea></label><label for="c-improve">¿Qué mejorarías? <span class="optional">· breve; si no propones cambios, indícalo</span><textarea id="c-improve" maxlength="600" rows="3" placeholder="Una pregunta guía, una restricción, más tiempo para explorar…">${escapeHTML(c.improve)}</textarea></label></div><div id="c-form-status" class="form-status" role="status">${evaluatedC(id) ? "Revisión confirmada. Si cambias algo, vuelve a guardar para confirmar." : draftC(id) ? "Borrador recuperado. Completa y confirma tu revisión." : "Completa las tres valoraciones y una observación breve."}</div><div class="actions"><button type="submit">Guardar revisión</button><button type="button" id="c-save-next" class="secondary">Guardar y continuar →</button></div><p class="small" style="margin-top:13px">Si el escolar cambia la creación después de confirmar, la revisión vuelve a borrador.</p></form></section>
<div class="exercise-footer">${idx ? `<button class="ghost" data-reto="${RETOS[idx - 1].id}">← Anterior</button>` : '<a class="back-link" href="#crear">← Retos</a>'}<span>Reto ${idx + 1} / 6 · <span id="c-status">${statusC(id)}</span></span>${idx < RETOS.length - 1 ? `<button class="secondary" data-reto="${RETOS[idx + 1].id}">Siguiente →</button>` : '<a href="#resultados" class="button">Ver resultados ↗</a>'}</div>`;
  }
  function bindReto(id) {
    const r = RETOS.find((x) => x.id === id), c = rec(id);
    const changed = () => {
      c.confirmed = false;
      save();
      $("#seq-checks").innerHTML = checksMarkup(r, c);
      if (r.word) $("#seq-sylcells").innerHTML = hitLabels(r, c);
      $("#c-notation").textContent = notation(r, c);
      $("#c-status").textContent = statusC(id);
      if (evaluatedC(id) === false && $("#c-form-status")) $("#c-form-status").textContent = "Creación modificada. Revisa y confirma de nuevo.";
    };
    $$(".seq-cell").forEach((b) => b.addEventListener("click", () => {
      const i = Number(b.dataset.step);
      if (r.type === "rhythm") {
        const k = b.dataset.k;
        c.pattern[k][i] = !c.pattern[k][i];
        b.setAttribute("aria-pressed", String(c.pattern[k][i]));
        if (c.pattern[k][i] && !player) preview(r, k, 1);
      } else {
        const n = Number(b.dataset.n);
        c.pattern.melody[i] = c.pattern.melody[i] === n ? null : n;
        $$(`.seq-cell[data-step="${i}"]`).forEach((x) => x.setAttribute("aria-pressed", String(c.pattern.melody[i] === Number(x.dataset.n))));
        if (c.pattern.melody[i] !== null && !player) preview(r, NOTES[n].sample, NOTES[n].rate);
      }
      changed();
    }));
    $$("[data-preview]").forEach((b) => b.addEventListener("click", () => preview(r, b.dataset.preview, 1)));
    $$("[data-preview-note]").forEach((b) => b.addEventListener("click", () => { const n = NOTES[Number(b.dataset.previewNote)]; preview(r, n.sample, n.rate); }));
    $("#seq-play").addEventListener("click", () => play(r, c));
    $("#seq-stop").addEventListener("click", stop);
    $("#seq-loop").addEventListener("click", () => {
      loopOn = !loopOn;
      $("#seq-loop").setAttribute("aria-pressed", String(loopOn));
      if (player) player.loop = loopOn;
    });
    $("#seq-metro").addEventListener("click", () => {
      metroOn = !metroOn;
      $("#seq-metro").setAttribute("aria-pressed", String(metroOn));
      if (!metroOn && player && notesUsed(r, c) === 0) stop();
    });
    $("#seq-gap").addEventListener("change", () => { if (player) play(r, c); });
    $("#seq-tempo").addEventListener("input", (ev) => {
      c.tempo = Number(ev.target.value);
      $("#seq-tempo-value").textContent = c.tempo + " ppm";
      if (player) play(r, c);
      save();
    });
    $("#seq-volume").addEventListener("input", (ev) => {
      state.volume = Number(ev.target.value);
      $("#seq-volume-value").textContent = state.volume + " %";
      if (master) master.gain.value = state.volume / 100;
      save();
    });
    if (r.word) {
      const bindChips = () => $$(".syl-chip").forEach((b) => b.addEventListener("click", () => {
        c.tonic = Number(b.dataset.syl);
        $("#seq-syl").innerHTML = chips(c); bindChips(); changed();
      }));
      $("#seq-word").addEventListener("input", (ev) => {
        c.word = ev.target.value; c.tonic = null;
        $("#seq-syl").innerHTML = chips(c); bindChips(); changed();
      });
      bindChips();
    }
    if (r.base) $("#seq-base").addEventListener("click", () => {
      if (notesUsed(r, c) && !window.confirm("¿Reemplazar lo que hay en la cuadrícula por el ritmo base?")) return;
      c.pattern = blankPattern(r);
      for (const [k, steps] of Object.entries(r.base)) steps.forEach((i) => (c.pattern[k][i] = true));
      $$(".seq-cell").forEach((b) => b.setAttribute("aria-pressed", String(!!c.pattern[b.dataset.k][Number(b.dataset.step)])));
      changed();
      play(r, c);
    });
    $("#seq-title").addEventListener("input", (ev) => { c.title = ev.target.value; c.confirmed = false; save(); $("#c-status").textContent = statusC(id); });
    $("#seq-wav").addEventListener("click", () => exportWAV(r, c));
    $("#seq-clear").addEventListener("click", () => {
      if (notesUsed(r, c) && !window.confirm("¿Borrar toda la creación de este reto?")) return;
      stop();
      c.pattern = blankPattern(r);
      $$(".seq-cell").forEach((b) => b.setAttribute("aria-pressed", "false"));
      changed();
    });
    $$("[data-reto]").forEach((b) => b.addEventListener("click", () => navigate("crear-" + b.dataset.reto)));
    const teacher = (open) => {
      stop();
      $("#c-teacher-panel").hidden = !open;
      $("#c-teacher-toggle").setAttribute("aria-expanded", String(open));
      if (open) $("#c-teacher-panel").scrollIntoView({ behavior: "smooth", block: "start" });
      else $("#c-teacher-toggle").focus();
    };
    $("#c-teacher-toggle").addEventListener("click", () => teacher($("#c-teacher-panel").hidden));
    $("#c-close-teacher").addEventListener("click", () => teacher(false));
    const form = $("#c-form");
    const read = () => {
      const before = JSON.stringify([c.applied, c.achievement, c.help, c.technology, c.observed, c.improve]);
      c.applied = $("#c-applied").checked;
      for (const k of Object.keys(CHOICE_SETS)) c[k] = $(`input[name="c-${k}"]:checked`, form)?.value || "";
      c.observed = $("#c-observed").value;
      c.improve = $("#c-improve").value;
      if (before !== JSON.stringify([c.applied, c.achievement, c.help, c.technology, c.observed, c.improve])) c.confirmed = false;
      save();
      $("#c-status").textContent = statusC(id);
      $("#c-form-status").classList.remove("error");
      $("#c-form-status").textContent = evaluatedC(id) ? "Revisión confirmada. No hay cambios pendientes." : "Borrador guardado en este navegador. Confirma con «Guardar revisión».";
    };
    form.addEventListener("input", read);
    form.addEventListener("change", read);
    const confirmIt = (next) => {
      read();
      const err = !notesUsed(r, c) ? "La creación está vacía. Primero el escolar debe crear en la cuadrícula."
        : !c.applied ? "Confirma primero que un estudiante de colegio creó la composición."
        : Object.keys(CHOICE_SETS).some((k) => !c[k]) ? "Elige una respuesta para cada una de las tres preguntas."
        : !c.observed.trim() ? "Añade una observación breve que justifique tu revisión." : "";
      if (err) { $("#c-form-status").textContent = err; $("#c-form-status").classList.add("error"); return; }
      c.confirmed = true;
      save();
      $("#c-status").textContent = statusC(id);
      $("#c-form-status").textContent = "Revisión guardada y confirmada. Ya aparece en resultados.";
      toast("Revisión confirmada · " + r.title);
      if (next) { const i = RETOS.indexOf(r); navigate(i < RETOS.length - 1 ? "crear-" + RETOS[i + 1].id : "resultados"); }
    };
    form.addEventListener("submit", (ev) => { ev.preventDefault(); confirmIt(false); });
    $("#c-save-next").addEventListener("click", () => confirmIt(true));
  }
  function render(hash) {
    const view = $("#create-view");
    const id = hash.startsWith("crear-") ? hash.slice(6) : null;
    if (id && RETOS.some((r) => r.id === id)) { view.innerHTML = reto(id); bindReto(id); }
    else { view.innerHTML = catalog(); $$("[data-reto]", view).forEach((b) => b.addEventListener("click", () => navigate("crear-" + b.dataset.reto))); }
  }
  const valid = (hash) => hash === "crear" || (hash.startsWith("crear-") && RETOS.some((r) => r.id === hash.slice(6)));
  function summaryC() {
    const done = RETOS.filter((r) => evaluatedC(r.id)).map((r) => S()[r.id]);
    return { evaluated: done.length, yes: done.filter((c) => c.achievement === "Sí").length, partial: done.filter((c) => c.achievement === "Parcialmente").length, no: done.filter((c) => c.achievement === "No").length };
  }
  function resultsMarkup() {
    const s = summaryC(), list = RETOS.filter((r) => draftC(r.id));
    return `<h2 style="margin-top:32px">Taller de creación</h2><div class="stats"><div class="stat"><b>${s.evaluated}<small style="font-size:14px;color:var(--muted)"> /6</small></b><span>Creaciones revisadas</span></div><div class="stat"><b>${s.yes}</b><span>Logradas completamente</span></div><div class="stat"><b>${s.partial}</b><span>Logradas parcialmente</span></div><div class="stat"><b>${s.no}</b><span>No logradas</span></div></div>${list.length ? list.map((r) => {
      const c = S()[r.id], done = evaluatedC(r.id);
      return `<details class="result-item"><summary><span>${r.title}${c.title.trim() ? " · «" + escapeHTML(c.title.trim()) + "»" : ""}</span><span class="tag ${done ? "aqua" : "coral"}">${done ? "Revisado" : "Borrador"}</span></summary><pre class="mini-notation">${escapeHTML(notation(r, c))}</pre><div class="tags"><span class="tag">Logro: ${escapeHTML(c.achievement || "Pendiente")}</span><span class="tag">Ayuda: ${escapeHTML(c.help || "Pendiente")}</span><span class="tag">App: ${escapeHTML(c.technology || "Pendiente")}</span></div><p><b>Qué observaste:</b> ${escapeHTML(c.observed || "Sin observación registrada.")}</p><p><b>Qué mejorarías:</b> ${escapeHTML(c.improve || "Sin propuesta registrada.")}</p><button class="secondary" data-open-reto="${r.id}">Abrir creación ↗</button></details>`;
    }).join("") : '<div class="empty">Aún no hay creaciones. Abre el Taller de creación para empezar.</div>'}`;
  }
  function bindResults() { $$("[data-open-reto]").forEach((b) => b.addEventListener("click", () => navigate("crear-" + b.dataset.openReto))); }
  function reportMarkup() {
    const s = summaryC(), list = RETOS.filter((r) => draftC(r.id));
    return `<h2>Taller de creación</h2><p>Composiciones creadas por estudiantes de colegio en la app, con guía del universitario. ${s.evaluated} de 6 revisiones confirmadas.</p><table><thead><tr><th>Bloque</th><th>Reto</th><th>Nombre</th><th>Revisión</th></tr></thead><tbody>${RETOS.map((r) => { const c = S()[r.id]; return `<tr><td>${GROUPS[r.group].title}</td><td>${r.title}</td><td>${escapeHTML(c?.title.trim() || "—")}</td><td>${evaluatedC(r.id) ? "Confirmada" : draftC(r.id) ? "Borrador" : "Pendiente"}</td></tr>`; }).join("")}</tbody></table>${list.map((r) => {
      const c = S()[r.id];
      return `<section class="report-exercise"><h3>${GROUPS[r.group].title} · ${r.title}${c.title.trim() ? " · «" + escapeHTML(c.title.trim()) + "»" : ""}</h3><p><b>Objetivo musical:</b> ${r.objective}</p><pre class="mini-notation">${escapeHTML(notation(r, c))}</pre><p><b>Velocidad:</b> ${c.tempo} ppm</p><p><b>¿Logró crear?</b> ${escapeHTML(c.achievement || "Sin registrar")}<br><b>¿Necesitó ayuda?</b> ${escapeHTML(c.help || "Sin registrar")}<br><b>¿La app facilitó?</b> ${escapeHTML(c.technology || "Sin registrar")}</p><p><b>Qué observaste:</b>\n${escapeHTML(c.observed.trim() || "Sin observación registrada.")}</p><p><b>Qué mejorarías:</b>\n${escapeHTML(c.improve.trim() || "Sin propuesta registrada.")}</p></section>`;
    }).join("")}`;
  }
  function pdf({ heading, para, rule, room, row }) {
    const s = summaryC(), list = RETOS.filter((r) => draftC(r.id));
    room(80);
    heading("Taller de creación");
    para("Composiciones creadas por estudiantes de colegio en la app, con guía del universitario. " + s.evaluated + " de 6 revisiones confirmadas.", { size: 9 });
    row(["Bloque / Reto", "Nombre", "Revisión"], [94, 45, 35], { header: true });
    RETOS.forEach((r) => { const c = S()[r.id]; row([GROUPS[r.group].title + " / " + r.title, c?.title.trim() || "—", evaluatedC(r.id) ? "Confirmada" : draftC(r.id) ? "Borrador" : "Pendiente"], [94, 45, 35]); });
    for (const r of list) {
      const c = S()[r.id];
      room(70);
      heading(GROUPS[r.group].title + " / " + r.title + (c.title.trim() ? " · «" + c.title.trim() + "»" : ""), 3);
      para("Objetivo musical: " + r.objective, { size: 9 });
      para(notation(r, c), { size: 9, ink: [20, 75, 83], mono: true });
      para("Velocidad: " + c.tempo + " ppm", { size: 9 });
      para("¿Logró crear? " + (c.achievement || "Sin registrar") + "\n¿Necesitó ayuda? " + (c.help || "Sin registrar") + "\n¿La app facilitó? " + (c.technology || "Sin registrar"), { size: 10, gap: 4 });
      para("Qué observaste:", { size: 10, gap: 1, ink: [20, 75, 83] });
      para(c.observed.trim() || "Sin observación registrada.", { indent: 3 });
      para("Qué mejorarías:", { size: 10, gap: 1, ink: [20, 75, 83] });
      para(c.improve.trim() || "Sin propuesta registrada.", { indent: 3 });
      rule();
    }
  }
  window.TIC_CREATE = { RETOS, clean, render, valid, stop, resultsMarkup, bindResults, reportMarkup, pdf, summary: summaryC };
})();

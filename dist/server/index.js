const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Color Distance Standards</title>
  <meta name="description" content="Compare two colors side by side using CIEDE2000, Lab, RGB, and Helmlab metrics.">
  <style>
    :root {
      --ink: #202124;
      --muted: #5f6368;
      --line: #d7dde3;
      --paper: #f8f6f1;
      --panel: #ffffff;
      --blue: #1f6feb;
      --green: #1b8a5a;
      --rose: #c73e5b;
      --gold: #b7791f;
      color-scheme: light;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background:
        linear-gradient(135deg, rgba(31, 111, 235, 0.12), transparent 32%),
        linear-gradient(315deg, rgba(199, 62, 91, 0.12), transparent 28%),
        var(--paper);
      color: var(--ink);
    }

    main {
      width: min(1100px, calc(100% - 32px));
      margin: 0 auto;
      padding: 42px 0;
    }

    header {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 24px;
      align-items: end;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0 0 10px;
      max-width: 780px;
      font-size: clamp(2.2rem, 7vw, 5rem);
      line-height: 0.95;
      letter-spacing: 0;
    }

    .lede {
      margin: 0;
      max-width: 690px;
      color: var(--muted);
      font-size: 1.05rem;
      line-height: 1.6;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.75);
      font-weight: 800;
      white-space: nowrap;
    }

    .badge span {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--green);
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 380px;
      gap: 20px;
      align-items: start;
    }

    .panel {
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: 0 18px 40px rgba(32, 33, 36, 0.08);
    }

    .workspace {
      padding: 22px;
    }

    .compare {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 16px;
    }

    .color-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
    }

    .swatch {
      height: 220px;
      border-bottom: 1px solid var(--line);
      background: var(--swatch);
    }

    .card-body {
      padding: 14px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: var(--muted);
      font-size: 0.82rem;
      font-weight: 850;
      text-transform: uppercase;
    }

    input[type="color"] {
      width: 100%;
      height: 46px;
      padding: 0;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: transparent;
      cursor: pointer;
    }

    input[type="text"], select {
      width: 100%;
      min-height: 46px;
      padding: 0 13px;
      border: 1px solid var(--line);
      border-radius: 8px;
      color: var(--ink);
      background: #fff;
      font: inherit;
      font-weight: 750;
    }

    input[type="number"] {
      width: 100%;
      min-height: 42px;
      padding: 0 10px;
      border: 1px solid var(--line);
      border-radius: 8px;
      color: var(--ink);
      background: #fff;
      font: inherit;
      font-weight: 750;
    }

    input[type="text"] {
      margin-top: 10px;
      text-transform: uppercase;
    }

    input:focus, select:focus {
      outline: 3px solid rgba(31, 111, 235, 0.22);
      border-color: var(--blue);
    }

    .standard-row {
      display: grid;
      grid-template-columns: minmax(220px, 320px) 1fr;
      gap: 14px;
      margin-top: 18px;
      align-items: end;
    }

    .examples {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .init-panel {
      margin-top: 18px;
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
    }

    .init-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 14px;
    }

    .init-title {
      margin: 0;
      font-size: 1.05rem;
    }

    .init-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .precursor {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) 70px;
      gap: 8px;
      align-items: end;
    }

    .mini-swatch {
      height: 42px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--swatch);
    }

    button {
      min-height: 40px;
      padding: 0 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      color: var(--ink);
      font: inherit;
      font-weight: 750;
      cursor: pointer;
    }

    button:hover { border-color: var(--blue); }

    .result {
      position: sticky;
      top: 16px;
      padding: 22px;
    }

    .score {
      margin: 8px 0;
      font-size: clamp(3.2rem, 12vw, 5.8rem);
      line-height: 0.9;
      font-weight: 900;
      letter-spacing: 0;
    }

    .meaning {
      min-height: 1.4em;
      margin: 0 0 18px;
      color: var(--muted);
      font-size: 1.02rem;
      line-height: 1.5;
    }

    .bar {
      height: 14px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: linear-gradient(90deg, var(--green), var(--gold), var(--rose));
    }

    .marker {
      width: 4px;
      height: 100%;
      background: #111;
      transform: translateX(0);
    }

    .metric-list {
      display: grid;
      gap: 10px;
      margin-top: 20px;
      color: var(--muted);
      font-size: 0.95rem;
    }

    .metric-row {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid #edf0f2;
    }

    .metric-row strong {
      color: var(--ink);
      text-align: right;
      white-space: nowrap;
    }

    .note {
      margin-top: 14px;
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .error { color: var(--rose); font-weight: 850; }

    footer {
      margin-top: 22px;
      color: var(--muted);
      font-size: 0.95rem;
      line-height: 1.55;
    }

    @media (max-width: 860px) {
      header, .layout, .compare, .standard-row, .init-grid {
        grid-template-columns: 1fr;
      }

      .result { position: static; }
      .swatch { height: 160px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1>Color distance standards</h1>
        <p class="lede">Initialize the four sensor-detected precursor colors, mix them by RYBW proportions, then compare the target against the calculated mixture.</p>
      </div>
      <div class="badge"><span></span> Side by side</div>
    </header>

    <section class="layout" aria-label="Color distance calculator">
      <div class="panel workspace">
        <div class="compare">
          <div class="color-card">
            <div id="swatch1" class="swatch" style="--swatch:#ff6b35"></div>
            <div class="card-body">
              <label for="color1">Target color</label>
              <input id="color1" type="color" value="#ff6b35">
              <input id="hex1" type="text" value="#ff6b35" maxlength="7" spellcheck="false" aria-label="Target color HEX value">
            </div>
          </div>

          <div class="color-card">
            <div id="swatch2" class="swatch" style="--swatch:#c68348"></div>
            <div class="card-body">
              <label for="color2">RYBW mix result</label>
              <input id="color2" type="color" value="#c68348" disabled>
              <input id="hex2" type="text" value="#c68348" maxlength="7" spellcheck="false" aria-label="Mixed color HEX value" readonly>
            </div>
          </div>
        </div>

        <div class="init-panel" aria-label="Precursor initialization">
          <div class="init-head">
            <div>
              <h2 class="init-title">Initialization</h2>
              <div class="note">Enter the RGB/HEX codes detected by the sensor for each precursor. Default RYBW ratio is 5:3:1:1.</div>
            </div>
          </div>

          <div class="init-grid">
            <div>
              <label for="redHex">Red</label>
              <div class="precursor">
                <div id="redSwatch" class="mini-swatch" style="--swatch:#ff2d2d"></div>
                <input id="redHex" type="text" value="#ff2d2d" maxlength="7" spellcheck="false">
                <input id="redPart" type="number" value="5" min="0" step="0.1" aria-label="Red proportion">
              </div>
            </div>
            <div>
              <label for="yellowHex">Yellow</label>
              <div class="precursor">
                <div id="yellowSwatch" class="mini-swatch" style="--swatch:#ffd735"></div>
                <input id="yellowHex" type="text" value="#ffd735" maxlength="7" spellcheck="false">
                <input id="yellowPart" type="number" value="3" min="0" step="0.1" aria-label="Yellow proportion">
              </div>
            </div>
            <div>
              <label for="blueHex">Blue</label>
              <div class="precursor">
                <div id="blueSwatch" class="mini-swatch" style="--swatch:#246bff"></div>
                <input id="blueHex" type="text" value="#246bff" maxlength="7" spellcheck="false">
                <input id="bluePart" type="number" value="1" min="0" step="0.1" aria-label="Blue proportion">
              </div>
            </div>
            <div>
              <label for="waterHex">Water</label>
              <div class="precursor">
                <div id="waterSwatch" class="mini-swatch" style="--swatch:#f7fbff"></div>
                <input id="waterHex" type="text" value="#f7fbff" maxlength="7" spellcheck="false">
                <input id="waterPart" type="number" value="1" min="0" step="0.1" aria-label="Water proportion">
              </div>
            </div>
          </div>
        </div>

        <div class="standard-row">
          <div>
            <label for="standard">Standard</label>
            <select id="standard">
              <option value="ciede2000">CIEDE2000 Delta E</option>
              <option value="lab76">CIELAB Delta E 76</option>
              <option value="frechet">Fréchet distance</option>
              <option value="rgb">RGB Euclidean</option>
              <option value="helmlab">Helmlab trained metric</option>
              <option value="jnd">Helmlab JND</option>
            </select>
          </div>

          <div class="examples" aria-label="Example target colors">
            <button type="button" data-a="#c68348">Use current mix</button>
            <button type="button" data-a="#b95f2f">Warm target</button>
            <button type="button" data-a="#8c6a54">Muted target</button>
            <button type="button" data-a="#d9a15f">Light target</button>
          </div>
        </div>
      </div>

      <aside class="panel result">
        <label id="scoreLabel">CIEDE2000 Delta E</label>
        <div id="distance" class="score">Loading</div>
        <p id="meaning" class="meaning"></p>
        <div class="bar" aria-hidden="true"><div id="marker" class="marker"></div></div>
        <div class="metric-list">
          <div class="metric-row"><span>CIEDE2000</span><strong id="ciedeValue">--</strong></div>
          <div class="metric-row"><span>Lab ΔE76</span><strong id="labValue">--</strong></div>
          <div class="metric-row"><span>Fréchet</span><strong id="frechetValue">--</strong></div>
          <div class="metric-row"><span>RGB distance</span><strong id="rgbValue">--</strong></div>
          <div class="metric-row"><span>Helmlab</span><strong id="helmValue">Loading</strong></div>
          <div class="metric-row"><span>JND</span><strong id="jndValue">Loading</strong></div>
        </div>
        <div id="note" class="note"></div>
      </aside>
    </section>

    <footer>
      The mix is a sensor-space weighted RGB estimate from RYBW. If CEID later gives physical calibration curves, this can be upgraded from linear RGB mixing.
    </footer>
  </main>

  <script>
    const color1Input = document.getElementById("color1");
    const color2Input = document.getElementById("color2");
    const hex1Input = document.getElementById("hex1");
    const hex2Input = document.getElementById("hex2");
    const standardInput = document.getElementById("standard");
    const swatch1 = document.getElementById("swatch1");
    const swatch2 = document.getElementById("swatch2");
    const distanceEl = document.getElementById("distance");
    const meaningEl = document.getElementById("meaning");
    const markerEl = document.getElementById("marker");
    const labelEl = document.getElementById("scoreLabel");
    const noteEl = document.getElementById("note");
    const ciedeValue = document.getElementById("ciedeValue");
    const labValue = document.getElementById("labValue");
    const frechetValue = document.getElementById("frechetValue");
    const rgbValue = document.getElementById("rgbValue");
    const helmValue = document.getElementById("helmValue");
    const jndValue = document.getElementById("jndValue");
    const precursorInputs = {
      red: { hex: document.getElementById("redHex"), part: document.getElementById("redPart"), swatch: document.getElementById("redSwatch") },
      yellow: { hex: document.getElementById("yellowHex"), part: document.getElementById("yellowPart"), swatch: document.getElementById("yellowSwatch") },
      blue: { hex: document.getElementById("blueHex"), part: document.getElementById("bluePart"), swatch: document.getElementById("blueSwatch") },
      water: { hex: document.getElementById("waterHex"), part: document.getElementById("waterPart"), swatch: document.getElementById("waterSwatch") }
    };
    let helmlab = null;
    let helmlabFailed = false;

    const labels = {
      ciede2000: "CIEDE2000 Delta E",
      lab76: "CIELAB Delta E 76",
      frechet: "Fréchet distance",
      rgb: "RGB Euclidean",
      helmlab: "Helmlab trained metric",
      jnd: "Helmlab JND"
    };

    function hexToRgb(hex) {
      hex = hex.replace("#", "").trim();
      if (hex.length === 3) hex = hex.split("").map((ch) => ch + ch).join("");
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    }

    function rgbToXyz({ r, g, b }) {
      r /= 255; g /= 255; b /= 255;
      r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
      r *= 100; g *= 100; b *= 100;
      return {
        x: r * 0.4124 + g * 0.3576 + b * 0.1805,
        y: r * 0.2126 + g * 0.7152 + b * 0.0722,
        z: r * 0.0193 + g * 0.1192 + b * 0.9505
      };
    }

    function xyzToLab({ x, y, z }) {
      x /= 95.047; y /= 100; z /= 108.883;
      x = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116;
      y = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
      z = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116;
      return { L: 116 * y - 16, a: 500 * (x - y), b: 200 * (y - z) };
    }

    function hexToLab(hex) { return xyzToLab(rgbToXyz(hexToRgb(hex))); }
    function deg(n) { return n * 180 / Math.PI; }
    function rad(n) { return n * Math.PI / 180; }

    function ciede2000(lab1, lab2) {
      const L1 = lab1.L, a1 = lab1.a, b1 = lab1.b;
      const L2 = lab2.L, a2 = lab2.a, b2 = lab2.b;
      const C1 = Math.sqrt(a1 * a1 + b1 * b1);
      const C2 = Math.sqrt(a2 * a2 + b2 * b2);
      const avgC = (C1 + C2) / 2;
      const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
      const a1p = (1 + G) * a1;
      const a2p = (1 + G) * a2;
      const C1p = Math.sqrt(a1p * a1p + b1 * b1);
      const C2p = Math.sqrt(a2p * a2p + b2 * b2);
      let h1p = deg(Math.atan2(b1, a1p)); if (h1p < 0) h1p += 360;
      let h2p = deg(Math.atan2(b2, a2p)); if (h2p < 0) h2p += 360;
      const dLp = L2 - L1;
      const dCp = C2p - C1p;
      let dhp = 0;
      if (C1p * C2p !== 0) {
        if (Math.abs(h2p - h1p) <= 180) dhp = h2p - h1p;
        else if (h2p - h1p > 180) dhp = h2p - h1p - 360;
        else dhp = h2p - h1p + 360;
      }
      const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp / 2));
      const avgLp = (L1 + L2) / 2;
      const avgCp = (C1p + C2p) / 2;
      let avghp = h1p + h2p;
      if (C1p * C2p !== 0) {
        if (Math.abs(h1p - h2p) <= 180) avghp = (h1p + h2p) / 2;
        else if (h1p + h2p < 360) avghp = (h1p + h2p + 360) / 2;
        else avghp = (h1p + h2p - 360) / 2;
      }
      const T = 1 - 0.17 * Math.cos(rad(avghp - 30)) + 0.24 * Math.cos(rad(2 * avghp)) + 0.32 * Math.cos(rad(3 * avghp + 6)) - 0.20 * Math.cos(rad(4 * avghp - 63));
      const deltaTheta = 30 * Math.exp(-Math.pow((avghp - 275) / 25, 2));
      const RC = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
      const SL = 1 + (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
      const SC = 1 + 0.045 * avgCp;
      const SH = 1 + 0.015 * avgCp * T;
      const RT = -Math.sin(rad(2 * deltaTheta)) * RC;
      return Math.sqrt(Math.pow(dLp / SL, 2) + Math.pow(dCp / SC, 2) + Math.pow(dHp / SH, 2) + RT * (dCp / SC) * (dHp / SH));
    }

    function validHex(hex) { return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex.trim()); }
    function normalizeHex(hex) {
      hex = hex.trim();
      if (!hex.startsWith("#")) hex = "#" + hex;
      if (hex.length === 4) hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      return hex.toLowerCase();
    }

    function lab76(lab1, lab2) {
      return Math.sqrt(Math.pow(lab1.L - lab2.L, 2) + Math.pow(lab1.a - lab2.a, 2) + Math.pow(lab1.b - lab2.b, 2));
    }

    function discreteFrechet(pointsA, pointsB, distanceFn) {
      const cache = Array.from({ length: pointsA.length }, () => Array(pointsB.length).fill(-1));
      function walk(i, j) {
        if (cache[i][j] > -1) return cache[i][j];
        const d = distanceFn(pointsA[i], pointsB[j]);
        if (i === 0 && j === 0) cache[i][j] = d;
        else if (i > 0 && j === 0) cache[i][j] = Math.max(walk(i - 1, 0), d);
        else if (i === 0 && j > 0) cache[i][j] = Math.max(walk(0, j - 1), d);
        else cache[i][j] = Math.max(Math.min(walk(i - 1, j), walk(i - 1, j - 1), walk(i, j - 1)), d);
        return cache[i][j];
      }
      return walk(pointsA.length - 1, pointsB.length - 1);
    }

    function rgbDistance(hex1, hex2) {
      const a = hexToRgb(hex1);
      const b = hexToRgb(hex2);
      return Math.sqrt(Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2));
    }

    function rgbToHex({ r, g, b }) {
      const toHex = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
      return "#" + toHex(r) + toHex(g) + toHex(b);
    }

    function calculateMixHex() {
      let total = 0;
      const acc = { r: 0, g: 0, b: 0 };

      for (const key of Object.keys(precursorInputs)) {
        const input = precursorInputs[key];
        if (!validHex(input.hex.value)) return null;
        const hex = normalizeHex(input.hex.value);
        const part = Math.max(0, Number(input.part.value) || 0);
        const rgb = hexToRgb(hex);
        input.swatch.style.setProperty("--swatch", hex);
        total += part;
        acc.r += rgb.r * part;
        acc.g += rgb.g * part;
        acc.b += rgb.b * part;
      }

      if (total <= 0) return null;
      return rgbToHex({ r: acc.r / total, g: acc.g / total, b: acc.b / total });
    }

    function describe(value, standard) {
      if (standard === "rgb") return "RGB distance is simple but less perceptual than Lab-based standards.";
      if (standard === "frechet") return "For two single colors, Fréchet equals the point-to-point Lab path distance.";
      if (standard === "helmlab") return "Helmlab trained metric is optimized for perceptual judgments; lower is closer.";
      if (standard === "jnd") return "JND is just-noticeable-difference units; near 1 is around a noticeable threshold.";
      if (value < 1) return "Almost identical.";
      if (value < 2) return "Barely visible difference.";
      if (value < 5) return "Small visible difference.";
      if (value < 10) return "Noticeable difference.";
      if (value < 25) return "Clearly different.";
      return "Very different colors.";
    }

    function setMain(value, standard, note) {
      labelEl.textContent = labels[standard];
      distanceEl.textContent = Number.isFinite(value) ? value.toFixed(standard === "helmlab" ? 4 : 2) : "--";
      meaningEl.textContent = Number.isFinite(value) ? describe(value, standard) : "This standard is not available yet.";
      noteEl.innerHTML = note || "Mix source: RYBW sensor colors at " + precursorInputs.red.part.value + ":" + precursorInputs.yellow.part.value + ":" + precursorInputs.blue.part.value + ":" + precursorInputs.water.part.value + ".";
      const scale = standard === "rgb" ? 441 : standard === "helmlab" ? 0.16 : standard === "jnd" ? 5 : 35;
      markerEl.style.transform = "translateX(" + (Math.min(value || 0, scale) / scale * 356) + "px)";
    }

    async function ensureHelmlab() {
      if (helmlab || helmlabFailed) return helmlab;
      try {
        const mod = await import("https://esm.sh/helmlab@1.0.0");
        helmlab = new mod.Helmlab();
      } catch (error) {
        helmlabFailed = true;
      }
      return helmlab;
    }

    async function update() {
      const mixHex = calculateMixHex();
      if (!validHex(hex1Input.value) || !mixHex) {
        distanceEl.textContent = "--";
        meaningEl.innerHTML = '<span class="error">Use valid precursor HEX values and at least one positive proportion.</span>';
        noteEl.textContent = "";
        return;
      }

      const hex1 = normalizeHex(hex1Input.value);
      const hex2 = mixHex;
      const standard = standardInput.value;
      color1Input.value = hex1;
      color2Input.value = hex2;
      hex2Input.value = hex2;
      swatch1.style.setProperty("--swatch", hex1);
      swatch2.style.setProperty("--swatch", hex2);

      const lab1 = hexToLab(hex1);
      const lab2 = hexToLab(hex2);
      const ciede = ciede2000(lab1, lab2);
      const lab = lab76(lab1, lab2);
      const frechet = discreteFrechet([lab1], [lab2], lab76);
      const rgb = rgbDistance(hex1, hex2);
      ciedeValue.textContent = ciede.toFixed(2);
      labValue.textContent = lab.toFixed(2);
      frechetValue.textContent = frechet.toFixed(2);
      rgbValue.textContent = rgb.toFixed(2);

      let helm = null;
      if (standard === "helmlab" || standard === "jnd" || !helmlabFailed) {
        const hl = await ensureHelmlab();
        if (hl) {
          helm = {
            difference: hl.metric.difference(hex1, hex2),
            jnd: hl.metric.jnd(hex1, hex2)
          };
          helmValue.textContent = helm.difference.toFixed(4);
          jndValue.textContent = helm.jnd.toFixed(2);
        } else {
          helmValue.textContent = "Unavailable";
          jndValue.textContent = "Unavailable";
        }
      }

      if (standard === "lab76") setMain(lab, standard);
      else if (standard === "frechet") setMain(frechet, standard);
      else if (standard === "rgb") setMain(rgb, standard);
      else if (standard === "helmlab") {
        setMain(helm ? helm.difference : NaN, standard, helmlabFailed ? '<span class="error">Helmlab could not load from the package CDN in this browser.</span>' : "");
      } else if (standard === "jnd") {
        setMain(helm ? helm.jnd : NaN, standard, helmlabFailed ? '<span class="error">Helmlab could not load from the package CDN in this browser.</span>' : "");
      } else setMain(ciede, standard);
    }

    color1Input.addEventListener("input", () => { hex1Input.value = color1Input.value; update(); });
    hex1Input.addEventListener("input", update);
    standardInput.addEventListener("change", update);
    Object.values(precursorInputs).forEach((input) => {
      input.hex.addEventListener("input", update);
      input.part.addEventListener("input", update);
    });
    document.querySelectorAll("button[data-a]").forEach((button) => {
      button.addEventListener("click", () => {
        hex1Input.value = button.dataset.a;
        update();
      });
    });
    update();
  </script>
</body>
</html>`;

export default {
  async fetch() {
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300"
      }
    });
  }
};

/*
 * 付款方式排序實驗 (Payment-method ORDER experiment)
 * ------------------------------------------------------------------
 * 研究問題：付款選項的「排列次序」會否影響用戶選擇哪一種付款方式？
 *
 * 設計 (design)
 *  - 版本 v2：3 個付款選項（Alipay / WeChat Pay、信用卡、八達通），結帳頁以「垂直、同等大小、
 *    無預設選項」的方式列出。每行只代表一個選擇（一按即選，行內沒有子選項）。
 *  - v1（6 個付款方式）的分配及事件已停用：載入時會刪除舊的 v1 localStorage 資料，
 *    所有訪客會重新獲得 3 個選項的隨機次序，舊數據不會混入新統計。
 *  - 每位訪客首次到訪時，以 Fisher–Yates 洗牌產生一個均勻隨機排列 (uniform random permutation)，
 *    連同參與者 ID (participant ID) 存入 localStorage → 同一瀏覽器每次看到相同次序。
 *  - 測試用 URL 參數（可放在 ?query 或 hash 之後，例如 #/checkout?order=...）：
 *      ?order=octopus,ewallet,card   指定次序（必須剛好包含 3 個 ID 各一次）
 *      ?variant=reset                                 重新隨機分配（同時產生新的參與者 ID）
 *    使用參數後會自動從網址移除，避免重新整理時重複觸發。
 *    以 ?order= 指定的分配會標記為 assignment = "override"，結果頁可選擇排除。
 *  - 落單時記錄一個事件 (event) 到 localStorage：
 *      參與者 ID、時間、顯示次序、所選方式、所選方式的位置 (1–3)、
 *      提交前更改選擇的次數、由進入結帳頁至提交的時間 (ms)、裝置寬度類別。
 *  - 結果頁：#/experiment（不在導覽列中）。
 *
 * ⚠️ 限制：此為純靜態網站，沒有後端。所有資料只存在「該瀏覽器」的 localStorage，
 *    無法彙集不同用戶的數據。正式實驗需把 logEvent() 改為傳送到後端
 *    （例如免費的 Google Form / Sheets、Supabase 或 Firebase）。
 */
(function () {
  const ASSIGN_KEY = 'techhub_exp_assignment_v2';
  const EVENTS_KEY = 'techhub_exp_events_v2';
  const EXPERIMENT_ID = 'payment-order-v2';
  // 舊版本的 localStorage key（v1 = 6 個付款方式），載入時刪除
  const LEGACY_KEYS = ['techhub_exp_assignment_v1', 'techhub_exp_events_v1'];
  LEGACY_KEYS.forEach(k => { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } });

  /* 3 個付款選項。每行左邊是同樣式的中性灰色徽章；tags 是行內的細小中性文字標籤（不使用商標圖片）。
     tags 只作說明，不是子選項 —— 整行就是一個選擇。 */
  const METHODS = [
    { id: 'ewallet', name: 'Alipay / WeChat Pay', badge: '錢', tags: ['Alipay 支付寶', 'WeChat Pay 微信支付'] },
    { id: 'card',    name: '信用卡',              badge: '卡', tags: ['VISA', 'Mastercard'] },
    { id: 'octopus', name: '八達通 Octopus',      badge: '八', tags: [] }
  ];
  const IDS = METHODS.map(m => m.id);
  const byId = id => METHODS.find(m => m.id === id);
  const K = IDS.length; // 選項數目 (3)
  /* 所有可能的排列（3 個選項 → 6 種次序），用於結果頁 */
  function permutations(arr) {
    if (arr.length <= 1) return [arr.slice()];
    return arr.flatMap((x, i) => permutations(arr.filter((_, j) => j !== i)).map(p => [x].concat(p)));
  }
  const ALL_ORDERS = permutations(IDS);

  /* ---------- helpers ---------- */
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }
  function randInt(n) { // unbiased integer in [0, n)
    if (window.crypto && crypto.getRandomValues) {
      const max = Math.floor(0x100000000 / n) * n, buf = new Uint32Array(1);
      let x;
      do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= max);
      return x % n;
    }
    return Math.floor(Math.random() * n);
  }
  /* Fisher–Yates shuffle → uniform random permutation */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function isValidOrder(order) {
    return Array.isArray(order) && order.length === IDS.length &&
      new Set(order).size === IDS.length && order.every(id => IDS.includes(id));
  }
  function readJSON(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
  }
  function deviceCategory(w) { return w < 600 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'; }

  /* ---------- assignment ---------- */
  function newAssignment(order, source) {
    const a = { experiment: EXPERIMENT_ID, pid: uuid(), order, source, assignedAt: new Date().toISOString() };
    localStorage.setItem(ASSIGN_KEY, JSON.stringify(a));
    return a;
  }
  function getAssignment() {
    const a = readJSON(ASSIGN_KEY, null);
    if (a && a.experiment === EXPERIMENT_ID && isValidOrder(a.order)) return a;
    return newAssignment(shuffle(IDS), 'random'); // first visit
  }

  /* 讀取並處理網址參數 (?order= / ?variant=reset)，處理後從網址移除 */
  function applyUrlParams() {
    const search = new URLSearchParams(location.search);
    const [hPath, hQs] = location.hash.split('?');
    const hash = new URLSearchParams(hQs || '');
    const get = k => hash.get(k) || search.get(k);
    const variant = get('variant'), orderParam = get('order');
    if (!variant && !orderParam) return;

    if (orderParam) {
      const order = orderParam.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      if (isValidOrder(order)) {
        const cur = readJSON(ASSIGN_KEY, null);
        // 保留同一參與者 ID，只改次序
        const a = { experiment: EXPERIMENT_ID, pid: (cur && cur.pid) || uuid(), order, source: 'override', assignedAt: new Date().toISOString() };
        localStorage.setItem(ASSIGN_KEY, JSON.stringify(a));
      } else {
        console.warn('[experiment] 無效的 order 參數，已忽略。需要剛好包含以下 ' + K + ' 個 ID：' + IDS.join(','));
      }
    } else if (variant === 'reset') {
      newAssignment(shuffle(IDS), 'random');
    }
    // 移除已處理的參數
    ['order', 'variant'].forEach(k => { search.delete(k); hash.delete(k); });
    const s = search.toString(), h = hash.toString();
    const url = location.pathname + (s ? '?' + s : '') + (location.hash ? hPath + (h ? '?' + h : '') : '');
    history.replaceState(null, '', url);
  }

  /* ---------- checkout tracking ---------- */
  let session = null; // { start, selections }
  function startCheckout() {
    session = { start: performance.now(), selections: 0 };
  }
  function trackSelection() { if (session) session.selections++; }

  function logEvent(choice, extra) {
    const a = getAssignment();
    const w = window.innerWidth;
    const ev = Object.assign({
      experiment: EXPERIMENT_ID,
      pid: a.pid,
      ts: new Date().toISOString(),
      order: a.order.slice(),
      choice,
      position: a.order.indexOf(choice) + 1,           // 1–3
      changes: session ? Math.max(0, session.selections - 1) : 0, // 首次選擇之後再更改的次數
      msToSubmit: session ? Math.round(performance.now() - session.start) : null,
      device: deviceCategory(w),
      viewportWidth: w,
      assignment: a.source                              // 'random' | 'override'
    }, extra || {});
    const events = readJSON(EVENTS_KEY, []);
    events.push(ev);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    // TODO(正式實驗)：在此把 ev 傳送到後端，例如 fetch(ENDPOINT, { method: 'POST', body: JSON.stringify(ev) })
    session = null;
    return ev;
  }

  /* ---------- rendering: checkout options ---------- */
  function paymentOptionsHTML() {
    return getAssignment().order.map((id, i) => {
      const m = byId(id);
      return `<label class="pay-row">
        <input type="radio" name="payment" value="${m.id}" data-position="${i + 1}">
        <span class="pay-badge" aria-hidden="true">${m.badge}</span>
        <span class="pay-text"><span class="pay-name">${m.name}</span>${m.tags.length ? `<span class="pay-tags">${m.tags.map(t => `<span class="pay-tag">${t}</span>`).join('')}</span>` : ''}</span>
        <span class="pay-radio" aria-hidden="true"></span>
      </label>`;
    }).join('');
  }

  /* ---------- statistics ---------- */
  function stats(events) {
    events = events.filter(e => e.experiment === EXPERIMENT_ID && isValidOrder(e.order)); // 只計算本版本事件
    const n = events.length;
    const choiceCounts = Object.fromEntries(IDS.map(id => [id, 0]));
    const posChosen = Array(K).fill(0);
    // matrix[p][id] = { shown, chosen }
    const matrix = Array.from({ length: K }, () => Object.fromEntries(IDS.map(id => [id, { shown: 0, chosen: 0 }])));
    events.forEach(e => {
      if (choiceCounts[e.choice] != null) choiceCounts[e.choice]++;
      if (e.position >= 1 && e.position <= K) posChosen[e.position - 1]++;
      (e.order || []).forEach((id, p) => {
        if (!matrix[p] || !matrix[p][id]) return;
        matrix[p][id].shown++;
        if (id === e.choice) matrix[p][id].chosen++;
      });
    });
    // 每種次序：提交次數，以及選了第 1/2/3 位的次數
    const byOrder = ALL_ORDERS.map(o => {
      const key = o.join(',');
      const evs = events.filter(e => e.order.join(',') === key);
      return { order: o, n: evs.length, pos: Array.from({ length: K }, (_, i) => evs.filter(e => e.position === i + 1).length) };
    });
    const avg = arr => arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0;
    return {
      n, choiceCounts, posChosen, matrix, byOrder,
      participants: new Set(events.map(e => e.pid)).size,
      avgChanges: avg(events.map(e => e.changes || 0)),
      avgSeconds: avg(events.filter(e => e.msToSubmit != null).map(e => e.msToSubmit / 1000))
    };
  }

  function toCSV(events) {
    const cols = ['experiment', 'pid', 'ts', 'assignment', 'order', 'choice', 'position', 'changes', 'msToSubmit', 'device', 'viewportWidth',
      ...IDS.map((_, i) => 'pos' + (i + 1))];
    const q = v => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const rows = events.map(e => cols.map(c => {
      if (c === 'order') return q((e.order || []).join('|'));
      if (/^pos\d$/.test(c)) return q((e.order || [])[+c.slice(3) - 1]);
      return q(e[c]);
    }).join(','));
    return '\uFEFF' + cols.join(',') + '\n' + rows.join('\n') + '\n'; // BOM → Excel 正確顯示中文
  }

  function exportCSV(events) {
    const blob = new Blob([toCSV(events)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'payment-order-experiment-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---------- results page (#/experiment) ---------- */
  const pct = (a, b) => b ? (a / b * 100).toFixed(1) + '%' : '—';
  function resultsHTML(excludeOverride) {
    const all = readJSON(EVENTS_KEY, []).filter(e => e.experiment === EXPERIMENT_ID);
    const events = excludeOverride ? all.filter(e => e.assignment !== 'override') : all;
    const s = stats(events);
    const a = getAssignment();
    const bar = (v, max) => `<span class="bar"><i style="width:${max ? v / max * 100 : 0}%"></i></span>`;
    const maxChoice = Math.max(0, ...Object.values(s.choiceCounts));
    const maxPos = Math.max(0, ...s.posChosen);
    return `
    <div class="crumbs"><a href="#/">首頁</a> / <span>付款次序實驗</span></div>
    <div class="list-head">
      <div><h1>付款方式次序實驗結果</h1><p class="muted">實驗 ID：${EXPERIMENT_ID}</p></div>
      <div class="tools">
        <button class="btn btn-ghost" id="expExport" ${all.length ? '' : 'disabled'}>匯出 CSV</button>
        <button class="btn btn-danger" id="expClear" ${all.length ? '' : 'disabled'}>清除資料</button>
      </div>
    </div>
    <div class="notice">⚠️ 資料只儲存在<b>此瀏覽器</b>的 localStorage（每個瀏覽器各自獨立），只適合測試。
      要收集真實用戶的數據，需要把事件傳送到後端，例如免費的 Google Form / Google Sheets、Supabase 或 Firebase（尚未設定）。</div>

    <div class="exp-stats">
      <div><b>${s.n}</b><span>總提交次數</span></div>
      <div><b>${s.participants}</b><span>參與者 (ID)</span></div>
      <div><b>${s.avgChanges.toFixed(2)}</b><span>平均更改選擇次數</span></div>
      <div><b>${s.avgSeconds.toFixed(1)} 秒</b><span>平均結帳時間</span></div>
    </div>
    <label class="exp-filter"><input type="checkbox" id="expExclude" ${excludeOverride ? 'checked' : ''}> 排除以 ?order= 測試覆寫的提交（${all.filter(e => e.assignment === 'override').length} 筆）</label>

    <div class="exp-grid">
      <section class="panel">
        <h3>各付款方式被選次數</h3>
        <table class="tbl"><thead><tr><th>付款方式</th><th>次數</th><th>%</th><th></th></tr></thead><tbody>
          ${METHODS.map(m => `<tr><td>${m.name}</td><td>${s.choiceCounts[m.id]}</td><td>${pct(s.choiceCounts[m.id], s.n)}</td><td>${bar(s.choiceCounts[m.id], maxChoice)}</td></tr>`).join('')}
        </tbody></table>
      </section>
      <section class="panel">
        <h3>按位置的選擇率</h3>
        <table class="tbl"><thead><tr><th>位置</th><th>被選次數</th><th>選擇率</th><th></th></tr></thead><tbody>
          ${s.posChosen.map((c, i) => `<tr><td>第 ${i + 1} 位</td><td>${c}</td><td>${pct(c, s.n)}</td><td>${bar(c, maxPos)}</td></tr>`).join('')}
        </tbody></table>
        <p class="muted small">若次序沒有影響，每個位置的選擇率應接近 ${(100 / K).toFixed(1)}%（1/${K}）。</p>
      </section>
    </div>

    <section class="panel">
      <h3>位置 × 付款方式矩陣</h3>
      <p class="muted small">每格：被選次數 / 在該位置出現次數（選擇率）</p>
      <div class="tbl-wrap"><table class="tbl matrix"><thead><tr><th>位置</th>${METHODS.map(m => `<th>${m.name}</th>`).join('')}</tr></thead><tbody>
        ${s.matrix.map((row, p) => `<tr><td>第 ${p + 1} 位</td>${METHODS.map(m => {
          const c = row[m.id];
          const r = c.shown ? c.chosen / c.shown : 0;
          return `<td style="--r:${r.toFixed(3)}"><b>${c.chosen}</b> / ${c.shown}<small>${pct(c.chosen, c.shown)}</small></td>`;
        }).join('')}</tr>`).join('')}
      </tbody></table></div>
    </section>

    <section class="panel">
      <h3>按次序（${ALL_ORDERS.length} 種排列）統計</h3>
      <div class="tbl-wrap"><table class="tbl orders"><thead><tr><th>#</th><th>次序（第 1 → 第 ${K} 位）</th><th>提交次數</th>${IDS.map((_, i) => `<th>選第 ${i + 1} 位</th>`).join('')}</tr></thead><tbody>
        ${s.byOrder.map((r, i) => `<tr><td>${i + 1}</td><td>${r.order.map(id => byId(id).name).join(' → ')}</td><td>${r.n}</td>${r.pos.map(c => `<td>${c}${r.n ? ` <small class="muted">(${pct(c, r.n)})</small>` : ''}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div>
      <p class="muted small">隨機分配下，每種次序的出現機會均等（各約 ${(100 / ALL_ORDERS.length).toFixed(1)}%）。</p>
    </section>

    <section class="panel">
      <h3>此瀏覽器的分配</h3>
      <p class="small">參與者 ID：<code>${a.pid}</code>（${a.source === 'override' ? '測試覆寫' : '隨機分配'}，${new Date(a.assignedAt).toLocaleString('zh-HK')}）</p>
      <ol class="exp-order">${a.order.map(id => `<li>${byId(id).name}</li>`).join('')}</ol>
      <p class="muted small">測試參數：<code>?order=${IDS.join(',')}</code> 指定次序；<code>?variant=reset</code> 重新隨機分配。</p>
      <a class="btn btn-ghost btn-sm" href="#/experiment?variant=reset">重新隨機分配</a>
    </section>

    <section class="panel">
      <h3>最近提交（最多 20 筆）</h3>
      ${all.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>時間</th><th>參與者</th><th>選擇</th><th>位置</th><th>更改</th><th>用時</th><th>裝置</th><th>分配</th></tr></thead><tbody>
        ${all.slice(-20).reverse().map(e => `<tr><td>${new Date(e.ts).toLocaleString('zh-HK')}</td><td><code>${String(e.pid).slice(0, 8)}</code></td><td>${(byId(e.choice) || {}).name || e.choice}</td><td>${e.position}</td><td>${e.changes}</td><td>${e.msToSubmit != null ? (e.msToSubmit / 1000).toFixed(1) + 's' : '—'}</td><td>${e.device}</td><td>${e.assignment}</td></tr>`).join('')}
      </tbody></table></div>` : '<p class="muted">暫時未有提交。</p>'}
    </section>`;
  }

  let excludeOverride = false;
  function bindResults(rerender) {
    const ex = document.getElementById('expExport');
    if (ex) ex.addEventListener('click', () => exportCSV(readJSON(EVENTS_KEY, []).filter(e => e.experiment === EXPERIMENT_ID)));
    const cl = document.getElementById('expClear');
    if (cl) cl.addEventListener('click', () => {
      if (confirm('確定清除此瀏覽器所有實驗資料？此操作無法還原。')) { localStorage.removeItem(EVENTS_KEY); rerender(); }
    });
    const f = document.getElementById('expExclude');
    if (f) f.addEventListener('change', () => { excludeOverride = f.checked; rerender(); });
  }

  // 處理網址參數：載入時及每次 hash 改變時（此 listener 先於 app.js 註冊，所以會先執行）
  applyUrlParams();
  window.addEventListener('hashchange', applyUrlParams);
  getAssignment(); // 首次到訪即分配

  window.Experiment = {
    METHODS, IDS, ALL_ORDERS, EXPERIMENT_ID, methodName: id => (byId(id) || {}).name || id,
    getAssignment, paymentOptionsHTML, startCheckout, trackSelection, logEvent,
    events: () => readJSON(EVENTS_KEY, []),
    stats, toCSV, exportCSV,
    resultsHTML: () => resultsHTML(excludeOverride), bindResults,
    _shuffle: shuffle
  };
})();

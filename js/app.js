/* 科技坊 TechHub — simple hash-router SPA (vanilla JS, no build step) */
(function () {
  const app = document.getElementById('app');
  const FREE_SHIP = 500, SHIP_FEE = 50;
  const fmt = n => 'HK$' + n.toLocaleString('en-HK');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const catName = id => (CATEGORIES.find(c => c.id === id) || {}).name || '';
  const byId = id => PRODUCTS.find(p => p.id === id);

  /* ---------- header ---------- */
  document.getElementById('searchIc').innerHTML = icon('search');
  document.getElementById('cartIc').innerHTML = icon('cart');
  document.getElementById('menuBtn').innerHTML = icon('menu');
  document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('nav').classList.toggle('open'));
  document.getElementById('searchForm').addEventListener('submit', e => {
    e.preventDefault();
    const q = document.getElementById('searchInput').value.trim();
    location.hash = '#/products' + (q ? '?q=' + encodeURIComponent(q) : '');
  });
  function updateCount() {
    const el = document.getElementById('cartCount');
    const n = Cart.count();
    el.textContent = n;
    el.classList.toggle('show', n > 0);
  }
  Cart.onChange(updateCount);
  updateCount();

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.innerHTML = icon('check') + '<span>' + msg + '</span>';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
  }

  /* ---------- components ---------- */
  function stars(r) { return `<span class="rating">${icon('star', 'star')} ${r.toFixed(1)}</span>`; }
  function card(p) {
    const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    return `<article class="card">
      <a href="#/product/${p.id}" class="card-img" style="--c:${p.color}">
        ${off ? `<span class="badge">-${off}%</span>` : ''}
        ${productArt(p.category, p.color)}
      </a>
      <div class="card-body">
        <div class="card-meta"><span class="tag">${catName(p.category)}</span>${stars(p.rating)}</div>
        <h3><a href="#/product/${p.id}">${p.name}</a></h3>
        <p class="muted small clamp">${p.desc}</p>
        <div class="card-foot">
          <div class="price">${fmt(p.price)}${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ''}</div>
          <button class="btn btn-sm" data-add="${p.id}" aria-label="加入購物車">${icon('cart')} 加入</button>
        </div>
      </div>
    </article>`;
  }

  /* ---------- views ---------- */
  function viewHome() {
    const featured = PRODUCTS.filter(p => p.featured);
    const hero = byId('p1');
    return `
    <section class="hero">
      <div class="hero-text">
        <span class="pill">新品登場 · 限時優惠</span>
        <h1>智能生活<br><span class="grad">由科技坊開始</span></h1>
        <p>精選手機、手提電腦、平板、耳機及智能手錶，香港本地送貨，全單滿 ${fmt(FREE_SHIP)} 免運費。</p>
        <div class="hero-cta">
          <a href="#/products" class="btn btn-lg">立即選購</a>
          <a href="#/product/${hero.id}" class="btn btn-lg btn-ghost">了解 ${hero.name}</a>
        </div>
      </div>
      <div class="hero-art">
        <div class="blob"></div>
        <div class="hero-device d1">${productArt('laptop', '#6366f1')}</div>
        <div class="hero-device d2">${productArt('phone', '#ec4899')}</div>
        <div class="hero-device d3">${productArt('watch', '#14b8a6')}</div>
      </div>
    </section>

    <section class="perks">
      <div>${icon('truck')}<div><b>免運費</b><span>滿 ${fmt(FREE_SHIP)} 免費送貨</span></div></div>
      <div>${icon('shield')}<div><b>正品保證</b><span>一年原廠保養</span></div></div>
      <div>${icon('refresh')}<div><b>7 日退貨</b><span>無理由退換</span></div></div>
    </section>

    <section class="section">
      <div class="section-head"><h2>產品分類</h2></div>
      <div class="cats">
        ${CATEGORIES.map(c => `<a class="cat" href="#/products?cat=${c.id}">
          <span class="cat-ic">${icon(c.icon)}</span><b>${c.name}</b>
          <span class="muted small">${PRODUCTS.filter(p => p.category === c.id).length} 件產品</span></a>`).join('')}
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>精選產品</h2><a href="#/products" class="link">查看全部 →</a></div>
      <div class="grid">${featured.map(card).join('')}</div>
    </section>

    <section class="promo">
      <div><h2>開學優惠 🎓</h2><p>手提電腦及平板指定型號低至 9 折，再送配件禮券。</p></div>
      <a href="#/products?cat=laptop" class="btn btn-lg btn-light">選購手提電腦</a>
    </section>`;
  }

  function viewProducts(params) {
    const cat = params.get('cat') || 'all';
    const q = params.get('q') || '';
    const sort = params.get('sort') || 'default';
    let list = PRODUCTS.filter(p => (cat === 'all' || p.category === cat) &&
      (!q || (p.name + p.desc + catName(p.category)).toLowerCase().includes(q.toLowerCase())));
    if (sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    const title = cat === 'all' ? '全部產品' : catName(cat);
    return `
    <div class="crumbs"><a href="#/">首頁</a> / <span>${title}</span></div>
    <div class="list-head">
      <div><h1>${title}</h1><p class="muted">${q ? `搜尋「${esc(q)}」· ` : ''}共 ${list.length} 件產品</p></div>
      <div class="tools">
        <input type="search" id="listSearch" class="input" placeholder="搜尋…" value="${esc(q)}" aria-label="搜尋">
        <select id="sortSel" class="input" aria-label="排序">
          <option value="default" ${sort === 'default' ? 'selected' : ''}>預設排序</option>
          <option value="asc" ${sort === 'asc' ? 'selected' : ''}>價格：低至高</option>
          <option value="desc" ${sort === 'desc' ? 'selected' : ''}>價格：高至低</option>
          <option value="rating" ${sort === 'rating' ? 'selected' : ''}>評分最高</option>
        </select>
      </div>
    </div>
    <div class="chips">
      <button class="chip ${cat === 'all' ? 'active' : ''}" data-cat="all">全部</button>
      ${CATEGORIES.map(c => `<button class="chip ${cat === c.id ? 'active' : ''}" data-cat="${c.id}">${icon(c.icon)} ${c.name}</button>`).join('')}
    </div>
    ${list.length ? `<div class="grid">${list.map(card).join('')}</div>` :
      `<div class="empty">${icon('search', 'big')}<h3>找不到相關產品</h3><p class="muted">試試其他關鍵字或分類</p><a class="btn" href="#/products">查看全部產品</a></div>`}`;
  }

  function viewProduct(id) {
    const p = byId(id);
    if (!p) return viewNotFound();
    const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    return `
    <div class="crumbs"><a href="#/">首頁</a> / <a href="#/products?cat=${p.category}">${catName(p.category)}</a> / <span>${p.name}</span></div>
    <section class="detail">
      <div class="detail-img" style="--c:${p.color}">${productArt(p.category, p.color)}</div>
      <div class="detail-info">
        <span class="tag">${catName(p.category)}</span>
        <h1>${p.name}</h1>
        <div class="muted">${stars(p.rating)} · 有現貨</div>
        <div class="price big">${fmt(p.price)}${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ''}</div>
        <p>${p.desc}</p>
        <ul class="specs">${p.specs.map(s => `<li>${icon('check')} ${s}</li>`).join('')}</ul>
        <div class="buy-row">
          <div class="qty" data-qty-box>
            <button type="button" data-step="-1" aria-label="減少">−</button>
            <input type="number" id="detailQty" value="1" min="1" max="99" aria-label="數量">
            <button type="button" data-step="1" aria-label="增加">+</button>
          </div>
          <button class="btn btn-lg" id="detailAdd">${icon('cart')} 加入購物車</button>
          <button class="btn btn-lg btn-ghost" id="detailBuy">立即購買</button>
        </div>
        <div class="perks-mini">
          <span>${icon('truck')} 滿 ${fmt(FREE_SHIP)} 免運費</span>
          <span>${icon('shield')} 一年保養</span>
          <span>${icon('refresh')} 7 日退貨</span>
        </div>
      </div>
    </section>
    ${related.length ? `<section class="section"><div class="section-head"><h2>相關產品</h2></div>
      <div class="grid">${related.map(card).join('')}</div></section>` : ''}`;
  }

  function summary(showItems) {
    const sub = Cart.subtotal();
    const ship = sub >= FREE_SHIP || sub === 0 ? 0 : SHIP_FEE;
    return `<aside class="summary">
      <h3>訂單摘要</h3>
      ${showItems ? Cart.items().map(i => { const p = byId(i.id); return `<div class="sum-item"><span>${p.name} × ${i.qty}</span><span>${fmt(p.price * i.qty)}</span></div>`; }).join('') + '<hr>' : ''}
      <div class="sum-row"><span>小計</span><span>${fmt(sub)}</span></div>
      <div class="sum-row"><span>運費</span><span>${ship ? fmt(ship) : '免費'}</span></div>
      ${sub > 0 && sub < FREE_SHIP ? `<p class="hint">再買 ${fmt(FREE_SHIP - sub)} 即享免運費</p>` : ''}
      <hr>
      <div class="sum-row total"><span>總計</span><span>${fmt(sub + ship)}</span></div>
      ${showItems ? '' : `<a href="#/checkout" class="btn btn-lg btn-block">前往結帳</a><a href="#/products" class="link center">← 繼續購物</a>`}
    </aside>`;
  }

  function viewCart() {
    const items = Cart.items();
    if (!items.length) return `<div class="crumbs"><a href="#/">首頁</a> / <span>購物車</span></div>
      <div class="empty">${icon('cart', 'big')}<h3>購物車是空的</h3><p class="muted">快去挑選心儀的產品吧！</p><a class="btn btn-lg" href="#/products">開始購物</a></div>`;
    return `
    <div class="crumbs"><a href="#/">首頁</a> / <span>購物車</span></div>
    <h1>購物車 <span class="muted">(${Cart.count()} 件)</span></h1>
    <div class="cart-layout">
      <div class="cart-list">
        ${items.map(i => { const p = byId(i.id); return `
        <div class="cart-item">
          <a href="#/product/${p.id}" class="cart-thumb" style="--c:${p.color}">${productArt(p.category, p.color)}</a>
          <div class="cart-info">
            <a href="#/product/${p.id}"><b>${p.name}</b></a>
            <span class="muted small">${catName(p.category)} · 單價 ${fmt(p.price)}</span>
            <div class="qty sm">
              <button type="button" data-cart-step="-1" data-id="${p.id}" aria-label="減少">−</button>
              <input type="number" value="${i.qty}" min="1" max="99" data-cart-qty="${p.id}" aria-label="數量">
              <button type="button" data-cart-step="1" data-id="${p.id}" aria-label="增加">+</button>
            </div>
          </div>
          <div class="cart-right">
            <b>${fmt(p.price * i.qty)}</b>
            <button class="icon-btn" data-remove="${p.id}" aria-label="移除">${icon('trash')}</button>
          </div>
        </div>`; }).join('')}
        <button class="link danger" id="clearCart">清空購物車</button>
      </div>
      ${summary(false)}
    </div>`;
  }

  function viewCheckout() {
    if (!Cart.items().length) return viewCart();
    return `
    <div class="crumbs"><a href="#/">首頁</a> / <a href="#/cart">購物車</a> / <span>結帳</span></div>
    <h1>結帳</h1>
    <div class="cart-layout">
      <form id="checkoutForm" class="form" novalidate>
        <fieldset>
          <legend>1. 聯絡資料</legend>
          <div class="row2">
            <label>姓名 *<input class="input" name="name" required autocomplete="name" placeholder="陳大文"><small class="err"></small></label>
            <label>電話 *<input class="input" name="phone" required inputmode="tel" autocomplete="tel" placeholder="9123 4567"><small class="err"></small></label>
          </div>
          <label>電郵（選填）<input class="input" name="email" type="email" autocomplete="email" placeholder="you@example.com"><small class="err"></small></label>
        </fieldset>
        <fieldset>
          <legend>2. 送貨地址</legend>
          <div class="row2">
            <label>地區 *<select class="input" name="region" required>
              <option value="">請選擇</option><option>香港島</option><option>九龍</option><option>新界</option><option>離島</option>
            </select><small class="err"></small></label>
            <label>送貨方式<select class="input" name="delivery"><option>標準送貨（2-3 個工作天）</option><option>順豐站自取</option></select></label>
          </div>
          <label>詳細地址 *<textarea class="input" name="address" rows="3" required placeholder="大廈、樓層、單位、街道"></textarea><small class="err"></small></label>
        </fieldset>
        <fieldset>
          <legend>3. 付款方式</legend>
          <!-- 付款方式：次序由 js/experiment.js 隨機分配，無預設選項 -->
          <div class="pay-list" role="radiogroup" aria-label="付款方式">${Experiment.paymentOptionsHTML()}</div>
          <small class="err" id="payErr"></small>
          <p class="muted small">＊此為示範網站，不會收取任何款項。</p>
        </fieldset>
        <button class="btn btn-lg btn-block" type="submit">確認落單</button>
      </form>
      ${summary(true)}
    </div>`;
  }

  function viewSuccess() {
    const o = JSON.parse(sessionStorage.getItem('techhub_last_order') || 'null');
    if (!o) return viewNotFound();
    return `<section class="success">
      <div class="success-ic">${icon('check', 'big')}</div>
      <h1>多謝惠顧，訂單已確認！</h1>
      <p class="muted">訂單編號 <b>${o.no}</b> · 我們會盡快安排送貨。</p>
      <div class="order-box">
        <div class="sum-row"><span>收件人</span><span>${esc(o.name)}（${esc(o.phone)}）</span></div>
        <div class="sum-row"><span>地址</span><span>${esc(o.region)} ${esc(o.address)}</span></div>
        <div class="sum-row"><span>送貨方式</span><span>${esc(o.delivery)}</span></div>
        <div class="sum-row"><span>付款方式</span><span>${esc(Experiment.methodName(o.payment))}</span></div>
        <hr>
        ${o.items.map(i => `<div class="sum-item"><span>${esc(i.name)} × ${i.qty}</span><span>${fmt(i.total)}</span></div>`).join('')}
        <hr>
        <div class="sum-row"><span>運費</span><span>${o.ship ? fmt(o.ship) : '免費'}</span></div>
        <div class="sum-row total"><span>總計</span><span>${fmt(o.total)}</span></div>
      </div>
      <p class="muted small">（示範訂單，並無實際付款或送貨）</p>
      <a class="btn btn-lg" href="#/products">繼續購物</a>
    </section>`;
  }

  function viewNotFound() {
    return `<div class="empty"><h3>找不到頁面</h3><a class="btn" href="#/">返回首頁</a></div>`;
  }

  /* ---------- router ---------- */
  function route() {
    const hash = location.hash.slice(1) || '/';
    const [path, qs] = hash.split('?');
    const params = new URLSearchParams(qs || '');
    const parts = path.split('/').filter(Boolean);
    let html, nav = '';
    switch (parts[0]) {
      case undefined: html = viewHome(); nav = 'home'; break;
      case 'products': html = viewProducts(params); nav = 'products'; break;
      case 'product': html = viewProduct(parts[1]); break;
      case 'cart': html = viewCart(); break;
      case 'checkout': html = viewCheckout(); break;
      case 'success': html = viewSuccess(); break;
      case 'experiment': html = Experiment.resultsHTML(); break; // 隱藏結果頁（不在導覽列）
      default: html = viewNotFound();
    }
    app.innerHTML = html;
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === nav));
    document.getElementById('nav').classList.remove('open');
    if (parts[0] !== 'products') document.getElementById('searchInput').value = '';
    bind(parts, params);
  }

  function setParam(params, key, val) {
    if (val && val !== 'all' && val !== 'default') params.set(key, val); else params.delete(key);
    const s = params.toString();
    location.hash = '#/products' + (s ? '?' + s : '');
  }

  function bind(parts, params) {
    app.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {
      Cart.add(b.dataset.add); toast('已加入購物車：' + byId(b.dataset.add).name);
    }));
    if (parts[0] === 'products') {
      app.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => setParam(params, 'cat', b.dataset.cat)));
      document.getElementById('sortSel').addEventListener('change', e => setParam(params, 'sort', e.target.value));
      const ls = document.getElementById('listSearch');
      let t;
      ls.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => setParam(params, 'q', ls.value.trim()), 400); });
      if (params.get('q')) { ls.focus(); ls.setSelectionRange(ls.value.length, ls.value.length); }
    }
    if (parts[0] === 'product') {
      const qty = document.getElementById('detailQty');
      if (!qty) return;
      const get = () => Math.max(1, Math.min(99, parseInt(qty.value, 10) || 1));
      app.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => { qty.value = Math.max(1, Math.min(99, get() + +b.dataset.step)); }));
      document.getElementById('detailAdd').addEventListener('click', () => { Cart.add(parts[1], get()); toast(`已加入 ${get()} 件到購物車`); });
      document.getElementById('detailBuy').addEventListener('click', () => { Cart.add(parts[1], get()); location.hash = '#/cart'; });
    }
    if (parts[0] === 'cart') {
      app.querySelectorAll('[data-cart-step]').forEach(b => b.addEventListener('click', () => {
        const it = Cart.items().find(i => i.id === b.dataset.id);
        Cart.setQty(b.dataset.id, it.qty + +b.dataset.cartStep);
      }));
      app.querySelectorAll('[data-cart-qty]').forEach(inp => inp.addEventListener('change', () => {
        Cart.setQty(inp.dataset.cartQty, parseInt(inp.value, 10) || 0);
      }));
      app.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { Cart.remove(b.dataset.remove); toast('已移除產品'); }));
      const c = document.getElementById('clearCart');
      if (c) c.addEventListener('click', () => { if (confirm('確定清空購物車？')) Cart.clear(); });
    }
    if (parts[0] === 'experiment') Experiment.bindResults(route);
    if (parts[0] === 'checkout') {
      const f = document.getElementById('checkoutForm');
      if (f) {
        Experiment.startCheckout(); // 開始計時
        f.addEventListener('submit', submitOrder);
        f.querySelectorAll('input[name=payment]').forEach(r => r.addEventListener('change', () => {
          Experiment.trackSelection();
          document.getElementById('payErr').textContent = '';
          f.querySelector('.pay-list').classList.remove('invalid');
        }));
        // clear a field's error as soon as the user edits it
        f.addEventListener('input', e => {
          const el = e.target, err = el.parentElement && el.parentElement.querySelector('.err');
          if (err && el.classList.contains('invalid')) { err.textContent = ''; el.classList.remove('invalid'); }
        });
      }
    }
  }

  function submitOrder(e) {
    e.preventDefault();
    const f = e.target, d = Object.fromEntries(new FormData(f));
    const errs = {};
    if (!d.name.trim()) errs.name = '請輸入姓名';
    if (!/^[2-9]\d{7}$/.test(d.phone.replace(/[\s-]/g, ''))) errs.phone = '請輸入 8 位數字香港電話號碼';
    if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) errs.email = '電郵格式不正確';
    if (!d.region) errs.region = '請選擇地區';
    if (d.address.trim().length < 5) errs.address = '請輸入詳細地址';
    if (!d.payment) errs.payment = '請選擇付款方式';
    f.querySelectorAll('[name]').forEach(el => {
      const err = el.parentElement.querySelector('.err');
      if (!err) return;
      err.textContent = errs[el.name] || '';
      el.classList.toggle('invalid', !!errs[el.name]);
    });
    document.getElementById('payErr').textContent = errs.payment || '';
    f.querySelector('.pay-list').classList.toggle('invalid', !!errs.payment);
    if (Object.keys(errs).length) {
      const first = f.querySelector('.input.invalid') || f.querySelector('input[name=payment]');
      first.focus();
      return;
    }
    Experiment.logEvent(d.payment); // 記錄實驗事件
    const sub = Cart.subtotal(), ship = sub >= FREE_SHIP ? 0 : SHIP_FEE;
    const order = {
      no: 'TH' + Date.now().toString().slice(-8),
      name: d.name.trim(), phone: d.phone.trim(), region: d.region, address: d.address.trim(),
      delivery: d.delivery, payment: d.payment,
      items: Cart.items().map(i => { const p = byId(i.id); return { name: p.name, qty: i.qty, total: p.price * i.qty }; }),
      ship, total: sub + ship
    };
    sessionStorage.setItem('techhub_last_order', JSON.stringify(order));
    Cart.clear();
    location.hash = '#/success';
  }

  Cart.onChange(() => { const h = location.hash; if (h.startsWith('#/cart')) route(); });
  window.addEventListener('hashchange', () => { route(); window.scrollTo({ top: 0, behavior: 'instant' }); });
  route();
})();

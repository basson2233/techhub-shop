/* Shopping cart persisted in localStorage */
(function () {
  const KEY = 'techhub_cart_v1';
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  let items = load(); // [{id, qty}]
  // 移除已不存在的產品（例如舊版示範產品 p1–p16），避免購物車出現無效項目
  const valid = items.filter(i => window.PRODUCTS && PRODUCTS.some(p => p.id === i.id) && i.qty > 0);
  if (valid.length !== items.length) { items = valid; localStorage.setItem(KEY, JSON.stringify(items)); }
  const listeners = [];
  function save() {
    localStorage.setItem(KEY, JSON.stringify(items));
    listeners.forEach(fn => fn());
  }
  window.Cart = {
    items: () => items.filter(i => PRODUCTS.some(p => p.id === i.id)),
    add(id, qty = 1) {
      const it = items.find(i => i.id === id);
      if (it) it.qty = Math.min(99, it.qty + qty); else items.push({ id, qty });
      save();
    },
    setQty(id, qty) {
      const it = items.find(i => i.id === id);
      if (!it) return;
      if (qty <= 0) items = items.filter(i => i.id !== id); else it.qty = Math.min(99, qty);
      save();
    },
    remove(id) { items = items.filter(i => i.id !== id); save(); },
    clear() { items = []; save(); },
    count() { return this.items().reduce((s, i) => s + i.qty, 0); },
    subtotal() {
      return this.items().reduce((s, i) => s + PRODUCTS.find(p => p.id === i.id).price * i.qty, 0);
    },
    onChange(fn) { listeners.push(fn); }
  };
  window.addEventListener('storage', e => { if (e.key === KEY) { items = load(); listeners.forEach(fn => fn()); } });
})();

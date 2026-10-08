# 科技坊 TechHub — 電子產品網店示範

純 HTML + CSS + 原生 JavaScript，無需編譯。

## 本地運行
```bash
cd electronics-shop
python3 -m http.server 8080
# 瀏覽 http://localhost:8080
```

## 結構
- `index.html` — 頁面骨架（header / footer），各頁面由 hash 路由動態渲染
- `css/style.css` — 樣式（響應式：桌面 / 平板 / 手機）
- `js/products.js` — **示例產品資料**（虛構名稱及價格，正式使用前請替換）
- `js/art.js` — 離線 SVG 產品插圖及圖示（不使用外部圖片）
- `js/cart.js` — 購物車（localStorage 儲存）
- `js/app.js` — 路由及各頁面：首頁、產品列表、產品詳情、購物車、結帳、訂單確認

路由：`#/`、`#/products?cat=phone&q=…&sort=asc|desc|rating`、`#/product/p1`、`#/cart`、`#/checkout`、`#/success`

> 此為示範網站，結帳不會進行任何真實付款。

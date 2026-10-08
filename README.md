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
- `js/experiment.js` — 付款方式次序實驗（隨機分配、事件記錄、結果統計）
- `js/app.js` — 路由及各頁面：首頁、產品列表、產品詳情、購物車、結帳、訂單確認

路由：`#/`、`#/products?cat=phone&q=…&sort=asc|desc|rating`、`#/product/p1`、`#/cart`、`#/checkout`、`#/success`、`#/experiment`（隱藏結果頁）

## 付款方式次序實驗 (Payment-order experiment)

**問題：** 付款選項的排列次序，會否影響用戶選擇哪一種付款方式？

**設計**
- 結帳頁的 6 個付款方式以垂直、同等大小、同一樣式列出，**沒有預設選項**（未選擇會顯示錯誤）：
  八達通 Octopus、Alipay 支付寶、WeChat Pay 微信支付、信用卡、轉數快 FPS、PayMe
- 每位訪客首次到訪時，以 Fisher–Yates 洗牌產生均勻隨機排列（共 720 種可能），連同參與者 ID 存於 localStorage（`techhub_exp_assignment_v1`），同一瀏覽器每次看到相同次序。
- 每次落單記錄一個事件（`techhub_exp_events_v1`）：

| 欄位 | 說明 |
|---|---|
| `pid` | 參與者 ID |
| `ts` | 提交時間（ISO 8601, UTC） |
| `order` | 顯示次序（位置 1→6） |
| `choice` | 所選付款方式 ID |
| `position` | 所選方式的位置（1–6） |
| `changes` | 首次選擇後再更改選擇的次數 |
| `msToSubmit` | 由進入結帳頁至提交的毫秒數 |
| `device` / `viewportWidth` | 裝置寬度類別（mobile < 600px ≤ tablet < 1024px ≤ desktop）及實際寬度 |
| `assignment` | `random`（隨機分配）或 `override`（以網址參數指定） |

**付款方式 ID：** `octopus`、`alipay`、`wechat`、`card`、`fps`、`payme`

**網址參數（測試用）**，可放在 `?` 查詢字串或 hash 後面，使用後會自動從網址移除：
- `?order=octopus,alipay,wechat,card,fps,payme` — 指定次序（6 個 ID 各出現一次），保留原參與者 ID，標記為 `override`
- `?variant=reset` — 重新隨機分配，並產生新參與者 ID

例子：`https://basson2233.github.io/techhub-shop/#/checkout?order=payme,fps,card,wechat,alipay,octopus`

**結果頁：** `#/experiment`（不在導覽列）— 總提交數、各方式被選次數及百分比、按位置 (1–6) 的選擇率、位置 × 付款方式矩陣；可匯出 CSV、清除資料，並可排除 `override` 測試數據。

> ⚠️ **限制：** 本網站是純靜態網站，沒有後端，所有實驗資料只存在**每個瀏覽器自己的 localStorage**，無法彙集不同用戶的數據。要做真實實驗，需要把 `js/experiment.js` 中 `logEvent()` 的事件傳送到後端（例如免費的 Google Form / Google Sheets、Supabase 或 Firebase）。

> 此為示範網站，結帳不會進行任何真實付款。

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
- `js/products.js` — 產品資料：16 款真實在售型號，香港參考價（2026-10-08 核對），每件附價格來源
- `js/art.js` — 離線 SVG 產品插圖及圖示（不使用外部圖片）
- `js/cart.js` — 購物車（localStorage 儲存）
- `js/experiment.js` — 付款方式次序實驗（隨機分配、事件記錄、結果統計）
- `js/app.js` — 路由及各頁面：首頁、產品列表、產品詳情、購物車、結帳、訂單確認

## 產品資料

- 6 個分類共 16 款真實型號（Apple、Samsung、ASUS、Lenovo、Sony、Logitech、Anker）。
- 價格為香港參考價（港幣），於 **2026-10-08** 經網上搜尋核對官方香港網店／新聞稿或主要零售商（Fortress、Broadway、Wilson 等）；`oldPrice` 為同一來源列出的建議零售價。每件產品的 `source` 欄位記錄來源名稱及網址，產品頁會顯示。
- 規格只收錄已核實的項目；未能確認的細節已省略。價格及供應會變動，只供參考。
- 本站為示範／研究網站，並非任何品牌的官方或授權商店，亦與相關品牌無任何關係；產品名稱及商標屬各自擁有人所有。產品圖片為離線 SVG 示意圖，並非官方相片。
- 舊版示範產品（`p1`–`p16`）的購物車項目會在載入時自動移除。

路由：`#/`、`#/products?cat=phone&q=…&sort=asc|desc`、`#/product/p1`、`#/cart`、`#/checkout`、`#/success`、`#/experiment`（隱藏結果頁）

## 付款方式次序實驗 (Payment-order experiment)

**問題：** 付款選項的排列次序，會否影響用戶選擇哪一種付款方式？

**設計**
- 結帳頁已簡化為只有「付款方式」一個部分（已移除聯絡資料及送貨地址欄位，避免必填欄位阻礙提交而影響數據收集）；唯一驗證是必須選擇付款方式。運費按標準送貨計算：滿 HK$500 免運費，否則 HK$50。確認頁只顯示訂單編號、產品、總計及所選付款方式。
- **目前版本：`payment-order-v2`（3 個選項）。** 結帳頁的 3 個付款選項以垂直、同等大小、同一樣式列出，**沒有預設選項**（未選擇會顯示錯誤）。每行就是一個選擇（一按即選，行內沒有子選項）；行內的細小文字標籤只作說明，不使用商標圖片：

| ID | 選項 | 行內標籤 |
|---|---|---|
| `ewallet` | Alipay / WeChat Pay | Alipay 支付寶、WeChat Pay 微信支付 |
| `card` | 信用卡 | VISA、Mastercard |
| `octopus` | 八達通 Octopus | — |

- 每位訪客首次到訪時，以 Fisher–Yates 洗牌產生均勻隨機排列（3 個選項共 6 種次序），連同參與者 ID 存於 localStorage（`techhub_exp_assignment_v2`），同一瀏覽器每次看到相同次序。
- **版本更新：** 舊版 v1（6 個付款方式：八達通、支付寶、微信支付、信用卡、轉數快、PayMe）的 localStorage 資料（`techhub_exp_assignment_v1`、`techhub_exp_events_v1`）會在載入時自動刪除，所有訪客重新分配 3 個選項的次序；結果頁及 CSV 只包含 v2 事件。
- 每次落單記錄一個事件（`techhub_exp_events_v2`）：

| 欄位 | 說明 |
|---|---|
| `pid` | 參與者 ID |
| `ts` | 提交時間（ISO 8601, UTC） |
| `experiment` | 實驗版本（`payment-order-v2`） |
| `order` | 顯示次序（位置 1→3） |
| `choice` | 所選付款方式 ID |
| `position` | 所選方式的位置（1–3） |
| `changes` | 首次選擇後再更改選擇的次數 |
| `msToSubmit` | 由進入結帳頁至提交的毫秒數 |
| `device` / `viewportWidth` | 裝置寬度類別（mobile < 600px ≤ tablet < 1024px ≤ desktop）及實際寬度 |
| `assignment` | `random`（隨機分配）或 `override`（以網址參數指定） |

**付款方式 ID：** `ewallet`、`card`、`octopus`

**網址參數（測試用）**，可放在 `?` 查詢字串或 hash 後面，使用後會自動從網址移除：
- `?order=octopus,ewallet,card` — 指定次序（3 個 ID 各出現一次），保留原參與者 ID，標記為 `override`
- `?variant=reset` — 重新隨機分配，並產生新參與者 ID

例子：`https://basson2233.github.io/techhub-shop/#/checkout?order=octopus,ewallet,card`

**結果頁：** `#/experiment`（不在導覽列）— 總提交數、各方式被選次數及百分比、按位置 (1–3) 的選擇率（基準 33.3%）、3 × 3 位置 × 付款方式矩陣、6 種次序各自的提交及選擇次數；可匯出 CSV、清除資料，並可排除 `override` 測試數據。

> ⚠️ **限制：** 本網站是純靜態網站，沒有後端，所有實驗資料只存在**每個瀏覽器自己的 localStorage**，無法彙集不同用戶的數據。要做真實實驗，需要把 `js/experiment.js` 中 `logEvent()` 的事件傳送到後端（例如免費的 Google Form / Google Sheets、Supabase 或 Firebase）。

**資源版本：** `index.html` 內所有 CSS / JS 以 `?v=v5` 作快取更新標記，更改檔案後請一併更新。

> 此為示範網站，結帳不會進行任何真實付款。

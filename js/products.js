/*
 * 產品資料 — 真實在售型號 (REAL, currently-sold models) · 參考價格 (REFERENCE PRICES)
 * ------------------------------------------------------------------
 * - 以下為真實品牌及型號；價格為香港參考價（港幣），於 2026-10-08 經網上搜尋核對
 *   官方香港網店／新聞稿或香港主要零售商（豐澤 Fortress、百老滙 Broadway、衛訊 Wilson 等）。
 * - price = 參考售價；oldPrice = 同一來源列出的建議零售價（只在來源有折扣時填寫）。
 * - 規格只收錄已從來源核實的項目；未能確認的細節一律省略。
 * - 價格及供應會隨時變動，只供參考。本站為示範／研究網站，並非任何品牌的官方或授權商店，
 *   亦與相關品牌無任何關係；產品名稱及商標屬各自擁有人所有。
 * - 產品圖片為本站自繪的離線 SVG 示意圖（js/art.js），並非官方產品相片。
 */
window.PRICE_CHECKED = '2026-10-08';

window.CATEGORIES = [
  { id: 'phone',     name: '手機',     icon: 'phone' },
  { id: 'laptop',    name: '手提電腦', icon: 'laptop' },
  { id: 'tablet',    name: '平板',     icon: 'tablet' },
  { id: 'headphone', name: '耳機',     icon: 'headphone' },
  { id: 'watch',     name: '智能手錶', icon: 'watch' },
  { id: 'accessory', name: '配件',     icon: 'accessory' }
];

window.PRODUCTS = [
  /* ---------- 手機 ---------- */
  { id: 'iphone-18-pro', category: 'phone', brand: 'Apple', name: 'iPhone 18 Pro（256GB）', price: 10499, color: '#7f1d1d', featured: true,
    desc: 'A20 Pro 晶片，4800 萬像素 Fusion 主鏡頭首度支援可變光圈，2026 年 9 月 18 日香港發售。',
    specs: ['6.3 吋 Super Retina XDR', 'A20 Pro 晶片', '4800 萬像素可變光圈主鏡頭', '影片播放最長 36 小時', 'Wi‑Fi 7（N1 晶片）', '256GB 起'],
    source: { name: 'Apple 香港新聞稿／網上商店', url: 'https://www.apple.com/hk/en/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/' } },
  { id: 'iphone-17', category: 'phone', brand: 'Apple', name: 'iPhone 17（256GB）', price: 7799, color: '#6d8fb3',
    desc: '6.3 吋 ProMotion 顯示屏配 A19 晶片，基本容量 256GB。',
    specs: ['6.3 吋 Super Retina XDR', 'ProMotion 技術', 'A19 晶片', '1800 萬像素 Center Stage 前置鏡頭', '256GB 起'],
    source: { name: 'Apple 香港網上商店', url: 'https://www.apple.com/hk/shop/buy-iphone/iphone-17' } },
  { id: 'galaxy-s26-ultra', category: 'phone', brand: 'Samsung', name: 'Galaxy S26 Ultra（12GB+256GB）', price: 9698, oldPrice: 10198, color: '#334155', featured: true,
    desc: 'Galaxy AI 旗艦，內置 Privacy Display 防窺顯示，機身厚 7.9mm、重 214g。',
    specs: ['6.9 吋 3120×1440 Dynamic AMOLED 2X', 'Snapdragon 8 Elite Gen 5 for Galaxy', '2 億像素主鏡頭', '5000mAh 電池', '12GB + 256GB'],
    source: { name: '衛訊 Wilson（建議零售價 HK$10,198）', url: 'https://www.wilsoncomm.com.hk/samsung-galaxy-s26-ultra-s9480?language=en' } },

  /* ---------- 手提電腦 ---------- */
  { id: 'macbook-air-13-m5', category: 'laptop', brand: 'Apple', name: 'MacBook Air 13 吋（M5）', price: 8999, color: '#8fb8d8', featured: true,
    desc: '無風扇輕薄設計，M5 晶片，基本容量提升至 512GB，支援 Wi‑Fi 7。',
    specs: ['13.6 吋 Liquid Retina', 'M5 晶片（10 核心 CPU）', '16GB 統一記憶體', '512GB SSD', '電池最長 18 小時', '2 個 Thunderbolt 4'],
    source: { name: 'Apple 香港新聞稿／網上商店', url: 'https://www.apple.com/hk/en/newsroom/2026/03/apple-introduces-the-new-macbook-air-with-m5/' } },
  { id: 'zenbook-14-um3406', category: 'laptop', brand: 'ASUS', name: 'ASUS Zenbook 14 OLED（UM3406GA）', price: 10998, oldPrice: 13998, color: '#1e293b', featured: true,
    desc: 'Copilot+ PC，NPU 高達 50 TOPS；全金屬機身通過 MIL-STD-810H 測試。',
    specs: ['14 吋 FHD 16:10 OLED', 'AMD Ryzen AI 7 445', '16GB LPDDR5X', '1TB SSD', '1.2kg・75Wh 電池'],
    source: { name: '百老滙 Broadway', url: 'https://www.broadwaylifestyle.com/products/asus-zenbook-14-um3406ga-jb7057w' } },
  { id: 'yoga-slim-7-ultra-14', category: 'laptop', brand: 'Lenovo', name: 'Lenovo Yoga Slim 7 Ultra 14（14IPH11）', price: 16999, color: '#475569',
    desc: '2026 年款 14 吋輕薄筆電，配備高解像度 120Hz OLED 螢幕。',
    specs: ['14 吋 2880×1800 OLED 120Hz', 'Intel Core Ultra 7 355', '32GB RAM', '1TB SSD', 'Windows 11 Home'],
    source: { name: 'Cyber-Pro（香港行貨）', url: 'https://www.cyber-pro.com.hk/products/lenovo-83qk002yhh-yoga-slim-7-ultra-14iph11-14-intel-ultra-7-355-32gb1tb-ssd' } },

  /* ---------- 平板 ---------- */
  { id: 'ipad-air-13-m4', category: 'tablet', brand: 'Apple', name: 'iPad Air 13 吋（M4）Wi‑Fi', price: 6099, oldPrice: 6299, color: '#7c6fb0', featured: true,
    desc: 'M4 晶片驅動，支援 Apple Pencil Pro 及 Magic Keyboard。',
    specs: ['13 吋顯示屏', 'M4 晶片（8 核心 CPU、9 核心 GPU）', '12GB RAM', '128GB 起', 'Wi‑Fi 版'],
    source: { name: '豐澤 Fortress 網上價（建議零售價 HK$6,299）', url: 'https://www.fortress.com.hk/en/product/ipad-air-13%E2%80%9D-m4-2026/p/BP_14077834?variant=14077834' } },
  { id: 'galaxy-tab-s12-plus', category: 'tablet', brand: 'Samsung', name: 'Galaxy Tab S12+ Wi‑Fi（12GB+256GB）', price: 9488, color: '#64748b',
    desc: '2026 年 10 月 7 日香港發售，機身厚 5.3mm，隨機附 S Pen。',
    specs: ['12.6 吋 2800×1752 Dynamic AMOLED 2X 120Hz', '天璣 9500 處理器', '12GB + 256GB', '10,600mAh 電池', 'IP68 防塵防水'],
    source: { name: 'Samsung 香港新聞稿（建議零售價）', url: 'https://www.samsung.com/hk/news/product/samsung-introduces-galaxy-tab-s12-series-the-ultimate-productivity-powerhouse-built-for-growth/' } },

  /* ---------- 耳機 ---------- */
  { id: 'airpods-pro-3', category: 'headphone', brand: 'Apple', name: 'AirPods Pro 3', price: 1849, color: '#9ca3af', featured: true,
    desc: '主動降噪效果較上代提升最多 2 倍，並新增運動時心率感應。',
    specs: ['主動降噪', '運動時心率感應', '開啟降噪聆聽最長 8 小時', 'IP57 抗汗抗水', '5 種尺寸耳塞'],
    source: { name: 'Apple 香港新聞稿／網上商店', url: 'https://www.apple.com/hk/en/newsroom/2025/09/introducing-airpods-pro-3-the-ultimate-audio-experience/' } },
  { id: 'sony-wh-1000xm6', category: 'headphone', brand: 'Sony', name: 'Sony WH-1000XM6 無線降噪耳機', price: 2799, oldPrice: 3699, color: '#1f2937', featured: true,
    desc: 'Sony 頭戴式旗艦降噪耳機，採用 QN3 處理器。',
    specs: ['頭戴式無線降噪', 'QN3 處理器', '最長 30 小時續航'],
    source: { name: '豐澤 Fortress（建議零售價 HK$3,699）', url: 'https://www.fortress.com.hk/en/product/wh-1000xm6-headphone/p/BP_13918697?variant=13918697' } },

  /* ---------- 智能手錶 ---------- */
  { id: 'apple-watch-s12', category: 'watch', brand: 'Apple', name: 'Apple Watch Series 12（42mm GPS）', price: 3199, color: '#57534e', featured: true,
    desc: '全新健康感測系統，每 5 秒讀取一次心率；2026 年 9 月 18 日發售。',
    specs: ['S11 晶片', '每 5 秒讀取心率', '鋁金屬錶殼配陶瓷盾', '42mm / 46mm 尺寸'],
    source: { name: 'Apple 香港網上商店（經 KONGGOK 報道核對）', url: 'https://www.apple.com/hk/shop/buy-watch/apple-watch' } },
  { id: 'galaxy-watch9', category: 'watch', brand: 'Samsung', name: 'Galaxy Watch9（40mm 藍牙）', price: 2898, color: '#0f766e',
    desc: 'BioActive 感應器，支援睡眠、血氧及心率等監測；機身厚 8.6mm。',
    specs: ['40mm / 44mm', 'Snapdragon Wear Elite（3nm）', '最高 3,000 nits 屏幕', '5ATM + IP68', '雙頻 GPS'],
    source: { name: 'Samsung 香港建議零售價（經 TechLab／csl 網店核對）', url: 'https://www.techlab.hk/p/gsmarena-galaxy-watch-ultra2-watch9' } },

  /* ---------- 配件 ---------- */
  { id: 'logitech-mx-master-4', category: 'accessory', brand: 'Logitech', name: 'Logitech MX Master 4 無線滑鼠', price: 849, oldPrice: 999, color: '#3f3f46',
    desc: '觸覺回饋 Haptic Sense Panel，可開啟 Actions Ring 快捷操作。',
    specs: ['Darkfield 感應器 200–8,000 DPI', 'Haptic Sense Panel', 'USB-C 充電，最長 70 日', 'Logi Bolt / 藍牙'],
    source: { name: '香港行貨價 HK$999，零售商促銷價（2026-10-08 搜尋）', url: 'https://support.logi.com/hc/en-us/articles/28321406604439-Specification-MX-Master-4' } },
  { id: 'apple-pencil-pro', category: 'accessory', brand: 'Apple', name: 'Apple Pencil Pro', price: 999, color: '#d4d4d8',
    desc: '支援擠壓手勢、筒身旋轉及觸覺回饋。',
    specs: ['擠壓手勢', '筒身旋轉', '觸覺回饋', '磁吸配對及充電'],
    source: { name: 'Apple 香港網上商店', url: 'https://www.apple.com/hk/shop/product/MX2D3ZA/A/apple-pencil-pro' } },
  { id: 'anker-nano-power-bank-10k', category: 'accessory', brand: 'Anker', name: 'Anker Nano 行動電源（10K, 45W）', price: 368, oldPrice: 399, color: '#2563eb',
    desc: '內置伸縮 USB-C 線，出門毋須另帶充電線（型號 A1638）。',
    specs: ['10,000mAh', '最高 45W 輸出', '內置伸縮 USB-C 線'],
    source: { name: 'DMA 泛音（Anker 香港定價 HK$399）', url: 'https://www.dmag.com.hk/products/anker-nano-power-bank-10k-45w-built-in-retractable-usb-c-cable-a1638' } },
  { id: 'anker-prime-160w', category: 'accessory', brand: 'Anker', name: 'Anker Prime 160W 充電器', price: 999, color: '#52525b',
    desc: '三口 USB-C 氮化鎵充電器，配智能顯示屏。',
    specs: ['160W 總輸出', '3 個 USB-C 埠', '動態電力分配', '智能顯示屏・App 遙距操控'],
    source: { name: 'Anker 香港網店', url: 'https://anker-hk.com/products/anker-prime-charger-160w-smart-display' } }
];

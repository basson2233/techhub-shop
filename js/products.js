/*
 * ⚠️ 示例資料 (EXAMPLE / SAMPLE DATA ONLY)
 * 以下所有產品名稱、價格、規格及描述均為虛構示範資料，
 * 並非真實產品，亦不代表任何品牌。正式上線前請替換為真實商品資料（或改為從後端 API 載入）。
 * All product names, prices and descriptions below are made-up demo data.
 */
window.CATEGORIES = [
  { id: 'phone',     name: '手機',     icon: 'phone' },
  { id: 'laptop',    name: '手提電腦', icon: 'laptop' },
  { id: 'tablet',    name: '平板',     icon: 'tablet' },
  { id: 'headphone', name: '耳機',     icon: 'headphone' },
  { id: 'watch',     name: '智能手錶', icon: 'watch' },
  { id: 'accessory', name: '配件',     icon: 'accessory' }
];

window.PRODUCTS = [
  { id: 'p1',  category: 'phone', name: 'Nova X1 智能手機', price: 5999, oldPrice: 6499, color: '#4f46e5', rating: 4.8, featured: true,
    desc: '6.7 吋 OLED 120Hz 螢幕，三鏡頭 50MP 主攝，全日續航。',
    specs: ['6.7 吋 OLED 120Hz', '256GB 儲存', '50MP 三鏡頭', '5000mAh 電池'] },
  { id: 'p2',  category: 'phone', name: 'Nova Lite 5G', price: 2799, color: '#0ea5e9', rating: 4.5,
    desc: '輕巧 5G 入門手機，性價比之選，雙卡雙待。',
    specs: ['6.4 吋 LCD', '128GB 儲存', '48MP 雙鏡頭', '4500mAh 電池'] },
  { id: 'p3',  category: 'phone', name: 'Fold Prism 摺機', price: 11999, color: '#db2777', rating: 4.7, featured: true,
    desc: '可摺疊大屏，一機兼顧手機與平板體驗。',
    specs: ['7.6 吋摺疊屏', '512GB 儲存', '12GB RAM', '無線充電'] },
  { id: 'p4',  category: 'laptop', name: 'AeroBook 14 輕薄筆電', price: 7899, oldPrice: 8599, color: '#64748b', rating: 4.6, featured: true,
    desc: '1.2kg 鋁合金機身，14 吋 2.8K 螢幕，續航長達 18 小時。',
    specs: ['14 吋 2.8K', '16GB RAM', '512GB SSD', '18 小時續航'] },
  { id: 'p5',  category: 'laptop', name: 'Titan G16 電競筆電', price: 13499, color: '#dc2626', rating: 4.9,
    desc: '高效能獨立顯示卡，240Hz 螢幕，RGB 背光鍵盤。',
    specs: ['16 吋 240Hz', '32GB RAM', '1TB SSD', '獨立顯示卡'] },
  { id: 'p6',  category: 'laptop', name: 'StudyMate 13', price: 3999, color: '#16a34a', rating: 4.3,
    desc: '學生首選，輕巧耐用，滿足上課及文書需要。',
    specs: ['13.3 吋 FHD', '8GB RAM', '256GB SSD', '10 小時續航'] },
  { id: 'p7',  category: 'tablet', name: 'Slate Pro 11', price: 5299, color: '#7c3aed', rating: 4.7, featured: true,
    desc: '11 吋高刷新率平板，支援手寫筆與鍵盤套。',
    specs: ['11 吋 120Hz', '256GB 儲存', '支援手寫筆', 'Wi-Fi 6'] },
  { id: 'p8',  category: 'tablet', name: 'Slate Mini 8', price: 2199, color: '#f59e0b', rating: 4.4,
    desc: '單手可握的 8 吋平板，閱讀追劇好拍檔。',
    specs: ['8.3 吋 LCD', '64GB 儲存', '立體聲喇叭', '7000mAh 電池'] },
  { id: 'p9',  category: 'headphone', name: 'SoundWave 降噪耳機', price: 1899, oldPrice: 2299, color: '#111827', rating: 4.8, featured: true,
    desc: '主動降噪頭戴式耳機，30 小時續航，舒適耳罩。',
    specs: ['主動降噪', '30 小時續航', '藍牙 5.3', '快速充電'] },
  { id: 'p10', category: 'headphone', name: 'AirBuds 真無線耳機', price: 899, color: '#e11d48', rating: 4.5, featured: true,
    desc: '輕巧入耳式設計，IPX5 防水，運動通勤皆宜。',
    specs: ['真無線', 'IPX5 防水', '24 小時連充電盒', '觸控操作'] },
  { id: 'p11', category: 'watch', name: 'Pulse Watch S', price: 2499, color: '#0d9488', rating: 4.6, featured: true,
    desc: '心率、血氧、睡眠監測，內置 GPS，防水 50 米。',
    specs: ['1.9 吋 AMOLED', '內置 GPS', '50 米防水', '7 日續航'] },
  { id: 'p12', category: 'watch', name: 'Pulse Band 運動手環', price: 499, color: '#ea580c', rating: 4.2,
    desc: '輕量運動手環，記錄步數及卡路里，14 日超長續航。',
    specs: ['1.1 吋彩屏', '14 日續航', '睡眠監測', '50 米防水'] },
  { id: 'p13', category: 'accessory', name: 'PowerCube 65W 充電器', price: 299, color: '#2563eb', rating: 4.7, featured: true,
    desc: '氮化鎵快充，三口輸出，可同時為手機及筆電充電。',
    specs: ['65W 輸出', '2C + 1A', '氮化鎵技術', '可摺疊插腳'] },
  { id: 'p14', category: 'accessory', name: 'MagCharge 流動電源 10000mAh', price: 359, color: '#9333ea', rating: 4.4,
    desc: '磁吸式無線充電流動電源，輕薄便攜。',
    specs: ['10000mAh', '磁吸無線充電', '20W 有線快充', 'LED 電量顯示'] },
  { id: 'p15', category: 'accessory', name: 'KeyFlow 無線鍵盤', price: 649, color: '#475569', rating: 4.5,
    desc: '低噪音剪刀腳鍵盤，可連接三部裝置快速切換。',
    specs: ['藍牙 / 2.4G', '三裝置切換', '充電式', '中英鍵位'] },
  { id: 'p16', category: 'accessory', name: 'GlideMouse 人體工學滑鼠', price: 399, color: '#0891b2', rating: 4.3,
    desc: '符合人體工學設計，長時間使用亦不易疲勞。',
    specs: ['4000 DPI', '靜音按鍵', '藍牙連接', '70 日續航'] }
];

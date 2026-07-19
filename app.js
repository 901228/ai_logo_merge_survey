// script.js — 帶「範例起始頁」版本
const STORAGE_KEY = "ml-image-study-v1";
const DATA_URL = "./data.json";
const SUBMIT_ENDPOINT = "https://script.google.com/macros/s/AKfycbyp0w_CL64BH-BfMQS7c6Ym8MtdsimoDiHNp6YiD5ZLhIoVnYLBSkXpeqZYbuvWf47f/exec";

const container = document.getElementById("surveyContainer");

// 主題
if (window.Survey && Survey.StylesManager) {
    //Survey.StylesManager.applyTheme("modern");
} else {
    container.innerHTML = warn("無法載入 SurveyJS（請改用 vendor 離線檔或檢查 CDN 連線）");
}

// 載題庫
fetch(DATA_URL)
    .then(r => { if (!r.ok) throw new Error(`讀取 data.json 失敗：HTTP ${r.status}`); return r.json(); })
    .then(cfg => {
        if (!cfg || !Array.isArray(cfg.cases)) throw new Error("data.json 缺少 cases 陣列");
        buildSurvey(cfg);
    })
    .catch(err => {
        console.error(err);
        container.innerHTML = warn(`無法載入題庫：${String(err.message)}<br>請確認 <b>data.json</b> 與 <b>images/</b> 路徑/大小寫。`);
    });

function buildSurvey(cfg) {
    const pages = [];

    // ===== 第 1 頁：範例與說明頁 =====
    // 檢查 data.json 中是否有我們定義好的 instructionExamples 物件
    if (cfg.instructionExamples) {
        const examples = cfg.instructionExamples;

        // 動態生成 "理想範例" 的 HTML 卡片
        // 我們使用 .map() 迴圈來處理 good 陣列中的每一個範例
        const goodExampleCardsHTML = examples.good.map(s => `
      <div class="sampleBlock ideal">
        <div class="sampleHeader">${escapeHTML(s.title || "理想範例")}</div>
        <div class="sampleRow">
          <div class="sampleCol"><img class="sampleImg" src="${s.logo}" alt="設計圖"><div class="sampleLabel">設計圖</div></div>
          <div class="sampleCol"><img class="sampleImg" src="${s.material}" alt="材質圖"><div class="sampleLabel">材質圖</div></div>
          <div class="sampleCol resultCol">
            <img class="sampleImg" src="${s.result}" alt="理想結果">
            <div class="checkmark">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#27ae60" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.285 6.709a1 1 0 0 0-1.414-1.418l-9.192 9.192-4.243-4.243a1 1 0 0 0-1.414 1.414l4.95 4.95a1 1 0 0 0 1.414 0l9.899-9.895z"/>
              </svg>
            </div>
            <div class="sampleLabel">理想結果</div>
          </div>

        </div>
      </div>
    `).join("");

        // 組裝完整的介紹頁 HTML
        const introHTML = `
      <div class="intro-page">

        <div class="intro-section">
          <h3>研究簡介</h3>
          <p>您好，感謝您撥冗參與本次的研究問卷。<br>本問卷旨在評估將「設計圖案」與<b>真實材質樣本</b>（如刺繡、金屬、皮革等）結合時的視覺表現：好的結果應該讓圖案看起來像是真的<b>由該材質製成</b>——紋理與質感自然，同時仍能一眼認出原本的圖案。</p>
        </div>

        <div class="intro-section">
          <h3>任務說明</h3>
          <p>接下來的每一題，您都會看到「設計圖」（原始圖案）、「材質圖」（要呈現的目標材質樣本），以及由不同方法生成的<b>多張結果圖</b>。<br>請從這些結果圖中，選出您認為<b>整體表現最佳</b>的一張。</p>
        </div>

        <div class="intro-section">
          <h3>判斷標準與範例</h3>
          <p style="color:#555; margin: 4px 0 12px;">請綜合考量以下三點，選出<b>整體最佳</b>的一張，沒有標準答案，依您的整體視覺感受即可：</p>
          <ol style="padding-left: 20px; margin: 0 0 16px; color:#555; line-height:1.7;">
            <li><b>圖案辨識度</b>：主體的形狀、色彩與重要細節是否清楚保留，能否一眼認出原本的圖案。</li>
            <li><b>材質真實感</b>：是否真實呈現該材質應有的紋理與質感（例如刺繡的線材走向、金屬的光澤反射、皮革的表面紋路與立體感），看起來像真的由該材質製成，而不只是「貼圖」或「印刷」。</li>
            <li><b>整體協調</b>：圖案與材質是否自然結合、視覺上平衡，而不是某一方過度壓過另一方。</li>
          </ol>
          <div class="sampleHeader" style="font-size: 1.2em; color: #27ae60; margin-top: 15px;">✅ 理想的範例</div>
          <div class="sampleSubHeader">說明：能清楚辨識圖案的原始結構與色彩，同時又能真實、自然地呈現該材質的紋理與質感。</div>
          ${goodExampleCardsHTML}

          <div class="sampleHeader" style="font-size: 1.2em; color: #c0392b; margin-top: 30px;">❌ 不理想的範例 </div>

          <div class="sampleBlock bad">
            <div class="sampleSubHeader"><b>1. 結構模糊 :</b> 圖案的輪廓變得模糊、被材質紋理吃掉、重要細節消失，失去了原本的辨識度。</div>
            <div class="sampleRow">
              <div class="sampleCol"><img class="sampleImg" src="${examples.structureLoss.logo}" alt="設計圖"><div class="sampleLabel">設計圖</div></div>
              <div class="sampleCol"><img class="sampleImg" src="${examples.structureLoss.material}" alt="材質圖"><div class="sampleLabel">材質圖</div></div>
              <div class="sampleCol resultCol">
                <img class="sampleImg" src="${examples.structureLoss.result}" alt="結構失真結果">
                <div class="checkmark">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="#e74c3c" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.364 5.636a1 1 0 0 0-1.414 0L12 10.586 7.05 5.636a1 1 0 0 0-1.414 1.414L10.586 12l-4.95 4.95a1 1 0 1 0 1.414 1.414L12 13.414l4.95 4.95a1 1 0 0 0 1.414-1.414L13.414 12l4.95-4.95a1 1 0 0 0 0-1.414z"/>
                  </svg>
                </div>
                <div class="sampleLabel">結構失真結果</div>
              </div>
            </div>
          </div>

          <div class="sampleBlock bad">
            <div class="sampleSubHeader"><b>2. 材質感不足 :</b> 圖案結構雖然清晰，但看起來只是「貼圖 / 印刷」，未能呈現該材質的紋理與立體質感。</div>
            <div class="sampleRow">
              <div class="sampleCol"><img class="sampleImg" src="${examples.textureLoss.logo}" alt="設計圖"><div class="sampleLabel">設計圖</div></div>
              <div class="sampleCol"><img class="sampleImg" src="${examples.textureLoss.material}" alt="材質圖"><div class="sampleLabel">材質圖</div></div>
              <div class="sampleCol resultCol">
                <img class="sampleImg" src="${examples.textureLoss.result}" alt="材質不足結果">
                <div class="checkmark">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="#e74c3c" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.364 5.636a1 1 0 0 0-1.414 0L12 10.586 7.05 5.636a1 1 0 0 0-1.414 1.414L10.586 12l-4.95 4.95a1 1 0 1 0 1.414 1.414L12 13.414l4.95 4.95a1 1 0 0 0 1.414-1.414L13.414 12l4.95-4.95a1 1 0 0 0 0-1.414z"/>
                  </svg>
                </div>
                <div class="sampleLabel">材質不足結果</div>
              </div>
            </div>
          </div>
        </div>

        <div class="intro-section">
            <h3>注意事項</h3>
            <ul style="padding-left: 20px; margin: 0; color: #555; line-height:1.7;">
                <li>本問卷共 ${cfg.cases.length} 題，預計花費約 5–10 分鐘。</li>
                <li>每題的結果圖<b>順序皆為隨機呈現</b>，與方法無關，請僅依畫面內容作答。</li>
                <li>本問卷<b>沒有標準答案</b>，請依整體視覺感受選擇。</li>
                <li>建議使用色彩顯示正常的螢幕、在光線充足的環境下填答。</li>
                <li>作答進度會自動保存於本機，中途離開後可從原本題目繼續。</li>
            </ul>
        </div>

      </div>`;

        pages.push({ name: "intro", elements: [{ type: "html", name: "intro_html", html: introHTML }] });
    }

    // =======================================================
    // ===== 新增：第 2 頁，使用者資料頁 =====
    // =======================================================
    const demographicsPage = {
        name: "user_data", // 頁面名稱
        elements: [
            {
                type: "html",
                name: "user_data_intro",
                html: "<h3>基本資料</h3>"
            },
            {
                type: "text",
                name: "user_name",
                title: "您的姓名（非必填）",
                isRequired: false
            },
            {
                type: "radiogroup",
                name: "user_gender",
                title: "您的性別",
                isRequired: true,
                choices: [
                    "男性",
                    "女性",
                    "其他"
                ]
            },
            {
                type: "radiogroup",
                name: "user_age",
                title: "您的年齡段",
                isRequired: true,
                choices: [
                    "25 歲及以下",
                    "26-35 歲",
                    "36-45 歲",
                    "46-55 歲",
                    "55 歲及以上"
                ]
            },
            {
                type: "radiogroup",
                name: "user_design_experience",
                title: "您是否有設計相關背景？",
                isRequired: true,
                choices: [
                    "是（設計師、美術、視覺相關）",
                    "否"
                ]
            },
            {
                type: "radiogroup",
                name: "user_design_software_experience",
                title: "您使用設計軟體的經驗",
                isRequired: true,
                choices: [
                    "沒有經驗",
                    "偶爾使用",
                    "經常使用",
                    "專業使用者"
                ]
            }
        ]
    };

    // 將這個新頁面加到所有頁面陣列中
    pages.push(demographicsPage);

    // ===== 後續各題 =====
    cfg.cases.forEach((c, idx) => {

        const intro = `
      <div class="intro stickyIntroBlock">
        <div>
        第 ${idx + 1} 題
        </div>
        <div class="qPairRow">
          <div class="qPairCol">
            <img class="qPairImg" src="${c.material}" alt="material" onerror="this.style.opacity=0.25">
            <div class="qPairLabel">材質圖</div>
          </div>
          <div class="qPairCol">
            <img class="qPairImg" src="${c.logo}" alt="logo" onerror="this.style.opacity=0.25">
            <div class="qPairLabel">設計圖</div>
          </div>
        </div>
      </div>`;


        const choices = shuffle((c.options || []).map(o => ({ value: o.value, imageLink: o.image, text: o.value })));

        pages.push({
            name: c.id,
            elements: [
                { type: "html", name: `${c.id}_intro`, html: intro },
                {
                    type: "imagepicker", name: c.id, title: "請比較各張結果圖，選出您認為整體表現最佳的一張（圖案辨識度 × 材質真實感 × 整體協調）。",
                    isRequired: true, imageHeight: 250, imageWidth: 250, choicesOrder: "none", showLabel: false, choices
                }
            ]
        });
    });

    const json = {
        title: cfg.title || "圖案 × 材質 視覺評估問卷",
        firstPageIsStarted: !!(cfg.instructionExamples),
        startSurveyText: "開始作答 ▶", // 若 firstPageIsStarted=true，會出現在第一頁下方
        showProgressBar: "top",
        progressBarType: "questions",
        showQuestionNumbers: "off",
        pageNextText: "下一題 ▶",
        pagePrevText: "◀ 上一題",
        completeText: "提交",
        pages
    };

    const survey = new Survey.Model(json);

    // 讓「開始作答」按鈕頁面回到頂端
    survey.onStarted.add(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    })

    // 1. 【讀取進度】在 survey 載入初期，嘗試從 localStorage 讀取舊進度
    const savedProgressJSON = localStorage.getItem(STORAGE_KEY);
    if (savedProgressJSON) {
        try {
            const savedProgress = JSON.parse(savedProgressJSON);
            // 恢復答題內容
            if (savedProgress.data) {
                survey.data = savedProgress.data;
            }
            // 恢復上次所在的頁碼 (關鍵！)
            if (typeof savedProgress.currentPageNo !== 'undefined') {
                survey.currentPageNo = savedProgress.currentPageNo - 1;
                survey.firstPageIsStarted = false;
            }
        } catch (e) {
            console.error("無法解析儲存的進度", e);
            localStorage.removeItem(STORAGE_KEY); // 如果解析失敗，清除壞掉的資料
        }
    }

    // 2. 【儲存進度】當答案或頁面改變時，將新進度存回 localStorage
    function saveProgress() {
        const dataToSave = {
            currentPageNo: survey.currentPageNo, // 儲存目前的頁碼
            data: survey.data                 // 儲存所有答案
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }

    survey.onValueChanged.add(saveProgress);
    survey.onCurrentPageChanged.add(() => {
        saveProgress();
        // 換頁時回到頁面頂端
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 送出
    survey.onComplete.add(async (sender) => {

        // 先取得 IP
        const ipInfo = await fetch('https://ipinfo.io/json').then(res => res.json());
        const ip = ipInfo.ip || '';

        // 組合 UA + IP
        const uaWithIp = navigator.userAgent + (ip ? ` [IP: ${ip}]` : '');

        const payload = {
            ts: new Date().toISOString(),
            ua: uaWithIp,//navigator.userAgent,
            answers: sender.data
        };
        console.log("提交結果", payload);

        if (SUBMIT_ENDPOINT) {
            try {
                await fetch(SUBMIT_ENDPOINT, {
                    method: "POST",
                    // 用 text/plain 降低預檢機率（GAS 端仍以 JSON.parse 嘗試解析）
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify(payload)
                });
                alert("已提交，感謝你的填答！");
            } catch (e) {
                alert("送出失敗，但你的答案已保存在本機。稍後再試。");
                console.error(e);
            }
        } else {
            alert("測試模式：結果已在瀏覽器 Console 顯示。");
        }
        localStorage.removeItem(STORAGE_KEY);
    });


    container.innerHTML = "";
    survey.render(container);
}

// 工具
function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function warn(html) { return `<div style="padding:16px;background:#fff3cd;border:1px solid #ffeeba;border-radius:8px;color:#856404">${html}</div>`; }
function escapeHTML(s) { return String(s || "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m])); }

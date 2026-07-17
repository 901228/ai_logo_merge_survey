function doPost(e) {
    try {
        // ===== 設定你的試算表 ID =====
        var SHEET_ID = "1hY67tZRfDkMNZad4-ipwHq24mR63p0Vmtr6npz1apJs";
        var SHEET_NAME = "工作表1";

        // 解析收到的資料
        var data = JSON.parse(e.postData.contents);

        // 開啟試算表
        var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

        let answers = data.answers;
        let newRow = [
            data.ts,  // 時間戳記
            data.ua,  // User Agent (含 IP)
            answers["user_name"],    // 姓名
            answers["user_gender"],  // 性別
            answers["user_age"],     // 年齡
            answers["user_design_experience"],          // 是否有設計相關背景
            answers["user_design_software_experience"]  // 是否有設計相關背景
        ];

        // for (var key in answers) {
        //   if (key.startsWith("q")) newRow.push(answers[key])
        // }
        for (let key of ["q001", "q002", "q005", "q006", "q008", "q009", "q010", "q011", "q013", "q015", "q017", "q018", "q020", "q021", "q023", "q024", "q025", "q026", "q027", "q028", "q030", "q032", "q033", "q034", "q035", "q036", "q037", "q038", "q039", "q040", "q047", "q048", "q049", "q051", "q053", "q055", "q058", "q059", "q062", "q063", "q064", "q065", "q067", "q068", "q069", "q070", "q071", "q072", "q073", "q075"]) {
            newRow.push(answers[key]);
        }

        newRow.push(JSON.stringify(data.answers)); // 所有答案（JSON 格式）

        // 寫入一列資料
        sheet.appendRow(newRow);

        // 回應成功
        return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            message: '已收到您的回覆'
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // 回應錯誤
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

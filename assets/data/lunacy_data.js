let lunacyData = null;
(() => {
    lunacyData = {
        // 광기 수급 데이터
        supply: {
            // 무료 수급 (주 단위)
            weeklyInspection: 300,      // 점검
            weeklyMirror: 750,          // 거울 던전
            // 무료 수급 (일일 기준)
            monthlySmallDaily: 39,     // 월정액(소) - 1일당
            monthlyLargeDaily: 65      // 월정액(대) - 1일당
        },
        
        // 광기 소모 데이터
        consumption: {
            paidGachaPerDay: 13         // 유료 단챠 1회당 광기 소모 (일일 기준)
        }
    };
})();


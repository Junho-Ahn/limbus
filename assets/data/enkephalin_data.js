let enkephalinData = null;
(() => {
    enkephalinData = {
        // 광기 상품 데이터
        lunacyItems: [
            { name: "광기 0.11만", firstTimeAmount: 140, amount: 70, price: 1100, isMonthly: false },
            { name: "묶음 0.51만", firstTimeAmount: 588, amount: 325, price: 5100, isMonthly: false },
            { name: "다발 1.7만", firstTimeAmount: 2028, amount: 1170, price: 17000, isMonthly: false },
            { name: "상자 3.3만", firstTimeAmount: 4294, amount: 2470, price: 33000, isMonthly: false },
            { name: "더미 5.5만", firstTimeAmount: 8206, amount: 4745, price: 55000, isMonthly: false },
            { name: "모음 11만", firstTimeAmount: 16672, amount: 9685, price: 110000, isMonthly: false },
            { name: "월정액", amount: 2600, price: 9900, isMonthly: true },
            { name: "월정액 소형", amount: 1300, price: 4400, isMonthly: true },
            { name: "월정액 2종", amount: 3900, price: 14300, isMonthly: true }
        ],
        
        // 경험치 던전 데이터 (번호별로 그룹화)
        expDungeons: {
            1: {
                manual: { tickets: [6, 7, 0, 0], enke: 40 },
                skip: { tickets: [9, 11, 0, 0], enke: 80 }
            },
            2: {
                manual: { tickets: [0, 3, 3, 0], enke: 40 },
                skip: { tickets: [0, 5, 5, 0], enke: 80 }
            },
            3: {
                manual: { tickets: [0, 4, 4, 0], enke: 40 },
                skip: { tickets: [0, 6, 6, 0], enke: 80 }
            },
            4: {
                manual: { tickets: [0, 0, 3, 2], enke: 60 },
                skip: { tickets: [0, 0, 5, 3], enke: 120 }
            },
            5: {
                manual: { tickets: [0, 4, 4, 2], enke: 60 },
                skip: { tickets: [0, 6, 6, 3], enke: 120 }
            },
            6: {
                manual: { tickets: [0, 2, 2, 4], enke: 60 },
                skip: { tickets: [0, 3, 3, 6], enke: 120 }
            },
            7: {
                manual: { tickets: [0, 4, 4, 4], enke: 60 },
                skip: { tickets: [0, 6, 6, 6], enke: 120 }
            },
            8: {
                manual: { tickets: [0, 4, 2, 6], enke: 60 },
                skip: { tickets: [0, 6, 3, 9], enke: 120 }
            }
        },
        
        // 티켓 가치
        ticketValues: [50, 200, 1000, 3000],
        
        // 충전 증가폭
        chargeIncrement: 26,
        
        // 현금 경험치 패키지
        cashExpPackages: [
            { name: "주간", ticket3: 25, ticket4: 35, price: 9900 },
            { name: "월간1", ticket3: 70, ticket4: 80, price: 28000 },
            { name: "월간2", ticket3: 95, ticket4: 160, price: 46000 },
            { name: "월간3", ticket3: 165, ticket4: 325, price: 90000 }
        ],
        
        // 주간 엔케팔린 패키지
        weeklyEnkePackage: {
            enke: 1200,
            price: 9900
        }
    };
})();


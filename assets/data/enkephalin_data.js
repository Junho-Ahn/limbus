let enkephalinData = null;
(() => {
    enkephalinData = {
        // 광기 상품 데이터
        lunacyItems: [
            { name: "광기 1,100원", firstTimeAmount: 140, amount: 70, price: 1100 },
            { name: "묶음 5,100원", firstTimeAmount: 588, amount: 325, price: 5100 },
            { name: "다발 17,000원", firstTimeAmount: 2028, amount: 1170, price: 17000 },
            { name: "상자 33,000원", firstTimeAmount: 4294, amount: 2470, price: 33000 },
            { name: "더미 55,000원", firstTimeAmount: 8206, amount: 4745, price: 55000 },
            { name: "모음 110,000원", firstTimeAmount: 16672, amount: 9685, price: 110000 }
        ],
        
        // 경험치 던전 데이터 (번호별로 그룹화, 스킵 데이터는 매뉴얼 기반으로 자동 생성)
        expDungeons: {
            1: {
                manual: { tickets: [6, 7, 0, 0], enke: 40 }
            },
            2: {
                manual: { tickets: [0, 3, 3, 0], enke: 40 }
            },
            3: {
                manual: { tickets: [0, 4, 4, 0], enke: 40 }
            },
            4: {
                manual: { tickets: [0, 0, 3, 2], enke: 60 }
            },
            5: {
                manual: { tickets: [0, 4, 4, 2], enke: 60 }
            },
            6: {
                manual: { tickets: [0, 2, 2, 4], enke: 60 }
            },
            7: {
                manual: { tickets: [0, 4, 4, 4], enke: 60 }
            },
            8: {
                manual: { tickets: [0, 4, 2, 6], enke: 60 }
            },
            9: {
                manual: { tickets: [0, 6, 6, 6], enke: 60 }
            }
        },
        
        // 티켓 가치
        ticketValues: [50, 200, 1000, 3000],
        
        // 충전 증가폭
        chargeIncrement: 26,
        
        // 현금 경험치 패키지
        cashExpPackages: [
            { name: "주간", ticket3: 20, ticket4: 50, price: 9900 },
            { name: "월간1", ticket3: 80, ticket4: 100, price: 28000 },
            { name: "월간2", ticket3: 72, ticket4: 210, price: 46000 },
            { name: "월간3", ticket3: 192, ticket4: 400, price: 90000 }
        ],
        
        // 주간 엔케팔린 패키지
        weeklyEnkePackage: {
            enke: 1200,
            price: 9900
        }
    };
})();


let deck_code_generator_page = null;
(() => {
    // 12명의 캐릭터 정보를 object로 보관
    const sinners = [
        { name: "이상" },
        { name: "파우스트" },
        { name: "돈키호테" },
        { name: "료슈" },
        { name: "뫼르소" },
        { name: "홍루" },
        { name: "히스클리프" },
        { name: "이스마엘" },
        { name: "로쟈" },
        { name: "싱클레어" },
        { name: "오티스" },
        { name: "그레고르" }
    ];
    // 12칸(6x2) 그리드 아이템 생성
    const gridItems = sinners.map((sinner, i) =>
        Structure.write({
            classList: ["deck_code_generator_page-cell"],
            content: sinner.name
        })
    );

    deck_code_generator_page = Structure.write({
        classList: ["deck_code_generator_page"],
        children: {
            grid: Structure.write({
                classList: ["deck_code_generator_page-grid"],
                children: Object.fromEntries(
                    gridItems.map((item, i) => [
                        `cell${i + 1}`,
                        item
                    ])
                )
            })
        }
    });
})();

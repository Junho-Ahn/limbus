let deck_code_generator_page = null;
(() => {
    // 12칸(6x2) 그리드 아이템 생성
    const gridItems = Array.from({ length: 12 }, (_, i) =>
        Structure.write({
            classList: ["deck_code_generator_page-cell"],
            content: `${i + 1}`
        })
    );

    deck_code_generator_page = Structure.write({
        classList: ["deck_code_generator_page"],
        children: {
            grid: Structure.write({
                classList: ["deck_code_generator_page-grid"],
                children: gridItems
            })
        }
    });
})();

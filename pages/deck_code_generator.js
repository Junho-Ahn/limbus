let deck_code_generator_page = null;
(() => {
    const { sinners } = formationData;
    // 12개 셀 children 객체 생성
    const gridChildren = {};
    for (let i = 0; i < 12; i++) {
        gridChildren[`cell${i + 1}`] = Structure.write({
            classList: ["deck_code_generator_page-cell"],
            children: {
                name: Structure.write({
                    classList: ["deck_code_generator_page-cell-name"],
                    content: sinners[i].name
                }),
                identityDisplay: Structure.write({
                    classList: ["deck_code_generator_page-identity-display"],
                    content: "테스트"
                })
            }
        });
    }
    deck_code_generator_page = Structure.write({
        classList: ["deck_code_generator_page"],
        children: {
            grid: Structure.write({
                classList: ["deck_code_generator_page-grid"],
                children: gridChildren
            })
        }
    });
})();

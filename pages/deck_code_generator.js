let deck_code_generator_page = null;
(() => {
    const { sinners } = formationData;
    // 테스트용: 각 셀의 선택 UI 오픈 여부 (임시로 12개 중 첫 번째만 true)
    const openSelector = Array(12).fill(false);
    openSelector[0] = true; // 첫 번째 셀만 열려있게 테스트

    const gridChildren = {};
    for (let i = 0; i < 12; i++) {
        gridChildren[`cell${i + 1}`] = Structure.write({
            classList: ["deck_code_generator_page-cell"],
            children: {
                identity_display: Structure.write({
                    classList: ["deck_code_generator_page-identity_display"],
                    content: "테스트"
                }),
                name_area: Structure.write({
                    classList: ["deck_code_generator_page-name_area"],
                    content: sinners[i].name
                }),
                selector_test: openSelector[i]
                    ? Structure.write({
                        classList: ["deck_code_generator_page-selector_test"],
                        children: Object.fromEntries(
                            Array.from({length: 12}, (_, j) => [
                                `option_${j+1}`,
                                Structure.write({
                                    classList: ["deck_code_generator_page-selector_test_option"],
                                    content: `옵션${j+1}`
                                })
                            ])
                        )
                    })
                    : null
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

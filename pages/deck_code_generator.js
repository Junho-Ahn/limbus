let deck_code_generator_page = null;
(() => {
    const { sinners, identities } = formationData;
    // 테스트용: 각 셀의 선택 UI 오픈 여부 (임시로 12개 중 첫 번째만 true)
    const openSelector = Array(12).fill(false);
    openSelector[0] = true; // 첫 번째 셀만 열려있게 테스트

    const gridChildren = {};
    for (let i = 0; i < 12; i++) {
        // 기본값: 1번 인격
        const defaultIdentity = identities[i][1]?.name || "";
        // 모든 인격 옵션
        const identityOptions = Object.entries(identities[i]).map(([id, data]) => [
            `option_${id}`,
            Structure.write({
                classList: ["deck_code_generator_page-selector_test_option"],
                content: data.name
            })
        ]);
        gridChildren[`cell${i + 1}`] = Structure.write({
            classList: ["deck_code_generator_page-cell"],
            children: {
                identity_display: Structure.write({
                    classList: ["deck_code_generator_page-identity_display"],
                    content: "테스트"
                }),
                name_area: Structure.write({
                    classList: ["deck_code_generator_page-name_area"],
                    content: defaultIdentity
                }),
                selector_test: openSelector[i]
                    ? Structure.write({
                        classList: ["deck_code_generator_page-selector_test"],
                        children: Object.fromEntries(identityOptions)
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

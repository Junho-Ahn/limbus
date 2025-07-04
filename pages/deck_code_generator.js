let deck_code_generator_page = null;
(() => {
    const { sinners, identities } = formationData;
    // 선택 UI 오픈 인덱스 (없으면 null)
    let openSelectorIdx = null;

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
        const isOpen = openSelectorIdx === i;
        gridChildren[`cell${i + 1}`] = Structure.write({
            classList: ["deck_code_generator_page-cell"],
            children: {
                identity_display: Structure.write({
                    classList: ["deck_code_generator_page-identity_display"],
                    content: defaultIdentity,
                    events: {
                        click: e => {
                            e.stopPropagation();
                            openSelectorIdx = i;
                            rerender();
                        }
                    }
                }),
                name_area: Structure.write({
                    classList: ["deck_code_generator_page-name_area"],
                    content: sinners[i].name,
                    events: {
                        click: e => {
                            e.stopPropagation();
                            openSelectorIdx = i;
                            rerender();
                        }
                    }
                }),
                selector_test: Structure.write({
                    classList: [
                        "deck_code_generator_page-selector_test",
                        isOpen ? "deck_code_generator_page-selector_test--show" : ""
                    ],
                    children: Object.fromEntries(identityOptions)
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
        },
        events: {
            click: () => {
                if (openSelectorIdx !== null) {
                    openSelectorIdx = null;
                    rerender();
                }
            }
        }
    });
})();

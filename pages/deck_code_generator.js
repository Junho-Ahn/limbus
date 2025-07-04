let deck_code_generator_page = null;
(() => {
    const { sinners, identities, egos } = formationData;

    const sinnerCell = {};
    for (let i = 0; i < 12; i++) {
        // 기본값: 1번 인격
        const defaultIdentity = identities[i][1]?.name || "";
        // 모든 인격 옵션
        const identityOptions = Object.entries(identities[i]).map(([id, data]) => [
            `option_${id}`,
            Structure.write({
                classList: ["deck_code_generator_page-identity_selection_option"],
                content: data.name
            })
        ]);
        sinnerCell[`cell${i + 1}`] = Structure.write({
            classList: ["deck_code_generator_page-cell"],
            children: {
                ego_button: Structure.write({
                    tagName: "button",
                    classList: ["deck_code_generator_page-ego_button"],
                    content: "E.G.O"
                }),
                identity_display: Structure.write({
                    classList: ["deck_code_generator_page-identity_display"],
                    content: defaultIdentity
                }),
                name_area: Structure.write({
                    classList: ["deck_code_generator_page-name_area"],
                    content: sinners[i].name
                }),
                identity_selection: Structure.write({
                    classList: ["deck_code_generator_page-identity_selection"],
                    children: Object.fromEntries(identityOptions)
                })
            }
        });
    }

    const egoCell = {
        zayin: null,
        teth: null,
        he: null,
        waw: null
    };
    for(let i = 0; i < 12; i++) {
        // ego 렌더할 값 추가할것
    }

    deck_code_generator_page = Structure.write({
        classList: ["deck_code_generator_page"],
        children: {
            grid: Structure.write({
                classList: ["deck_code_generator_page-grid"],
                children: {
                    ...sinnerCell
                }
            })
        }
    });
})();

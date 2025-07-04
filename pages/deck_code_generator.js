let deck_code_generator_page = null;
(() => {
    const { sinners, identities, egos } = formationData;

    const sinnerProfileImages = {
        0: "yisang.webp",
        1: "faust.webp",
        2: "donquixote.webp",
        3: "ryoshu.webp",
        4: "meursalt.webp",
        5: "honglu.webp",
        6: "heathcliff.webp",
        7: "ishmael.webp",
        8: "rodion.webp",
        9: "sinclair.webp",
        10: "outis.webp",
        11: "gregor.webp",
    };

    const sinnerIdentity = {
        0: 1,
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
    };

    const sinnerEgo = {};
    for (let i = 0; i < 12; i++) {
        sinnerEgo[i] = { zayin: 1, teth: 0, he: 0, waw: 0 };
    }

    const sinnerCell = {};
    let isSinnerIdentitySelectionShow = false;
    let shownSinner = null;
    for (let i = 0; i < 12; i++) {
        // 기본값: 1번 인격
        const defaultIdentity = identities[i][1]?.name || "";
        // 모든 인격 옵션
        const identityOptions = Object.entries(identities[i]).map(([id, data]) => [
            `option_${id}`,
            Structure.write({
                classList: [
                    "deck_code_generator_page-identity_selection_option",
                    (+sinnerIdentity[i] === +id) ? "deck_code_generator_page-identity_selection_option--selected" : ""
                ].filter(Boolean),
                content: data.name,
                events: {
                    click: event => {
                        sinnerIdentity[i] = +id;
                        // 모든 옵션에서 --selected 제거
                        event.currentTarget.parentNode.querySelectorAll('.deck_code_generator_page-identity_selection_option').forEach(el => {
                            el.setModifierClass('selected', false);
                        });
                        // 현재 클릭한 옵션에 --selected 추가
                        event.currentTarget.setModifierClass('selected', true);
                        // 이름 영역에 인격 이름 반영
                        const wrapper = event.currentTarget.closest('.deck_code_generator_page-sinner_wrapper');
                        if(wrapper) {
                            const display = wrapper.querySelector('.deck_code_generator_page-identity_display');
                            if(display) display.textContent = data.name;
                        }
                    }
                }
            })
        ]);
        const egoSelectionId = `ego_selection_${i}`;
        sinnerCell[`sinner_wrapper${i + 1}`] = Structure.write({
            classList: ["deck_code_generator_page-sinner_wrapper"],
            children: {
                ego_button: Structure.write({
                    tagName: "div",
                    classList: ["deck_code_generator_page-ego_button"],
                    content: "E.G.O",
                    children: {
                        ego_selection: Structure.write({
                            classList: ["deck_code_generator_page-ego_selection"],
                            properties: { id: egoSelectionId },
                            children: {
                                zayin: Structure.write({
                                    classList: ["deck_code_generator_page-ego_selection_group"],
                                    children: {
                                        label: Structure.write({
                                            classList: ["deck_code_generator_page-ego_selection_label"],
                                            content: "ZAYIN"
                                        }),
                                        ...Object.fromEntries(
                                            Object.entries(egos[i]?.zayin || {}).map(([key, data]) => [
                                                `option_zayin_${key}`,
                                                Structure.write({
                                                    classList: [
                                                        "deck_code_generator_page-ego_selection_option",
                                                        (+sinnerEgo[i].zayin === +key) ? "deck_code_generator_page-ego_selection_option--selected" : ""
                                                    ].filter(Boolean),
                                                    content: data.name,
                                                    events: {
                                                        click: (event) => {
                                                            event.stopPropagation();
                                                            sinnerEgo[i].zayin = +key;
                                                            document.querySelectorAll(`#ego_selection_${i} .deck_code_generator_page-ego_selection_group:nth-child(1) .deck_code_generator_page-ego_selection_option`).forEach(el => {
                                                                el.setModifierClass('selected', false);
                                                            });
                                                            event.currentTarget.setModifierClass('selected', true);
                                                        }
                                                    }
                                                })
                                            ])
                                        )
                                    }
                                }),
                                teth: Structure.write({
                                    classList: ["deck_code_generator_page-ego_selection_group"],
                                    children: {
                                        label: Structure.write({
                                            classList: ["deck_code_generator_page-ego_selection_label"],
                                            content: "TETH"
                                        }),
                                        ...Object.fromEntries(
                                            Object.entries(egos[i]?.teth || {}).map(([key, data]) => [
                                                `option_teth_${key}`,
                                                Structure.write({
                                                    classList: [
                                                        "deck_code_generator_page-ego_selection_option",
                                                        (+sinnerEgo[i].teth === +key) ? "deck_code_generator_page-ego_selection_option--selected" : ""
                                                    ].filter(Boolean),
                                                    content: data.name,
                                                    events: {
                                                        click: (event) => {
                                                            event.stopPropagation();
                                                            sinnerEgo[i].teth = +key;
                                                            document.querySelectorAll(`#ego_selection_${i} .deck_code_generator_page-ego_selection_group:nth-child(2) .deck_code_generator_page-ego_selection_option`).forEach(el => {
                                                                el.setModifierClass('selected', false);
                                                            });
                                                            event.currentTarget.setModifierClass('selected', true);
                                                        }
                                                    }
                                                })
                                            ])
                                        )
                                    }
                                }),
                                he: Structure.write({
                                    classList: ["deck_code_generator_page-ego_selection_group"],
                                    children: {
                                        label: Structure.write({
                                            classList: ["deck_code_generator_page-ego_selection_label"],
                                            content: "HE"
                                        }),
                                        ...Object.fromEntries(
                                            Object.entries(egos[i]?.he || {}).map(([key, data]) => [
                                                `option_he_${key}`,
                                                Structure.write({
                                                    classList: [
                                                        "deck_code_generator_page-ego_selection_option",
                                                        (+sinnerEgo[i].he === +key) ? "deck_code_generator_page-ego_selection_option--selected" : ""
                                                    ].filter(Boolean),
                                                    content: data.name,
                                                    events: {
                                                        click: (event) => {
                                                            event.stopPropagation();
                                                            sinnerEgo[i].he = +key;
                                                            document.querySelectorAll(`#ego_selection_${i} .deck_code_generator_page-ego_selection_group:nth-child(3) .deck_code_generator_page-ego_selection_option`).forEach(el => {
                                                                el.setModifierClass('selected', false);
                                                            });
                                                            event.currentTarget.setModifierClass('selected', true);
                                                        }
                                                    }
                                                })
                                            ])
                                        )
                                    }
                                }),
                                waw: Structure.write({
                                    classList: ["deck_code_generator_page-ego_selection_group"],
                                    children: {
                                        label: Structure.write({
                                            classList: ["deck_code_generator_page-ego_selection_label"],
                                            content: "WAW"
                                        }),
                                        ...Object.fromEntries(
                                            Object.entries(egos[i]?.waw || {}).map(([key, data]) => [
                                                `option_waw_${key}`,
                                                Structure.write({
                                                    classList: [
                                                        "deck_code_generator_page-ego_selection_option",
                                                        (+sinnerEgo[i].waw === +key) ? "deck_code_generator_page-ego_selection_option--selected" : ""
                                                    ].filter(Boolean),
                                                    content: data.name,
                                                    events: {
                                                        click: (event) => {
                                                            event.stopPropagation();
                                                            sinnerEgo[i].waw = +key;
                                                            document.querySelectorAll(`#ego_selection_${i} .deck_code_generator_page-ego_selection_group:nth-child(4) .deck_code_generator_page-ego_selection_option`).forEach(el => {
                                                                el.setModifierClass('selected', false);
                                                            });
                                                            event.currentTarget.setModifierClass('selected', true);
                                                        }
                                                    }
                                                })
                                            ])
                                        )
                                    }
                                })
                            }
                        })
                    },
                    events: {
                        click: (e) => {
                            e.stopPropagation();
                            const target = document.getElementById(egoSelectionId);
                            const isOpen = target && target.classList.contains('deck_code_generator_page-ego_selection--show');
                            // 모든 선택창 닫기
                            document.querySelectorAll('.deck_code_generator_page-ego_selection--show').forEach(el => {
                                el.setModifierClass('show', false);
                            });
                            // 토글: 이미 열려 있으면 닫고, 아니면 열기
                            if (target && !isOpen) target.setModifierClass('show', true);
                        }
                    }
                }),
                cell: Structure.write({
                    classList: ["deck_code_generator_page-cell"],
                    children: {
                        identity_display: Structure.write({
                            classList: ["deck_code_generator_page-identity_display"],
                            content: defaultIdentity
                        }),
                        name_area: Structure.write({
                            classList: ["deck_code_generator_page-name_area"],
                            content: sinners[i].name
                        }),
                        profile_image: Structure.write({
                            tagName: "img",
                            properties: { src: `./assets/images/sinner_profiles/${sinnerProfileImages[i]}` },
                            classList: ["deck_code_generator_page-profile_image"],
                        }),
                        identity_selection: Structure.write({
                            classList: ["deck_code_generator_page-identity_selection"],
                            children: Object.fromEntries(identityOptions)
                        })
                    },
                    events: {
                        click: event => {
                            if(shownSinner !== null && shownSinner !== i) {
                                document.querySelectorAll(".deck_code_generator_page-identity_selection--show").forEach(x => x.setModifierClass("show", false));
                                isSinnerIdentitySelectionShow = false;
                                shownSinner = null;
                            }

                            isSinnerIdentitySelectionShow = !isSinnerIdentitySelectionShow;
                            shownSinner = isSinnerIdentitySelectionShow ? i : null;
                            event.currentTarget.querySelector(".deck_code_generator_page-identity_selection").setModifierClass("show", isSinnerIdentitySelectionShow);
                        }
                    }
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
        },
        events: {
            click: event => {
                if((event.target.closest(".deck_code_generator_page-cell") ?? "Nullish") === "Nullish") {
                    document.querySelectorAll(".deck_code_generator_page-identity_selection--show").forEach(x => x.setModifierClass("show", false));
                    isSinnerIdentitySelectionShow = false;
                    shownSinner = null;
                }

                if((event.target.closest(".deck_code_generator_page-ego_button") ?? "Nullish") === "Nullish") {
                    document.querySelectorAll('.deck_code_generator_page-ego_selection--show').forEach(el => {
                        el.setModifierClass('show', false);
                    });
                }
            }
        }
    });
})();

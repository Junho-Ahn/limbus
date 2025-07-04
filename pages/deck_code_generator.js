let deck_code_generator_page = null;
(() => {
    function decimalTo4bitBinary(num) {
        return num.toString(2).padStart(4, '0');
    }

    function encryptBits(bitStr) {
        // 1. 8비트 단위로 자르고 바이트 배열로 변환
        const bytes = [];
        for (let i = 0; i < bitStr.length; i += 8) {
            let byte = bitStr.substr(i, 8).padEnd(8, '0');
            bytes.push(parseInt(byte, 2));
        }
        const byteArray = new Uint8Array(bytes);

        // 2. base64 인코딩
        const base64 = btoa(String.fromCharCode.apply(null, byteArray));

        // 3. gzip 압축 (pako, mtime: 0)
        const gzip = window.pako.gzip(base64, { mtime: 0 });

        // 4. 최종 base64 인코딩
        const finalBase64 = btoa(String.fromCharCode.apply(null, gzip));
        return finalBase64;
    }

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
    // 편성 순번 관리용 배열
    let formationOrder = [];

    let deckCode = "";
    let deckCodeAlertTimeout = null;
    
    for (let i = 0; i < 12; i++) {
        // 기본값: 1번 인격
        const defaultIdentity = identities[i][1]?.name || "";
        // 등급별로 인격 분류
        const identityByGrade = { 3: [], 2: [], 1: [] };
        Object.entries(identities[i]).forEach(([id, data]) => {
            if (data && data.grade) identityByGrade[data.grade].push([id, data]);
        });
        const gradeLabels = { 3: "3성", 2: "2성", 1: "1성" };
        const gradeOrder = [3, 2, 1];
        const gradeIconFiles = { 3: "identitygrade3.webp", 2: "identitygrade2.webp", 1: "identitygrade1.webp" };
        const identityOptionsGrouped = gradeOrder.map(grade => [
            `grade_${grade}`,
            Structure.write({
                classList: ["deck_code_generator_page-identity_selection_group"],
                children: {
                    label_row: Structure.write({
                        classList: ["deck_code_generator_page-identity_selection_label_row"],
                        children: {
                            grade_icon: Structure.write({
                                tagName: "img",
                                classList: ["deck_code_generator_page-identity_selection_grade_icon"],
                                properties: { src: `./assets/images/${gradeIconFiles[grade]}`, alt: "★" }
                            })
                        }
                    }),
                    options_row: Structure.write({
                        classList: ["deck_code_generator_page-identity_selection_row"],
                        children: Object.fromEntries((identityByGrade[grade] || []).map(([id, data]) => [
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
                                        event.currentTarget.closest('.deck_code_generator_page-identity_selection').querySelectorAll('.deck_code_generator_page-identity_selection_option').forEach(el => {
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
                        ]))
                    })
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
                            // EGO UI 열 때 인격 UI도 모두 닫기
                            document.querySelectorAll('.deck_code_generator_page-identity_selection--show').forEach(x => x.setModifierClass('show', false));
                            isSinnerIdentitySelectionShow = false;
                            shownSinner = null;
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
                            children: Object.fromEntries(identityOptionsGrouped)
                        })
                    },
                    events: {
                        click: event => {
                            // 인격 UI 열 때 EGO UI도 모두 닫기
                            document.querySelectorAll('.deck_code_generator_page-ego_selection--show').forEach(el => {
                                el.setModifierClass('show', false);
                            });
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
                }),
                organize_button: Structure.write({
                    tagName: "div",
                    classList: ["deck_code_generator_page-organize_button"],
                    content: "편성",
                    events: {
                        click: (e) => {
                            e.stopPropagation();
                            const idx = formationOrder.indexOf(i);
                            if (idx === -1) {
                                // 편성되지 않은 경우 마지막에 추가
                                formationOrder.push(i);
                            } else {
                                // 이미 편성된 경우 제거 및 순번 당김
                                formationOrder.splice(idx, 1);
                            }
                            // 버튼 상태 갱신(선택/비선택 등 시각적 표시 필요시)
                            document.querySelectorAll('.deck_code_generator_page-sinner_wrapper').forEach((wrapper, j) => {
                                const btn = wrapper.querySelector('.deck_code_generator_page-organize_button');
                                if (btn) {
                                    if (formationOrder.indexOf(j) !== -1) {
                                        btn.setModifierClass('selected', true);
                                        btn.textContent = (formationOrder.indexOf(j) + 1) + '번';
                                    } else {
                                        btn.setModifierClass('selected', false);
                                        btn.textContent = '편성';
                                    }
                                }
                            });
                        }
                    }
                }),
            }
        });
    }

    const egoCell = {
        zayin: null,
        teth: null,
        he: null,
        waw: null
    };

    deck_code_generator_page = Structure.write({
        classList: ["deck_code_generator_page"],
        children: {
            grid: Structure.write({
                classList: ["deck_code_generator_page-grid"],
                children: {
                    ...sinnerCell
                }
            }),
            code_area_group: Structure.write({
                classList: ["deck_code_generator_page-code_area_group"],
                children: {
                    code_area: Structure.write({
                        classList: ["deck_code_generator_page-code_area"],
                        children: {
                            code_text: Structure.write({
                                classList: ["deck_code_generator_page-code_area_text"],
                                content: "여기에 덱 코드가 표시됩니다."
                            }),
                            code_copy: Structure.write({
                                classList: ["deck_code_generator_page-code_copy"]
                            })
                        },
                        events: {
                            click: event => {
                                const codeTextAreaEl = event.currentTarget.querySelector(".deck_code_generator_page-code_area_text");
                                
                                if(deckCode === "") {
                                    codeTextAreaEl.innerHTML = "코드를 생성해주세요.";
                                    
                                    clearTimeout(deckCodeAlertTimeout);
                                    deckCodeAlertTimeout = setTimeout(() => {
                                        codeTextAreaEl.innerHTML = "여기에 덱 코드가 표시됩니다.";
                                    }, 1000);
                                    return;
                                }
                                navigator.clipboard.writeText(deckCode);
                                codeTextAreaEl.innerHTML = "복사되었습니다.";
                                clearTimeout(deckCodeAlertTimeout);
                                deckCodeAlertTimeout = setTimeout(() => {
                                    codeTextAreaEl.innerHTML = deckCode;
                                }, 1000);
                            }
                        }
                    }),
                    code_generate: Structure.write({
                        classList: ["deck_code_generator_page-code_generate"],
                        content: "코드 생성",
                        events: {
                            click: event => {
                                const bitStr = Object.keys(sinnerIdentity)
                                    .map(Number)
                                    .sort((a, b) => a - b)
                                    .map(idx => {
                                        const identity = decimalTo4bitBinary(sinnerIdentity[idx]);
                                        // 편성되지 않은 경우 0, 편성된 경우만 순번
                                        const orderNum = formationOrder.indexOf(idx) === -1 ? 0 : formationOrder.indexOf(idx) + 1;
                                        const order = decimalTo4bitBinary(orderNum);
                                        const { zayin, teth, he, waw } = sinnerEgo[idx];
                                        return '0000' + identity + order + '000' +
                                               decimalTo4bitBinary(zayin) + '000' +
                                               decimalTo4bitBinary(teth) + '000' +
                                               decimalTo4bitBinary(he) + '000' +
                                               decimalTo4bitBinary(waw) + '000000';
                                    })
                                    .join('') + '00000000';

                                deckCode = encryptBits(bitStr);
                                
                                clearTimeout(deckCodeAlertTimeout);
                                
                                event.currentTarget.closest(".deck_code_generator_page-code_area_group").querySelector(".deck_code_generator_page-code_area_text").innerHTML = deckCode;
                            }
                        }
                    })
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

let deck_code_generator_page = null;

(() => {
    // 유틸리티 함수들
    const Utils = {
        decimalTo4bitBinary(num) {
            return num.toString(2).padStart(4, '0');
        },

        encryptBits(bitStr) {
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
    };

    // 상수 정의
    const CONSTANTS = {
        SINNER_COUNT: 12,
        DEFAULT_IDENTITY: 1,
        GRADE_ORDER: [3, 2, 1],
        GRADE_LABELS: { 3: "3성", 2: "2성", 1: "1성" },
        GRADE_ICONS: { 3: "identitygrade3.webp", 2: "identitygrade2.webp", 1: "identitygrade1.webp" },
        EGO_TYPES: ['zayin', 'teth', 'he', 'waw'],
        EGO_LABELS: { zayin: "ZAYIN", teth: "TETH", he: "HE", waw: "WAW" }
    };

    // 프로필 이미지 매핑
    const sinnerProfileImages = {
        0: "yisang.webp", 1: "faust.webp", 2: "donquixote.webp", 3: "ryoshu.webp",
        4: "meursalt.webp", 5: "honglu.webp", 6: "heathcliff.webp", 7: "ishmael.webp",
        8: "rodion.webp", 9: "sinclair.webp", 10: "outis.webp", 11: "gregor.webp"
    };

    // 상태 관리
    const State = {
        sinnerIdentity: {},
        sinnerEgo: {},
        formationOrder: [],
        isSinnerIdentitySelectionShow: false,
        shownSinner: null,
        deckCode: "",
        deckCodeAlertTimeout: null
    };

    // 초기화
    const initializeState = () => {
        for (let i = 0; i < CONSTANTS.SINNER_COUNT; i++) {
            State.sinnerIdentity[i] = CONSTANTS.DEFAULT_IDENTITY;
            State.sinnerEgo[i] = { zayin: 1, teth: 0, he: 0, waw: 0 };
        }
    };

    // UI 관리자
    const UIManager = {
        closeAllDropdowns() {
            document.querySelectorAll('.deck_code_generator_page-identity_selection--show').forEach(x => 
                x.setModifierClass('show', false)
            );
            document.querySelectorAll('.deck_code_generator_page-ego_selection--show').forEach(el => 
                el.setModifierClass('show', false)
            );
            State.isSinnerIdentitySelectionShow = false;
            State.shownSinner = null;
        },

        updateFormationButtons() {
            document.querySelectorAll('.deck_code_generator_page-sinner_wrapper').forEach((wrapper, j) => {
                const btn = wrapper.querySelector('.deck_code_generator_page-organize_button');
                if (btn) {
                    const orderIndex = State.formationOrder.indexOf(j);
                    if (orderIndex !== -1) {
                        btn.setModifierClass('selected', true);
                        btn.textContent = (orderIndex + 1) + '번';
                    } else {
                        btn.setModifierClass('selected', false);
                        btn.textContent = '편성';
                    }
                }
            });
        },

        showCodeAlert(message, duration = 1000) {
            const codeTextArea = document.querySelector(".deck_code_generator_page-code_area_text");
            if (!codeTextArea) return;

            codeTextArea.innerHTML = message;
            clearTimeout(State.deckCodeAlertTimeout);
            State.deckCodeAlertTimeout = setTimeout(() => {
                codeTextArea.innerHTML = State.deckCode || "여기에 덱 코드가 표시됩니다.";
            }, duration);
        }
    };

    // 이벤트 핸들러
    const EventHandlers = {
        identityOptionClick(event, sinnerIndex, identityId, identityName) {
            State.sinnerIdentity[sinnerIndex] = +identityId;
            
            // 모든 옵션에서 --selected 제거
            event.currentTarget.closest('.deck_code_generator_page-identity_selection')
                .querySelectorAll('.deck_code_generator_page-identity_selection_option')
                .forEach(el => el.setModifierClass('selected', false));
            
            // 현재 클릭한 옵션에 --selected 추가
            event.currentTarget.setModifierClass('selected', true);
            
            // 이름 영역에 인격 이름 반영
            const wrapper = event.currentTarget.closest('.deck_code_generator_page-sinner_wrapper');
            if (wrapper) {
                const display = wrapper.querySelector('.deck_code_generator_page-identity_display');
                if (display) display.textContent = identityName;
            }
        },

        egoOptionClick(event, sinnerIndex, egoType, egoId) {
            event.stopPropagation();
            State.sinnerEgo[sinnerIndex][egoType] = +egoId;
            
            // 해당 그룹의 모든 옵션에서 --selected 제거
            const groupIndex = CONSTANTS.EGO_TYPES.indexOf(egoType) + 1;
            document.querySelectorAll(`#ego_selection_${sinnerIndex} .deck_code_generator_page-ego_selection_group:nth-child(${groupIndex}) .deck_code_generator_page-ego_selection_option`)
                .forEach(el => el.setModifierClass('selected', false));
            
            // 현재 클릭한 옵션에 --selected 추가
            event.currentTarget.setModifierClass('selected', true);
        },

        egoButtonClick(event, sinnerIndex) {
            event.stopPropagation();
            const target = document.getElementById(`ego_selection_${sinnerIndex}`);
            const isOpen = target && target.classList.contains('deck_code_generator_page-ego_selection--show');
            // 이미 열려 있으면 닫기, 아니면 열기
            if (target) {
                if (isOpen) {
                    target.setModifierClass('show', false);
                } else {
                    UIManager.closeAllDropdowns();
                    target.setModifierClass('show', true);
                }
            }
        },

        identityCellClick(event, sinnerIndex) {
            const selection = event.currentTarget.querySelector('.deck_code_generator_page-identity_selection');
            const isOpen = selection && selection.classList.contains('deck_code_generator_page-identity_selection--show');
            // 이미 열려 있으면 닫기, 아니면 열기
            if (selection) {
                if (isOpen) {
                    selection.setModifierClass('show', false);
                    State.isSinnerIdentitySelectionShow = false;
                    State.shownSinner = null;
                } else {
                    UIManager.closeAllDropdowns();
                    selection.setModifierClass('show', true);
                    State.isSinnerIdentitySelectionShow = true;
                    State.shownSinner = sinnerIndex;
                }
            }
        },

        organizeButtonClick(event, sinnerIndex) {
            event.stopPropagation();
            const idx = State.formationOrder.indexOf(sinnerIndex);
            
            if (idx === -1) {
                State.formationOrder.push(sinnerIndex);
            } else {
                State.formationOrder.splice(idx, 1);
            }
            
            UIManager.updateFormationButtons();
        },

        resetIdentityClick(event) {
            event.stopPropagation();
            
            // 인격 상태 초기화
            for (let i = 0; i < CONSTANTS.SINNER_COUNT; i++) {
                State.sinnerIdentity[i] = CONSTANTS.DEFAULT_IDENTITY;
            }
            
            // 모든 인격 선택 상태 제거
            document.querySelectorAll('.deck_code_generator_page-identity_selection_option--selected')
                .forEach(el => el.setModifierClass('selected', false));
            
            // 기본 선택 상태로 복원
            document.querySelectorAll('.deck_code_generator_page-identity_selection_option').forEach(el => {
                if (el.textContent === '기본') {
                    el.setModifierClass('selected', true);
                }
            });
            
            // 인격 이름 표시 초기화
            document.querySelectorAll('.deck_code_generator_page-identity_display').forEach((display, index) => {
                const { identities } = formationData;
                const defaultIdentity = identities[index][1]?.name || "";
                display.textContent = defaultIdentity;
            });
            
            // 덱 코드 초기화
            State.deckCode = "";
            const codeTextArea = document.querySelector(".deck_code_generator_page-code_area_text");
            if (codeTextArea) {
                codeTextArea.innerHTML = "여기에 덱 코드가 표시됩니다.";
            }
        },

        resetEgoClick(event) {
            event.stopPropagation();
            
            // EGO 상태 초기화
            for (let i = 0; i < CONSTANTS.SINNER_COUNT; i++) {
                State.sinnerEgo[i] = { zayin: 1, teth: 0, he: 0, waw: 0 };
            }
            
            // 모든 EGO 선택 상태 제거
            document.querySelectorAll('.deck_code_generator_page-ego_selection_option--selected')
                .forEach(el => el.setModifierClass('selected', false));
            
            // 기본 선택 상태로 복원
            document.querySelectorAll('.deck_code_generator_page-ego_selection_option').forEach(el => {
                if (el.textContent === '기본') {
                    el.setModifierClass('selected', true);
                }
            });
            
            // 덱 코드 초기화
            State.deckCode = "";
            const codeTextArea = document.querySelector(".deck_code_generator_page-code_area_text");
            if (codeTextArea) {
                codeTextArea.innerHTML = "여기에 덱 코드가 표시됩니다.";
            }
        },

        resetFormationClick(event) {
            event.stopPropagation();
            
            // 편성 순번 초기화
            State.formationOrder = [];
            
            // 편성 버튼 초기화
            UIManager.updateFormationButtons();
            
            // 덱 코드 초기화
            State.deckCode = "";
            const codeTextArea = document.querySelector(".deck_code_generator_page-code_area_text");
            if (codeTextArea) {
                codeTextArea.innerHTML = "여기에 덱 코드가 표시됩니다.";
            }
        },

        codeAreaClick(event) {
            if (State.deckCode === "") {
                UIManager.showCodeAlert("코드를 생성해주세요.");
                return;
            }
            
            navigator.clipboard.writeText(State.deckCode);
            UIManager.showCodeAlert("복사되었습니다.");
        },

        codeGenerateClick(event) {
            const bitStr = Object.keys(State.sinnerIdentity)
                .map(Number)
                .sort((a, b) => a - b)
                .map(idx => {
                    const identity = Utils.decimalTo4bitBinary(State.sinnerIdentity[idx]);
                    const orderNum = State.formationOrder.indexOf(idx) === -1 ? 0 : State.formationOrder.indexOf(idx) + 1;
                    const order = Utils.decimalTo4bitBinary(orderNum);
                    const { zayin, teth, he, waw } = State.sinnerEgo[idx];
                    
                    return '0000' + identity + order + '000' +
                           Utils.decimalTo4bitBinary(zayin) + '000' +
                           Utils.decimalTo4bitBinary(teth) + '000' +
                           Utils.decimalTo4bitBinary(he) + '000' +
                           Utils.decimalTo4bitBinary(waw) + '000000';
                })
                .join('') + '00000000';

            State.deckCode = Utils.encryptBits(bitStr);
            clearTimeout(State.deckCodeAlertTimeout);
            
            const codeTextArea = event.currentTarget.closest(".deck_code_generator_page-code_area_group")
                .querySelector(".deck_code_generator_page-code_area_text");
            if (codeTextArea) codeTextArea.innerHTML = State.deckCode;
        }
    };

    // UI 컴포넌트 생성기
    const ComponentFactory = {
        createIdentitySelectionGroup(sinnerIndex, grade, identities) {
            return Structure.write({
                classList: ["deck_code_generator_page-identity_selection_group"],
                children: {
                    label_row: Structure.write({
                        classList: ["deck_code_generator_page-identity_selection_label_row"],
                        children: {
                            grade_icon: Structure.write({
                                tagName: "img",
                                classList: ["deck_code_generator_page-identity_selection_grade_icon"],
                                properties: { 
                                    src: `./assets/images/${CONSTANTS.GRADE_ICONS[grade]}`, 
                                    alt: "★" 
                                }
                            })
                        }
                    }),
                    options_row: Structure.write({
                        classList: ["deck_code_generator_page-identity_selection_row"],
                        children: Object.fromEntries(identities.map(([id, data]) => [
                            `option_${id}`,
                            Structure.write({
                                classList: [
                                    "deck_code_generator_page-identity_selection_option",
                                    (+State.sinnerIdentity[sinnerIndex] === +id) ? "deck_code_generator_page-identity_selection_option--selected" : ""
                                ].filter(Boolean),
                                content: data.name,
                                events: {
                                    click: event => EventHandlers.identityOptionClick(event, sinnerIndex, id, data.name)
                                }
                            })
                        ]))
                    })
                }
            });
        },

        createEgoSelectionGroup(sinnerIndex, egoType, egos) {
            return Structure.write({
                classList: ["deck_code_generator_page-ego_selection_group"],
                children: {
                    label: Structure.write({
                        classList: ["deck_code_generator_page-ego_selection_label"],
                        content: CONSTANTS.EGO_LABELS[egoType]
                    }),
                    ...Object.fromEntries(
                        Object.entries(egos || {}).map(([key, data]) => [
                            `option_${egoType}_${key}`,
                            Structure.write({
                                classList: [
                                    "deck_code_generator_page-ego_selection_option",
                                    (+State.sinnerEgo[sinnerIndex][egoType] === +key) ? "deck_code_generator_page-ego_selection_option--selected" : ""
                                ].filter(Boolean),
                                content: data.name,
                                events: {
                                    click: event => EventHandlers.egoOptionClick(event, sinnerIndex, egoType, key)
                                }
                            })
                        ])
                    )
                }
            });
        },

        createSinnerCell(sinnerIndex) {
            const { sinners, identities, egos } = formationData;
            const defaultIdentity = identities[sinnerIndex][1]?.name || "";
            
            // 등급별로 인격 분류
            const identityByGrade = { 3: [], 2: [], 1: [] };
            Object.entries(identities[sinnerIndex]).forEach(([id, data]) => {
                if (data && data.grade) identityByGrade[data.grade].push([id, data]);
            });

            const identityOptionsGrouped = CONSTANTS.GRADE_ORDER.map(grade => [
                `grade_${grade}`,
                this.createIdentitySelectionGroup(sinnerIndex, grade, identityByGrade[grade] || [])
            ]);

            const egoSelectionId = `ego_selection_${sinnerIndex}`;

            return Structure.write({
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
                                children: Object.fromEntries(
                                    CONSTANTS.EGO_TYPES.map(egoType => [
                                        egoType,
                                        this.createEgoSelectionGroup(sinnerIndex, egoType, egos[sinnerIndex]?.[egoType])
                                    ])
                                )
                            })
                        },
                        events: {
                            click: event => EventHandlers.egoButtonClick(event, sinnerIndex)
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
                                content: sinners[sinnerIndex].name
                            }),
                            profile_image: Structure.write({
                                tagName: "img",
                                properties: { src: `./assets/images/sinner_profiles/${sinnerProfileImages[sinnerIndex]}` },
                                classList: ["deck_code_generator_page-profile_image"],
                            }),
                            identity_selection: Structure.write({
                                classList: ["deck_code_generator_page-identity_selection"],
                                children: Object.fromEntries(identityOptionsGrouped)
                            })
                        },
                        events: {
                            click: event => EventHandlers.identityCellClick(event, sinnerIndex)
                        }
                    }),
                    organize_button: Structure.write({
                        tagName: "div",
                        classList: ["deck_code_generator_page-organize_button"],
                        content: "편성",
                        events: {
                            click: event => EventHandlers.organizeButtonClick(event, sinnerIndex)
                        }
                    }),
                }
            });
        }
    };

    // 메인 페이지 생성
    const createMainPage = () => {
        const sinnerCells = {};
        for (let i = 0; i < CONSTANTS.SINNER_COUNT; i++) {
            sinnerCells[`sinner_wrapper${i + 1}`] = ComponentFactory.createSinnerCell(i);
        }

        return Structure.write({
            classList: ["deck_code_generator_page"],
            children: {
                grid: Structure.write({
                    classList: ["deck_code_generator_page-grid"],
                    children: sinnerCells
                }),
                reset_button_group: Structure.write({
                    classList: ["deck_code_generator_page-reset_button_group"],
                    children: {
                        reset_identity: Structure.write({
                            classList: ["deck_code_generator_page-reset_identity"],
                            content: "인격 초기화",
                            events: {
                                click: EventHandlers.resetIdentityClick
                            }
                        }),
                        reset_ego: Structure.write({
                            classList: ["deck_code_generator_page-reset_ego"],
                            content: "E.G.O 초기화",
                            events: {
                                click: EventHandlers.resetEgoClick
                            }
                        }),
                        reset_formation: Structure.write({
                            classList: ["deck_code_generator_page-reset_formation"],
                            content: "편성 초기화",
                            events: {
                                click: EventHandlers.resetFormationClick
                            }
                        })
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
                                click: EventHandlers.codeAreaClick
                            }
                        }),
                        code_generate: Structure.write({
                            classList: ["deck_code_generator_page-code_generate"],
                            content: "코드 생성",
                            events: {
                                click: EventHandlers.codeGenerateClick
                            }
                        })
                    }
                })
            },
            events: {
                click: event => {
                    if ((event.target.closest(".deck_code_generator_page-cell") ?? "Nullish") === "Nullish") {
                        document.querySelectorAll(".deck_code_generator_page-identity_selection--show")
                            .forEach(x => x.setModifierClass("show", false));
                        State.isSinnerIdentitySelectionShow = false;
                        State.shownSinner = null;
                    }
                    if ((event.target.closest(".deck_code_generator_page-ego_button") ?? "Nullish") === "Nullish") {
                        document.querySelectorAll('.deck_code_generator_page-ego_selection--show')
                            .forEach(el => el.setModifierClass('show', false));
                    }
                }
            }
        });
    };

    // 초기화 및 실행
    initializeState();
    deck_code_generator_page = createMainPage();

})();

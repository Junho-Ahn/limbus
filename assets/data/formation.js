let formationData = null;
(() => {
    formationData = {
        sinners: {
            0: { name: "이상" },
            1: { name: "파우스트" },
            2: { name: "돈키호테" },
            3: { name: "료슈" },
            4: { name: "뫼르소" },
            5: { name: "홍루" },
            6: { name: "히스클리프" },
            7: { name: "이스마엘" },
            8: { name: "로쟈" },
            9: { name: "싱클레어" },
            10: { name: "오티스" },
            11: { name: "그레고르" }
        },
        identities: {
            // 이상
            0: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 2, name: "남부 세븐 협회 6과" },
                3: { grade: 3, name: "검계 살수" },
                4: { grade: 3, name: "개화 E.G.O::동백" },
                5: { grade: 2, name: "어금니 사무소 해결사" },
                6: { grade: 3, name: "W사 3등급 정리 요원" },
                7: { grade: 2, name: "피쿼드호 일등 항해사" },
                8: { grade: 2, name: "남부 디에치 협회 4과" },
                9: { grade: 3, name: "약지 점묘파 스튜던트" },
                10: { grade: 3, name: "로보토미 E.G.O::엄숙한 애도" },
                11: { grade: 2, name: "LCE EGO::초롱" },
                12: { grade: 3, name: "남부 리우 협회 3과" },
                13: { grade: 3, name: "N사 E.G.O::흉탄" }
            },
            // 파우스트
            1: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 2, name: "W사 2등급 정리 요원" },
                3: { grade: 2, name: "살아남은 로보토미 직원" },
                4: { grade: 3, name: "쥐는 자" },
                5: { grade: 2, name: "남부 츠바이 협회 4과" },
                6: { grade: 3, name: "남부 세븐 협회 4과" },
                7: { grade: 3, name: "로보토미 E.G.O::후회" },
                8: { grade: 3, name: "검계 살수" },
                9: { grade: 2, name: "워더링하이츠 버틀러" },
                10: { grade: 3, name: "멀티크랙 사무소 대표" },
                11: { grade: 3, name: "LCE EGO::홍염살" },
                12: { grade: 3, name: "흑수-묘 필두" },
            },
            // 돈키호테
            2: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 3, name: "W사 3등급 정리 요원" },
                3: { grade: 2, name: "남부 시 협회 5과 부장" },
                4: { grade: 2, name: "N사 중간 망치" },
                5: { grade: 3, name: "남부 섕크 협회 5과 부장" },
                6: { grade: 3, name: "중지 작은 아우" },
                7: { grade: 2, name: "로보토미 E.G.O::초롱" },
                8: { grade: 2, name: "검계 살수" },
                9: { grade: 3, name: "T사 3등급 징수직 직원" },
                10: { grade: 3, name: "라만차랜드 실장" },
                11: { grade: 3, name: "동부 섕크 협회 3과" },
                12: { grade: 3, name: "로보토미 E.G.O::사랑과 증오의 이름으로" },
            },
            // 료슈
            3: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 2, name: "남부 세븐 협회 6과" },
                3: { grade: 3, name: "흑운회 와카슈" },
                4: { grade: 3, name: "료.고.파. 주방장" },
                5: { grade: 3, name: "W사 3등급 정리 요원" },
                6: { grade: 2, name: "LCCB 대리" },
                7: { grade: 2, name: "남부 리우 협회 4과" },
                8: { grade: 3, name: "에드가 가문 치프 버틀러" },
                9: { grade: 2, name: "20구 유로지비" },
                10: { grade: 3, name: "로보토미 E.G.O::적안·참회" },
                11: { grade: 3, name: "흑수-묘" },
            },
            // 뫼르소
            4: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 2, name: "남부 리우 협회 6과" },
                3: { grade: 3, name: "W사 2등급 정리 요원" },
                4: { grade: 3, name: "N사 큰 망치" },
                5: { grade: 2, name: "장미스패너 공방 해결사" },
                6: { grade: 3, name: "R사 제 4무리 코뿔소팀" },
                7: { grade: 2, name: "중지 작은 아우" },
                8: { grade: 3, name: "검계 우두머리" },
                9: { grade: 2, name: "데드레빗츠 보스" },
                10: { grade: 3, name: "남부 디에치 협회 4과 부장" },
                11: { grade: 3, name: "서부 섕크 협회 3과" },
                12: { grade: 3, name: "동부 엄지 카포 IIII" },
            },
            // 홍루
            5: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 2, name: "흑운회 와카슈" },
                3: { grade: 3, name: "콩콩이파 두목" },
                4: { grade: 2, name: "남부 리우 협회 5과" },
                5: { grade: 3, name: "K사 3등급 적출직 직원" },
                6: { grade: 2, name: "W사 2등급 정리 요원" },
                7: { grade: 2, name: "갈고리 사무소 해결사" },
                8: { grade: 3, name: "남부 디에치 협회 4과" },
                9: { grade: 3, name: "20구 유로지비" },
                10: { grade: 2, name: "송곳니 사냥 사무소 해결사" },
                11: { grade: 3, name: "마침표 사무소 대표" },
                12: { grade: 3, name: "R사 제 4무리 순록팀" },
            },
            // 히스클리프
            6: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 2, name: "남부 시 협회 5과" },
                3: { grade: 3, name: "R사 제 4무리 토끼팀" },
                4: { grade: 2, name: "N사 작은 망치" },
                5: { grade: 3, name: "로보토미 E.G.O::여우비" },
                6: { grade: 2, name: "남부 세븐 협회 4과" },
                7: { grade: 3, name: "피쿼드호 작살잡이" },
                8: { grade: 3, name: "남부 외우피 협회 3과" },
                9: { grade: 2, name: "멀티크랙 사무소 해결사" },
                10: { grade: 3, name: "와일드헌트" },
                11: { grade: 3, name: "마침표 사무소" },
                12: { grade: 3, name: "흑운회 와카슈" },
            },
            // 이스마엘
            7: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 3, name: "R사 제 4무리 순록팀" },
                3: { grade: 2, name: "남부 시 협회 5과" },
                4: { grade: 2, name: "LCCB 대리" },
                5: { grade: 2, name: "로보토미 E.G.O::출렁임" },
                6: { grade: 2, name: "남부 리우 협회 4과" },
                7: { grade: 3, name: "어금니 보트 센터 해결사" },
                8: { grade: 3, name: "피쿼드호 선장" },
                9: { grade: 2, name: "에드가 가문 버틀러" },
                10: { grade: 3, name: "서부 츠바이 협회 3과" },
                11: { grade: 3, name: "흑운회 부조장" },
                12: { grade: 3, name: "가주 후보" },
            },
            // 로쟈
            8: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 3, name: "흑운회 와카슈" },
                3: { grade: 2, name: "LCCB 대리" },
                4: { grade: 2, name: "N사 중간 망치" },
                5: { grade: 3, name: "장미스패너 공방 대표" },
                6: { grade: 2, name: "남부 츠바이 협회 5과" },
                7: { grade: 3, name: "남부 디에치 협회 4과" },
                8: { grade: 3, name: "남부 리우 협회 4과 부장" },
                9: { grade: 2, name: "T사 2등급 징수직 직원" },
                10: { grade: 3, name: "북부 제뱌찌 협회 3과" },
                11: { grade: 3, name: "라만차랜드 공주" },
                12: { grade: 3, name: "흑수-사" },
                13: { grade: 3, name: "로보토미 E.G.O::눈물로 벼려낸 검" },
            },
            // 싱클레어
            9: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 2, name: "검계 살수" },
                3: { grade: 2, name: "남부 츠바이 협회 6과" },
                4: { grade: 2, name: "마리아치 보스" },
                5: { grade: 3, name: "쥐어들 자" },
                6: { grade: 2, name: "로보토미 E.G.O::홍적" },
                7: { grade: 2, name: "어금니 보트 센터 해결사" },
                8: { grade: 3, name: "남부 섕크 협회 4과 부장" },
                9: { grade: 3, name: "새벽 사무소 해결사" },
                10: { grade: 2, name: "서부 츠바이 협회 3과" },
                11: { grade: 3, name: "북부 제뱌찌 협회 3과" },
                12: { grade: 3, name: "중지 작은 아우" },
                13: { grade: 3, name: "동부 엄지 솔다토 II" },
            },
            // 오티스
            10: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 3, name: "검계 살수" },
                3: { grade: 2, name: "G사 부장" },
                4: { grade: 2, name: "남부 세븐 협회 6과 부장" },
                5: { grade: 3, name: "어금니 사무소 해결사" },
                6: { grade: 2, name: "남부 섕크 협회 4과" },
                7: { grade: 3, name: "로보토미 E.G.O::마탄" },
                8: { grade: 3, name: "워더링하이츠 치프 버틀러" },
                9: { grade: 2, name: "약지 점묘파 스튜던트" },
                10: { grade: 3, name: "W사 3등급 정리 요원 팀장" },
                11: { grade: 3, name: "라만차랜드 이발사" },
                12: { grade: 3, name: "흑수-묘" },
                13: { grade: 3, name: "T사 3등급 강력징수직 직원" },
            },
            // 그레고르
            11: {
                1: { grade: 1, name: "LCB 수감자" },
                2: { grade: 2, name: "남부 리우 협회 6과" },
                3: { grade: 3, name: "G사 일등대리" },
                4: { grade: 2, name: "료.고.파. 조수" },
                5: { grade: 2, name: "장미스패너 공방 해결사" },
                6: { grade: 3, name: "남부 츠바이 협회 4과" },
                7: { grade: 3, name: "쌍갈고리 해적단 부선장" },
                8: { grade: 2, name: "흑운회 부조장" },
                9: { grade: 3, name: "에드가 가문 승계자" },
                10: { grade: 3, name: "라만차랜드 신부" },
                11: { grade: 3, name: "불주먹 사무소 생존자" },
                12: { grade: 3, name: "흑수-사" },
            }
        },
        egos: {
            // 이상
            0: {
                zayin: {
                    1: { name: "오감도" },
                    6: { name: "지난 날" }
                },
                teth: {
                    0: { name: "없음" },
                    2: { name: "4번째 성냥불" },
                    3: { name: "소망석" }
                },
                he: {
                    0: { name: "없음" },
                    4: { name: "차원찢개" },
                    7: { name: "흉탄" }
                },
                waw: {
                    0: { name: "없음" },
                    5: { name: "여우비" }
                }
            },
            // 파우스트
            1: {
                zayin: {
                    1: { name: "표상 방출기" }
                },
                teth: {
                    0: { name: "없음" },
                    3: { name: "저주못" },
                    5: { name: "9장 2절" },
                    7: { name: "올가미" }
                },
                he: {
                    0: { name: "없음" },
                    2: { name: "물주머니" },
                    4: { name: "전봇대" },
                    8: { name: "흉통" }
                },
                waw: {
                    0: { name: "없음" },
                    6: { name: "영속" }
                }
            },
            // 돈키호테
            2: {
                zayin: {
                    1: { name: "라 샹그레 데 산쵸" }
                },
                teth: {
                    0: { name: "없음" },
                    4: { name: "평생 스튜" },
                    5: { name: "소망석" },
                    6: { name: "전기울음" }
                },
                he: {
                    0: { name: "없음" },
                    2: { name: "물주머니" },
                    3: { name: "전봇대" },
                    8: { name: "홍적" }
                },
                waw: {
                    0: { name: "없음" },
                    7: { name: "갈망 - 미르칼라" },
                    9: { name: "사랑과 증오의 이름으로" }
                }
            },
            // 료슈
            3: {
                zayin: {
                    1: { name: "삼라염상" },
                    5: { name: "소다" }
                },
                teth: {
                    0: { name: "없음" },
                    3: { name: "적안" },
                    6: { name: "맹목" }
                },
                he: {
                    0: { name: "없음" },
                    2: { name: "4번째 성냥불" },
                    4: { name: "적안(開)" },
                    8: { name: "흉통" }
                },
                waw: {
                    0: { name: "없음" },
                    7: { name: "경멸, 경외" }
                }
            },
            // 뫼르소
            4: {
                zayin: {
                    1: { name: "타인의 사슬" }
                },
                teth: {
                    0: { name: "없음" },
                    2: { name: "나사빠진 일격" },
                    5: { name: "후회" },
                    6: { name: "전기울음" }
                },
                he: {
                    0: { name: "없음" },
                    3: { name: "집행" },
                    4: { name: "카포테" }
                },
                waw: {
                    0: { name: "없음" },
                    7: { name: "갈망 - 미르칼라" },
                    8: { name: "분쇄될 과거" }
                }
            },
            // 홍루
            5: {
                zayin: {
                    1: { name: "허환경" }
                },
                teth: {
                    0: { name: "없음" },
                    2: { name: "분홍욕망" },
                    4: { name: "소다" },
                    6: { name: "낮은울음" },
                    7: { name: "올가미" }
                },
                he: {
                    0: { name: "없음" },
                    3: { name: "차원찢개" },
                    5: { name: "들끓는 부식" }
                },
                waw: {
                    0: { name: "없음" },
                    8: { name: "오혈읍루" }
                }
            },
            // 히스클리프
            6: {
                zayin: {
                    1: { name: "시체자루" },
                    5: { name: "홀리데이" }
                },
                teth: {
                    0: { name: "없음" },
                    3: { name: "AEDD" },
                    7: { name: "흉탄" }
                },
                he: {
                    0: { name: "없음" },
                    2: { name: "전봇대" },
                    4: { name: "공즉시색" },
                    8: { name: "쏠린 관성" }
                },
                waw: {
                    0: { name: "없음" },
                    6: { name: "구속" }
                }
            },
            // 이스마엘
            7: {
                zayin: {
                    1: { name: "작살박이" },
                    9: { name: "즉저살" }
                },
                teth: {
                    0: { name: "없음" },
                    2: { name: "분홍욕망" },
                    4: { name: "카포테" },
                    7: { name: "지난 날" }
                },
                he: {
                    0: { name: "없음" },
                    3: { name: "홍염살" },
                    6: { name: "날갯짓" },
                    8: { name: "크리스마스 악몽" }
                },
                waw: {
                    0: { name: "없음" },
                    5: { name: "맹목" }
                }
            },
            // 로쟈
            8: {
                zayin: {
                    1: { name: "던져지는 것" }
                },
                teth: {
                    0: { name: "없음" },
                    3: { name: "얼음다리" },
                    4: { name: "들끓는 부식" }
                },
                he: {
                    0: { name: "없음" },
                    2: { name: "4번째 성냥불" },
                    5: { name: "집행" },
                    7: { name: "저주못" }
                },
                waw: {
                    0: { name: "없음" },
                    6: { name: "핏빛욕망" },
                    8: { name: "지정 재판" }
                }
            },
            // 싱클레어
            9: {
                zayin: {
                    1: { name: "지식나무의 가지" },
                    6: { name: "낮은울음" }
                },
                teth: {
                    0: { name: "없음" },
                    2: { name: "다가올날" },
                    3: { name: "평생 스튜" },
                    7: { name: "저주못" }
                },
                he: {
                    0: { name: "없음" },
                    4: { name: "초롱" },
                    5: { name: "9장 2절" }
                },
                waw: {
                    0: { name: "없음" },
                    8: { name: "오혈읍루" }
                }
            },
            // 오티스
            10: {
                zayin: {
                    1: { name: "토 파토스 마토스" }
                },
                teth: {
                    0: { name: "없음" },
                    3: { name: "공즉시색" },
                    4: { name: "여우비" }
                },
                he: {
                    0: { name: "없음" },
                    2: { name: "검은줄기" },
                    5: { name: "홀리데이" },
                    7: { name: "차원찢개" },
                    8: { name: "마탄" }
                },
                waw: {
                    0: { name: "없음" },
                    6: { name: "구속" }
                }
            },
            // 그레고르
            11: {
                zayin: {
                    1: { name: "어느날 갑자기" },
                    2: { name: "눈속임" }
                },
                teth: {
                    0: { name: "없음" },
                    3: { name: "초롱" },
                    6: { name: "지난 날" }
                },
                he: {
                    0: { name: "없음" },
                    4: { name: "AEDD" },
                    7: { name: "엄숙한 애도" },
                    8: { name: "크리스마스 악몽" }
                },
                waw: {
                    0: { name: "없음" },
                    5: { name: "가시 화원" }
                }
            }
        }
    };
})(); 
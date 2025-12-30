let enkephalin_calculator_page = null;

(() => {
	// 참조 데이터
	const REFERENCE_DATA = {
		// 광기 상품 데이터
		lunacyItems: [
			{ name: "초회 광기 0.11만", amount: 140, price: 1100 },
			{ name: "초회 묶음 0.51만", amount: 588, price: 5100 },
			{ name: "초회 다발 1.7만", amount: 2028, price: 17000 },
			{ name: "초회 상자 3.3만", amount: 4294, price: 33000 },
			{ name: "초회 더미 5.5만", amount: 8206, price: 55000 },
			{ name: "초회 모음 11만", amount: 16672, price: 110000 },
			{ name: "광기 0.11만", amount: 70, price: 1100 },
			{ name: "묶음 0.51만", amount: 325, price: 5100 },
			{ name: "다발 1.7만", amount: 1170, price: 17000 },
			{ name: "상자 3.3만", amount: 2470, price: 33000 },
			{ name: "더미 5.5만", amount: 4745, price: 55000 },
			{ name: "모음 11만", amount: 9685, price: 110000 },
			{ name: "월정액", amount: 2600, price: 9900 },
			{ name: "월정액 소형", amount: 1300, price: 4400 },
			{ name: "월정액 2종", amount: 3900, price: 14300 }
		],
		
		// 경험치 던전 데이터
		expDungeons: [
			{ name: "1 - 수동", tickets: [6, 7, 0, 0], enke: 40 },
			{ name: "1 - 스킵", tickets: [9, 11, 0, 0], enke: 80 },
			{ name: "2 - 수동", tickets: [0, 3, 3, 0], enke: 40 },
			{ name: "2 - 스킵", tickets: [0, 5, 5, 0], enke: 80 },
			{ name: "3 - 수동", tickets: [0, 4, 4, 0], enke: 40 },
			{ name: "3 - 스킵", tickets: [0, 6, 6, 0], enke: 80 },
			{ name: "4 - 수동", tickets: [0, 0, 3, 2], enke: 60 },
			{ name: "4 - 스킵", tickets: [0, 0, 5, 3], enke: 120 },
			{ name: "5 - 수동", tickets: [0, 4, 4, 2], enke: 60 },
			{ name: "5 - 스킵", tickets: [0, 6, 6, 3], enke: 120 },
			{ name: "6 - 수동", tickets: [0, 2, 2, 4], enke: 60 },
			{ name: "6 - 스킵", tickets: [0, 3, 3, 6], enke: 120 },
			{ name: "7 - 수동", tickets: [0, 4, 4, 4], enke: 60 },
			{ name: "7 - 스킵", tickets: [0, 6, 6, 6], enke: 120 },
			{ name: "8 - 수동", tickets: [0, 4, 2, 6], enke: 60 },
			{ name: "8 - 스킵", tickets: [0, 6, 3, 9], enke: 120 }
		],
		
		// 티켓 가치
		ticketValues: [50, 200, 1000, 3000],
		
		// 충전 증가폭
		chargeIncrement: 26,
		
		// 현금 경험치 패키지
		cashExpPackages: [
			{ name: "주간", ticket3: 25, ticket4: 35, price: 9900 },
			{ name: "월간1", ticket3: 70, ticket4: 80, price: 28000 },
			{ name: "월간2", ticket3: 95, ticket4: 160, price: 46000 },
			{ name: "월간3", ticket3: 165, ticket4: 325, price: 90000 }
		],
		
		// 주간 엔케팔린 패키지
		weeklyEnkePackage: {
			enke: 1200,
			price: 9900
		}
	};
	
	// 상태 관리
	const State = {
		maxEnke: 140,
		standardChargeCount: 2,
		standardLunacyItem: "초회 다발 1.7만",
		standardExpDungeon: "8 - 수동"
	};
	
	// 계산 함수들
	const Calculator = {
		// 가격당 광기 계산
		getLunacyPerPrice(item) {
			return item.amount / item.price;
		},
		
		// 기준 효율 계산
		getStandardEfficiency() {
			const item = REFERENCE_DATA.lunacyItems.find(i => i.name === State.standardLunacyItem);
			return item ? this.getLunacyPerPrice(item) : 0.1192941176;
		},
		
		// 충전 횟수별 광기 절대 소모량
		getAbsoluteLunacyConsumption(chargeCount) {
			return (REFERENCE_DATA.chargeIncrement / 2) * chargeCount * (chargeCount + 1);
		},
		
		// 충전 횟수별 엔케 절대 수급량
		getAbsoluteEnkeSupply(chargeCount) {
			return State.maxEnke * chargeCount;
		},
		
		// 기준 충전 횟수의 광기 소모량
		getStandardLunacyConsumption() {
			return this.getAbsoluteLunacyConsumption(State.standardChargeCount);
		},
		
		// 기준 충전 횟수의 엔케 수급량
		getStandardEnkeSupply() {
			return this.getAbsoluteEnkeSupply(State.standardChargeCount);
		},
		
		// 충전 효율 계산 (1-10회)
		calculateChargeEfficiency(chargeCount) {
			const absLunacy = this.getAbsoluteLunacyConsumption(chargeCount);
			const absEnke = this.getAbsoluteEnkeSupply(chargeCount);
			const stdLunacy = this.getStandardLunacyConsumption();
			const stdEnke = this.getStandardEnkeSupply();
			
			const relLunacy = Math.max(0, absLunacy - stdLunacy);
			const relEnke = Math.max(0, absEnke - stdEnke);
			const enkePerLunacy = relLunacy > 0 ? relEnke / relLunacy : 0;
			
			return {
				chargeCount,
				lunacyConsumption: relLunacy,
				enkeSupply: relEnke,
				enkePerLunacy: enkePerLunacy
			};
		},
		
		// 주간 엔케팔린 패키지 효율
		calculateWeeklyEnkeEfficiency() {
			const standardEfficiency = this.getStandardEfficiency();
			const lunacyWorth = standardEfficiency * REFERENCE_DATA.weeklyEnkePackage.price;
			const enkePerLunacy = REFERENCE_DATA.weeklyEnkePackage.enke / lunacyWorth;
			
			return {
				lunacyWorth,
				enkePerLunacy
			};
		},
		
		// 경험치 총량 계산
		calculateExpTotal(tickets) {
			return tickets.reduce((sum, count, index) => {
				return sum + (count * REFERENCE_DATA.ticketValues[index]);
			}, 0);
		},
		
		// 경험치 던전 데이터 찾기
		findExpDungeon(name) {
			return REFERENCE_DATA.expDungeons.find(d => d.name === name);
		},
		
		// 기준 경험치 던전 데이터
		getStandardExpDungeon() {
			return this.findExpDungeon(State.standardExpDungeon);
		},
		
		// 경험치 수급 효율 계산
		calculateExpEfficiency() {
			const standardEfficiency = this.getStandardEfficiency();
			const standardDungeon = this.getStandardExpDungeon();
			const standardExpPerRun = this.calculateExpTotal(standardDungeon.tickets);
			const standardEnkePerRun = standardDungeon.enke;
			const expPerEnke = standardExpPerRun / standardEnkePerRun;
			
			const results = [];
			
			// 현금 경험치 패키지
			REFERENCE_DATA.cashExpPackages.forEach(pkg => {
				const expTotal = pkg.ticket3 * REFERENCE_DATA.ticketValues[2] + 
				                pkg.ticket4 * REFERENCE_DATA.ticketValues[3];
				const lunacyWorth = standardEfficiency * pkg.price;
				const expPerLunacy = expTotal / lunacyWorth;
				
				results.push({
					method: pkg.name === "주간" ? "주간 경험치" : 
					        pkg.name === "월간1" ? "월간 경험치 1" :
					        pkg.name === "월간2" ? "월간 경험치 2" : "월간 경험치 3",
					lunacyWorth,
					expSupply: expTotal,
					expPerLunacy,
					note: `* ${pkg.price.toLocaleString()}원`
				});
			});
			
			// 엔케 패키지 경던
			const enkePackageLunacy = standardEfficiency * REFERENCE_DATA.weeklyEnkePackage.price;
			const enkePackageExp = (REFERENCE_DATA.weeklyEnkePackage.enke / standardEnkePerRun) * standardExpPerRun;
			const enkePackageExpPerLunacy = enkePackageExp / enkePackageLunacy;
			
			results.push({
				method: "엔케 패키지 경던",
				lunacyWorth: enkePackageLunacy,
				expSupply: enkePackageExp,
				expPerLunacy: enkePackageExpPerLunacy,
				note: `* ${REFERENCE_DATA.weeklyEnkePackage.price.toLocaleString()}원`
			});
			
			// 충전 경던 (1-10충)
			// 기준 수급/엔케 = 기준 경던 수급량 / 기준 엔케 소모량 (이미 위에서 계산됨)
			// 1충당 횟수 = 엔케팔린 최대치 / 기준 엔케 소모량
			const runsPerCharge = State.maxEnke / standardEnkePerRun;
			
			for (let chargeCount = 1; chargeCount <= 10; chargeCount++) {
				const absLunacy = this.getAbsoluteLunacyConsumption(chargeCount);
				// 경험치 수급량 = 기준 경던 수급량 * (1충당 횟수 * 충전 횟수) / 기준 엔케 소모량
				// 또는 = 기준 수급/엔케 * (1충당 횟수 * 충전 횟수)
				const expSupply = expPerEnke * runsPerCharge * chargeCount;
				const expPerLunacy = absLunacy > 0 ? expSupply / absLunacy : 0;
				
				results.push({
					method: `${chargeCount}충 경던`,
					lunacyWorth: absLunacy,
					expSupply: expSupply,
					expPerLunacy: expPerLunacy
				});
			}
			
			return results;
		}
	};
	
	// UI 업데이트 함수
	const UIManager = {
		updateWeeklyEnkeEfficiency() {
			const result = Calculator.calculateWeeklyEnkeEfficiency();
			const lunacyElement = document.querySelector('.enkephalin_calculator_page-weekly_lunacy_worth');
			const enkeElement = document.querySelector('.enkephalin_calculator_page-weekly_enke_per_lunacy');
			
			if (lunacyElement) {
				lunacyElement.textContent = result.lunacyWorth.toFixed(2);
			}
			if (enkeElement) {
				enkeElement.textContent = result.enkePerLunacy.toFixed(2);
			}
		},
		
		updateChargeEfficiency() {
			for (let i = 1; i <= 10; i++) {
				const result = Calculator.calculateChargeEfficiency(i);
				const row = document.querySelector(`.enkephalin_calculator_page-charge_row[data-charge="${i}"]`);
				if (row) {
					const lunacyCell = row.querySelector('.enkephalin_calculator_page-charge_lunacy');
					const enkeCell = row.querySelector('.enkephalin_calculator_page-charge_enke');
					const efficiencyCell = row.querySelector('.enkephalin_calculator_page-charge_efficiency');
					
					if (lunacyCell) lunacyCell.textContent = result.lunacyConsumption.toLocaleString();
					if (enkeCell) enkeCell.textContent = result.enkeSupply.toLocaleString();
					if (efficiencyCell) efficiencyCell.textContent = result.enkePerLunacy.toFixed(2);
				}
			}
		},
		
		updateExpEfficiency() {
			const results = Calculator.calculateExpEfficiency();
			results.forEach((result, index) => {
				const row = document.querySelector(`.enkephalin_calculator_page-exp_row[data-index="${index}"]`);
				if (row) {
					const lunacyCell = row.querySelector('.enkephalin_calculator_page-exp_lunacy');
					const expCell = row.querySelector('.enkephalin_calculator_page-exp_supply');
					const efficiencyCell = row.querySelector('.enkephalin_calculator_page-exp_efficiency');
					const noteCell = row.querySelector('.enkephalin_calculator_page-exp_note');
					
					if (lunacyCell) lunacyCell.textContent = result.lunacyWorth.toFixed(2);
					if (expCell) expCell.textContent = result.expSupply.toLocaleString();
					if (efficiencyCell) efficiencyCell.textContent = result.expPerLunacy.toFixed(2);
					if (noteCell && result.note) noteCell.textContent = result.note;
				}
			});
		},
		
		updateAll() {
			this.updateWeeklyEnkeEfficiency();
			this.updateChargeEfficiency();
			this.updateExpEfficiency();
		}
	};
	
	// 이벤트 핸들러
	const EventHandlers = {
		onMaxEnkeChange(event) {
			const value = parseInt(event.target.value) || 140;
			State.maxEnke = value;
			UIManager.updateAll();
		},
		
		onStandardChargeCountChange(event) {
			const value = parseInt(event.target.value) || 0;
			State.standardChargeCount = Math.max(0, Math.min(10, value));
			UIManager.updateAll();
		},
		
		onStandardLunacyItemChange(event) {
			State.standardLunacyItem = event.target.value;
			UIManager.updateAll();
		},
		
		onStandardExpDungeonChange(event) {
			State.standardExpDungeon = event.target.value;
			UIManager.updateAll();
		}
	};
	
	// UI 컴포넌트 생성
	const ComponentFactory = {
		createSettingsSection() {
			return Structure.write({
				classList: ["enkephalin_calculator_page-settings"],
				children: {
					title: Structure.write({
						classList: ["enkephalin_calculator_page-settings_title"],
						content: "[엔케팔린 최대치 / 기준 상품 / 기준 경던] 설정"
					}),
					inputs: Structure.write({
						classList: ["enkephalin_calculator_page-settings_inputs"],
						children: {
							max_enke_label: Structure.write({
								classList: ["enkephalin_calculator_page-settings_label"],
								content: "엔케팔린 최대치"
							}),
							max_enke_input: Structure.write({
								tagName: "input",
								classList: ["enkephalin_calculator_page-settings_input"],
								properties: { type: "number", value: String(State.maxEnke) },
								events: {
									input: EventHandlers.onMaxEnkeChange
								}
							}),
							charge_count_label: Structure.write({
								classList: ["enkephalin_calculator_page-settings_label"],
								content: "기준 충전 횟수 (0-10)"
							}),
							charge_count_input: Structure.write({
								tagName: "input",
								classList: ["enkephalin_calculator_page-settings_input"],
								properties: { type: "number", min: "0", max: "10", value: String(State.standardChargeCount) },
								events: {
									input: EventHandlers.onStandardChargeCountChange
								}
							}),
							lunacy_item_label: Structure.write({
								classList: ["enkephalin_calculator_page-settings_label"],
								content: "기준 광기 상품"
							}),
							lunacy_item_select: Structure.write({
								tagName: "select",
								classList: ["enkephalin_calculator_page-settings_select"],
								children: Object.fromEntries(
									REFERENCE_DATA.lunacyItems.map((item, index) => [
										`option_${index}`,
										Structure.write({
											tagName: "option",
											properties: { 
												value: item.name,
												...(item.name === State.standardLunacyItem ? { selected: "selected" } : {})
											},
											content: item.name
										})
									])
								),
								events: {
									change: EventHandlers.onStandardLunacyItemChange
								}
							}),
							exp_dungeon_label: Structure.write({
								classList: ["enkephalin_calculator_page-settings_label"],
								content: "기준 경험치 던전"
							}),
							exp_dungeon_select: Structure.write({
								tagName: "select",
								classList: ["enkephalin_calculator_page-settings_select"],
								children: Object.fromEntries(
									REFERENCE_DATA.expDungeons.map((dungeon, index) => [
										`option_${index}`,
										Structure.write({
											tagName: "option",
											properties: { 
												value: dungeon.name,
												...(dungeon.name === State.standardExpDungeon ? { selected: "selected" } : {})
											},
											content: dungeon.name
										})
									])
								),
								events: {
									change: EventHandlers.onStandardExpDungeonChange
								}
							})
						}
					})
				}
			});
		},
		
		createWeeklyEnkeSection() {
			return Structure.write({
				classList: ["enkephalin_calculator_page-weekly_enke"],
				children: {
					title: Structure.write({
						classList: ["enkephalin_calculator_page-section_title"],
						content: "주간 엔케팔린 패키지 효율"
					}),
					table: Structure.write({
						classList: ["enkephalin_calculator_page-table"],
						children: {
							header: Structure.write({
								classList: ["enkephalin_calculator_page-table_header"],
								children: {
									col1: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"],
										content: "9,900원어치 광기"
									}),
									col2: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"],
										content: "광기당 엔케"
									})
								}
							}),
							row: Structure.write({
								classList: ["enkephalin_calculator_page-table_row"],
								children: {
									lunacy: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-weekly_lunacy_worth"],
										content: "0.00"
									}),
									enke: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-weekly_enke_per_lunacy"],
										content: "0.00"
									})
								}
							}),
							note: Structure.write({
								classList: ["enkephalin_calculator_page-note"],
								content: "* 엔케팔린 수급량 = 1,200"
							})
						}
					})
				}
			});
		},
		
		createChargeEfficiencySection() {
			const rows = {};
			for (let i = 1; i <= 10; i++) {
				rows[`row_${i}`] = Structure.write({
					classList: ["enkephalin_calculator_page-charge_row"],
					dataset: { charge: String(i) },
					children: {
						charge: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell"],
							content: i.toString()
						}),
						lunacy: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-charge_lunacy"],
							content: "0"
						}),
						enke: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-charge_enke"],
							content: "0"
						}),
						efficiency: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-charge_efficiency"],
							content: "0.00"
						})
					}
				});
			}
			
			return Structure.write({
				classList: ["enkephalin_calculator_page-charge_efficiency"],
				children: {
					title: Structure.write({
						classList: ["enkephalin_calculator_page-section_title"],
						content: "엔케팔린 충전 효율"
					}),
					table: Structure.write({
						classList: ["enkephalin_calculator_page-table"],
						children: {
							header: Structure.write({
								classList: ["enkephalin_calculator_page-table_header"],
								children: {
									charge: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"],
										content: "충전 횟수"
									}),
									lunacy: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"],
										content: "광기 소모량"
									}),
									enke: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"],
										content: "엔케 수급량"
									}),
									efficiency: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"],
										content: "광기당 엔케"
									})
								}
							}),
							...rows
						}
					}),
					note: Structure.write({
						classList: ["enkephalin_calculator_page-note"],
						content: "* 주간 광기 수급량 : 거던보너스 750, 점검 300+α, 소월정액 273, 대월정액 455"
					})
				}
			});
		},
		
		createExpEfficiencySection() {
			const results = Calculator.calculateExpEfficiency();
			const rows = {};
			
			results.forEach((result, index) => {
				rows[`row_${index}`] = Structure.write({
					classList: ["enkephalin_calculator_page-exp_row"],
					dataset: { index: String(index) },
					children: {
						method: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell"],
							content: result.method
						}),
						lunacy: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-exp_lunacy"],
							content: result.lunacyWorth.toFixed(2)
						}),
						exp: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-exp_supply"],
							content: result.expSupply.toLocaleString()
						}),
						efficiency: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-exp_efficiency"],
							content: result.expPerLunacy.toFixed(2)
						}),
						note: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-exp_note"],
							...(result.note ? { content: result.note } : {})
						})
					}
				});
			});
			
			return Structure.write({
				classList: ["enkephalin_calculator_page-exp_efficiency"],
				children: {
					title: Structure.write({
						classList: ["enkephalin_calculator_page-section_title"],
						content: "경험치 수급 효율"
					}),
					table: Structure.write({
						classList: ["enkephalin_calculator_page-table"],
						children: {
							header: Structure.write({
								classList: ["enkephalin_calculator_page-table_header"],
								children: {
									method: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"],
										content: "방식"
									}),
									lunacy: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"],
										content: "[현금/엔케 → 광기] 환산"
									}),
									exp: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"],
										content: "경험치 수급량"
									}),
									efficiency: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"],
										content: "광기당 경험치"
									}),
									note: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell"]
									})
								}
							}),
							...rows
						}
					}),
					note: Structure.write({
						classList: ["enkephalin_calculator_page-note"],
						content: `* 경던 1회당 수급량 = ${Calculator.calculateExpTotal(Calculator.getStandardExpDungeon().tickets).toLocaleString()}`
					})
				}
			});
		}
	};
	
	// 메인 페이지 생성
	const createMainPage = () => {
		return Structure.write({
			classList: ["enkephalin_calculator_page"],
			children: {
				settings: ComponentFactory.createSettingsSection(),
				weekly_enke: ComponentFactory.createWeeklyEnkeSection(),
				charge_efficiency: ComponentFactory.createChargeEfficiencySection(),
				exp_efficiency: ComponentFactory.createExpEfficiencySection()
			}
		});
	};
	
	// 초기화
	enkephalin_calculator_page = createMainPage();
	
	// 페이지가 렌더링된 후 초기 업데이트를 위한 함수
	const initializePage = () => {
		// DOM이 준비되면 초기 업데이트
		const checkAndUpdate = () => {
			const settings = document.querySelector('.enkephalin_calculator_page-settings');
			if (settings) {
				UIManager.updateAll();
			} else {
				setTimeout(checkAndUpdate, 50);
			}
		};
		checkAndUpdate();
	};
	
	// 페이지가 로드되면 초기화
	if (typeof window !== 'undefined') {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initializePage);
		} else {
			initializePage();
		}
	}
})();


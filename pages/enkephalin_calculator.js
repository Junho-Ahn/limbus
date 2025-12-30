let enkephalin_calculator_page = null;

(() => {
	// 참조 데이터 (별도 파일에서 로드)
	const REFERENCE_DATA = enkephalinData;
	
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
			// xlsx 수식에 따르면:
			// 경험치 수급량 = 기준 경던 수급량 * (상대 광기 소모량) / 기준 엔케 소모량
			// 광기당 경험치 = 기준 수급/엔케 * (상대 광기당 엔케)
			const stdLunacy = this.getStandardLunacyConsumption();
			const stdEnke = this.getStandardEnkeSupply();
			
			for (let chargeCount = 1; chargeCount <= 10; chargeCount++) {
				const chargeEfficiency = this.calculateChargeEfficiency(chargeCount);
				const relLunacy = chargeEfficiency.lunacyConsumption; // 상대 광기 소모량
				const relEnkePerLunacy = chargeEfficiency.enkePerLunacy; // 상대 광기당 엔케
				
				// 경험치 수급량 = 기준 경던 수급량 * (상대 광기 소모량) / 기준 엔케 소모량
				const expSupply = (standardExpPerRun * relLunacy) / standardEnkePerRun;
				// 광기당 경험치 = 기준 수급/엔케 * (상대 광기당 엔케)
				const expPerLunacy = expPerEnke * relEnkePerLunacy;
				
				results.push({
					method: `${chargeCount}충 경던`,
					lunacyWorth: relLunacy,
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
				lunacyElement.textContent = result.lunacyWorth.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
			}
			if (enkeElement) {
				enkeElement.textContent = result.enkePerLunacy.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
			}
		},
		
		updateChargeEfficiency() {
			const weeklyEnkeEfficiency = Calculator.calculateWeeklyEnkeEfficiency();
			const weeklyEnkePerLunacy = weeklyEnkeEfficiency.enkePerLunacy;
			
			for (let i = 1; i <= 10; i++) {
				const result = Calculator.calculateChargeEfficiency(i);
				const row = document.querySelector(`.enkephalin_calculator_page-charge_row[data-charge="${i}"]`);
				if (row) {
					const lunacyCell = row.querySelector('.enkephalin_calculator_page-charge_lunacy');
					const enkeCell = row.querySelector('.enkephalin_calculator_page-charge_enke');
					const efficiencyCell = row.querySelector('.enkephalin_calculator_page-charge_efficiency');
					
					if (lunacyCell) lunacyCell.textContent = result.lunacyConsumption.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
					if (enkeCell) enkeCell.textContent = result.enkeSupply.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
					if (efficiencyCell) efficiencyCell.textContent = result.enkePerLunacy.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
					
					// 비활성화 효과 (소모량, 수급량이 0인 경우)
					const isDisabled = result.lunacyConsumption === 0 && result.enkeSupply === 0;
					row.setModifierClass('disabled', isDisabled);
					
					// 긍정/부정 효과 (주간 엔케팔린 패키지 효율과 비교)
					if (!isDisabled && result.enkePerLunacy > 0) {
						if (result.enkePerLunacy > weeklyEnkePerLunacy) {
							row.setModifierClass('positive', true);
							row.setModifierClass('negative', false);
						} else if (result.enkePerLunacy < weeklyEnkePerLunacy) {
							row.setModifierClass('positive', false);
							row.setModifierClass('negative', true);
						} else {
							row.setModifierClass('positive', false);
							row.setModifierClass('negative', false);
						}
					} else {
						row.setModifierClass('positive', false);
						row.setModifierClass('negative', false);
					}
				}
			}
		},
		
		updateExpEfficiency() {
			const results = Calculator.calculateExpEfficiency();
			// 엔케 패키지 경던의 효율을 기준으로 사용
			const enkePackageResult = results.find(r => r.method === "엔케 패키지 경던");
			const standardExpPerLunacy = enkePackageResult ? enkePackageResult.expPerLunacy : 0;
			
			// 타이틀의 info 부분 업데이트
			const titleInfo = document.querySelector('.enkephalin_calculator_page-exp_title_info');
			if (titleInfo) {
				const standardDungeon = Calculator.getStandardExpDungeon();
				const expTotal = Calculator.calculateExpTotal(standardDungeon.tickets);
				titleInfo.textContent = `경던 1회당 수급량 = ${expTotal.toLocaleString()}`;
			}
			
			results.forEach((result, index) => {
				const row = document.querySelector(`.enkephalin_calculator_page-exp_row[data-index="${index}"]`);
				if (row) {
					const methodCell = row.querySelector('.enkephalin_calculator_page-exp_method');
					const methodName = methodCell ? methodCell.querySelector('.enkephalin_calculator_page-exp_method_name') : null;
					const methodNote = methodCell ? methodCell.querySelector('.enkephalin_calculator_page-exp_method_note') : null;
					const lunacyCell = row.querySelector('.enkephalin_calculator_page-exp_lunacy');
					const expCell = row.querySelector('.enkephalin_calculator_page-exp_supply');
					const efficiencyCell = row.querySelector('.enkephalin_calculator_page-exp_efficiency');
					
					if (methodName) methodName.textContent = result.method;
					if (result.note) {
						if (methodNote) {
							methodNote.textContent = result.note;
						} else if (methodCell) {
							// note가 없으면 동적으로 생성
							const noteElement = document.createElement('div');
							noteElement.className = 'enkephalin_calculator_page-exp_method_note';
							noteElement.textContent = result.note;
							methodCell.appendChild(noteElement);
						}
					} else if (methodNote) {
						methodNote.remove();
					}
					if (lunacyCell) lunacyCell.textContent = result.lunacyWorth.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
					if (expCell) expCell.textContent = result.expSupply.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
					if (efficiencyCell) efficiencyCell.textContent = result.expPerLunacy.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
					
					// n충 경던 행에만 비활성화/긍정/부정 효과 적용
					if (result.method && result.method.includes("충 경던")) {
						// 비활성화 효과 (상대 광기 소모량이 0인 경우)
						const isDisabled = result.lunacyWorth === 0;
						row.setModifierClass('disabled', isDisabled);
						
						// 긍정/부정 효과 (엔케 패키지 경던 효율과 비교)
						if (!isDisabled && result.expPerLunacy > 0) {
							if (result.expPerLunacy > standardExpPerLunacy) {
								row.setModifierClass('positive', true);
								row.setModifierClass('negative', false);
							} else if (result.expPerLunacy < standardExpPerLunacy) {
								row.setModifierClass('positive', false);
								row.setModifierClass('negative', true);
							} else {
								row.setModifierClass('positive', false);
								row.setModifierClass('negative', false);
							}
						} else {
							row.setModifierClass('positive', false);
							row.setModifierClass('negative', false);
						}
					} else {
						// n충 경던이 아닌 행은 효과 제거
						row.setModifierClass('disabled', false);
						row.setModifierClass('positive', false);
						row.setModifierClass('negative', false);
					}
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
							max_enke_group: Structure.write({
								classList: ["enkephalin_calculator_page-settings_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["enkephalin_calculator_page-settings_label"],
										properties: { for: "max_enke_input" },
										content: "엔케팔린 최대치"
									}),
									input: Structure.write({
										tagName: "input",
										classList: ["enkephalin_calculator_page-settings_input"],
										properties: { 
											type: "number", 
											id: "max_enke_input",
											value: String(State.maxEnke) 
										},
										events: {
											input: EventHandlers.onMaxEnkeChange
										}
									})
								}
							}),
							charge_count_group: Structure.write({
								classList: ["enkephalin_calculator_page-settings_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["enkephalin_calculator_page-settings_label"],
										properties: { for: "charge_count_input" },
										content: "기준 충전 횟수 (0-10)"
									}),
									input: Structure.write({
										tagName: "input",
										classList: ["enkephalin_calculator_page-settings_input"],
										properties: { 
											type: "number", 
											id: "charge_count_input",
											min: "0", 
											max: "10", 
											value: String(State.standardChargeCount) 
										},
										events: {
											input: EventHandlers.onStandardChargeCountChange
										}
									})
								}
							}),
							lunacy_item_group: Structure.write({
								classList: ["enkephalin_calculator_page-settings_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["enkephalin_calculator_page-settings_label"],
										properties: { for: "lunacy_item_select" },
										content: "기준 광기 상품"
									}),
									select: Structure.write({
										tagName: "select",
										classList: ["enkephalin_calculator_page-settings_select"],
										properties: { id: "lunacy_item_select" },
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
									})
								}
							}),
							exp_dungeon_group: Structure.write({
								classList: ["enkephalin_calculator_page-settings_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["enkephalin_calculator_page-settings_label"],
										properties: { for: "exp_dungeon_select" },
										content: "기준 경험치 던전"
									}),
									select: Structure.write({
										tagName: "select",
										classList: ["enkephalin_calculator_page-settings_select"],
										properties: { id: "exp_dungeon_select" },
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
										dataset: { label: "9,900원어치 광기" },
										content: "0.00"
									}),
									enke: Structure.write({
										classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-weekly_enke_per_lunacy"],
										dataset: { label: "광기당 엔케" },
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
							dataset: { label: "충전 횟수" },
							content: i.toString()
						}),
						lunacy: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-charge_lunacy"],
							dataset: { label: "광기 소모량" },
							content: "0"
						}),
						enke: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-charge_enke"],
							dataset: { label: "엔케 수급량" },
							content: "0"
						}),
						efficiency: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-charge_efficiency"],
							dataset: { label: "광기당 엔케" },
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
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-exp_method"],
							dataset: { label: "방식" },
							children: {
								name: Structure.write({
									classList: ["enkephalin_calculator_page-exp_method_name"],
									content: result.method
								}),
								...(result.note ? {
									note: Structure.write({
										classList: ["enkephalin_calculator_page-exp_method_note"],
										content: result.note
									})
								} : {})
							}
						}),
						lunacy: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-exp_lunacy"],
							dataset: { label: "[현금/엔케 → 광기] 환산" },
							content: result.lunacyWorth.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
						}),
						exp: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-exp_supply"],
							dataset: { label: "경험치 수급량" },
							content: result.expSupply.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
						}),
						efficiency: Structure.write({
							classList: ["enkephalin_calculator_page-table_cell", "enkephalin_calculator_page-exp_efficiency"],
							dataset: { label: "광기당 경험치" },
							content: result.expPerLunacy.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
						})
					}
				});
			});
			
			return Structure.write({
				classList: ["enkephalin_calculator_page-exp_efficiency"],
				children: {
					title: Structure.write({
						classList: ["enkephalin_calculator_page-section_title", "enkephalin_calculator_page-exp_title"],
						children: {
							text: Structure.write({
								classList: ["enkephalin_calculator_page-exp_title_text"],
								content: "경험치 수급 효율"
							}),
							info: Structure.write({
								classList: ["enkephalin_calculator_page-exp_title_info"],
								content: `경던 1회당 수급량 = ${Calculator.calculateExpTotal(Calculator.getStandardExpDungeon().tickets).toLocaleString()}`
							})
						}
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
									})
								}
							}),
							...rows
						}
					}),
					note: Structure.write({
						classList: ["enkephalin_calculator_page-note"],
						content: ""
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


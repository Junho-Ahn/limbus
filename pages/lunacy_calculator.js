let lunacy_calculator_page = null;

(() => {
	// 참조 데이터
	const REFERENCE_DATA = enkephalinData;
	
	// 로컬스토리지 키
	const STORAGE_KEY = 'lunacy_calculator_settings';
	
	// 로컬스토리지 관리
	const Storage = {
		save() {
			try {
				const data = {
					weeklyInspection: State.weeklyInspection,
					weeklyMirror: State.weeklyMirror,
					monthlySmall: State.monthlySmall,
					monthlyLarge: State.monthlyLarge,
					additionalFreeLunacy: State.additionalFreeLunacy,
					additionalPaidLunacy: State.additionalPaidLunacy,
					chargeCount: State.chargeCount,
					paidGachaCount: State.paidGachaCount,
					additionalConsumption: State.additionalConsumption
				};
				localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
			} catch (e) {
				console.warn('로컬스토리지 저장 실패:', e);
			}
		},
		
		load() {
			try {
				const saved = localStorage.getItem(STORAGE_KEY);
				if (saved) {
					const data = JSON.parse(saved);
					if (typeof data.weeklyInspection === 'boolean') {
						State.weeklyInspection = data.weeklyInspection;
					}
					if (typeof data.weeklyMirror === 'boolean') {
						State.weeklyMirror = data.weeklyMirror;
					}
					if (typeof data.monthlySmall === 'boolean') {
						State.monthlySmall = data.monthlySmall;
					}
					if (typeof data.monthlyLarge === 'boolean') {
						State.monthlyLarge = data.monthlyLarge;
					}
					if (typeof data.additionalFreeLunacy === 'number' && data.additionalFreeLunacy >= 0) {
						State.additionalFreeLunacy = data.additionalFreeLunacy;
					}
					if (typeof data.additionalPaidLunacy === 'number' && data.additionalPaidLunacy >= 0) {
						State.additionalPaidLunacy = data.additionalPaidLunacy;
					}
					if (typeof data.chargeCount === 'number' && data.chargeCount >= 0 && data.chargeCount <= 10) {
						State.chargeCount = data.chargeCount;
					}
					if (typeof data.paidGachaCount === 'number' && data.paidGachaCount >= 0 && data.paidGachaCount <= 3) {
						State.paidGachaCount = data.paidGachaCount;
					}
					if (typeof data.additionalConsumption === 'number' && data.additionalConsumption >= 0) {
						State.additionalConsumption = data.additionalConsumption;
					}
				}
			} catch (e) {
				console.warn('로컬스토리지 불러오기 실패:', e);
			}
		}
	};
	
	// 상태 관리
	const State = {
		// 수급
		weeklyInspection: false,  // 점검-300 (무료)
		weeklyMirror: false,      // 거울 던전-750 (무료)
		monthlySmall: false,      // 월정액(소)-273 (유료)
		monthlyLarge: false,      // 월정액(대)-455 (유료)
		additionalFreeLunacy: 0,  // 추가 광기 (무료)
		additionalPaidLunacy: 0,  // 추가 광기 (유료)
		// 소비
		chargeCount: 0,           // 광기 충전 횟수 (0-10)
		paidGachaCount: 0,        // 유료 단챠 횟수 (0-3)
		additionalConsumption: 0  // 추가 소비 광기
	};
	
	// 초기화 시 저장된 값 불러오기
	Storage.load();
	
	// 계산 함수들
	const Calculator = {
		// 광기 충전 횟수별 광기 절대 소모량
		getAbsoluteLunacyConsumption(chargeCount) {
			return (REFERENCE_DATA.chargeIncrement / 2) * chargeCount * (chargeCount + 1);
		},
		
		// 유료 수급 계산
		getPaidSupply() {
			let supply = 0;
			if (State.monthlySmall) supply += 273;
			if (State.monthlyLarge) supply += 455;
			supply += State.additionalPaidLunacy;
			return supply;
		},
		
		// 무료 수급 계산
		getFreeSupply() {
			let supply = 0;
			if (State.weeklyInspection) supply += 300;
			if (State.weeklyMirror) supply += 750;
			supply += State.additionalFreeLunacy;
			return supply;
		},
		
		// 통합 수급 계산
		getTotalSupply() {
			return this.getPaidSupply() + this.getFreeSupply();
		},
		
		// 유료 소모 계산
		getPaidConsumption() {
			// 유료 단챠 1회당 유료 광기 13 소모
			return State.paidGachaCount * 13;
		},
		
		// 무료 소모 계산
		getFreeConsumption() {
			const chargeConsumption = this.getAbsoluteLunacyConsumption(State.chargeCount);
			return chargeConsumption + State.additionalConsumption;
		},
		
		// 통합 소모 계산
		getTotalConsumption() {
			return this.getPaidConsumption() + this.getFreeConsumption();
		},
		
		// 유료 계 계산
		getPaidBalance() {
			return this.getPaidSupply() - this.getPaidConsumption();
		},
		
		// 무료 계 계산
		getFreeBalance() {
			return this.getFreeSupply() - this.getFreeConsumption();
		},
		
		// 통합 계 계산
		getTotalBalance() {
			return this.getTotalSupply() - this.getTotalConsumption();
		}
	};
	
	// 이벤트 핸들러
	const EventHandlers = {
		onWeeklyInspectionChange(event) {
			State.weeklyInspection = event.target.checked;
			Storage.save();
			UIManager.updateAll();
		},
		
		onWeeklyMirrorChange(event) {
			State.weeklyMirror = event.target.checked;
			Storage.save();
			UIManager.updateAll();
		},
		
		onMonthlySmallChange(event) {
			State.monthlySmall = event.target.checked;
			Storage.save();
			UIManager.updateAll();
		},
		
		onMonthlyLargeChange(event) {
			State.monthlyLarge = event.target.checked;
			Storage.save();
			UIManager.updateAll();
		},
		
		onAdditionalFreeLunacyChange(event) {
			State.additionalFreeLunacy = parseInt(event.target.value) || 0;
			Storage.save();
			UIManager.updateAll();
		},
		
		onAdditionalPaidLunacyChange(event) {
			State.additionalPaidLunacy = parseInt(event.target.value) || 0;
			Storage.save();
			UIManager.updateAll();
		},
		
		onChargeCountChange(event) {
			const value = parseInt(event.target.value) || 0;
			State.chargeCount = Math.max(0, Math.min(10, value));
			Storage.save();
			UIManager.updateAll();
		},
		
		onPaidGachaCountChange(event) {
			const value = parseInt(event.target.value) || 0;
			State.paidGachaCount = Math.max(0, Math.min(3, value));
			Storage.save();
			UIManager.updateAll();
		},
		
		onAdditionalConsumptionChange(event) {
			State.additionalConsumption = parseInt(event.target.value) || 0;
			Storage.save();
			UIManager.updateAll();
		}
	};
	
	// UI 업데이트 함수
	const UIManager = {
		updateAll() {
			// 유료 행 업데이트
			const paidSupply = Calculator.getPaidSupply();
			const paidConsumption = Calculator.getPaidConsumption();
			const paidBalance = Calculator.getPaidBalance();
			
			const paidSupplyCell = document.querySelector('.lunacy_calculator_page-paid_supply');
			const paidConsumptionCell = document.querySelector('.lunacy_calculator_page-paid_consumption');
			const paidBalanceCell = document.querySelector('.lunacy_calculator_page-paid_balance');
			
			if (paidSupplyCell) paidSupplyCell.textContent = paidSupply.toLocaleString();
			if (paidConsumptionCell) paidConsumptionCell.textContent = paidConsumption.toLocaleString();
			if (paidBalanceCell) {
				paidBalanceCell.textContent = paidBalance.toLocaleString();
				// 양수/음수에 따라 색상 변경
				if (paidBalance > 0) {
					paidBalanceCell.style.color = '#4CAF50';
				} else if (paidBalance < 0) {
					paidBalanceCell.style.color = '#f44336';
				} else {
					paidBalanceCell.style.color = '#fff';
				}
			}
			
			// 무료 행 업데이트
			const freeSupply = Calculator.getFreeSupply();
			const freeConsumption = Calculator.getFreeConsumption();
			const freeBalance = Calculator.getFreeBalance();
			
			const freeSupplyCell = document.querySelector('.lunacy_calculator_page-free_supply');
			const freeConsumptionCell = document.querySelector('.lunacy_calculator_page-free_consumption');
			const freeBalanceCell = document.querySelector('.lunacy_calculator_page-free_balance');
			
			if (freeSupplyCell) freeSupplyCell.textContent = freeSupply.toLocaleString();
			if (freeConsumptionCell) freeConsumptionCell.textContent = freeConsumption.toLocaleString();
			if (freeBalanceCell) {
				freeBalanceCell.textContent = freeBalance.toLocaleString();
				// 양수/음수에 따라 색상 변경
				if (freeBalance > 0) {
					freeBalanceCell.style.color = '#4CAF50';
				} else if (freeBalance < 0) {
					freeBalanceCell.style.color = '#f44336';
				} else {
					freeBalanceCell.style.color = '#fff';
				}
			}
			
			// 통합 행 업데이트
			const totalSupply = Calculator.getTotalSupply();
			const totalConsumption = Calculator.getTotalConsumption();
			const totalBalance = Calculator.getTotalBalance();
			
			const totalSupplyCell = document.querySelector('.lunacy_calculator_page-total_supply');
			const totalConsumptionCell = document.querySelector('.lunacy_calculator_page-total_consumption');
			const totalBalanceCell = document.querySelector('.lunacy_calculator_page-total_balance');
			
			if (totalSupplyCell) totalSupplyCell.textContent = totalSupply.toLocaleString();
			if (totalConsumptionCell) totalConsumptionCell.textContent = totalConsumption.toLocaleString();
			if (totalBalanceCell) {
				totalBalanceCell.textContent = totalBalance.toLocaleString();
				// 양수/음수에 따라 색상 변경
				if (totalBalance > 0) {
					totalBalanceCell.style.color = '#4CAF50';
				} else if (totalBalance < 0) {
					totalBalanceCell.style.color = '#f44336';
				} else {
					totalBalanceCell.style.color = '#fff';
				}
			}
		}
	};
	
	// 컴포넌트 생성
	const ComponentFactory = {
		createSettingsSection() {
			return Structure.write({
				classList: ["lunacy_calculator_page-settings"],
				children: {
					supply_section: Structure.write({
						classList: ["lunacy_calculator_page-settings_section"],
						children: {
							title: Structure.write({
								classList: ["lunacy_calculator_page-settings_section_title"],
								content: "수급"
							}),
							inputs: Structure.write({
								classList: ["lunacy_calculator_page-settings_inputs"],
								children: {
									inspection_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["lunacy_calculator_page-settings_checkbox_label"],
										children: {
											checkbox: Structure.write({
												tagName: "input",
												classList: ["lunacy_calculator_page-settings_checkbox"],
												properties: {
													type: "checkbox",
													id: "weekly_inspection_checkbox",
													...(State.weeklyInspection ? { checked: "checked" } : {})
												},
												events: {
													change: EventHandlers.onWeeklyInspectionChange
												}
											}),
											text: Structure.write({
												tagName: "span",
												content: "점검-300"
											})
										}
									})
								}
							}),
							mirror_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["lunacy_calculator_page-settings_checkbox_label"],
										children: {
											checkbox: Structure.write({
												tagName: "input",
												classList: ["lunacy_calculator_page-settings_checkbox"],
												properties: {
													type: "checkbox",
													id: "weekly_mirror_checkbox",
													...(State.weeklyMirror ? { checked: "checked" } : {})
												},
												events: {
													change: EventHandlers.onWeeklyMirrorChange
												}
											}),
											text: Structure.write({
												tagName: "span",
												content: "거울 던전-750"
											})
										}
									})
								}
							}),
							monthly_small_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["lunacy_calculator_page-settings_checkbox_label"],
										children: {
											checkbox: Structure.write({
												tagName: "input",
												classList: ["lunacy_calculator_page-settings_checkbox"],
												properties: {
													type: "checkbox",
													id: "monthly_small_checkbox",
													...(State.monthlySmall ? { checked: "checked" } : {})
												},
												events: {
													change: EventHandlers.onMonthlySmallChange
												}
											}),
											text: Structure.write({
												tagName: "span",
												content: "월정액(소)-273"
											})
										}
									})
								}
							}),
							monthly_large_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["lunacy_calculator_page-settings_checkbox_label"],
										children: {
											checkbox: Structure.write({
												tagName: "input",
												classList: ["lunacy_calculator_page-settings_checkbox"],
												properties: {
													type: "checkbox",
													id: "monthly_large_checkbox",
													...(State.monthlyLarge ? { checked: "checked" } : {})
												},
												events: {
													change: EventHandlers.onMonthlyLargeChange
												}
											}),
											text: Structure.write({
												tagName: "span",
												content: "월정액(대)-455"
											})
										}
									})
								}
							}),
							additional_free_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["lunacy_calculator_page-settings_label"],
										properties: { for: "additional_free_lunacy_input" },
										content: "추가 광기 (무료)"
									}),
									input: Structure.write({
										tagName: "input",
										classList: ["lunacy_calculator_page-settings_input"],
										properties: {
											type: "number",
											id: "additional_free_lunacy_input",
											min: "0",
											value: String(State.additionalFreeLunacy)
										},
										events: {
											input: EventHandlers.onAdditionalFreeLunacyChange
										}
									})
								}
							}),
							additional_paid_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["lunacy_calculator_page-settings_label"],
										properties: { for: "additional_paid_lunacy_input" },
										content: "추가 광기 (유료)"
									}),
									input: Structure.write({
										tagName: "input",
										classList: ["lunacy_calculator_page-settings_input"],
										properties: {
											type: "number",
											id: "additional_paid_lunacy_input",
											min: "0",
											value: String(State.additionalPaidLunacy)
										},
										events: {
											input: EventHandlers.onAdditionalPaidLunacyChange
										}
									})
								}
							})
						}
					})
				}
			}),
					consumption_section: Structure.write({
						classList: ["lunacy_calculator_page-settings_section"],
						children: {
							title: Structure.write({
								classList: ["lunacy_calculator_page-settings_section_title"],
								content: "소비"
							}),
							inputs: Structure.write({
								classList: ["lunacy_calculator_page-settings_inputs"],
								children: {
									charge_count_group: Structure.write({
										classList: ["lunacy_calculator_page-settings_group"],
										children: {
											label: Structure.write({
												tagName: "label",
												classList: ["lunacy_calculator_page-settings_label"],
												properties: { for: "charge_count_input" },
												content: "광기 충전 횟수 (0-10)"
											}),
											input: Structure.write({
												tagName: "input",
												classList: ["lunacy_calculator_page-settings_input"],
												properties: {
													type: "number",
													id: "charge_count_input",
													min: "0",
													max: "10",
													value: String(State.chargeCount)
												},
												events: {
													input: EventHandlers.onChargeCountChange
												}
											})
										}
									}),
									paid_gacha_group: Structure.write({
										classList: ["lunacy_calculator_page-settings_group"],
										children: {
											label: Structure.write({
												tagName: "label",
												classList: ["lunacy_calculator_page-settings_label"],
												properties: { for: "paid_gacha_count_input" },
												content: "유료 단챠 횟수 (0-3)"
											}),
											input: Structure.write({
												tagName: "input",
												classList: ["lunacy_calculator_page-settings_input"],
												properties: {
													type: "number",
													id: "paid_gacha_count_input",
													min: "0",
													max: "3",
													value: String(State.paidGachaCount)
												},
												events: {
													input: EventHandlers.onPaidGachaCountChange
												}
											})
										}
									}),
									additional_consumption_group: Structure.write({
										classList: ["lunacy_calculator_page-settings_group"],
										children: {
											label: Structure.write({
												tagName: "label",
												classList: ["lunacy_calculator_page-settings_label"],
												properties: { for: "additional_consumption_input" },
												content: "추가 소비 광기"
											}),
											input: Structure.write({
												tagName: "input",
												classList: ["lunacy_calculator_page-settings_input"],
												properties: {
													type: "number",
													id: "additional_consumption_input",
													min: "0",
													value: String(State.additionalConsumption)
												},
												events: {
													input: EventHandlers.onAdditionalConsumptionChange
												}
											})
										}
									})
								}
							})
						}
					})
				}
			});
		},
		
		createResultsSection() {
			return Structure.write({
				classList: ["lunacy_calculator_page-results"],
				children: {
					title: Structure.write({
						classList: ["lunacy_calculator_page-section_title"],
						content: "결과"
					}),
					table: Structure.write({
						classList: ["lunacy_calculator_page-table"],
						children: {
							header: Structure.write({
								classList: ["lunacy_calculator_page-table_header"],
								children: {
									label: Structure.write({
										classList: ["lunacy_calculator_page-table_cell"],
										content: "구분"
									}),
									paid: Structure.write({
										classList: ["lunacy_calculator_page-table_cell"],
										content: "유료"
									}),
									free: Structure.write({
										classList: ["lunacy_calculator_page-table_cell"],
										content: "무료"
									}),
									total: Structure.write({
										classList: ["lunacy_calculator_page-table_cell"],
										content: "통합"
									})
								}
							}),
							supply_row: Structure.write({
								classList: ["lunacy_calculator_page-table_row"],
								children: {
									label: Structure.write({
										classList: ["lunacy_calculator_page-table_cell"],
										content: "수급"
									}),
									paid: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-paid_supply"],
										content: "0"
									}),
									free: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-free_supply"],
										content: "0"
									}),
									total: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-total_supply"],
										content: "0"
									})
								}
							}),
							consumption_row: Structure.write({
								classList: ["lunacy_calculator_page-table_row"],
								children: {
									label: Structure.write({
										classList: ["lunacy_calculator_page-table_cell"],
										content: "소모"
									}),
									paid: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-paid_consumption"],
										content: "0"
									}),
									free: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-free_consumption"],
										content: "0"
									}),
									total: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-total_consumption"],
										content: "0"
									})
								}
							}),
							balance_row: Structure.write({
								classList: ["lunacy_calculator_page-table_row"],
								children: {
									label: Structure.write({
										classList: ["lunacy_calculator_page-table_cell"],
										content: "계"
									}),
									paid: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-paid_balance"],
										content: "0"
									}),
									free: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-free_balance"],
										content: "0"
									}),
									total: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-total_balance"],
										content: "0"
									})
								}
							}),
							note: Structure.write({
								classList: ["lunacy_calculator_page-note"]
							})
						}
					})
				}
			});
		}
	};
	
	// 메인 페이지 생성
	const createMainPage = () => {
		return Structure.write({
			classList: ["lunacy_calculator_page"],
			children: {
				settings: ComponentFactory.createSettingsSection(),
				results: ComponentFactory.createResultsSection()
			}
		});
	};
	
	// 초기화
	lunacy_calculator_page = createMainPage();
	
	// 페이지가 로드되면 초기화
	const initializePage = () => {
		const checkAndUpdate = () => {
			const settings = document.querySelector('.lunacy_calculator_page-settings');
			if (settings) {
				UIManager.updateAll();
			} else {
				setTimeout(checkAndUpdate, 50);
			}
		};
		checkAndUpdate();
	};
	
	if (typeof window !== 'undefined') {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initializePage);
		} else {
			initializePage();
		}
	}
})();

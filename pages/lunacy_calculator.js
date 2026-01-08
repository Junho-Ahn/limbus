let lunacy_calculator_page = null;

(() => {
	// 참조 데이터
	const REFERENCE_DATA = enkephalinData;
	const LUNACY_DATA = lunacyData;
	
	// 로컬스토리지 키
	const STORAGE_KEY = 'lunacy_calculator_settings';
	
	// 로컬스토리지 관리
	const Storage = {
		save() {
			try {
				const data = {
					periodType: State.periodType,
					showDetail: State.showDetail,
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
					if (data.periodType === 'weekly' || data.periodType === 'monthly') {
						State.periodType = data.periodType;
					}
					if (typeof data.showDetail === 'boolean') {
						State.showDetail = data.showDetail;
					}
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
		periodType: 'weekly',     // 'weekly' 또는 'monthly'
		showDetail: false,        // 상세보기 모드
		// 수급
		weeklyInspection: false,  // 점검 (무료)
		weeklyMirror: false,      // 거울 던전 (무료)
		monthlySmall: false,      // 월정액(소) (무료)
		monthlyLarge: false,      // 월정액(대) (무료)
		additionalFreeLunacy: 0,  // 추가 광기 (무료)
		additionalPaidLunacy: 0,  // 추가 광기 (유료)
		// 소모
		chargeCount: 0,           // 광기 충전 횟수 (0-10)
		paidGachaCount: 0,        // 유료 단챠 횟수 (0-6)
		additionalConsumption: 0  // 추가 소모 광기 (주/개월 단위)
	};
	
	// 초기화 시 저장된 값 불러오기
	Storage.load();
	
	// 계산 함수들
	const Calculator = {
		// 주/월 배율 계산 (수급용)
		getPeriodMultiplier() {
			return State.periodType === 'monthly' ? 4 : 1;
		},
		
		// 일일 소모 배율 계산 (소모용)
		getDailyConsumptionMultiplier() {
			return State.periodType === 'monthly' ? 28 : 7;
		},
		
		// 광기 충전 횟수별 광기 절대 소모량
		getAbsoluteLunacyConsumption(chargeCount) {
			return (REFERENCE_DATA.chargeIncrement / 2) * chargeCount * (chargeCount + 1);
		},
		
		// 유료 수급 계산 (주 단위 기준)
		getPaidSupplyWeekly() {
			let supply = 0;
			// 월정액 유료 광기 수급 (주 단위 기준)
			if (State.monthlySmall) supply += LUNACY_DATA.supply.monthlySmallPaidWeekly;
			if (State.monthlyLarge) supply += LUNACY_DATA.supply.monthlyLargePaidWeekly;
			supply += State.additionalPaidLunacy;
			return supply;
		},
		
		// 무료 수급 계산 (주 단위 기준)
		getFreeSupplyWeekly() {
			let supply = 0;
			if (State.weeklyInspection) supply += LUNACY_DATA.supply.weeklyInspection;
			if (State.weeklyMirror) supply += LUNACY_DATA.supply.weeklyMirror;
			// 월정액은 일일 기준 → 주 단위로 환산 (일일 * 7)
			if (State.monthlySmall) supply += LUNACY_DATA.supply.monthlySmallDaily * 7;
			if (State.monthlyLarge) supply += LUNACY_DATA.supply.monthlyLargeDaily * 7;
			supply += State.additionalFreeLunacy;
			return supply;
		},
		
		// 유료 수급 계산 (표시용, 주/개월 배율 적용)
		getPaidSupply() {
			// 추가 수급 광기는 주 단위로 입력받으므로 배율 적용하지 않음
			const weeklyBase = this.getPaidSupplyWeekly() - State.additionalPaidLunacy;
			return weeklyBase * this.getPeriodMultiplier() + State.additionalPaidLunacy;
		},
		
		// 무료 수급 계산 (표시용, 주/개월 배율 적용)
		getFreeSupply() {
			// 추가 수급 광기는 주 단위로 입력받으므로 배율 적용하지 않음
			const weeklyBase = this.getFreeSupplyWeekly() - State.additionalFreeLunacy;
			return weeklyBase * this.getPeriodMultiplier() + State.additionalFreeLunacy;
		},
		
		// 통합 수급 계산
		getTotalSupply() {
			return this.getPaidSupply() + this.getFreeSupply();
		},
		
		// 유료 소모 계산 (일일 기준)
		getPaidConsumptionDaily() {
			return State.paidGachaCount * LUNACY_DATA.consumption.paidGachaPerDay;
		},
		
		// 무료 소모 계산 (일일 기준)
		getFreeConsumptionDaily() {
			const chargeConsumption = this.getAbsoluteLunacyConsumption(State.chargeCount);
			// 추가 소모 광기는 주/개월 단위로 입력받으므로 일일 단위로 변환
			const additionalConsumptionDaily = State.additionalConsumption / this.getDailyConsumptionMultiplier();
			return chargeConsumption + additionalConsumptionDaily;
		},
		
		// 유료 소모 계산 (표시용, 일일 × 배율)
		getPaidConsumption() {
			return this.getPaidConsumptionDaily() * this.getDailyConsumptionMultiplier();
		},
		
		// 무료 소모 계산 (표시용, 일일 × 배율)
		getFreeConsumption() {
			return this.getFreeConsumptionDaily() * this.getDailyConsumptionMultiplier();
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
		},
		
		// 상세보기용 각 항목별 계산 함수들
		getInspectionSupply() {
			if (!State.weeklyInspection) return 0;
			return LUNACY_DATA.supply.weeklyInspection * this.getPeriodMultiplier();
		},
		
		getMirrorSupply() {
			if (!State.weeklyMirror) return 0;
			return LUNACY_DATA.supply.weeklyMirror * this.getPeriodMultiplier();
		},
		
		getMonthlySmallFreeSupply() {
			if (!State.monthlySmall) return 0;
			return LUNACY_DATA.supply.monthlySmallDaily * 7 * this.getPeriodMultiplier();
		},
		
		getMonthlySmallPaidSupply() {
			if (!State.monthlySmall) return 0;
			return LUNACY_DATA.supply.monthlySmallPaidWeekly * this.getPeriodMultiplier();
		},
		
		getMonthlyLargeFreeSupply() {
			if (!State.monthlyLarge) return 0;
			return LUNACY_DATA.supply.monthlyLargeDaily * 7 * this.getPeriodMultiplier();
		},
		
		getMonthlyLargePaidSupply() {
			if (!State.monthlyLarge) return 0;
			return LUNACY_DATA.supply.monthlyLargePaidWeekly * this.getPeriodMultiplier();
		},
		
		getAdditionalFreeSupply() {
			return State.additionalFreeLunacy;
		},
		
		getAdditionalPaidSupply() {
			return State.additionalPaidLunacy;
		},
		
		getChargeConsumption() {
			if (State.chargeCount === 0) return 0;
			return -this.getAbsoluteLunacyConsumption(State.chargeCount) * this.getDailyConsumptionMultiplier();
		},
		
		getPaidGachaConsumption() {
			if (State.paidGachaCount === 0) return 0;
			return -this.getPaidConsumptionDaily() * this.getDailyConsumptionMultiplier();
		},
		
		getAdditionalConsumptionValue() {
			if (State.additionalConsumption === 0) return 0;
			return -State.additionalConsumption;
		}
	};
	
	// 이벤트 핸들러
	const EventHandlers = {
		onPeriodTypeChange(event) {
			State.periodType = event.target.value;
			Storage.save();
			UIManager.updateAll();
		},
		
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
			State.paidGachaCount = Math.max(0, Math.min(6, value));
			Storage.save();
			UIManager.updateAll();
		},
		
		onAdditionalConsumptionChange(event) {
			State.additionalConsumption = parseInt(event.target.value) || 0;
			Storage.save();
			UIManager.updateAll();
		},
		
		onShowDetailChange(event) {
			State.showDetail = event.target.checked;
			Storage.save();
			UIManager.updateAll();
		}
	};
	
	// UI 업데이트 함수
	const UIManager = {
		updateAdditionalConsumptionLabel() {
			const label = document.querySelector('.lunacy_calculator_page-additional_consumption_label');
			if (label) {
				const periodText = State.periodType === 'monthly' ? '1개월' : '1주';
				label.textContent = `추가 소모 광기(${periodText})`;
			}
		},
		
		updateAll() {
			// 추가 소모 광기 라벨 업데이트
			this.updateAdditionalConsumptionLabel();
			
			if (State.showDetail) {
				this.updateDetailView();
			} else {
				this.updateSummaryView();
			}
		},
		
		updateSummaryView() {
			// 요약 행들 다시 표시
			const table = document.querySelector('.lunacy_calculator_page-table');
			if (table) {
				const summaryRows = table.querySelectorAll('.lunacy_calculator_page-table_row:not(.lunacy_calculator_page-detail_row)');
				summaryRows.forEach(row => {
					row.style.display = '';
				});
				
				// 상세 행들 제거
				const detailRows = table.querySelectorAll('.lunacy_calculator_page-detail_row');
				detailRows.forEach(row => row.remove());
			}
			
			// 기존 요약 뷰 업데이트
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
		},
		
		updateDetailView() {
			// 상세보기 모드: 각 항목별로 행 업데이트
			const table = document.querySelector('.lunacy_calculator_page-table');
			if (!table) return;
			
			// 요약 행들 숨기기
			const summaryRows = table.querySelectorAll('.lunacy_calculator_page-table_row:not(.lunacy_calculator_page-detail_row)');
			summaryRows.forEach(row => {
				if (!row.classList.contains('lunacy_calculator_page-table_header')) {
					row.style.display = 'none';
				}
			});
			
			// 기존 상세 행들 제거
			const existingDetailRows = table.querySelectorAll('.lunacy_calculator_page-detail_row');
			existingDetailRows.forEach(row => row.remove());
			
			// 수급 항목들
			const supplyItems = [
				{ label: '점검', getValue: () => Calculator.getInspectionSupply(), isFree: true, isPaid: false },
				{ label: '거울 던전', getValue: () => Calculator.getMirrorSupply(), isFree: true, isPaid: false },
				{ label: '월정액(소) - 무료', getValue: () => Calculator.getMonthlySmallFreeSupply(), isFree: true, isPaid: false },
				{ label: '월정액(소) - 유료', getValue: () => Calculator.getMonthlySmallPaidSupply(), isFree: false, isPaid: true },
				{ label: '월정액(대) - 무료', getValue: () => Calculator.getMonthlyLargeFreeSupply(), isFree: true, isPaid: false },
				{ label: '월정액(대) - 유료', getValue: () => Calculator.getMonthlyLargePaidSupply(), isFree: false, isPaid: true },
				{ label: '추가 수급 광기 (무료)', getValue: () => Calculator.getAdditionalFreeSupply(), isFree: true, isPaid: false },
				{ label: '추가 수급 광기 (유료)', getValue: () => Calculator.getAdditionalPaidSupply(), isFree: false, isPaid: true }
			];
			
			// 소모 항목들 (마이너스로 표기)
			const consumptionItems = [
				{ label: '광기 충전', getValue: () => Calculator.getChargeConsumption(), isFree: true, isPaid: false },
				{ label: '유료 단챠', getValue: () => Calculator.getPaidGachaConsumption(), isFree: false, isPaid: true },
				{ label: '추가 소모 광기', getValue: () => Calculator.getAdditionalConsumptionValue(), isFree: true, isPaid: false }
			];
			
			// 수급 행들 추가
			supplyItems.forEach(item => {
				const value = item.getValue();
				if (value === 0) return; // 0인 항목은 표시하지 않음
				
				const row = this.createDetailRow(item.label, value, item.isFree, item.isPaid);
				const header = table.querySelector('.lunacy_calculator_page-table_header');
				if (header) {
					header.insertAdjacentElement('afterend', row);
				}
			});
			
			// 소모 행들 추가
			consumptionItems.forEach(item => {
				const value = item.getValue();
				if (value === 0) return; // 0인 항목은 표시하지 않음
				
				const row = this.createDetailRow(item.label, value, item.isFree, item.isPaid);
				const lastRow = table.querySelector('.lunacy_calculator_page-detail_row:last-of-type');
				if (lastRow) {
					lastRow.insertAdjacentElement('afterend', row);
				} else {
					const header = table.querySelector('.lunacy_calculator_page-table_header');
					if (header) {
						header.insertAdjacentElement('afterend', row);
					}
				}
			});
			
			// 계 행 추가
			const paidBalance = Calculator.getPaidBalance();
			const freeBalance = Calculator.getFreeBalance();
			const totalBalance = Calculator.getTotalBalance();
			
			const balanceRow = document.createElement('div');
			balanceRow.className = 'lunacy_calculator_page-table_row lunacy_calculator_page-detail_row';
			balanceRow.innerHTML = `
				<div class="lunacy_calculator_page-table_cell">계</div>
				<div class="lunacy_calculator_page-table_cell" style="color: ${paidBalance >= 0 ? '#4CAF50' : '#f44336'}">${paidBalance.toLocaleString()}</div>
				<div class="lunacy_calculator_page-table_cell" style="color: ${freeBalance >= 0 ? '#4CAF50' : '#f44336'}">${freeBalance.toLocaleString()}</div>
				<div class="lunacy_calculator_page-table_cell" style="color: ${totalBalance >= 0 ? '#4CAF50' : '#f44336'}">${totalBalance.toLocaleString()}</div>
			`;
			
			const lastDetailRow = table.querySelector('.lunacy_calculator_page-detail_row:last-of-type');
			if (lastDetailRow) {
				lastDetailRow.insertAdjacentElement('afterend', balanceRow);
			} else {
				const header = table.querySelector('.lunacy_calculator_page-table_header');
				if (header) {
					header.insertAdjacentElement('afterend', balanceRow);
				}
			}
		},
		
		createDetailRow(label, value, isFree, isPaid) {
			const row = document.createElement('div');
			row.className = 'lunacy_calculator_page-table_row lunacy_calculator_page-detail_row';
			
			const paidValue = isPaid ? value : 0;
			const freeValue = isFree ? value : 0;
			const totalValue = value;
			
			row.innerHTML = `
				<div class="lunacy_calculator_page-table_cell">${label}</div>
				<div class="lunacy_calculator_page-table_cell" style="color: ${paidValue >= 0 ? '#fff' : '#f44336'}">${paidValue.toLocaleString()}</div>
				<div class="lunacy_calculator_page-table_cell" style="color: ${freeValue >= 0 ? '#fff' : '#f44336'}">${freeValue.toLocaleString()}</div>
				<div class="lunacy_calculator_page-table_cell" style="color: ${totalValue >= 0 ? '#fff' : '#f44336'}">${totalValue.toLocaleString()}</div>
			`;
			
			return row;
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
							period_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group", "lunacy_calculator_page-settings_group--period"],
								children: {
									label_wrapper: Structure.write({
										classList: ["lunacy_calculator_page-settings_label_wrapper"],
										children: {
											label: Structure.write({
												tagName: "label",
												classList: ["lunacy_calculator_page-settings_label"],
												content: "단위"
											}),
											subtext: Structure.write({
												tagName: "span",
												classList: ["lunacy_calculator_page-settings_label_subtext"],
												content: "* 편의상 1개월=4주로 계산"
											})
										}
									}),
									radio_group: Structure.write({
										classList: ["lunacy_calculator_page-settings_radio_group"],
										children: {
											weekly_label: Structure.write({
												tagName: "label",
												classList: ["lunacy_calculator_page-settings_radio_label"],
												children: {
													radio: Structure.write({
														tagName: "input",
														classList: ["lunacy_calculator_page-settings_radio"],
														properties: {
															type: "radio",
															name: "period_type",
															id: "period_weekly",
															value: "weekly",
															...(State.periodType === 'weekly' ? { checked: "checked" } : {})
														},
														events: {
															change: EventHandlers.onPeriodTypeChange
														}
													}),
													text: Structure.write({
														tagName: "span",
														content: "1주"
													})
												}
											}),
											monthly_label: Structure.write({
												tagName: "label",
												classList: ["lunacy_calculator_page-settings_radio_label"],
												children: {
													radio: Structure.write({
														tagName: "input",
														classList: ["lunacy_calculator_page-settings_radio"],
														properties: {
															type: "radio",
															name: "period_type",
															id: "period_monthly",
															value: "monthly",
															...(State.periodType === 'monthly' ? { checked: "checked" } : {})
														},
														events: {
															change: EventHandlers.onPeriodTypeChange
														}
													}),
													text: Structure.write({
														tagName: "span",
														content: "1개월"
													})
												}
											})
										}
									}),
								}
							}),
							inputs: Structure.write({
								classList: ["lunacy_calculator_page-settings_inputs"],
								children: {
									checkbox_group: Structure.write({
										classList: ["lunacy_calculator_page-settings_checkbox_container"],
										children: {
											inspection_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group", "lunacy_calculator_page-settings_group--checkbox"],
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
												content: "점검"
											})
										}
									})
								}
							}),
							mirror_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group", "lunacy_calculator_page-settings_group--checkbox"],
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
												content: "거울 던전"
											})
										}
									})
								}
							}),
							monthly_small_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group", "lunacy_calculator_page-settings_group--checkbox"],
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
												content: "월정액(소)"
											})
										}
									})
								}
							}),
							monthly_large_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group", "lunacy_calculator_page-settings_group--checkbox"],
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
												content: "월정액(대)"
											})
										}
									})
								}
							})
										}
									}),
									additional_group: Structure.write({
										classList: ["lunacy_calculator_page-settings_additional_container"],
										children: {
											additional_free_group: Structure.write({
								classList: ["lunacy_calculator_page-settings_group", "lunacy_calculator_page-settings_group--additional"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["lunacy_calculator_page-settings_label"],
										properties: { for: "additional_free_lunacy_input" },
										content: "추가 수급 광기 (무료)"
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
								classList: ["lunacy_calculator_page-settings_group", "lunacy_calculator_page-settings_group--additional"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["lunacy_calculator_page-settings_label"],
										properties: { for: "additional_paid_lunacy_input" },
										content: "추가 수급 광기 (유료)"
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
					})
				}
			}),
					consumption_section: Structure.write({
						classList: ["lunacy_calculator_page-settings_section"],
						children: {
							title: Structure.write({
								classList: ["lunacy_calculator_page-settings_section_title"],
								content: "소모"
							}),
							inputs: Structure.write({
								classList: ["lunacy_calculator_page-settings_inputs", "lunacy_calculator_page-settings_inputs--consumption"],
								children: {
									charge_count_group: Structure.write({
										classList: ["lunacy_calculator_page-settings_group", "lunacy_calculator_page-settings_group--consumption"],
										children: {
											label: Structure.write({
												tagName: "label",
												classList: ["lunacy_calculator_page-settings_label"],
												properties: { for: "charge_count_input" },
												content: "광기 충전 횟수(일일)"
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
										classList: ["lunacy_calculator_page-settings_group", "lunacy_calculator_page-settings_group--consumption"],
										children: {
											label: Structure.write({
												tagName: "label",
												classList: ["lunacy_calculator_page-settings_label"],
												properties: { for: "paid_gacha_count_input" },
												content: "유료 단챠 횟수(일일)"
											}),
											input: Structure.write({
												tagName: "input",
												classList: ["lunacy_calculator_page-settings_input"],
												properties: {
													type: "number",
													id: "paid_gacha_count_input",
													min: "0",
													max: "6",
													value: String(State.paidGachaCount)
												},
												events: {
													input: EventHandlers.onPaidGachaCountChange
												}
											})
										}
									}),
									additional_consumption_group: Structure.write({
										classList: ["lunacy_calculator_page-settings_group", "lunacy_calculator_page-settings_group--consumption"],
										children: {
											label: Structure.write({
												tagName: "label",
												classList: ["lunacy_calculator_page-settings_label", "lunacy_calculator_page-additional_consumption_label"],
												properties: { for: "additional_consumption_input" },
												content: `추가 소모 광기(${State.periodType === 'monthly' ? '1개월' : '1주'})`
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
					title_wrapper: Structure.write({
						classList: ["lunacy_calculator_page-results_title_wrapper"],
						children: {
							title: Structure.write({
								classList: ["lunacy_calculator_page-section_title"],
								content: "결과"
							}),
							detail_checkbox_group: Structure.write({
								classList: ["lunacy_calculator_page-detail_checkbox_group"],
								children: {
									label: Structure.write({
										tagName: "label",
										classList: ["lunacy_calculator_page-detail_checkbox_label"],
										children: {
											checkbox: Structure.write({
												tagName: "input",
												classList: ["lunacy_calculator_page-detail_checkbox"],
												properties: {
													type: "checkbox",
													id: "show_detail_checkbox",
													...(State.showDetail ? { checked: "checked" } : {})
												},
												events: {
													change: EventHandlers.onShowDetailChange
												}
											}),
											text: Structure.write({
												tagName: "span",
												content: "상세보기"
											})
										}
									})
								}
							})
						}
					}),
					table: Structure.write({
						classList: ["lunacy_calculator_page-table"],
						children: {
							header: Structure.write({
								classList: ["lunacy_calculator_page-table_header"],
								children: {
									label: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-table_cell--header"],
										content: "구분"
									}),
									paid: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-table_cell--header"],
										content: "유료"
									}),
									free: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-table_cell--header"],
										content: "무료"
									}),
									total: Structure.write({
										classList: ["lunacy_calculator_page-table_cell", "lunacy_calculator_page-table_cell--header"],
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
				results: ComponentFactory.createResultsSection(),
				bottom_spacer: Structure.write({
					classList: ["lunacy_calculator_page-bottom_spacer"]
				})
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
		// 초기 로드 시 초기화
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initializePage);
		} else {
			initializePage();
		}
		
		// 라우터가 페이지를 렌더링할 때마다 초기화
		// MutationObserver를 사용하여 root 요소의 변경을 감지
		const root = document.getElementById('root');
		if (root) {
			const observer = new MutationObserver((mutations) => {
				// root의 자식이 변경되었을 때 (페이지 렌더링)
				for (const mutation of mutations) {
					if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
						// 광기 계산기 페이지인지 확인
						const lunacyPage = document.querySelector('.lunacy_calculator_page');
						if (lunacyPage) {
							// 약간의 지연을 두고 초기화 (DOM이 완전히 렌더링된 후)
							setTimeout(() => {
								initializePage();
							}, 10);
							break;
						}
					}
				}
			});
			
			observer.observe(root, {
				childList: true,
				subtree: false
			});
		}
	}
})();

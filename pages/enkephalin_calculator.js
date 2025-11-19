let enkephalin_calculator_page = null;

(() => {
	const Utils = {
		/*
		 * @param {string} value
		 */
		validateNumber(value) {
			return Number.isInteger(value) ? value : "";
		},
		objFrom(array) {
			return array.reduce(
				(acc, value, index) =>
					({...acc, [index]: value}),
				{}
			);
		}
	};
	
	const CONSTANTS = {
		DAILY_RECHARGE: 6 * 10 * 24
		
	};
	
	const executeCalc = {
		lunacyToEnke: () => {
			const lunacyToEnkeCalcResult = {};
			
			for(let i = 1; i <= 10; i++) {
				lunacyToEnkeCalcResult[i] = {
					requiredLunacy: 0
					
				};
			}
			
			return lunacyToEnkeCalcResult;
		},
		expDungeon: () => {
		
		}
	};
	
	// Editable Structures
	const ES = {
		userInput: {
			maxEnke: Structure.write({
				tagName: "input"
			}),
			lunacyToEnkeCount: Structure.write({
				tagName: "input"
			}),
			criteriaLunacyItem: Structure.write({
				tagName: "select"
			}),
			criteriaExpDungeon: Structure.write({
				tagName: "select"
			})
		},
		weeklyLunacy: {
			lunacyPerPrice: Structure.write({}),
			lunacyPerEnke: Structure.write({})
		},
		enkeResult: (() => {
			const obj = {};
			
			for(let i = 1; i <= 10; i++) {
				obj[i] = {
					lunacyCost: Structure.write({
					}),
					result: Structure.write({
					}),
					perLunacy: Structure.write({
					})
				};
			}
			
			return obj;
		})(),
		expResult: (() => {
			const obj = {
				weekly: Structure.write({
				}),
				monthly1: Structure.write({
				}),
				monthly2: Structure.write({
				}),
				monthly3: Structure.write({
				}),
				enkePackage: Structure.write({
				})
			};
			
			for(let i = 1; i <= 10; i++) {
				obj[i] = {
					costAsLunacy: Structure.write({
					}),
					resultExp: Structure.write({
					}),
					expPerLunacy: Structure.write({
					})
				};
			}
			
			return obj;
		})()
	};
	
	const createMainPage = () => {
		return Structure.write({
			children: {
				temp1: Structure.write({
					children: ES.userInput
				}),
				temp2: Structure.write({
					children: ES.weeklyLunacy
				}),
				temp3: Structure.write({
					children: ES.enkeResult
				}),
				temp4: Structure.write({
					children: ES.expResult
				})
			}
		})
	};
	
	createMainPage();
})();
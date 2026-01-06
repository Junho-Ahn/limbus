let lunacy_calculator_page = null;

(() => {
	lunacy_calculator_page = Structure.write({
		classList: ['lunacy_calculator_page'],
		children: {
			title: Structure.write({
				classList: ['lunacy_calculator_page-title'],
				content: '광기 계산기'
			}),
			content: Structure.write({
				classList: ['lunacy_calculator_page-content'],
				content: '광기 계산기 페이지 (구현 예정)'
			})
		}
	});
})();


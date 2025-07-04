let Header = null;
(() => {
	Header = Structure.write({
		classList: ['header'],
		children: {
			logoWrapper: Structure.write({
				classList: ['header-logo_wrapper'],
				children: {
					logoImage: Structure.write({
						tagName: 'img',
						properties: {src: './assets/images/mephy.webp'},
						classList: ['header-logo_image']
					}),
					logo: Structure.write({
						classList: ['header-logo'],
						content: '메피'
					})
				}
			}),
			nav: Structure.write({
				classList: ['header-nav'],
				children: {
					// main: Structure.write({
					// 	classList: ['header-nav_item'],
					// 	children: {
					// 		link: Structure.write({
					// 			tagName: 'a',
					// 			properties: { href: '/main' },
					// 			dataset: { routerLink: '' },
					// 			content: 'Main'
					// 		})
					// 	}
					// }),
					// test: Structure.write({
					// 	classList: ['header-nav_item'],
					// 	children: {
					// 		link: Structure.write({
					// 			tagName: 'a',
					// 			properties: { href: '/test' },
					// 			dataset: { routerLink: '' },
					// 			content: 'Test'
					// 		})
					// 	}
					// }),
					deck: Structure.write({
						classList: ['header-nav_item'],
						children: {
							link: Structure.write({
								tagName: 'a',
								properties: { href: '/deck-code-generator' },
								dataset: { routerLink: '' },
								content: '덱 코드 생성기'
							})
						}
					})
				}
			})
		}
	});
})(); 
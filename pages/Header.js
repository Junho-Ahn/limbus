let Header = null;
(() => {
	Header = Structure.write({
		classList: ['header'],
		children: {
			logo: Structure.write({
				classList: ['header-logo'],
				content: 'MyApp'
			}),
			nav: Structure.write({
				classList: ['header-nav'],
				children: {
					main: Structure.write({
						classList: ['header-nav_item'],
						children: {
							link: Structure.write({
								tagName: 'a',
								properties: { href: '/main' },
								dataset: { routerLink: '' },
								content: 'Main'
							})
						}
					}),
					test: Structure.write({
						classList: ['header-nav_item'],
						children: {
							link: Structure.write({
								tagName: 'a',
								properties: { href: '/test' },
								dataset: { routerLink: '' },
								content: 'Test'
							})
						}
					}),
					deck: Structure.write({
						classList: ['header-nav_item'],
						children: {
							link: Structure.write({
								tagName: 'a',
								properties: { href: '/deck-code-generator' },
								dataset: { routerLink: '' },
								content: 'Deck'
							})
						}
					})
				}
			})
		}
	});
})(); 
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
								properties: { href: '/main', 'data-router-link': '' },
								content: 'Main'
							})
						}
					}),
					test: Structure.write({
						classList: ['header-nav_item'],
						children: {
							link: Structure.write({
								tagName: 'a',
								properties: { href: '/test', 'data-router-link': '' },
								content: 'Test'
							})
						}
					})
				}
			})
		}
	});
})(); 
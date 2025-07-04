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
					home: Structure.write({
						classList: ['header-nav_item'],
						content: 'Home'
					}),
					about: Structure.write({
						classList: ['header-nav_item'],
						content: 'About'
					}),
					contact: Structure.write({
						classList: ['header-nav_item'],
						content: 'Contact'
					})
				}
			})
		}
	});
})(); 
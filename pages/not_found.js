let NotFoundPage = null;
(() => {
	NotFoundPage = Structure.write({
		classList: ['not_found'],
		children: {
			message: Structure.write({
				classList: ['not_found-message'],
				content: '404 Not Found'
			})
		}
	});
})(); 
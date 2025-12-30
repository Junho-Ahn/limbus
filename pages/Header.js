let Header = null;
(() => {
	// 메일 주소 복사 함수
	let emailCopyTimer = null;
	const contactEmail = 'mephy.contact@gmail.com';

	Header = Structure.write({
		classList: ['header'],
		children: {
			left: Structure.write({
				classList: ['header-left'],
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
							}),
							contact: Structure.write({
								classList: ['header-contact'],
								children: {
									email: Structure.write({
										classList: ['header-contact_email'],
										content: '건의 및 제보 : mephy.contact@gmail.com',
										events: {
											click: async (event) => {
												try {
													await navigator.clipboard.writeText(contactEmail);
													// 복사 성공 시 시각적 피드백
													const emailElement = event.target;
													if (emailElement) {
														const originalText = emailElement.textContent;
														emailElement.textContent = '복사되었습니다!';
														emailElement.style.color = '#4CAF50';
														emailCopyTimer = setTimeout(() => {
															emailElement.textContent = originalText;
															emailElement.style.color = '';
															emailCopyTimer = null;
														}, 1500);
													}
												} catch (err) {
													console.error('클립보드 복사 실패:', err);
													// 폴백: 구식 방식으로 복사
													const textArea = document.createElement('textarea');
													textArea.value = contactEmail;
													document.body.appendChild(textArea);
													textArea.select();
													document.execCommand('copy');
													document.body.removeChild(textArea);
													emailCopyTimer = null;
												}
											}
										},
									})
								}
							})
						}
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
					// deck: Structure.write({
					// 	classList: ['header-nav_item'],
					// 	children: {
					// 		link: Structure.write({
					// 			tagName: 'a',
					// 			properties: { href: '/deck-code-generator' },
					// 			dataset: { routerLink: '' },
					// 			content: '덱 코드 생성기'
					// 		})
					// 	}
					// }),
					calc: Structure.write({
						classList: ['header-nav_item'],
						children: {
							link: Structure.write({
								tagName: 'a',
								properties: { href: '/enkephalin-calculator' },
								dataset: { routerLink: '' },
								content: '엔케팔린 계산기'
							})
						}
					})
				}
			})
		}
	});
})(); 
let main_page = null;
(() => {
	// 원래 코드
	// main_page = Structure.write({
	//     classList: ["main_page"],
	//     content: "Hello World!"
	// });

	// 기본 페이지를 엔케팔린 계산기로 리다이렉트
	PageRouter.i.replace("/enkephalin-calculator");
})();
let main_page = null;
(() => {
	// 원래 코드
	// main_page = Structure.write({
	//     classList: ["main_page"],
	//     content: "Hello World!"
	// });

	// /main 경로일 때만 엔케팔린 계산기로 리다이렉트
	if (location.pathname === '/main') {
		PageRouter.i.replace("/enkephalin-calculator");
	}
})();
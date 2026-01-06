let main_page = null;
(() => {
	// /main 경로일 때만 엔케팔린 계산기로 리다이렉트
	if (location.pathname === '/main') {
		PageRouter.i.replace("/enkephalin-calculator");
	}
})();
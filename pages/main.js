let main_page = null;
(() => {
	// 원래 코드
	// main_page = Structure.write({
	//     classList: ["main_page"],
	//     content: "Hello World!"
	// });

	// 임시: deck_code_generator_page를 기본 렌더
	PageRouter.i.replace("/deck-code-generator");
})();
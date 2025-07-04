let BasicLayout = null;
(() => {
    BasicLayout = Structure.write({
        classList: ['basic_layout'],
        children: {
            header: Header,
            // 여기에 본문 영역 등 추가 가능
        }
    });
})(); 
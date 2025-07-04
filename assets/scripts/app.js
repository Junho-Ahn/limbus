window.addEventListener("DOMContentLoaded", () => {
    // 모든 라우트 등록
    for (const route of routes) {
        PageRouter.i.register(route.path, route.render, { layout: route.layout });
    }
    // SPA 라우터 시작
    PageRouter.i.start();
}, {once: true});
let routes = [
  {
    path: '/main',
    render: () => main_page,
    layout: BasicLayout
  },
  {
    path: '/test',
    render: () => test_page,
    layout: BasicLayout
  },
  {
    path: '/deck-code-generator',
    render: () => deck_code_generator_page,
    layout: BasicLayout
  }
  // 추가 라우트는 여기에 객체로 계속 추가
]; 
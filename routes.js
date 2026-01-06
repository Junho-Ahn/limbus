let routes = [
  {
    path: '/lunacy-calculator',
    render: () => {
      console.log('[Route] Rendering lunacy-calculator, page:', lunacy_calculator_page);
      if (!lunacy_calculator_page) {
        console.error('[Route] lunacy_calculator_page is not defined');
        if (typeof NotFoundPage !== 'undefined' && NotFoundPage) {
          return NotFoundPage;
        }
        return null;
      }
      return lunacy_calculator_page;
    },
    layout: BasicLayout
  },
  {
    path: '/enkephalin-calculator',
    render: () => enkephalin_calculator_page,
    layout: BasicLayout
  },
  {
    path: '/deck-code-generator',
    render: () => deck_code_generator_page,
    layout: BasicLayout
  },
  {
    path: '/test',
    render: () => test_page,
    layout: BasicLayout
  },
  {
    path: '/main',
    render: () => enkephalin_calculator_page,
    layout: BasicLayout
  },
  {
    path: '/',
    render: () => enkephalin_calculator_page,
    layout: BasicLayout
  }
  // 추가 라우트는 여기에 객체로 계속 추가
]; 
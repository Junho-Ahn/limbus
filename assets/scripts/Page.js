/**
 * SPA 라우터: 주소 인식, 앞으로/뒤로 가기, 라우트 등록, 파라미터/쿼리, 404, Structure 연동 지원
 */
class PageRouter {
	constructor(rootId = 'root') {
		this.routes = [];
		this.root = document.getElementById(rootId);
		window.addEventListener('popstate', () => this.#render(location.pathname + location.search));
		this.#interceptLinks();
	}

	/**
	 * 싱글톤 인스턴스 반환 (PageRouter.i)
	 */
	static get i() {
		if (!this._instance) {
			this._instance = new PageRouter();
		}
		return this._instance;
	}

	/**
	 * 라우트 등록
	 * @param {string} path
	 * @param {function({params, query}): Structure} renderFn
	 * @param {Object} [options] - { layout: Structure }
	 */
	register(path, renderFn, options = {}) {
		this.routes.push({ path, renderFn, layout: options.layout });
	}

	/**
	 * 페이지 이동 (히스토리 추가)
	 */
	go(path) {
		history.pushState({}, '', path);
		this.#render(path);
	}

	/**
	 * 페이지 이동 (히스토리 대체)
	 */
	replace(path) {
		history.replaceState({}, '', path);
		this.#render(path);
	}

	/**
	 * 현재 주소에 맞는 페이지 렌더
	 */
	#render(path) {
		const { route, params } = this.#matchRoute(path);
		const query = this.#parseQuery(path);
		if (route) {
			const structure = route.renderFn({ params, query });
			let toRender = structure;
			if (route.layout) {
				const layout = deepCopy(route.layout);
				const children = layout.getChildren ? layout.getChildren() : {};
				layout.set('children', { ...children, main: structure });
				toRender = layout;
			}
			if (toRender && typeof toRender.build === 'function') {
				this.root.innerHTML = '';
				this.root.appendChild(toRender.build(true).getElement());
			}
		} else {
			const mainRoute = this.routes.find(r => r.path === '/main');
			if (mainRoute) {
				const structure = mainRoute.renderFn({ params: {}, query: {} });
				let toRender = structure;
				if (mainRoute.layout) {
					const layout = deepCopy(mainRoute.layout);
					const children = layout.getChildren ? layout.getChildren() : {};
					layout.set('children', { ...children, main: structure });
					toRender = layout;
				}
				if (toRender && typeof toRender.build === 'function') {
					this.root.innerHTML = '';
					this.root.appendChild(toRender.build(true).getElement());
				}
			} else if (typeof NotFoundPage !== 'undefined' && NotFoundPage) {
				this.root.innerHTML = '';
				this.root.appendChild(NotFoundPage.build(true).getElement());
			} else {
				this.root.innerHTML = '<div style="padding:2em;text-align:center;">404 Not Found</div>';
			}
		}
	}

	/**
	 * 라우트 매칭 (파라미터 지원)
	 */
	#matchRoute(path) {
		const [pathname] = path.split('?');
		for (const route of this.routes) {
			const { regex, keys } = this.#pathToRegex(route.path);
			const match = pathname.match(regex);
			if (match) {
				const params = {};
				keys.forEach((k, i) => params[k] = match[i + 1]);
				return { route, params };
			}
		}
		return { route: null, params: {} };
	}

	/**
	 * '/user/:id' -> 정규식 변환
	 */
	#pathToRegex(path) {
		const keys = [];
		const regex = new RegExp('^' + path.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1')
			.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
		return { regex, keys };
	}

	/**
	 * 쿼리 파싱
	 */
	#parseQuery(path) {
		const query = {};
		const q = path.split('?')[1];
		if (!q) return query;
		q.split('&').forEach(pair => {
			const [k, v] = pair.split('=');
			query[decodeURIComponent(k)] = decodeURIComponent(v || '');
		});
		return query;
	}

	/**
	 * a 태그 클릭 인터셉트 (SPA 내비게이션)
	 */
	#interceptLinks() {
		document.addEventListener('click', e => {
			const a = e.target.closest('a');
			if (a && a.hasAttribute('data-router-link')) {
				e.preventDefault();
				this.go(a.getAttribute('href'));
			}
		});
	}

	/**
	 * 최초 진입 시 렌더
	 */
	start() {
		this.#render(location.pathname + location.search);
	}
} 
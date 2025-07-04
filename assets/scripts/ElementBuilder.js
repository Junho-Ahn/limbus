class Structure {
	/**
	 * @type {string}
	 */
	#tagName = "div";
	/**
	 *
	 * @type {string[]}
	 */
	#classList = [];
	/**
	 *
	 * @type {Object<string>}
	 */
	#properties = {};
	/**
	 *
	 * @type {Object<string>}
	 */
	#dataset = {};
	/**
	 *
	 * @type {{pre: ?string, post: ?string, unset: ?string}}
	 */
	#content = {
		pre: null,
		post: null,
		unset: null
	};
	#element = null;
	/**
	 *
	 * @type {{ [name: string]: Structure }}
	 */
	#children = {};
	#refs = {};
	#onMount = null;
	#onUnmount = null;
	#events = null;
	
	/**
	 *
	 * @param {Object<string|Array<string>|Object<string>>} option
	 * @returns {Structure}
	 */
	static write(option) {
		return new this(option);
	}
	
	/**
	 * 반복 구조 헬퍼
	 * @param {Array} arr
	 * @param {function(any, number): Structure} fn
	 * @returns {Object<string, Structure>}
	 */
	static list(arr, fn) {
		const result = {};
		arr.forEach((item, i) => {
			result[i] = fn(item, i);
		});
		return result;
	}
	
	build(force = false) {
		if (this.#element && !force) {
			return this;
		}
		const elem = document.createElement(this.#tagName);
		
		if(IsValid.stringArray(this.#classList)) {
			elem.classList.add(...this.#classList);
		}
		
		if(IsValid.stringObject(this.#properties)) {
			for(const property of Object.entries(this.#properties)) {
				elem.setAttribute(...property);
			}
		}
		
		if(IsValid.stringObject(this.#dataset)) {
			for(const key in this.#dataset) {
				const value = this.#dataset[key];
				elem.dataset[key] = value;
			}
		}
		
		if(IsValid.string(this.#content.pre)) {
			elem.insertAdjacentText("afterbegin", this.#content.pre);
		}
		
		if(IsValid.string(this.#content.post)) {
			elem.insertAdjacentText("beforeend", this.#content.post);
		}
		
		if(IsValid.string(this.#content.unset)) {
			elem.innerHTML = this.#content.unset;
		}
		
		if(IsValid.StructureObject(this.#children)) {
			for(const [name, child] of Object.entries(this.#children)) {
				elem.appendChild(child.build(force).getElement());
				this.#refs[name] = child.getElement();
			}
		}
		
		// 이벤트 바인딩
		if (this.#events && typeof this.#events === 'object') {
			for (const [type, handler] of Object.entries(this.#events)) {
				elem.addEventListener(type, handler);
			}
		}
		
		// onMount 훅
		if (typeof this.#onMount === 'function') {
			setTimeout(() => this.#onMount(elem), 0);
		}
		
		this.#element = elem;
		
		return this;
	}
	
	constructor(option) {
		this.#initRefs();
		this.#initLifecycle();
		this.#initEvents();
		this.#initOption(option);
	}
	
	#initOption(option) {
		for (const [key, value] of Object.entries(option)) {
			this.set(key, value);
		}
	}
	
	#initRefs() {
		this.#refs = {};
	}
	
	#initLifecycle() {
		this.#onMount = null;
		this.#onUnmount = null;
	}
	
	#initEvents() {
		this.#events = null;
	}
	
	getTagName() {
		return this.#tagName;
	}
	
	getClassList() {
		return deepCopy(this.#classList);
	}
	
	getProperties() {
		return deepCopy(this.#properties);
	}
	
	getContent() {
		return deepCopy(this.#content);
	}
	
	/**
	 *
	 * @returns {{ [name: string]: Structure }}
	 */
	getChildren() {
		return deepCopy(this.#children);
	}
	
	getElement() {
		if(this.#element === null) {
			throw new Error("Structure :: cannot get element before build");
		}
		return this.#element;
	}
	
	set(key, value) {
		switch(key) {
			case "tagName":
				if(!IsValid.string(value)) {
					throw new Error("Structure :: invalid tagName");
				}
				
				this.#tagName = value;
				break;
			
			case "classList":
				if(!IsValid.stringArray(value)) {
					throw new Error("Structure :: invalid classes");
				}
				this.#classList = value;
				break;
			
			case "properties":
				if(!IsValid.stringObject(value)) {
					throw new Error("Structure :: invalid properties");
				}
				
				this.#properties = value;
				break;
			
			case "dataset":
				if(!IsValid.stringObject(value)) {
					throw new Error("Structure :: invalid tagName");
				}
				
				this.#dataset = value;
				break;
			
			case "content":
				if(IsValid.string(value)) {
					this.#content.unset = value;
				} else if(IsValid.keyRequiredObject(value, "or", ["pre", "post"])) {
					[this.#content.pre, this.#content.post] = [value.pre, value.post];
				} else {
					throw new Error("Structure :: invalid content");
				}
				break;
				
			case "children":
				if(!IsValid.StructureObject(value)) {
					throw new Error("Structure :: a child is not Structure");
				}
				this.#children = value;
				break;
			
			default:
				throw new Error("Structure :: invalid key");
		}
		
		return this;
	}
	
	merge(key, value) {
		switch(key) {
			case "classList":
				if(!IsValid.stringArray(value)) {
					throw new Error("Structure :: invalid classes");
				}
				this.#classList.push(...value);
				break;
			
			case "properties":
				if(!IsValid.stringObject(value)) {
					throw new Error("Structure :: invalid properties");
				}
				
				this.#properties = {...this.#properties, ...value};
				break;
			
			case "dataset":
				if(!IsValid.stringObject(value)) {
					throw new Error("Structure :: invalid tagName");
				}
				
				this.#dataset = {...this.#dataset, ...value};
				break;
			
			case "children":
				if(!IsValid.StructureObject(value)) {
					throw new Error("Structure :: a child is not Structure");
				}
				this.#children = {...this.#children, ...value};
				break;
			
			default:
				throw new Error("Structure :: invalid key");
		}
		
		return this;
	}
	
	findChild(childName) {
		let result = [];
		if (!IsValid.StructureObject(this.#children)) {
			return result;
		}

		// 1. 직계 children에서 찾기
		if (Object.hasOwn(this.#children, childName)) {
			result.push(this.#children[childName]);
		}

		// 2. 각 child에 대해 재귀적으로 탐색
		for (const child of Object.values(this.#children)) {
			const found = child.findChild(childName);
			if (Array.isArray(found) && found.length > 0) {
				result = result.concat(found);
			}
		}

		return result;
	}
	
	// 동적 조작 메서드
	addClass(cls) {
		if (!this.#classList.includes(cls)) {
			this.#classList.push(cls);
			if (this.#element) this.#element.classList.add(cls);
		}
		return this;
	}
	removeClass(cls) {
		this.#classList = this.#classList.filter(c => c !== cls);
		if (this.#element) this.#element.classList.remove(cls);
		return this;
	}
	setStyle(key, value) {
		if (this.#element) this.#element.style[key] = value;
		return this;
	}
	setAttribute(key, value) {
		this.#properties[key] = value;
		if (this.#element) this.#element.setAttribute(key, value);
		return this;
	}

	// children 조작 메서드
	appendChild(name, child) {
		this.#children[name] = child;
		if (this.#element) this.#element.appendChild(child.build().getElement());
		return this;
	}
	removeChild(name) {
		if (this.#children[name]) {
			if (this.#element && this.#children[name].#element) {
				this.#element.removeChild(this.#children[name].#element);
			}
			delete this.#children[name];
		}
		return this;
	}
	replaceChild(name, newChild) {
		if (this.#children[name]) {
			if (this.#element && this.#children[name].#element) {
				this.#element.replaceChild(newChild.build().getElement(), this.#children[name].#element);
			}
			this.#children[name] = newChild;
		}
		return this;
	}

	// ref 기능
	getRef(name) {
		return this.#refs ? this.#refs[name] : undefined;
	}

	// 라이프사이클 훅 setter
	setOnMount(fn) {
		this.#onMount = fn;
		return this;
	}
	setOnUnmount(fn) {
		this.#onUnmount = fn;
		return this;
	}
}
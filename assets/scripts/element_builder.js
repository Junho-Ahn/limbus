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
	#events = {};
	
	/**
	 *
	 * @param {Object<string|Array<string>|Object<string>>} option
	 * @returns {Structure}
	 */
	static write(option) {
		return new this(option);
	}
	
	build() {
		const elem = document.createElement(this.#tagName);
		
		if(IsValid.stringArray(this.#classList)) {
			elem.classList.add(...this.#classList);
		}
		
		if(IsValid.stringObject(this.#properties, false)) {
			for(const property of Object.entries(this.#properties)) {
				elem.setAttribute(...property);
			}
		}
		
		if(IsValid.stringObject(this.#dataset, false)) {
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
			for(const [, child] of Object.entries(this.#children)) {
				elem.appendChild(child.build().getElement());
			}
		}
		
		// 이벤트 바인딩
		if (this.#events && typeof this.#events === 'object') {
			for (const [type, handler] of Object.entries(this.#events)) {
				elem.addEventListener(type, handler);
			}
		}
		
		this.#element = elem;
		
		return this;
	}
	
	constructor(option) {
		this.#initOption(option);
	}
	
	#initOption(option) {
		for (const [key, value] of Object.entries(option)) {
			this.set(key, value);
		}
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
				if(!IsValid.stringObject(value, false)) {
					throw new Error("Structure :: invalid properties");
				}
				
				this.#properties = value;
				break;
			
			case "dataset":
				if(!IsValid.stringObject(value, false)) {
					throw new Error("Structure :: invalid dataset");
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
                if(IsValid.object(value) && Object.values(value).includes(null)) {
                    this.#children = {};
                    for(const key in value) {
                        if(value[key] !== null) {
                            this.#children[key] = value[key];
                        }
                    }
                }else {
                    if(!IsValid.StructureObject(value)) {
                        throw new Error("Structure :: a child is not Structure");
                    }
                    
                    this.#children = value;
                }
				
				break;
			
			case "events":
				if(!IsValid.object(value)) {
					throw new Error("Structure :: invalid events");
				}
				this.#events = value;
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
				if(!IsValid.stringObject(value, false)) {
					throw new Error("Structure :: invalid properties");
				}
				
				this.#properties = {...this.#properties, ...value};
				break;
			
			case "dataset":
				if(!IsValid.stringObject(value, false)) {
					throw new Error("Structure :: invalid dataset");
				}
				
				this.#dataset = {...this.#dataset, ...value};
				break;
			
			case "children":
				if(!IsValid.StructureObject(value)) {
					throw new Error("Structure :: a child is not Structure");
				}
				this.#children = {...this.#children, ...value};
				break;
			
			case "events":
				if(!IsValid.object(value)) {
					throw new Error("Structure :: invalid events");
				}
				this.#events = {...this.#events, ...value};
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

	setEvent(type, handler) {
		this.#events[type] = handler;
		return this;
	}
}
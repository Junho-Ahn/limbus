class IsValid {
    /**
     *
     * @param value
     * @param {boolean} [checkLength=true] - 길이 검사 여부
     * @returns {boolean}
     */
    static string(value, checkLength = true) {
        return (
            typeof value === "string"
            && (checkLength && (value.length > 0) || !checkLength)
        );
    }
    
    /**
     *
     * @param value
     * @param {boolean} [checkLength=true]
     * @returns {boolean}
     */
    static array(value, checkLength = true) {
        return (
            Array.isArray(value)
            && (checkLength && (value.length > 0) || !checkLength)
        );
    }
    
    /**
     *
     * @param value
     * @param {boolean} [checkLength=true]
     * @returns {boolean}
     */
    static stringArray(value, checkLength = true) {
        // boolean casting
        return !!(
            IsValid.array(value, checkLength)
            && value.every(x => IsValid.string(x, checkLength))
        );
    }
    
    /**
     *
     * @param value
     * @param {boolean} [checkLength=true]
     * @returns {boolean}
     */
    static object(value, checkLength = true) {
        return (
            value instanceof Object
            && !Array.isArray(value)
            && (checkLength && (Object.values(value).length > 0) || !checkLength)
        );
    }
    
    /**
     *
     * @param value
     * @param {boolean} [checkLength=true]
     * @returns {boolean}
     */
    static stringObject(value, checkLength = true) {
        // boolean casting
        return !!(
            IsValid.object(value, checkLength)
            && Object.values(value).every(x => IsValid.string(x, checkLength))
        );
    }
    
    /**
     *
     * @param value
     * @param {string[]} requirements
     * @returns {string|undefined}
     */
    static requiredString(value, requirements) {
        if(!(IsValid.string(value) && IsValid.stringArray(requirements))) {
            throw new Error("Type :: invalid argument(s)");
        }

        return requirements.find(x => x === value);
    }
    
    /**
     *
     * @param value
     * @param {"or"|"and"} requireType
     * @param {string[]} requirements
     * @returns {*}
     */
    static keyRequiredObject(value, requireType, requirements) {
        const keys = Object.keys(value);
        /**
         *
         * @type {null|"some"|"every"}
         */
        let findType = null;

        switch(requireType) {
            case "or":
                findType = "some";
                break;

            case "and":
                findType = "every";
                break;

            default:
                throw new Error("Type :: invalid requireType");
        }
        
        return requirements[findType](x => keys.includes(x));
    }
    
    static StructureArray(value) {
        return (
            IsValid.array(value)
            && value.every(x => x instanceof Structure)
        );
    }
    
    static StructureObject(value) {
        console.log(Object.values(value));
        return (
            IsValid.object(value)
            && Object.values(value).every(x => x instanceof Structure)
        );
    }
}

function deepCopy(target, seen = new WeakSet()) {
    if ((target ?? "Nullish") === "Nullish" || !(target instanceof Object)) {
        return target;
    }
    if (seen.has(target)) {
        // 순환 참조 발생 시 null 반환 (혹은 throw new Error 가능)
        return null;
    }
    seen.add(target);
    const result = Array.isArray(target) ? [] : {};
    for (const key in target) {
        result[key] = deepCopy(target[key], seen);
    }
    seen.delete(target);
    return result;
}

 /**
     * 기존 className에 인자를 modifier 형식으로 추가해 반환
     * @param {string} className
     * @return {string}
     */
 Element.prototype.getModifierClass = function(className) {
    const original = [...this.classList].find(x => x.indexOf("--") < 0);

    if((original ?? "Nullish") === "Nullish") {
        return className;
    }

    return `${original}--${className}`;
}

/**
 * modifier 클래스 추가/삭제
 * @param {string} className
 * @param {boolean} set
 * @return {boolean}
 */
Element.prototype.setModifierClass = function(className, set) {
    const modifierClassName = this.getModifierClass(className);

    if(modifierClassName === className) {
        return false;
    }

    // 클래스 지정
    this.classList[set ? "add" : "remove"](modifierClassName);
    return true;
}
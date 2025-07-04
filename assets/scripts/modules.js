class IsValid {
    /**
     *
     * @param value
     * @returns {boolean}
     */
    static string(value) {
        return (
            typeof value === "string"
            && value.length > 0
        );
    }
    
    /**
     *
     * @param value
     * @returns {boolean}
     */
    static array(value) {
        return (
            Array.isArray(value)
            && value.length > 0
        );
    }
    
    /**
     *
     * @param value
     * @returns {boolean}
     */
    static stringArray(value) {
        // boolean casting
        return !!(
            IsValid.array(value)
            && value.every(x => IsValid.string(x))
        );
    }
    
    /**
     *
     * @param value
     * @returns {boolean}
     */
    static object(value) {
        return (
            value instanceof Object
            && !Array.isArray(value)
            && Object.values(value).length > 0
        );
    }
    
    /**
     *
     * @param value
     * @returns {boolean}
     */
    static stringObject(value) {
        // boolean casting
        return !!(
            IsValid.object(value)
            && Object.values(value).every(x => IsValid.string(x))
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
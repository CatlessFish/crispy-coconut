const assertParam = (name, param, type, nullable = false) => {
    if (nullable && param === null) {
        return true;
    }
    if (typeof param !== type) {
        throw new Error(`parameter ${name} must be ${type}, got ${typeof param} instead`);
    }
    if (!nullable && param === null) {
        throw new Error(`parameter ${name} must not be null`);
    }
}

export default assertParam;
import {useEffect, useRef} from 'react';

// 简单深比较函数，只比较对象和数组，其他类型直接用 ===
function deepEqual(a, b) {
    if (a === b) return true;

    if (typeof a !== 'object' || a === null ||
        typeof b !== 'object' || b === null) {
        return false;
    }

    // 比较数组
    //数组遍历有顺序，对象无顺序，需区分
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
    }

    // 比较对象
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;

    for (let key of aKeys) {
        if (!b.hasOwnProperty(key) || !deepEqual(a[key], b[key])) {
            return false;
        }
    }

    return true;
}

function useDeepCompareEffect(effect, dependencies) {
    const previousDepsRef = useRef();

    if (!previousDepsRef.current || !deepEqual(previousDepsRef.current, dependencies)) {
        previousDepsRef.current = dependencies;
    }

    useEffect(effect, [previousDepsRef.current]);
}

export default useDeepCompareEffect;

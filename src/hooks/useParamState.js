import {useEffect, useState} from 'react';
import {getURLParam, updateURLParams} from "../utils/CommonUtils.js";

export function useParamState(key, defaultValue, options) {
    options = options || {};
    const replace = options.replace ?? true;
    const parse = options.parse || (v => v);
    const stringify = options.stringify || (v => String(v));

    function getParamValue() {
        const param = getURLParam(key);
        if (param === null) return defaultValue;
        try {
            return parse(param);
        } catch {
            return defaultValue;
        }
    }

    const [state, setState] = useState(getParamValue());

    useEffect(() => {
        function onPopState() {
            setState(getParamValue());
        }

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, [key]);

    function updateState(newValue) {
        if (newValue === null || newValue === undefined) {
            updateURLParams({[key]: null}, replace);
            setState(undefined);
        } else {
            updateURLParams({[key]: stringify(newValue)}, replace);
            setState(newValue);
        }
    }

    return [state, updateState];
}

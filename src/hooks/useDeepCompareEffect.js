import {useEffect, useRef} from 'react';
import {deepEqual} from "../utils/CommonUtils.jsx";


function useDeepCompareEffect(effect, dependencies) {
    const previousDepsRef = useRef();

    if (!previousDepsRef.current || !deepEqual(previousDepsRef.current, dependencies)) {
        previousDepsRef.current = dependencies;
    }

    useEffect(effect, [previousDepsRef.current]);
}

export default useDeepCompareEffect;

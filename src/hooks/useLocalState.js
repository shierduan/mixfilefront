import {useRef} from "react";
import {proxy, subscribe, useSnapshot} from "valtio";
import useDeepCompareEffect from "./useDeepCompareEffect.js";

function useLocalState(key, initialState) {
    // 从 localStorage 取初始值
    const storedValue = (() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialState;
        } catch (e) {
            console.warn("Failed to parse localStorage item", e);
            return initialState;
        }
    })();

    const state = useRef(proxy(storedValue)).current;

    // 监听变化 → 写入 localStorage
    useDeepCompareEffect(() => {
        const unsub = subscribe(state, () => {
            localStorage.setItem(key, JSON.stringify(state));
        });
        return () => unsub();
    }, [key, state]);

    // 确保 snapshot 能触发组件刷新
    useSnapshot(state);

    return state;
}

export default useLocalState;

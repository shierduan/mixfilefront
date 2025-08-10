// useApi.jsx
import {client} from "../config.js";
import {CircularProgress} from "@mui/material";
import styled from "styled-components";
import useProxyState from "./useProxyState.js";
import useDeepCompareEffect from "./useDeepCompareEffect.js";

const MiddleContainer = styled.div`
    margin: 20px auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .error {
        font-weight: bold;
        color: red;
    }
`

export function DefaultLoading() {
    return <MiddleContainer>
        <CircularProgress/>
    </MiddleContainer>
}

export function DefaultError({err}) {
    return <MiddleContainer>
        <div className={'error'}>Error: {err.message}</div>
    </MiddleContainer>
}


export default function useApi({
                                   path,
                                   method = 'GET',
                                   body = null,
                                   headers = {},
                                   config = {},
                                   refreshInterval = -1,
                                   content = (data) => <></>,
                                   error = (err) => <DefaultError err={err}/>,
                                   loading = <DefaultLoading/>
                               }) {

    const state = useProxyState({
        err: null,
        data: null,
        isLoading: true,
    })

    const fetchData = async () => {
        const response = await client({
            ...config,
            url: path,
            method: method.toUpperCase(),
            data: body,
            headers,
        })
        state.data = response.data
        state.err = null
    }

    useDeepCompareEffect(() => {
        (async () => {
            state.isLoading = true
            try {
                await fetchData()
            } catch (e) {
                state.err = e
            } finally {
                state.isLoading = false
            }
        })()
        if (refreshInterval > 0) {
            const timer = setInterval(fetchData, refreshInterval)
            return () => clearInterval(timer)
        }
    }, [path, method, headers, config, body, refreshInterval])

    const {err, data, isLoading} = state

    if (isLoading) return loading
    if (err) return error?.(err)
    return content?.(data) || null
}

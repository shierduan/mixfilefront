// useApi.jsx
import {useEffect} from 'react'
import {client} from "../config.js";
import {CircularProgress} from "@mui/material";
import styled from "styled-components";
import useProxyState from "./useProxyState.js";

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
                                   refreshInterval = -1,
                                   content = (data) => <></>,
                                   error = (err) => <DefaultError err={err}/>,
                                   loading = <DefaultLoading/>
                               }) {

    const state = useProxyState({
        err: null,
        data: null,
        isLoading: true
    })

    const {err, data, isLoading} = state

    const fetchData = async () => {
        try {
            const response = await client({
                url: path,
                method: method.toUpperCase(),
                data: body,
                headers,
            })
            state.data = response.data
            state.err = null
        } catch (e) {
            if (!state.data) {
                state.err = e
            }
        } finally {
            state.isLoading = false
        }
    }

    useEffect(() => {
        state.isLoading = true
        fetchData()
        if (refreshInterval > 0) {
            const timer = setInterval(fetchData, refreshInterval)
            return () => clearInterval(timer)
        }
    }, [path, method, JSON.stringify(body), refreshInterval])

    if (isLoading) return loading
    if (err) return error?.(err)
    return content?.(data) || null
}

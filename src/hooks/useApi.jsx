// useApi.jsx
import {useEffect, useRef, useState} from 'react'
import {client} from "../config.js";
import {CircularProgress} from "@mui/material";
import styled from "styled-components";

const MiddleContainer = styled.div`
    margin: 0 auto;
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

    const [data, setData] = useState(null)
    const [err, setErr] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const dataRef = useRef(null)

    const fetchData = async () => {
        try {
            const response = await client({
                url: path,
                method: method.toUpperCase(),
                data: body,
                headers,
            })
            dataRef.current = response.data
            setData(dataRef.current)
            setErr(null)
        } catch (e) {
            if (!dataRef.current) {
                setErr(e)
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
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

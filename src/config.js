import axios, {CanceledError} from "axios";
import axiosRetry from "axios-retry";
import {notifyError} from "./utils/CommonUtils.js";

const params = new URLSearchParams(window.location.search);

export const apiAddress = params.get("api") ?? `${window.location.origin}/`

export const client = axios.create({
    baseURL: apiAddress,
    withCredentials: true
})

axiosRetry(client, {
    retries: 3,
    retryDelay: (retryCount) => {
        return retryCount * 100;
    }
});


client.interceptors.response.use((config) => {
    return config
}, (error) => {
    if (error instanceof CanceledError){
        return
    }
    const msg = `连接失败: ${error.response?.body ?? error.message}`;
    notifyError(msg, {
        position: "top-center",
        toastId: msg
    });
    return Promise.reject(error)
})

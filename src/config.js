import axios from "axios";
import {toast} from "react-toastify";

const params = new URLSearchParams(window.location.search);
export const apiAddress = params.get("api") ?? `${window.location.origin}/`

export const client = axios.create({
    baseURL: apiAddress
})

client.interceptors.response.use((config) => {
    return config
}, (error) => {
    toast.error(`连接失败: ${error.response?.body}`, {
        position: "top-center"
    });
    return Promise.reject(error)
})

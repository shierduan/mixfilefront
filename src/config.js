import axios from "axios";
import {toast} from "react-toastify";


// export const apiAddress = `${window.location.origin}/`
export const apiAddress = `http://192.168.101.103:4719/`

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

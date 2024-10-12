import { message } from "antd";
import axios from "axios";
// import type {AxiosRequestConfig} from 'axios'

export type ResponseType<T> = {
	code: number
	data: T,
	message: string
}

export const api = axios.create({
	baseURL: 'http://localhost:3000/',
	timeout: 3000,
})
// @ts-ignore
api.interceptors.response.use((res) => {
	return res.data
}, err => {
	message.error(err.response.data?.message ?? '系统繁忙，请稍后重试')
})
export default api

// api.get()
// export const api2 = <T>(cfg: AxiosRequestConfig) => api.request<any, T>(cfg)
// export const get = <T>(url: string, cfg: AxiosRequestConfig) => api.get<any, T extends ResponseType<infer U> ? ResponseType<U> : T>(url, cfg)

// export const post = <T>(url: string, cfg: AxiosRequestConfig) => api.post<any, T extends ResponseType<infer U> ? ResponseType<U> : T>(url, cfg)
import api, {ResponseType} from "@/api";
import { Token } from "@/token";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";




export function AdminLogin() {
	const nav = useNavigate()
	async function onFinish(value: {username: string, password: string}) {
		// console.log(value)
		const {data: {accessToken, refreshToken}} = await api.post<any, ResponseType<Token>>('/user/admin/login', value)
		localStorage.setItem('accessToken', accessToken)
		localStorage.setItem('refreshToken', refreshToken)
		message.success('登录成功')
		setTimeout(() => nav('/admin/'), 2000)
	}
	return <div className="w-[400px] mt-[100px] mx-auto text-center">
		<h1>会议室预订系统</h1>
		<Form labelCol={{span:4}} wrapperCol={{span:20}} onFinish={onFinish} autoComplete='off' colon={false}>
			<Form.Item label='用户名' name='username' rules={[{required: true, message: '请输入用户名'}]}>
				<Input></Input>
			</Form.Item>
			<Form.Item label='密码' name='password' rules={[{required: true, message: '请输入密码'}]}>
				<Input.Password></Input.Password>
			</Form.Item>

			<Form.Item labelCol={{span: 0}} wrapperCol={{span:24}}>
				<div className="flex justify-between">
					<a href="/register">创建账号</a>
					<a href="/forget-password">忘记密码</a>
				</div>
			</Form.Item>
			<Form.Item labelCol={{span: 0}} wrapperCol={{span:24}}>
				<Button type='primary' htmlType="submit" className="w-full">登录</Button>
			</Form.Item>
		</Form>
	</div>
}
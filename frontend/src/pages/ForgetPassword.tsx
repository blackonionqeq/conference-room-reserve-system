import { Button, Form, Input, message } from "antd"
import api, { ResponseType } from "../api"
import { useForm } from "antd/es/form/Form"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"


type ForgetPasswordForm = {
	username: string
	password: string
	confirmPassword: string
	email: string
	captcha: string
}



export function ForgetPassword() {
	const [form] = useForm()
	const nav = useNavigate()
	
	async function onFinish(value: ForgetPasswordForm) {
		// console.log(value)
		if (value.confirmPassword !== value.password) {
			message.error('两次输入的密码不一致')
			return
		}
		const { code } = await api.post<any, ResponseType>('/user/forget-password', value)
		if (code === 200 || code === 201) {
			message.success('修改密码成功')
			setTimeout(() => nav('/login'), 2000)
		}
	}

	const  sendCaptcha = useCallback(
		async function () {
			const email = form.getFieldValue('email')
			if (!email) {
				message.error('请先输入邮箱')
				return
			}
			const {data} = await api.get<any, ResponseType<string>>(`/user/captcha/${email}`)
			message.success(data)
		}, []
	)
	return <div className="w-[400px] mt-[100px] mx-auto text-center">
		<h1>会议室预订系统</h1>
		<Form form={form} labelCol={{span:6}} wrapperCol={{span:18}} onFinish={onFinish} colon={false} autoComplete="off" labelAlign="left">
			<Form.Item label='用户名' name='username' rules={[{required: true, message: '请输入用户名'}]}>
				<Input></Input>
			</Form.Item>
			<Form.Item label='新密码' name='password' rules={[{required: true, message: '请输入密码'}]}>
				<Input.Password></Input.Password>
			</Form.Item>
			<Form.Item label='确认密码' name='confirmPassword' rules={[{required: true, message: '请输入确认密码'}]}>
				<Input.Password></Input.Password>
			</Form.Item>
			<Form.Item label='邮箱' name='email' rules={[{required: true, message: '请输入邮箱'}, {type:'email', message: '请输入合法的邮箱地址'}]}>
				<Input></Input>
			</Form.Item>
			
			{/* <div className="flex justify-end"> */}
			<Form.Item label='验证码' name='captcha' rules={[{required: true, message: '请输入验证码'}]} labelCol={{span: 6}} wrapperCol={{span:18	}}>
				<Input></Input>
			</Form.Item>
			<Button className="w-full mb-6" onClick={() => sendCaptcha()}>发送验证码</Button>
			{/* </div> */}

			
			<Form.Item labelCol={{span:0}} wrapperCol={{span: 24}}>
				<Button type='primary' htmlType="submit" className="w-full">更改密码</Button>
			</Form.Item>
			
			<Form.Item labelCol={{span:0}} wrapperCol={{span: 24}}>
				<div className="flex justify-end">已有账号？去
					<a href="/login">登录</a>
				</div>
			</Form.Item>
			

		</Form>
	</div>
}
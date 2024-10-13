import { Button, Form, Input, message } from "antd"
import api, { ResponseType } from "../api"
import { useForm } from "antd/es/form/Form"
// import { useNavigate } from "react-router-dom"


type RegisterUser = {
	oldPassword: string
	password: string
	confirmPassword: string
}



export function UpdatePassword() {
	const [form] = useForm()
	// const nav = useNavigate()
	
	async function onFinish(value: RegisterUser) {
		// console.log(value)
		if (value.confirmPassword !== value.password) {
			message.error('两次输入的密码不一致')
			return
		}
		const { code } = await api.post<any, ResponseType>('/user/update_password', value)
		if (code === 200 || code === 201) {
			message.success('更改成功')
			// setTimeout(() => nav('/login'), 2000)
		}
	}

	return <div className="w-[400px] mt-[100px] mx-auto text-center">
		<h1>会议室预订系统</h1>
		<Form form={form} labelCol={{span:6}} wrapperCol={{span:18}} onFinish={onFinish} colon={false} autoComplete="off" labelAlign="left">
			
			<Form.Item label='旧密码' name='oldPassword' rules={[{required: true, message: '请输入旧密码'}]}>
				<Input.Password></Input.Password>
			</Form.Item>
			<Form.Item label='密码' name='password' rules={[{required: true, message: '请输入密码'}]}>
				<Input.Password></Input.Password>
			</Form.Item>
			<Form.Item label='确认密码' name='confirmPassword' rules={[{required: true, message: '请输入确认密码'}]}>
				<Input.Password></Input.Password>
			</Form.Item>

			
			<Form.Item labelCol={{span:0}} wrapperCol={{span: 24}}>
				<Button type='primary' className="w-full" htmlType="submit">确定</Button>
			</Form.Item>
			
			

		</Form>
	</div>
}
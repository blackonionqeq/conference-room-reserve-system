import { Button, Form, Input, message } from "antd"
import api, { ResponseType } from "@/api/index"
import { useForm } from "antd/es/form/Form"
import { useEffect } from "react"
import { UploadAvatar } from "@/components/UploadAvatar"

type UpdateUserInfoForm = {
	username: string
	email: string
	nickName: string
	avatar: string
}



export function UpdateUserInfo() {
	const [form] = useForm()
	
	async function onFinish(value: UpdateUserInfoForm) {
		const { code } = await api.post<any, ResponseType>('/user/update', value)
		if (code === 200 || code === 201) {
			message.success('修改成功')
		}
	}

	useEffect(() => {
		async function queryUserInfo() {
			const res = await api.get<any, ResponseType<UpdateUserInfoForm>>('/user/userInfo')
			const {data} = res
			
			if (data.email) form.setFieldValue('email', data.email)
			if (data.nickName) form.setFieldValue('nickName', data.nickName)
			if (data.username) form.setFieldValue('username', data.username)
		}
		queryUserInfo()
	}, [])

	return <div className="w-[400px] mt-[100px] mx-auto text-center">
		<h1>会议室预订系统</h1>
		<Form form={form} labelCol={{span:6}} wrapperCol={{span:18}} onFinish={onFinish} colon={false} autoComplete="off" labelAlign="left">

			<Form.Item label='头像' name='avatar'>
				<UploadAvatar></UploadAvatar>
			</Form.Item>
			<Form.Item label='用户名' name='username' rules={[{required: true, message: '请输入用户名'}]}>
				<Input></Input>
			</Form.Item>
			<Form.Item label='昵称' name='nickName' rules={[{required: true, message: '请输入昵称'}]}>
				<Input></Input>
			</Form.Item>
			<Form.Item label='邮箱' name='email' rules={[{required: true, message: '请输入邮箱'}, {type:'email', message: '请输入合法的邮箱地址'}]}>
				<Input></Input>
			</Form.Item>
			
			<Form.Item labelCol={{span:0}} wrapperCol={{span: 24}}>
				<Button type='primary' htmlType="submit" className="w-full">更改</Button>
			</Form.Item>
			

		</Form>
	</div>
}
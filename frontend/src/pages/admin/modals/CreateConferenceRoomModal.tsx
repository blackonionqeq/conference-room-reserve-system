import api, {ResponseType} from "@/api";
import {  Form, Input, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCallback } from "react";


export type CreateRoomForm = {
	name: string
	capacity: number
	location: string
	equipment: string
	description: string
}

export function CreateConferenceRoomModal(props: {
	isOpen: boolean,
	handleClose: any,
}) {
	const [form] = useForm<CreateRoomForm>()
	const handleOk = useCallback(async () => {
		const values = form.getFieldsValue()
		console.log(values)

		values.description = values.description ?? ''
		values.equipment = values.equipment ?? ''

		const {code, message:_m } = await api.post<any, ResponseType>('/conference-room/create', values)
		if ([201,200].includes(code)) {
			message.success('创建成功')
			form.resetFields()
			props.handleClose()
		} else {
			message.error(_m)
		}

	}, [])

	return <Modal title='创建会议室' open={props.isOpen} onOk={handleOk} onCancel={() => props.handleClose()} okText='创建' cancelText='取消'>
		
		<Form form={form} labelCol={{span:6}} wrapperCol={{span:18}} autoComplete='off' colon={false}>
			<Form.Item label='会议室名称' name='name' rules={[{required: true, message: '请输入会议室名称'}]}>
				<Input></Input>
			</Form.Item>
			<Form.Item label='位置' name='location' rules={[{required: true, message: '请输入位置'}]}>
				<Input></Input>
			</Form.Item>
			<Form.Item label='可容纳人数' name='capacity' rules={[{required: true, message: '请输入可容纳人数'}]}>
				<Input></Input>
			</Form.Item>
			<Form.Item label='设备' name='equipment' rules={[{required: true, message: '请输入设备'}]}>
				<Input></Input>
			</Form.Item>
			<Form.Item label='描述' name='description'>
				<Input></Input>
			</Form.Item>

		</Form>
	</Modal>
}
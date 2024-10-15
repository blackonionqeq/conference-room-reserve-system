import api, {ResponseType} from "@/api";
import {  DatePicker, Form, Input, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCallback } from "react";


export type CreateReservation = {
	startTime: number
	endTime: number
	note: string
}

export function CreateReservationModal(props: {
	isOpen: boolean,
	handleClose: any,
	roomId: number,
}) {
	const [form] = useForm<CreateReservation>()
	const handleOk = useCallback(async () => {
		const values = form.getFieldsValue()
		console.log(values)

		const {code, message:_m } = await api.post<any, ResponseType>('/reservation/add', {
			...values,
			roomId: props.roomId,
		})
		if ([201,200].includes(code)) {
			message.success('创建成功')
			form.resetFields()
			props.handleClose()
		} else {
			message.error(_m)
		}

	}, [props.roomId])

	return <Modal title='预定会议室' open={props.isOpen} onOk={handleOk} onCancel={() => props.handleClose()} okText='创建' cancelText='取消'>
		
		<Form form={form} labelCol={{span:6}} wrapperCol={{span:18}} autoComplete='off' colon={false}>
			<Form.Item label='预定开始时间' name='startTime' rules={[{required: true, message: '请输入预定开始时间'}]}>
				<DatePicker showTime></DatePicker>
			</Form.Item>
			<Form.Item label='预定结束时间' name='endTime' rules={[{required: true, message: '请输入可容纳人数'}]}>
				<DatePicker showTime></DatePicker>
			</Form.Item>
			<Form.Item label='备注' name='note'>
				<Input></Input>
			</Form.Item>

		</Form>
	</Modal>
}
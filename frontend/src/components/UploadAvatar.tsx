import { InboxOutlined } from "@ant-design/icons"
import {  message } from "antd"
import Dragger, { DraggerProps } from "antd/es/upload/Dragger"

type Prop = {
	value?: string
	onChange?: (...args: any)=>any
}
let onChange: (...args: any)=>any

const draggerProps: DraggerProps = {
	name: 'file',
	action: import.meta.env.VITE_SERVER + 'user/upload',
	onChange(info) {
		const {status} = info.file
		if (status === 'done') {
			message.success(`${info.file.name} 上传成功`)
			onChange(info.file.response.data)
		} else if (status === 'error') {
			message.error(`${info.file.name} 上传失败`)
		}
	}
}

const dragger = <Dragger {...draggerProps}>
	<p className="ant-upload-drag-icon">
		<InboxOutlined />
	</p>
	<p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
</Dragger>

export function UploadAvatar(prop: Prop) {
	if (prop.onChange) onChange = prop.onChange
	if (!prop.value) {
		return <div>
			{dragger}
		</div>
	}
	return <div>
		<img width='100' height='100' src={import.meta.env.VITE_SERVER+prop.value} alt="avatar" />
		{dragger}
	</div>
}
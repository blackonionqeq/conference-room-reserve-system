import api from "@/api";
import { Button, Form, Input, Popconfirm, Table,  message,  } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType,  } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateConferenceRoomModal } from "./modals/CreateConferenceRoomModal"
import { UpdateConferenceRoomModal } from "./modals/UpdateConferenceRoomModal";

type SearchParam = {
	name: string
	capacity: number
	equipment: string
	location: string
}

type ConferenceItem = {
	id: number
	name: string
	equipment: string
	capacity: number
	description: string
	location: string
}
type UsersReturn = {
	totalCount: number
	conferenceRooms: ConferenceItem[]
}



const PAGE_SIZE = 2 as const


export function ConferenceRoomManagement() {

	const search = () => {
		searchConferenceRooms({
			name: form.getFieldValue('name'),
			equipment: form.getFieldValue('equipment'),
			location: form.getFieldValue('location'),
			capacity: form.getFieldValue('capacity'),
			pageNum,
		})
	}
	
	const handleDeleteRoom = useCallback(async (id: number) => {
		await api.delete(`/conference-room/delete/${id}`)
		message.success('操作成功')
		
		// searchConferenceRooms({
		// 	name: form.getFieldValue('name'),
		// 	equipment: form.getFieldValue('equipment'),
		// 	location: form.getFieldValue('location'),
		// 	capacity: form.getFieldValue('capacity'),
		// 	pageNum,
		// })
		search()
	}, [])
	const columns: ColumnsType<ConferenceItem> = useMemo(() => [
		{ title: '会议室名称', dataIndex: 'name' },
		{ title: '位置', dataIndex: 'location' },
		{ title: '会议室容量', dataIndex: 'capacity' },
		{ title: '设备', dataIndex: 'equipment' },
		{ title: '描述', dataIndex: 'description' },
		{ title: '创建时间', dataIndex: 'createDate' },
		// { title: '更新时间', dataIndex: 'updateDate' },
		// { title: '状态', dataIndex: 'isFrozen', render: (_, record) => record.isFrozen ? <Badge status="success">已冻结</Badge> : '正常' },
		{ title: '操作', render: (_, record) => <div>
			<Popconfirm title='确认' description='确认要删除这个会议室吗？' okText='确认' cancelText='取消' onConfirm={() => handleDeleteRoom(record.id)}>
				<a href="#">删除</a> 
			</Popconfirm>
			<br />
			<a href="#" onClick={() => {
				setUpdateId(record.id)
				setUpdateModalOpen(true)
			}}>编辑</a>
		</div>
		}
  ], [])
	const [pageNum, setPageNum] = useState(1)
	const [conferenceRooms, setConferenceRooms] = useState<ConferenceItem[]>([])
	const [total, setTotal] = useState(-1)
	const [createModalOpen, setCreateModalOpen] = useState(false)
	const [updateId, setUpdateId] = useState(-1)
	const [udpateModalOpen, setUpdateModalOpen] = useState(false)
	const searchConferenceRooms = useCallback(async ({
		name,
		location,
		equipment,
		capacity,
		pageNum,
	}: (SearchParam & { pageNum: number })) => {
		const {data} = await api.get<UsersReturn>('/conference-room/list', {
			params: {
				name,
				location,
				equipment,
				capacity,
				pageNum,
				pageSize: PAGE_SIZE,
			}
		})
		console.log(data)
		setConferenceRooms(data.conferenceRooms)
		setTotal(data.totalCount)
	}, [])

	const [form] = useForm()
	useEffect(() => {
		// searchConferenceRooms({
		// 	name: form.getFieldValue('name'),
		// 	equipment: form.getFieldValue('equipment'),
		// 	location: form.getFieldValue('location'),
		// 	capacity: form.getFieldValue('capacity'),
		// 	pageNum,
		// })
		search()
	}, [pageNum])
	const onChange = useCallback((pageNum: number) => {
		console.log(pageNum)
		setPageNum(pageNum)
	}, [])
	return <div className="p-5">
		<div className="user-manage-form">
			<Form form={form} onFinish={searchConferenceRooms} name="search" layout="inline" colon={false}>
				<Form.Item label='会议室名称' name='name'>
					<Input></Input>
				</Form.Item>
				<Form.Item label='位置' name='location'>
					<Input></Input>
				</Form.Item>
				<Form.Item label='设备' name='equipment'>
					<Input></Input>
				</Form.Item>
				<Form.Item label='容纳人数' name='capacity'>
					<Input></Input>
				</Form.Item>
				<Form.Item label=''>
					<Button type="primary" htmlType="submit">
						搜索会议室
					</Button>
					<Button type="primary" className="bg-green" onClick={() => setCreateModalOpen(true)}>
						添加会议室
					</Button>
				</Form.Item>
			</Form>
		</div>


		<div className="user-manage-table">
			<Table columns={columns} dataSource={conferenceRooms} pagination={{
				pageSize: PAGE_SIZE,
				current: pageNum,
				total,
				onChange
			}}></Table>
		</div>

		<CreateConferenceRoomModal isOpen={createModalOpen} handleClose={() => {
			setCreateModalOpen(false)
			search()
		}}></CreateConferenceRoomModal>
		<UpdateConferenceRoomModal id={updateId} isOpen={udpateModalOpen} handleClose={() => {
			setUpdateModalOpen(false)
			search()
		}}></UpdateConferenceRoomModal>
	</div>
}
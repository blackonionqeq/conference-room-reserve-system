import api from "@/api";
import { Button, Form, Input, Table,  } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType,  } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateReservationModal } from "./CreateReservationModal";

type SearchParam = {
	name: string
	capacity: number
	equipment: string
	location: string
}

export type ConferenceItem = {
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


export function ConferenceRoomList() {

	const search = () => {
		searchConferenceRooms({
			name: form.getFieldValue('name'),
			equipment: form.getFieldValue('equipment'),
			location: form.getFieldValue('location'),
			capacity: form.getFieldValue('capacity'),
			pageNum,
		})
	}
	
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
			<a href="#" onClick={() => {
				setCreateRoomId(record.id)
				setCreateModalOpen(true)
			}}>预定</a>
		</div>
		}
  ], [])
	const [pageNum, setPageNum] = useState(1)
	const [conferenceRooms, setConferenceRooms] = useState<ConferenceItem[]>([])
	const [total, setTotal] = useState(-1)
	const [createRoomId, setCreateRoomId] = useState(-1)
	const [createModalOpen, setCreateModalOpen] = useState(false)
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

		<CreateReservationModal isOpen={createModalOpen} roomId={createRoomId} handleClose={() => {
			setCreateModalOpen(false)
		}}></CreateReservationModal>

	</div>
}
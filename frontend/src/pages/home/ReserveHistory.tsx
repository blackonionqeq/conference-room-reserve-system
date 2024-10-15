import api from "@/api";
import { Button, DatePicker, Form, Input,  Table, Popconfirm, message   } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType,  } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react"
import type { ConferenceItem } from "../home/ConferenceRoomList";
import dayjs from 'dayjs'
import type { User } from "../admin/UserManagement";

type SearchParam = {
	roomName: string
	roomLocation: string
	reserveStartFrom: string
	reserveEndUntil: string
}

type ReservationItem = {
	startTime: string
	endTime: string
	status: string
	note: string
	id: number
	user: User
	room: ConferenceItem
	createTime: string
	updateTime: string
}

type ReservationsReturn = {
	totalCount: number
	reservations: ReservationItem[]
}



const PAGE_SIZE = 10 as const

const format = (date: string) => {
	if (!date) return ''
	return dayjs(new Date(date)).format('YYYY-MM-DD HH:mm:ss')
}



export function ReserveHistory() {


	const search = () => {
		searchConferenceRooms({
			roomName: form.getFieldValue('roomName'),
			roomLocation: form.getFieldValue('roomLocation'),
			reserveStartFrom: form.getFieldValue('reserveStartFrom'),
			reserveEndUntil: form.getFieldValue('reserveEndUntil'),
			pageNum,
		})
	}
	
	async function changeStatus(id: number) {
		await api.patch(`/reservation/unbind/${id}`)
		message.success('操作成功')
		search()
	}

	const columns: ColumnsType<ReservationItem> = useMemo(() => [
		{ title: '会议室名称', dataIndex: 'room', render: (_, record) => record.room.name },
		{ title: '会议室位置', dataIndex: 'room', render: (_, record) => record.room.location },
		{ title: '开始时间', dataIndex: 'room', render: (_, record) => format(record.startTime) },
		{ title: '结束时间', dataIndex: 'room', render: (_, record) => format(record.endTime) },
		{ title: '审批状态', dataIndex: 'status', render: (_, record) => {
			switch (record.status) {
				case '0': return '待审核'
				case '1': return '已通过'
				case '2': return '驳回'
				case '3': return '已解除'
			}
		}  },
		{ title: '预定时间', dataIndex: 'room', render: (_, record) => format(record.createTime) },
		{ title: '备注', dataIndex: 'note' },
		{ title: '描述', dataIndex: 'description' },
		{ title: '操作', render: (_, record) => <div>
			{
				record.status !== '0' ? '' : <div>
					<Popconfirm title='确认' description='确认解除申请？' okText='确认' cancelText='取消' onConfirm={() => changeStatus(record.id)}>
						<a href="#">解除</a>
					</Popconfirm>
				</div>
			}
		</div>
		}
  ], [])
	const [pageNum, setPageNum] = useState(1)
	const [reservations, setReservations] = useState<ReservationItem[]>([])
	const [total, setTotal] = useState(-1)
	const searchConferenceRooms = useCallback(async ({
		roomName,
		roomLocation,
		pageNum,
		reserveStartFrom,
		reserveEndUntil,
	}: (SearchParam & {pageNum: number})) => {
		const {data} = await api.get<ReservationsReturn>('/reservation/list', {
			params: {
				roomName,
				roomLocation,
				pageNum,
				pageSize: PAGE_SIZE,
				reserveStartFrom,
				reserveEndUntil,
			}
		})
		console.log(data)
		setReservations(data.reservations)
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
				<Form.Item label='会议室名称' name='roomName'>
					<Input></Input>
				</Form.Item>
				<Form.Item label='位置' name='roomLocation'>
					<Input></Input>
				</Form.Item>
				<Form.Item label='预定开始时间' name='reserveStartFrom'>
					<DatePicker showTime></DatePicker>
				</Form.Item>
				<Form.Item label='预定结束时间' name='reserveEndUntil'>
					<DatePicker showTime></DatePicker>
				</Form.Item>
				<Form.Item label=''>
					<Button type="primary" htmlType="submit">
						搜索预定历史
					</Button>
				</Form.Item>
			</Form>
		</div>


		<div className="user-manage-table">
			<Table rowKey='id' columns={columns} dataSource={reservations} pagination={{
				pageSize: PAGE_SIZE,
				current: pageNum,
				total,
				onChange
			}}></Table>
		</div>

	</div>
}
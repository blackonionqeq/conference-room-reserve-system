import api from "@/api";
import { Button, DatePicker, Form, Select } from "antd";
import { useForm } from "antd/es/form/Form";
// import { ColumnsType,  } from "antd/es/table";
import {  useEffect,  useRef, useState } from "react"
// import type { ConferenceItem } from "../home/ConferenceRoomList";
import dayjs from 'dayjs'
// import type { User } from "../admin/UserManagement";
import * as echarts from "echarts";


type StatisticsForm = {
	startTime: string
	endTime: string
	chartType: 'bar'|'pie'
}

type ResultItem = {
	username: string
	reservationCount: number
}
type ResultItem2 = {
	roomName: string
	reservationCount: number
}

const format = (date: string) => dayjs(date).format('YYYY-MM-DD')

export function DataStatistics() {

	async function getData() {
		const values = form.getFieldsValue()
		api.get('/statistic/count-reservations-of-user', {
			params: {
				startTime: format(values.startTime),
				endTime: format(values.endTime)
			}
		}).then(res => {
			setList(res.data)
		})
		api.get('/statistic/count-reservations-of-room', {
			params: {
				startTime: format(values.startTime),
				endTime: format(values.endTime)
			}
		}).then(res => {
			setList2(res.data)
		})
	}

	const [form] = useForm<StatisticsForm>()
	const [list, setList] = useState<ResultItem[]>()
	const [list2, setList2] = useState<ResultItem2[]>()

	const chartsRef = useRef<HTMLDivElement>(null)
	const chartsRef2 = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!list) return
		const chart = echarts.init(chartsRef.current)
		chart.setOption({
			baseOption: {
				title: { text: '用户预定情况' },
				xAxis: {
					data: list?.map(i => i.username),
					type: 'category'
				},
				yAxis: {},
				series: [
					{
						name: '预定次数',
						type: form.getFieldValue('chartType'),
						data: list?.map(i => ({ name: i.username, value: i.reservationCount }))
					}
				]
			}
		})
	}, [list])
	useEffect(() => {
		if (!list2) return
		const chart = echarts.init(chartsRef2.current)
		chart.setOption({
			baseOption: {
				title: { text: '会议室预定情况' },
				xAxis: {
					data: list2?.map(i => i.roomName),
					type: 'category'
				},
				yAxis: {},
				series: [
					{
						name: '预定次数',
						type: form.getFieldValue('chartType'),
						data: list2?.map(i => ({ name: i.roomName, value: i.reservationCount }))
					}
				]
			}
		})
	}, [list2])
	// async function render() {
	// 	const data = await getData()
	// }
	
	return <div className="p-5">
		<div className="mb-10">
			<Form form={form} onFinish={getData} name="search" layout="inline" colon={false}>
				<Form.Item label='开始日期' name='startTime'>
					<DatePicker></DatePicker>
				</Form.Item>
				<Form.Item label='结束日期' name='endTime'>
					<DatePicker></DatePicker>
				</Form.Item>
				<Form.Item label='图标类型' name='chartType' initialValue="bar">
					<Select>
						<Select.Option value='pie'>饼图</Select.Option>
						<Select.Option value='bar'>柱状图</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item label=''>
					<Button type="primary" htmlType="submit">
						查询
					</Button>
				</Form.Item>
			</Form>
		</div>

		<div className='w-200 h-150' ref={chartsRef}>
			图表1
		</div>
		<div className='w-200 h-150' ref={chartsRef2}>
			图表2
		</div>

	</div>
}
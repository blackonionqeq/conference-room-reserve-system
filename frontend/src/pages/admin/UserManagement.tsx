import api from "@/api";
import { Button, Form, Input, Table, Image, message, Badge } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType,  } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";

type SearchParam = {
	username: string
	nickName: string
	email: string
}

type User = {
	id: number
	username: string
	nickName: string
	email: string
	isFrozen: boolean
}
type UsersReturn = {
	totalCount: number
	users: User[]
}


// 表格相关


// const data = [
// 	{
// 			id: 1,
// 			username: 'xx',
// 			avatar: 'xxx.png',
// 			nickName: 'xxx',
// 			email: 'xx@xx.com',
// 			createTime: new Date()
// 	},
// 	{
// 			id: 2,
// 			username: 'yy',
// 			avatar: 'yy.png',
// 			nickName: 'yyy',
// 			email: 'yy@yy.com',
// 			createTime: new Date()
// 	}
// ]

const PAGE_SIZE = 2 as const


export function UserManagement() {
	
	const handleFreezeUser = useCallback(async (username: string) => {
		await api.get(`/user/freeze/${username}`)
		message.success('操作成功')
		
		searchUsers({
			username: form.getFieldValue('username'),
			email: form.getFieldValue('email'),
			nickName: form.getFieldValue('nickName'),
			pageNum,
		})
	}, [])
	const columns: ColumnsType<User> = useMemo(() => [
		{ title: '用户名', dataIndex: 'username' },
		{ title: '头像', dataIndex: 'avatar', render: (src?: string) => src ? <Image width={50} src={import.meta.env.VITE_SERVER+src} /> : '' },
		{ title: '昵称', dataIndex: 'nickName' },
		{ title: '邮箱', dataIndex: 'email' },
		{ title: '注册时间', dataIndex: 'createDate' },
		{ title: '状态', dataIndex: 'isFrozen', render: (_, record) => record.isFrozen ? <Badge status="success">已冻结</Badge> : '正常' },
		{ title: '操作', render: (_, record) => <a href="#" onClick={() => handleFreezeUser(record.username)}>冻结</a> }
	], [])
	const [pageNum, setPageNum] = useState(1)
	const [users, setUsers] = useState<User[]>([])
	const [total, setTotal] = useState(-1)
	const searchUsers = useCallback(async ({
		username,
		nickName,
		email,
		pageNum,
	}: (SearchParam & { pageNum: number })) => {
		const {data} = await api.get<UsersReturn>('/user/list', {
			params: {
				username,
				nickName,
				email,
				pageNum,
				pageSize: PAGE_SIZE,
			}
		})
		console.log(data)
		setUsers(data.users)
		setTotal(data.totalCount)
	}, [])

	const [form] = useForm()
	useEffect(() => {
		searchUsers({
			username: form.getFieldValue('username'),
			email: form.getFieldValue('email'),
			nickName: form.getFieldValue('nickName'),
			pageNum,
		})
	}, [pageNum])
	const onChange = useCallback((pageNum: number) => {
		console.log(pageNum)
		setPageNum(pageNum)
	}, [])
	return <div className="p-5">
		<div className="user-manage-form">
			<Form form={form} onFinish={searchUsers} name="search" layout="inline" colon={false}>
				<Form.Item label='用户名' name='username'>
					<Input></Input>
				</Form.Item>
				<Form.Item label='昵称' name='nickName'>
					<Input></Input>
				</Form.Item>
				<Form.Item label='邮箱' name='email' rules={[
					{ type: 'email', message: '请输入合法的邮箱' }
				]}>
					<Input></Input>
				</Form.Item>
				<Form.Item label=''>
					<Button type="primary" htmlType="submit">
						搜索用户
					</Button>
				</Form.Item>
			</Form>
		</div>


		<div className="user-manage-table">
			<Table columns={columns} dataSource={users} pagination={{
				pageSize: PAGE_SIZE,
				current: pageNum,
				total,
				onChange
			}}></Table>
		</div>
	</div>
}
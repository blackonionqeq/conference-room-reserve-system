import { Menu } from "antd";
import { Outlet } from "react-router-dom";

const menuItems = [
	{ key: 1, label: '会议室管理' },
	{ key: 2, label: '预定管理' },
	{ key: 3, label: '用户管理' },
	{ key: 4, label: '统计' },
]

export function AdminMenu() {
	return <div className="flex flex-row">
		<div className="w-[200px]">
			<Menu items={menuItems} defaultSelectedKeys={['3']}></Menu>
		</div>
		<div className="flex-1">
			<Outlet></Outlet>
		</div>
	</div>
}
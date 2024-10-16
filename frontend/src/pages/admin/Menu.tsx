import { router } from "@/main";
import { Menu } from "antd";
import { Outlet } from "react-router-dom";

const menuItems = [
	{ key: '1', label: '会议室管理', to: '/admin/conference-room-management' },
	{ key: '2', label: '预定管理', to: '/admin/reserve-management' },
	{ key: '3', label: '用户管理', to: '/admin/user-managment' },
	{ key: '4', label: '统计', to: '/admin/data-statistics' },
]

function getSelectedKeys(pathname: string) {
	const idx = menuItems.findIndex(i => pathname.includes(i.to))
	if (idx !== -1) {
		return menuItems[idx].key
	}
	return menuItems[2].key
}

function handleClickMenuItem(key: string) {
	const idx = menuItems.findIndex(i => i.key === key)
	if (idx !== -1) {
		router.navigate(menuItems[idx].to)
	}
}

export function AdminMenu() {
	return <div className="flex flex-row">
		<div className="w-[200px]">
			<Menu items={menuItems} defaultSelectedKeys={[
				getSelectedKeys(location.pathname)
			]} onClick={(record) => handleClickMenuItem(record.key)}></Menu>
		</div>
		<div className="flex-1">
			<Outlet></Outlet>
		</div>
	</div>
}
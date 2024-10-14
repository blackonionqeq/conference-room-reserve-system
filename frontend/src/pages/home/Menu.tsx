import { router } from "@/main";
import { Menu as AntMenu } from "antd";
import { Outlet } from "react-router-dom";

const menuItems = [
	{ key: '1', label: '会议室列表', to: '/home/conference-room-list' },
	{ key: '2', label: '预定历史', to: '/home/reserve-history' },
]

function getSelectedKeys(pathname: string) {
	const idx = menuItems.findIndex(i => pathname.includes(i.to))
	if (idx !== -1) {
		return menuItems[idx].key
	}
	return menuItems[0].key
}

function handleClickMenuItem(key: string) {
	const idx = menuItems.findIndex(i => i.key === key)
	if (idx !== -1) {
		router.navigate(menuItems[idx].to)
	}
}

export function Menu() {
	return <div className="flex flex-row">
		<div className="w-[200px]">
			<AntMenu items={menuItems} defaultSelectedKeys={[
				getSelectedKeys(location.pathname)
			]} onClick={(record) => handleClickMenuItem(record.key)}></AntMenu>
		</div>
		<div className="flex-1">
			<Outlet></Outlet>
		</div>
	</div>
}
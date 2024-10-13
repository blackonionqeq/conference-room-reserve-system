import { router } from "@/main";
import { Menu, MenuProps } from "antd";
import { useCallback, useMemo } from "react";
import { Outlet } from "react-router-dom";



export function UserMenu() {
	const menuItems = useMemo(() => [
		{ key: '1', label: '更改个人信息', to: '/admin/user/modify-info' },
		{ key: '2', label: '修改密码', to: '/admin/user/modify-password' },
	], [])
	// @ts-ignore
	const handleClickMenuItem: MenuProps['onClick'] = useCallback((info) => {
		// if (info.key === menuItems[0].key) {
		// 	router.navigate('/admin/user/modify-info')
		// } else if (info.key === menuItems[1].key) {
		// 	router.navigate('/admin/user/modify-password')
		// }
		const idx = menuItems.findIndex(i => i.key === info.key)
		if (idx !== -1) router.navigate(menuItems[idx].to)
	}, [])
	return <div className="flex flex-row">
		<div className="w-[200px]">
			<Menu items={menuItems} defaultSelectedKeys={[
				location.pathname === menuItems[0].to ? menuItems[0].key : menuItems[1].key
			]} onClick={handleClickMenuItem}></Menu>
		</div>
		<div className="flex-1">
			<Outlet></Outlet>
		</div>
	</div>
}
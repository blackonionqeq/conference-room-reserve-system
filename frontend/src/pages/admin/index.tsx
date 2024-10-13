import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";


export function AdminHome() {
	return <div className="h-dvh flex flex-col">
		<div className="h-[80px] border-b-1 border-[#aaa] leading-[80px] flex justify-between px-5">
			<Link to='/admin' className="decoration-none text-black">
				<h1>会议室预定系统-后台管理</h1>
			</Link>
			<Link to='/admin/user/modify-info' className="decoration-none text-black">
				<UserOutlined className='text-10 mt-5' />
			</Link>
			{/* <div className="w-10 h-10 mt-5 i-ic:baseline-account-box"></div> */}
		</div>
		<div className="flex-1">
			<Outlet></Outlet>
		</div>
	</div>
}
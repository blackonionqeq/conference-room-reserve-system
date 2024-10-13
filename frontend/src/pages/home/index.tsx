import { UserOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";


export function Home() {
	return <div className="h-dvh flex flex-col">
		<div className="h-[80px] border-b-1 border-[#aaa] leading-[80px] flex justify-between px-5">
			<h1>会议室预定系统</h1>
			<UserOutlined className='text-10 mt-5' />
			{/* <div className="w-10 h-10 mt-5 i-ic:baseline-account-box"></div> */}
		</div>
		<div className="flex-1">
			<Outlet></Outlet>
		</div>
	</div>
}
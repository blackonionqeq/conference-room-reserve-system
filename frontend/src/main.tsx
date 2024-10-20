// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import { createBrowserRouter,  RouterProvider } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { UpdatePassword } from './pages/UpdatePassword'
import 'virtual:uno.css'
import { ForgetPassword } from './pages/ForgetPassword'
import { Home } from './pages/home'
import { UpdateUserInfo } from './pages/home/UpdateUserInfo'
import { AdminHome } from './pages/admin'
import { AdminLogin } from './pages/admin/Login'
import { AdminMenu } from './pages/admin/Menu'
import { UserManagement } from './pages/admin/UserManagement'
import { UserMenu } from './pages/admin/UserMenu'
import { ConferenceRoomManagement } from './pages/admin/ConferenceRoomManagement'
import { ReserveManagement } from './pages/admin/ReserveManagement'
import { DataStatistics } from './pages/admin/DataStatistics'
import { Menu } from './pages/home/Menu'
import { ConferenceRoomList } from './pages/home/ConferenceRoomList'
import { ReserveHistory } from './pages/home/ReserveHistory'

// function Layout() {
//   return <div>
//     <div>
//       <Link to="/aaa">toaaa</Link>
//     </div>
//     <div>
//       <Link to="/bbb">tobbb</Link>
//     </div>
//     <div>
//       <Outlet></Outlet>
//     </div>
//   </div>
// }

export const router = createBrowserRouter([
      {
        path: '/',
        element: <div>default page</div>,
        errorElement: <div>Error</div>,
      },
      {
        path: '/home',
        element: <Home></Home>,
        children: [
          {
            path: '',
            element: <Menu></Menu>,
            children: [
              {
                path: '',
                element: <ConferenceRoomList></ConferenceRoomList>
              },
              {
                path: 'conference-room-list',
                element: <ConferenceRoomList></ConferenceRoomList>,
              },
              {
                path: 'reserve-history',
                element: <ReserveHistory></ReserveHistory>
              }
            ]
          },
          {
            path: 'login',
            element: <Login/>
          },
          {
            path: 'update-user-info',
            element: <UpdateUserInfo/>
          },
        ]
      },
      {
        path: 'login',
        element: <Login/>
      },
      {
        path: 'register',
        element: <Register/>
      },
      {
        path: 'update-password',
        element: <UpdatePassword/>
      },
      {
        path: 'forget-password',
        element: <ForgetPassword/>
      },
      {
        path: '/admin',
        element: <AdminHome></AdminHome>,
        children: [
          {
            path: '',
            element: <AdminMenu></AdminMenu>,
            children: [
              {
                path: 'user-managment',
                element: <UserManagement></UserManagement>,
              },
              {
                path: 'conference-room-management',
                element: <ConferenceRoomManagement></ConferenceRoomManagement>,
              },
              {
                path: 'reserve-management',
                element: <ReserveManagement></ReserveManagement>,
              },
              {
                path: 'data-statistics',
                element: <DataStatistics></DataStatistics>,
              },
            ],
          },
          {
            path: 'user',
            element: <UserMenu></UserMenu>,
            children: [
              {
                path: 'modify-info',
                element: <UpdateUserInfo></UpdateUserInfo>
              },
              {
                path: 'modify-password',
                element: <UpdatePassword></UpdatePassword>
              },
            ],
          },
          {
            path: 'login',
            element: <AdminLogin></AdminLogin>
          },
        ],
      }
    // ]
  // }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)

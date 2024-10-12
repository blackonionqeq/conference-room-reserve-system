// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import { createBrowserRouter,  RouterProvider } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { UpdatePassword } from './pages/UpdatePassword'
import 'virtual:uno.css'

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

const router = createBrowserRouter([
  // {
    // path: '/',
    // element: <Layout></Layout>,
    // errorElement: <div>Error</div>,
    // children: [
      {
        path: '/',
        element: <div>default page</div>,
        errorElement: <div>Error</div>,
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
    // ]
  // }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)

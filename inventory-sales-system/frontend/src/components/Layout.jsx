import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 rtl:pl-0 ltr:pl-0">
      <Sidebar />
      <div className="rtl:pl-64 ltr:pl-0 min-h-screen transition-all duration-300">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
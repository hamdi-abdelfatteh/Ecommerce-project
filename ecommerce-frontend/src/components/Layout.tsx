import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f8f7ff]">
      <Navbar />
      <main className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-7xl px-6 py-10">
          <Outlet />
        </div>
      </main>
      <footer className="w-full bg-[#0f0e17] text-gray-500 text-sm text-center py-6">
        <div className="max-w-7xl mx-auto">© 2026 ShopNest. All rights reserved.</div>
      </footer>
    </div>
  )
}

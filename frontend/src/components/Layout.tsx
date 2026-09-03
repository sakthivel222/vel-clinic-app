import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, CalendarDays, IndianRupee, Settings, LogOut, Dumbbell } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm hidden md:flex">
        <h1 className="text-xl font-semibold text-slate-800">Vel Clinic</h1>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
            DK
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto p-4 h-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t flex justify-around items-center pb-safe pt-2 shadow-lg z-50 overflow-x-auto">
        <NavItem to="/" icon={<Home className="w-6 h-6" />} label="Home" />
        <NavItem to="/patients" icon={<Users className="w-6 h-6" />} label="Patients" />
        <NavItem to="/calendar" icon={<CalendarDays className="w-6 h-6" />} label="Calendar" />
        <NavItem to="/exercises" icon={<Dumbbell className="w-6 h-6" />} label="Exercises" />
        <NavItem to="/payments" icon={<IndianRupee className="w-6 h-6" />} label="Billing" />
        <NavItem to="/settings" icon={<Settings className="w-6 h-6" />} label="More" />
      </nav>

      {/* Side Navigation for Desktop */}
      <nav className="hidden md:block fixed left-0 top-14 bottom-0 w-64 bg-white border-r">
         <div className="flex flex-col p-4 gap-2">
            <DesktopNavItem to="/" icon={<Home className="w-5 h-5" />} label="Dashboard" />
            <DesktopNavItem to="/patients" icon={<Users className="w-5 h-5" />} label="Patients" />
            <DesktopNavItem to="/calendar" icon={<CalendarDays className="w-5 h-5" />} label="Calendar" />
            <DesktopNavItem to="/exercises" icon={<Dumbbell className="w-5 h-5" />} label="Exercises" />
            <DesktopNavItem to="/payments" icon={<IndianRupee className="w-5 h-5" />} label="Payments" />
            <DesktopNavItem to="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
         </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center p-2 w-16 ${
          isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
        }`
      }
    >
      {icon}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </NavLink>
  );
}

function DesktopNavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-md transition-colors ${
          isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

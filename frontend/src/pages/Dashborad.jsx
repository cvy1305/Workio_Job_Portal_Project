import { useContext, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { LoaderCircle, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Added this

  const { userData, userDataLoading, logoutUser } = useContext(AppContext);

  const sidebarLinks = [
    {
      id: "manage-jobs",
      name: "Manage Jobs",
      path: "/dashboard/manage-jobs",
      icon: assets.home_icon,
    },
    {
      id: "add-job",
      name: "Add Job",
      path: "/dashboard/add-job",
      icon: assets.add_icon,
    },
    {
      id: "view-applications",
      name: "View Applications",
      path: "/dashboard/view-applications",
      icon: assets.person_tick_icon,
    },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      document.title = "Workio - Job Portal | Dashboard";
      navigate("/dashboard/manage-jobs");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 py-3 bg-white sticky top-0 z-10 px-4 shadow-sm">
        <Link to="/dashboard" className="flex items-center">
          <img className="w-[120px]" src={assets.workio_logo} alt="Workio Logo" />
        </Link>
        {userDataLoading ? (
          <LoaderCircle className="animate-spin text-gray-500" />
        ) : userData ? (
          <div className="flex items-center gap-4 md:gap-3">
            <div className="flex items-center gap-2">
              <p className="text-gray-600">Hi, {userData?.name}</p>
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={userData?.image}
                alt={`${userData?.name}'s profile`}
              />
            </div>
            <button
              className="w-[30px] h-[30px] flex items-center justify-center rounded bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={18} className="text-gray-700" />
            </button>
          </div>
        ) : null}
      </header>

      <div className="flex flex-1">
        <aside className="md:w-64 w-16 border-r border-gray-200 bg-white flex flex-col shrink-0 shadow-sm">
          <nav className="pt-4">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.id}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 gap-3 transition-colors rounded-l-md ${
                    isActive
                      ? "border-r-4 md:border-r-[6px] bg-indigo-50 border-indigo-500 text-indigo-600 font-medium"
                      : "text-gray-600"
                  }`
                }
                end={item.path === "/dashboard/manage-jobs"}
              >
                <img
                  src={item.icon}
                  alt={`${item.name} icon`}
                  className="w-5 h-5"
                  aria-hidden="true"
                />
                <span className="md:block hidden">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

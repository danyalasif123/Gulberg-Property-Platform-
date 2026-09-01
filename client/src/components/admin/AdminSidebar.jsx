import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./AdminSidebar.css";

const AdminSidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard"
    },
    {
      label: "Properties",
      path: "/admin/properties"
    },
    {
      label: "Enquiries",
      path: "/admin/enquiries"
    },
    {
      label: "Categories",
      path: "/admin/categories"
    },
    {
      label: "Locations",
      path: "/admin/locations"
    },
    {
      label: "Settings",
      path: "/admin/settings"
    }
  ];

  return (
    <aside className="admin-sidebar">

      <div className="sidebar-logo">
        <h2>Gulberg</h2>
        <span>Property Platform</span>
      </div>

      <nav className="sidebar-nav">

        <div className="sidebar-section-title">
          MAIN
        </div>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>{item.label}</span>
          </NavLink>
        ))}

      </nav>

      <div className="sidebar-bottom">

        <button
          className="sidebar-logout"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;
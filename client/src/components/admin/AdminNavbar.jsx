import { useAuth } from "../../context/AuthContext";

import "./AdminNavbar.css";

const AdminNavbar = () => {
  const { admin } = useAuth();

  return (
    <header className="admin-navbar">

      <div className="navbar-left">
        <h1>Dashboard</h1>
      </div>

      <div className="navbar-right">

        <div className="admin-profile">

          <div className="admin-avatar">
            {admin?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="admin-info">
            <strong>{admin?.name}</strong>
            <span>Administrator</span>
          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminNavbar;
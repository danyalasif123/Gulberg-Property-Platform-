import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  /*
  =========================================
  CHECK ADMIN SESSION
  =========================================

  sessionStorage is specific to the
  current browser tab.

  This means:

  Tab 1 → Admin login
  Tab 2 → No admin session
  */

  const token = sessionStorage.getItem(
    "adminToken"
  );

  /*
  =========================================
  NOT AUTHENTICATED
  =========================================
  */

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /*
  =========================================
  AUTHENTICATED
  =========================================
  */

  return children;
};

export default ProtectedRoute;
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const RequireAdmin = () => {
  const role = Cookies.get("role");
  // eslint-disable-next-line
  return role == 1 ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default RequireAdmin;

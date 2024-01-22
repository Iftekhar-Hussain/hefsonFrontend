import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const RequireAdminCarrier = () => {
  const role = Cookies.get("role");
  // eslint-disable-next-line
  return role == 1 || role == 2 ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default RequireAdminCarrier;

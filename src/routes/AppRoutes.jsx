import { Route, Routes, Navigate } from "react-router-dom";

import HomeScreen from "../pages/HomeScreen";
import LogIn from "../components/login/LogIn";
import ForgotPassword from "../components/forgot-password/forgotPassword";
import SignUp from "../components/signup/SIgnUp";
import SendCode from "../components/sendCode/SendCode";
import Missing from "../components/Missing";
import PrivateRoutes from "../utils/PrivateRoutes";
import Unauthorized from "../components/Unauthorized";
import Trailers from "../pages/Trailers";
import NewShipment from "../pages/NewShipment";
import Drivers from "../pages/Drivers";
import Shipment from "../pages/Shipment";
import ShipmentMoreinfo from "../pages/ShipmentMoreinfo";
import RequireCarrier from "../utils/RequireCarrier";
import EmailVerification from "../components/EmailVerification/EmailVerification";
import Devices from "../pages/Devices";
import DeviceList from "../pages/DeviceList";
import Alarm from "../pages/Alarm";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Chat from "../pages/Chat";
import QRcodes from "../pages/QRcodes";
import QRcodesDisplay from "../pages/QRcodedisplay";
import Soiltable from "../pages/Soiltable";
import SoiltableList from "../pages/SoiltableList";
import SolitableDetailList from "../pages/SolitableDetailList";
import TrailerList from "../pages/TrailerList";
import ResetPassword from "../components/reset-password/resetPassword";
import ResetConfirm from "../components/reset-confirm/resetConfirm";
import Trucks from "../pages/Trucks";
import Terms from "../components/term/Terms";
import TrailersMoreInfo from "../pages/TrailersMoreInfo";
import Landingpage from "../components/Landingpages/Landingpage";
import Solution from "../components/Landingpages/Solution";
import Products from "../components/Landingpages/Products";
import Industries from "../components/Landingpages/Industries";
import DevicesMoreinfo from "../pages/DevicesMoreinfo";
import CompleteShipment from "../pages/CompleteShipment";
import CompleteShipmentMoreinfo from "../pages/CompleteShipmentMoreinfo";
import AdminDashboard from "../pages/AdminDashboard";
import UpdateShipment from "../pages/UpdateShipment";
import RequireAdmin from "../utils/RequireAdmin";
import RequireAdminCarrier from "../utils/RequireAdminCarrier";
import Customer from "../pages/Customer";
import DeviceListAdmin from "../pages/DeviceListAdmin";
import AdminSoiltableList from "../pages/AdminSoiltableList";
import DriversMoreinfo from "../pages/DriversMoreinfo";
import TrucksMoreinfo from "../pages/TrucksMoreinfo";
import OpenRenderer from "../pages/OpenRenderer";
import TrailersMoreInfoAdmin from "../pages/TrailersMoreInfoAdmin";
import ShipmentMoreinfoNotemp from "../pages/ShipmentMoreinfoNotemp";
import CompleteShipmentMoreinfoNotemp from "../pages/CompleteShipmentMoreinfoNotemp";
import Notifications from "../pages/Notifications";

const AppRoutes = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route exact path="/" element={<Navigate replace to="/login" />} />
      <Route path="login" element={<LogIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="send-code" element={<SendCode />} />
      <Route
        path="verify-email/:emailVerification"
        element={<EmailVerification />}
      />
      <Route path="Alarm" element={<Alarm />} />
      <Route path="QRcodes" element={<QRcodes />} />
      <Route path="QRcodesDisplay/:id" element={<QRcodesDisplay />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
      <Route path="reset-confirm" element={<ResetConfirm />} />
      <Route path="terms-and-condition" element={<Terms />} />

      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="Landingpage" element={<Landingpage />} />
      <Route path="Solution" element={<Solution />} />
      <Route path="Products" element={<Products />} />
      <Route path="Industries" element={<Industries />} />
      <Route path="/soiltable/:id" element={<Soiltable />} />
      {/* <Route path="open" element={<OpenRenderer />} /> */}

      {/* open link */}
      <Route path="/Shipment-moreinfo/:id" element={<ShipmentMoreinfo />} />
      <Route
        path="/Shipment-moreinfo-notemp/:id"
        element={<ShipmentMoreinfoNotemp />}
      />
      <Route
        path="/complete-shipment-moreinfo/:id"
        element={<CompleteShipmentMoreinfo />}
      />
      <Route
        path="/complete-shipment-moreinfo-notemp/:id"
        element={<CompleteShipmentMoreinfoNotemp />}
      />

      <Route element={<PrivateRoutes />}>
        {/* protected routes for Admin and carrier */}
        <Route element={<RequireAdminCarrier />}>
          {/* <Route path="Soiltable/:id" element={<Soiltable />} /> */}
          <Route path="SoiltableList" element={<SoiltableList />} />
          <Route
            path="SolitableDetailList/:id"
            element={<SolitableDetailList />}
          />
          <Route path="Chat" element={<Chat />} />

          <Route path="Devices" element={<Devices />} />
          <Route path="DeviceList" element={<DeviceList />} />
          <Route path="Devices-moreinfo/:id" element={<DevicesMoreinfo />} />

          <Route path="trailers-moreinfo/:id" element={<TrailersMoreInfo />} />

          <Route path="Settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* protected routes for Admin */}

        <Route element={<RequireAdmin />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-devicelist" element={<DeviceListAdmin />} />
          <Route path="admin-soiltablelist" element={<AdminSoiltableList />} />
          <Route path="customer" element={<Customer />} />
          <Route
            path="/trailers-moreinfo-admin/:id"
            element={<TrailersMoreInfoAdmin />}
          />
        </Route>

        {/* protected routes for Carrier */}

        <Route element={<RequireCarrier />}>
          <Route path="units" element={<Trucks />} />
          <Route path="/units-moreinfo/:name" element={<TrucksMoreinfo />} />

          <Route path="Trailers" element={<Trailers />} />
          <Route path="TrailersList" element={<TrailerList />} />

          <Route path="driver" element={<Drivers />} />
          <Route path="/driver-moreinfo/:name" element={<DriversMoreinfo />} />

          <Route path="Shipment" element={<Shipment />} />
          <Route path="completeshipment" element={<CompleteShipment />} />

          <Route path="new-shipment" element={<NewShipment />} />
          <Route path="/update-shipment/:id" element={<UpdateShipment />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="Profile" element={<Profile />} />
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
};

export default AppRoutes;

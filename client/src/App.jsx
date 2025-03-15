import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLayout from "./components/layouts/CustomerLayout";
import Home from "./pages/Customer/Home";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Seller/service/Services";
import Orders from "./pages/Seller/Orders";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import AuthLayout from "./components/layouts/AuthLayout";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import AddService from "./pages/Seller/service/AddService";
import CServices from "./pages/Customer/CServices";
import SellerLogin from "./pages/Auth/SellerLogin";
import SellerRegister from "./pages/Auth/SellerRegister";
import CServiceDetails from "./pages/Customer/CServiceDetails"
import CSuppliers from "./pages/Customer/CSuppliers";
import AdminLogin from "./pages/Auth/AdminLogin";
import ASellerManage from "./pages/Admin/ASellerManage";
import AAddSellerRole from "./pages/Admin/AAddSellerRole";
import ASellerRole from "./pages/Admin/ASellerRole";
import CSupplierShop from "./pages/Customer/CSupplierShop";
import Bookings from "./pages/Seller/service/Bookings";
import CustomerPrivateRoutes from "./components/routes/CustomerPrivateRoutes";
import CProfile from "./pages/Customer/Profile/CProfile";
import Inquiries from "./pages/Seller/Inquiries";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* customer  */}
        <Route element={<CustomerPrivateRoutes />}>
          <Route path="/services/:serviceId" element={<CustomerLayout component={CServiceDetails} />} /> 
          <Route path="/user/profile" element={<CustomerLayout component={CProfile} />} /> 
        </Route>
        <Route path="/" element={<CustomerLayout component={Home} />} />
        <Route path="/services" element={<CustomerLayout component={CServices} />} />
        <Route path="/suppliers" element={<CustomerLayout component={CSuppliers} />} />
        <Route path="/suppliers/:id" element={<CustomerLayout component={CSupplierShop} />} />
        <Route path="/sign-up" element={<AuthLayout component={Register} />} />
        <Route path="/sign-in" element={<AuthLayout component={Login} />} />
        {/* seller auth */}
        <Route path="/seller/sign-in" element={<AuthLayout component={SellerLogin} />} />
        <Route path="/seller/sign-up" element={<AuthLayout component={SellerRegister} />} />
        <Route path="/admin/sign-in" element={<AuthLayout component={AdminLogin} />} />
        <Route path="/forget-password" element={<AuthLayout component={ForgetPassword} />} />
        {/* seller  */}
        <Route path="/dashboard/my-profile" element={<AdminLayout component={Dashboard} />} />
        <Route path="/dashboard/services" element={<AdminLayout component={Services} />} />
        <Route path="/dashboard/add-services" element={<AdminLayout component={AddService} />} />
        <Route path="/dashboard/bookings" element={<AdminLayout component={Bookings} />} />
        <Route path="/dashboard/seller-manage" element={<AdminLayout component={ASellerManage} />} />
        <Route path="/dashboard/seller-role" element={<AdminLayout component={ASellerRole} />} />
        <Route path="/dashboard/add-seller-role" element={<AdminLayout component={AAddSellerRole} />} />
        <Route path="/dashboard/orders" element={<AdminLayout component={Orders} />} />
        <Route path="/dashboard/inquiries" element={<AdminLayout component={Inquiries} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

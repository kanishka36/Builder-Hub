import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import {
  authenticateSuccess,
  authenticateFailure,
  signOutSuccess,
} from "../../redux/user/userSlice";

const CustomerPrivateRoutes = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  //check token expiry
  useEffect(() => {
    const checkTokenExpiry = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/check-auth`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          dispatch(authenticateSuccess());
        } else {
          dispatch(authenticateFailure());
          dispatch(signOutSuccess());
        }
      } catch (error) {
        dispatch(authenticateFailure());
        dispatch(signOutSuccess());
      }
    };
    checkTokenExpiry();
  }, [dispatch, apiUrl]);

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  const authorizedRoles = ["user"];
  const userRole = currentUser.role;

  if (!authorizedRoles.includes(userRole)) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default CustomerPrivateRoutes;

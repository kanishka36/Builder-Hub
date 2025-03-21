import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  cartItems: [],
  cartItemCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      state.cartItemCount = action.payload.length;
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.productId._id !== action.payload
      );
      state.cartItemCount = state.cartItems.length;
    },
  },
});

export const { setCartItems, removeCartItem } = cartSlice.actions;

export const fetchCartItems = () => async (dispatch) => {
  try {
    const apiUrl = import.meta.env.VITE_ROUTE_URL;
    const res = await axios.get(`${apiUrl}/api/view-cart`, {
      withCredentials: true,
    });
    dispatch(setCartItems(res.data.data?.items || []));
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
  }
};

export default cartSlice.reducer;

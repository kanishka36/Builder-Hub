// utils/paymentUtils.js
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const handlePayment = async ({
  selectedItem,
  totalPrice,
  sellerId,
  customer,
}) => {
  if (!selectedItem || !customer) {
    console.error("Missing selectedItem or customer info");
    return;
  }
  const customerId = customer?._id;
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const orderId = `PRODUCT_${uuidv4()}`;
  const merchantID = import.meta.env.VITE_PAYHERE_MERCHANT_ID;

  console.log(customer, "customer");

  const payment = {
    sandbox: true,
    merchant_id: merchantID,
    return_url: "http://localhost:5173/payment-success",
    cancel_url: "http://localhost:5173/payment-failed",
    notify_url: `http://localhost:5173/notify`,
    order_id: orderId,
    items: selectedItem.name,
    amount: totalPrice,
    currency: "LKR",
    first_name: customer.firstName,
    last_name: customer.lastName,
    email: customer.email,
    phone: customer.phoneNumber,
    address: customer.address,
    city: customer.city,
    country: "Sri Lanka",
    delivery_address: customer.address,
    delivery_city: customer.city,
    delivery_country: "Sri Lanka",
    custom_1: sellerId,
    custom_2: customerId,
  };

  try {
    const response = await axios.post(`${apiUrl}/api/generate-hash`, {
      merchant_id: payment.merchant_id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
    });

    payment.hash = response.data.hash;
    payhere.startPayment(payment);
  } catch (error) {
    console.error("Error generating hash or starting payment:", error);
  }
};

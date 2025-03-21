import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const handlePayment = async ({
  type = "default", // for logging or future customizations
  itemTitle,
  amount,
  customer,
  sellerId,
  customData = {},
  onSuccess,
  onError,
  onDismiss,
}) => {
  if (!customer || !itemTitle || !amount || !sellerId) {
    console.error("Missing payment data");
    return;
  }

  const orderId = `${type.toUpperCase()}_${uuidv4()}`;
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const merchantID = import.meta.env.VITE_PAYHERE_MERCHANT_ID;

  const payment = {
    sandbox: true,
    merchant_id: merchantID,
    return_url: "http://localhost:5173/payment-success",
    cancel_url: "http://localhost:5173/payment-failed",
    notify_url: "http://localhost:5173/notify",
    order_id: orderId,
    items: itemTitle,
    amount: amount,
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
    custom_2: customer._id,
    ...customData, // optional additional fields
  };

  try {
    const response = await axios.post(`${apiUrl}/api/generate-hash`, {
      merchant_id: payment.merchant_id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
    });

    payment.hash = response.data.hash;

    // Setup PayHere callbacks
    payhere.onCompleted = function (orderId) {
      console.log("✅ Payment completed:", orderId);
      onSuccess?.(orderId);
    };

    payhere.onDismissed = function () {
      console.warn("⚠️ Payment dismissed by user");
      onDismiss?.();
    };

    payhere.onError = function (error) {
      console.error("❌ Payment error:", error);
      onError?.(error);
    };

    payhere.startPayment(payment);
  } catch (err) {
    console.error("Hash generation failed:", err);
    onError?.(err);
  }
};

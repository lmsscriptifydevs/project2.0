export const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
};

export const allowedCardNetworks = ["VISA", "MASTERCARD"];
export const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

// 🔁 Choose your real payment gateway
// For Checkout.com:
export const tokenizationSpecification = {
  type: "PAYMENT_GATEWAY",
  parameters: {
    gateway: "checkoutltd", // ✅ Use "checkoutltd" for Checkout.com
    gatewayMerchantId: "your_checkout_merchant_id", // ✅ Replace this with your real Checkout.com Google Pay Merchant ID
  },
};

// OR if using Stripe (just for reference):
// export const tokenizationSpecification = {
//   type: "PAYMENT_GATEWAY",
//   parameters: {
//     gateway: "stripe",
//     'stripe:version': '2022-08-01',
//     'stripe:publishableKey': 'pk_test_...'
//   }
// };

export const baseCardPaymentMethod = {
  type: "CARD",
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks: allowedCardNetworks,
  },
};

export const cardPaymentMethod = Object.assign({}, baseCardPaymentMethod, {
  tokenizationSpecification: tokenizationSpecification,
});

export const googlePayConfig = {
  environment: "PRODUCTION", // Change to "TEST" if testing
  merchantInfo: {
    merchantId: "BCR2DN4T765ZNJLF", // ✅ Use your verified Google Merchant ID
    merchantName: "GrapeTask",
  },
  paymentDataRequest: Object.assign({}, baseRequest, {
    allowedPaymentMethods: [cardPaymentMethod],
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPrice: "100.00", // Default value, override dynamically
      currencyCode: "PKR",
      countryCode: "PK",
    },
    merchantInfo: {
      merchantId: "BCR2DN4T765ZNJLF",
      merchantName: "GrapeTask",
    },
  }),
};
export const paymentRequest = googlePayConfig.paymentDataRequest;

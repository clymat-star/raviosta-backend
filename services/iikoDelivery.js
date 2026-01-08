import { getIikoToken } from "./iikoAuth.js";

export async function createIikoDelivery(items) {
  const token = await getIikoToken(process.env.IIKO_API_LOGIN);
  if (!token) throw new Error("IIKO TOKEN YO‘Q");

  const body = {
    organizationId: process.env.ORG_ID,
    terminalGroupId: process.env.TERMINAL_GROUP_ID,
    order: {
      phone: "+998900000000",

      // 🔴 ENUM — faqat STRING
      orderServiceType: "DeliveryByCourier",

      deliveryPoint: {
        address: {
          city: { name: "Tashkent" },
          street: { name: "Test ko‘cha" },
          house: "1"
        }
      },

      items: items.map(i => ({
        productId: i.id,
        amount: i.qty
      }))
    }
  };

  console.log("IIKO DELIVERY BODY:", JSON.stringify(body, null, 2));

  const res = await fetch(
    "https://api-ru.iiko.services/api/1/deliveries/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }
  );

  const data = await res.json();
  console.log("IIKO DELIVERY RESPONSE:", data);
  return data;
}

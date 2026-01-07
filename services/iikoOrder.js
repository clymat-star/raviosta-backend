import { getIikoToken } from "./iikoAuth.js";

export async function createIikoOrder(items) {
  const token = await getIikoToken(process.env.IIKO_API_LOGIN);

  if (!token) {
    throw new Error("IIKO TOKEN YO‘Q");
  }

  let total = 0;
  items.forEach(i => {
    total += Number(i.price) * i.qty;
  });

  const body = {
    organizationId: process.env.ORG_ID,
    terminalGroupId: process.env.TERMINAL_GROUP_ID,
    order: {
      orderType: "Delivery",
      items: items.map(i => ({
        productId: i.id,
        amount: i.qty
      })),
      payments: [
        {
          paymentTypeKind: "Cash",
          sum: total
        }
      ],
      customer: {
        name: "Telegram user"
      }
    }
  };

  console.log("IIKO ORDER BODY:", JSON.stringify(body, null, 2));

  const res = await fetch(
    "https://api-ru.iiko.services/api/1/order/create",
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
  console.log("IIKO RESPONSE:", data);

  return data;
}

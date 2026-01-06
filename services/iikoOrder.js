import fetch from "node-fetch";
import { getIikoToken } from "./iikoAuth.js";

export async function createIikoOrder(items) {
  const token = await getIikoToken(process.env.IIKO_API_LOGIN);

  const body = {
    organizationId: process.env.ORG_ID,
    terminalGroupId: process.env.TERMINAL_GROUP_ID,
    order: {
      items: items.map(i => ({
        productId: i.id,
        amount: i.qty
      })),
      payments: [
        {
          paymentTypeKind: "Cash",
          sum: 0
        }
      ]
    }
  };

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

  return await res.json();
}

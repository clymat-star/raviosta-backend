import fetch from "node-fetch";
import { getIikoToken } from "./iikoAuth.js";

export async function getMenu() {
  const token = await getIikoToken(process.env.IIKO_API_LOGIN);

  if (!token) {
    throw new Error("IIKO TOKEN YO‘Q");
  }

  const res = await fetch(
    "https://api-ru.iiko.services/api/1/nomenclature",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        organizationId: process.env.ORG_ID
      })
    }
  );

  const text = await res.text();
  const data = JSON.parse(text);

  const products = data.products || [];
  const groups = data.groups || [];

  // groupId → groupName
  const groupMap = {};
  groups.forEach(g => {
    groupMap[g.id] = g.name;
  });

  const menu = products
    .filter(p => p.sizePrices && p.sizePrices.length > 0)
    .map(p => ({
      id: p.id,
      name: p.name,
      category: groupMap[p.groupId] || "Boshqa",
      price: p.sizePrices[0].price,
      image: p.imageLinks?.[0]?.imageUrl || null
    }));

  return menu;
}


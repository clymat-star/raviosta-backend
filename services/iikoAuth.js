export async function getIikoToken(apiLogin) {
  const res = await fetch(
    "https://api-ru.iiko.services/api/1/access_token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiLogin })
    }
  );

  const data = await res.json();
  console.log("IIKO TOKEN RESPONSE:", data); 

  return data.token;
}
``
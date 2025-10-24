// File: pages/api/gasProxy.js

export default async function handler(req, res) {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbxN312wbnFlJ1DhFPXErFOOmiUkMK1UE-ZQu6-PRZsQHoM1SuyM5Dp7V7eThLJh4x7hDA/exec";

  try {
    // Forward **all** query parameters (path, qid, answer, etc.)
    const queryString = new URLSearchParams(req.query).toString();
    const url = `${GAS_URL}?${queryString}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json"
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined
    });

    // Parse the response safely
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: "Invalid JSON from GAS", raw: text };
    }

    // Allow CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);

  } catch (error) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ success: false, message: "Proxy error", error: error.message });
  }
}
import express from "express";
import { getMenu } from "../services/iikoMenu.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const menu = await getMenu();
    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Menyu olinmadi" });
  }
});

export default router;

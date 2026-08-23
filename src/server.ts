import dotenv from "dotenv";

dotenv.config();

console.log("🔥 ENV TEST:", process.env.FRONTEND_URL);

import app from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`🚀 MenuM API running on port ${PORT}`);
});
import jsonServer from "json-server";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "database.json"));
const middlewares = jsonServer.defaults();

server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// log request
server.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ JSON Server is running on port ${PORT}`);
});

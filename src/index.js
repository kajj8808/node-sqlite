import express from "express";
import { createTable, getAllContnets, initDB } from "./db.js";
import "../lib/utile.js";

const SERVER_PORT = 5000;

const app = express();

app.get("/", (_, res) => {
  res.json({
    ok: true,
    route: "/",
    tip: "이 메세지가 보인다면, 서버가 잘 작동 하고 있다는 뜻임.",
    message: "Welcome to express server! ⭐",
  });
});

app.get("/get_contnets", async (_, res) => {
  const contents = await getAllContnets();
  res.json({
    ok: true,
    route: "/get_contnets",
    tip: "Database 에서 contnent들을 모두 가져오고 있음.",
    contents,
  });
});

app.get("/image/:id", (req, res) => {
  const { id } = req.params;
  const imagePath = `public/image/${id}`;
  res.sendFile(imagePath, { root: "." }, (err) => {
    if (err) {
      res.status(404).json({
        ok: false,
        message: "이미지를 찾을 수 없습니다.",
      });
    }
  });
});

async function main() {
  await initDB();
  app.listen(SERVER_PORT, () => {
    console.log(`Server is Ready: http://localhost:${SERVER_PORT}`);
  });
}

main();

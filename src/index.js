import express from "express";
import qrcode from "qrcode";
import path from "path";

import {
  createTable,
  getAllContnets,
  getGroupContnet,
  initDB,
  insertContent,
} from "./db.js";
import { getFileListFromDir, getRandomGroup } from "../lib/utile.js";

const SERVER_PORT = 5555;

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

const PAGES_DIR = path.join(__dirname, "../src/pages");

app.get("/", (_, res) => {
  res.sendFile(path.join(PAGES_DIR, "index.html"));
});

app.get("/group/:name", (_, res) => {
  res.sendFile(path.join(PAGES_DIR, "group.html"));
});

app.get("/get_contnets/group/:name", async (req, res) => {
  const groupName = req.params.name;
  if (!groupName) {
    return res.json({
      ok: false,
      route: "/get_contnets",
      tip: "존재하지 않는 Group name임.",
    });
  }

  const contents = await getGroupContnet(groupName);

  res.json({
    ok: true,
    route: "/get_contnets",
    tip: "Database 에서 특정 group의 contnent들을 가져오고 있음.",
    contents,
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
  //await createTable();

  /* const fileList = await getFileListFromDir("./public/image");

  for (let imageFile of fileList) {
    const group = getRandomGroup();

    await insertContent(group, imageFile);
  } */

  /* const qrImage = await qrcode.toDataURL(
    "https://chzzk.naver.com/live/0d027498b18371674fac3ed17247e6b8"
  );
 */

  app.listen(SERVER_PORT, () => {
    console.log(`Server is Ready: http://localhost:${SERVER_PORT}`);
  });
}

main();

import express from "express";
import qrcode from "qrcode";

import {
  createTable,
  dropTable,
  getAllContnets,
  getGroupContent,
  getRandomContent,
  initDB,
  insertContent,
} from "./db.js";
import { getFileListFromDir, getRandomGroup } from "../lib/utile.js";
import cors from "cors";

const SERVER_PORT = 5000;

const app = express();

app.use(cors());

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

app.get("/get_contents/group", async (req, res) => {
  const { name, offset } = req.query;
  const contents = await getGroupContent(name, offset);
  res.json({
    ok: true,
    route: "/get_contnets/group",
    tip: "Database 에서 특정 group의 contnent들을 offset에 맞게 30개씩 가져오고 있음.",
    contents,
  });
});

app.get("/image/get_random/:group_name", async (req, res) => {
  const { group_name } = req.params;
  const content = await getRandomContent(group_name);
  if (!content) {
    return res.status(404).json({
      ok: false,
      message: "랜덤 이미지를 찾을 수 없습니다.",
    });
  }
  const imageUrl = `https://6757-2001-e60-ca42-ca61-381d-d495-b330-299f.ngrok-free.app/image/${content.image}`;
  const qrImage = await qrcode.toDataURL(imageUrl);
  res.json({
    ok: true,
    route: "/get_contnets",
    tip: "Database 에서 contnent를 랜덤으로 가져오고 있음.",
    content,
    qrImage,
    imageUrl: `http://localhost:5000/image/${content.image}`,
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
  //await createTable(); // 테이블 생성
  //await dropTable(); // 테이블 삭제
  /* const fileList = await getFileListFromDir("./public/image");
  for (let imageFile of fileList) {
    const group = getRandomGroup();
    await insertContent(group, imageFile);
  } */ // 이미지 파일을 DB에 삽입
  // await insertContent("group_one", "test.png");
  // await insertContent("group_two", "test.png");
  /* const qrImage = await qrcode.toDataURL(
    "https://chzzk.naver.com/live/0d027498b18371674fac3ed17247e6b8"
  );
  console.log("qrImage", qrImage); */

  //console.log(contents);
  const groupTwoOffset0 = await getGroupContent("group_one", 0);
  const groupTwoOffset30 = await getGroupContent("group_one", 30);

  app.listen(SERVER_PORT, () => {
    console.log(`Server is Ready: http://localhost:${SERVER_PORT}`);
  });
}

main();

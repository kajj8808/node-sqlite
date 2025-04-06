import { getFileListFromDir } from "../lib/utile";
import db, {
  createTable,
  dropTable,
  getAllContnets,
  initDB,
  insertContent,
} from "./db";

async function runDevTests() {
  // await initDB();
  // await dropTable();
  // await createTable();
  // await insertContent("group_1", "image_1");
  // await getAllContnets();
  /* const imageFiles = await getFileListFromDir("./public/image");
    for (const imageFile of imageFiles) {
      console.log(imageFile);
    } */
}

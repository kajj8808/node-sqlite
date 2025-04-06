import fs from "fs";

export async function getFileListFromDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  return files;
}

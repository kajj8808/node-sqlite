import fs from "fs";

export async function getFileListFromDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  return files;
}

function getRandomGroup() {
  const groups = ["group_one", "group_two"];
  const randomIndex = Math.round(Math.random());
  return groups[randomIndex];
}

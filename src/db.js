import sqlite3, { Database } from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import { open } from "sqlite";

sqlite3.verbose();

let db;

export async function initDB() {
  db = await open({
    filename: "/tmp/database.db",
    driver: sqlite3.Database,
  });
  console.log("Database init!");
}

export async function dropTable() {
  await db.run("DROP TABLE content;");
}

export async function createTable() {
  await db.run(`
    CREATE TABLE content(
      id INTEGER UNIQUE NOT NULL,
      group_name TEXT NOT NULL,
      image TEXT NOT NULL
    );
  `);
}

export async function insertContent(group_name, image) {
  const id = uuidv4();
  await db.run(
    `INSERT INTO content (id, group_name, image) VALUES (?, ?, ?);`,
    [id, group_name, image]
  );
}

export async function getAllContnets() {
  const contents = await db.all("SELECT * FROM content;");
  // console.log("contnets:", contents);
  return contents;
}

export async function getGroupContnet(groupName) {
  const contents = await db.all(
    `SELECT * FROM content WHERE group_name == '${groupName}';`
  );

  return contents;
}
export async function getGroupContent(groupName, limit, offsetNumber) {
  let contents; // 요청에 따른 conent
  let countResult; // DB결과 임시 저장을 위해 사용.
  let totalCount; // 전체 conent 갯수
  let totalPages; // 총 페이지
  let currentPage; // 지금 페이지

  if (groupName === "all") {
    contents = await db.all(`SELECT * FROM content LIMIT ? OFFSET ?;`, [
      limit,
      offsetNumber,
    ]);
    countResult = await db.get("SELECT COUNT(*) AS count FROM content;");
  } else {
    contents = await db.all(
      `SELECT * FROM content WHERE group_name = ? LIMIT ? OFFSET ?;`,
      [groupName, limit, offsetNumber]
    );
    countResult = await db.get(
      "SELECT COUNT(*) AS count FROM content WHERE group_name = ?;",
      [groupName]
    );
  }

  totalCount = countResult.count;
  totalPages = Math.ceil(totalCount / limit) - 1; // 올림 처리로 총 페이지 휙득

  return { contents, totalCount, totalPages };
}
export default db;

import sqlite3, { Database } from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

let db;

export async function initDB() {
  db = await open({
    filename: "/tmp/database.db",
    driver: sqlite3.Database,
  });
  console.log("🚀 init database!");
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
  const id = new Date().getTime();
  await db.run(
    `INSERT INTO content (id, group_name, image) VALUES (?, ?, ?);`,
    [id, group_name, image]
  );
}

export async function getAllContnets() {
  const contents = await db.all("SELECT * FROM content;");

  console.log("contnets:", contents);
}
export default db;

import sqlite3, { Database } from "sqlite3";
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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT NOT NULL,
      image TEXT NOT NULL
    );
  `);
}

export async function insertContent(group_name, image) {
  await db.run(`INSERT INTO content (group_name, image) VALUES (?, ?);`, [
    group_name,
    image,
  ]);
}

export async function getAllContnets() {
  const contents = await db.all("SELECT * FROM content;");
  // console.log("contnets:", contents);
  return contents;
}

export async function getRandomContent(group_name) {
  const contents = await db.all(
    `SELECT * FROM content WHERE group_name = ? ORDER BY RANDOM() LIMIT 1;`,
    [group_name]
  );
  5000;
  return contents[0];
}

export async function getGroupContent(groupName, offsetNumber) {
  const contents = await db.all(
    `SELECT * FROM content WHERE group_name = ? limit 30 offset ?;`,
    [groupName, offsetNumber]
  );

  return contents;
}

export default db;

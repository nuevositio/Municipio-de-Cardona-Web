import path from 'node:path'
import fs from 'node:fs'
import sqlite3 from 'sqlite3'

const dbDirectory = path.resolve(process.cwd(), 'server', 'data')
const dbPath = path.resolve(dbDirectory, 'news.sqlite')

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true })
}

sqlite3.verbose()

export const db = new sqlite3.Database(dbPath)

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error)
        return
      }

      resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

export function queryAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error)
        return
      }
      resolve(rows)
    })
  })
}

export function queryOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error)
        return
      }
      resolve(row)
    })
  })
}

export async function initializeDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT NOT NULL,
      date TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS council_minutes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      file TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function insertNews(news) {
  const { title, slug, excerpt, content, image, date } = news

  const result = await run(
    `INSERT INTO news (title, slug, excerpt, content, image, date) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, slug, excerpt, content, image, date],
  )

  return result.lastID
}

export async function updateNewsById(id, news) {
  const { title, slug, excerpt, content, image, date } = news

  await run(
    `
      UPDATE news
      SET title = ?, slug = ?, excerpt = ?, content = ?, image = ?, date = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [title, slug, excerpt, content, image, date, id],
  )
}

export async function deleteNewsById(id) {
  await run(`DELETE FROM news WHERE id = ?`, [id])
}

// ── Council Minutes ────────────────────────────────────────────────
export async function insertCouncilMinute(minute) {
  const { title, date, description, file } = minute
  const result = await run(
    `INSERT INTO council_minutes (title, date, description, file) VALUES (?, ?, ?, ?)`,
    [title, date, description, file],
  )
  return result.lastID
}

export async function updateCouncilMinuteById(id, minute) {
  const { title, date, description, file } = minute
  await run(
    `UPDATE council_minutes
     SET title = ?, date = ?, description = ?, file = ?, updatedAt = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [title, date, description, file, id],
  )
}

export async function deleteCouncilMinuteById(id) {
  await run(`DELETE FROM council_minutes WHERE id = ?`, [id])
}

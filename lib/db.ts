import { createClient } from "@libsql/client"

let dbUrl = process.env.TURSO_DATABASE_URL
let dbAuthToken = process.env.TURSO_AUTH_TOKEN

// Fallback to local SQLite if not provided, for local dev
if (!dbUrl) {
    dbUrl = "file:local.db"
}

export const db = createClient({
    url: dbUrl,
    authToken: dbAuthToken,
})

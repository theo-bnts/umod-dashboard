import mysql from 'mysql2/promise'

class Database {
    static async runQuery(...args) {
        const connection = await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        })

        const [rows, fields] = await connection.execute(...args)

        return rows
    }
}

export default Database
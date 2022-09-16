import mysql from 'mysql2/promise'

class Database {
    static pool

    static async runQuery(...args) {
        if (Database.pool === undefined)
            Database.pool = await mysql.createPool({
                connectionLimit : 10,
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
            })

        const [rows, fields] = await Database.pool.execute(...args)

        return rows
    }
}

export default Database
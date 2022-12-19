import mysql from 'mysql2/promise'

class Database {

    static Website = class {
        static pool

        static async runQuery(...args) {
            if (Database.Website.pool === undefined)
                Database.Website.pool = await mysql.createPool({
                    connectionLimit : 100,
                    host: process.env.DATABASE_HOST,
                    port: process.env.DATABASE_PORT,
                    user: process.env.DATABASE_USER,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_NAME,
                })
    
            const [rows] = await Database.Website.pool.execute(...args)
    
            return rows
        }
    }


    static Bot = class {
        static pool

        static async runQuery(...args) {
            if (Database.Bot.pool === undefined)
                Database.Bot.pool = await mysql.createPool({
                    connectionLimit : 100,
                    host: process.env.DATABASE_BOT_HOST,
                    port: process.env.DATABASE_BOT_PORT,
                    user: process.env.DATABASE_BOT_USER,
                    password: process.env.DATABASE_BOT_PASSWORD,
                    database: process.env.DATABASE_BOT_NAME,
                })

            // TODO: Debug TOO_MANY_CONNECTIONS issues
            //console.debug(Database.Bot.pool)

            const [rows] = await Database.Bot.pool.execute(...args)
    
            return rows
        }
    }

}

export default Database
import Database from '/tools/serverside/Database'

class Bot {
    static async isInGuild(id) {
        const [row] = await Database.Bot.runQuery({
            sql: `
                SELECT COUNT(*) AS count
                FROM guilds
                WHERE id = ?
            `,
            values: [id]
        })

        return row.count > 0
    }
}

export default Bot
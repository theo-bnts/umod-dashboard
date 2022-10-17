import Database from '/tools/serverside/Database'
import DiscordAPI from '/tools/serverside/Discord/API'
import Tools from '/tools/serverside/Tools'

class Guild {
    static async getChannels(guild_id) {
        const channels = await DiscordAPI.get('guilds/' + guild_id + '/channels')

        return channels
            .filter(channel => channel.type === 0)
            .sort((a, b) => a.position - b.position)
            .map(channel => {
                return {
                    id: channel.id,
                    name: channel.name
                }
            })
    }

    static async getRoles(guild_id) {
        const roles = await DiscordAPI.get('guilds/' + guild_id + '/roles')

        return roles
            .sort((a, b) => b.position - a.position)
            .map(role => {
                return {
                    id: role.id,
                    name: role.name
                }
            })
    }

    static async getSettings(guild_id, id, encryption_key) {
        const [row] = await Database.Bot.runQuery({
            sql: `
                SELECT *
                FROM guilds
                WHERE id = ?
            `,
            values: [guild_id]
        })

        return {
            logs_channel: Tools.selectNameObject(
                await Guild.getChannels(guild_id),
                row.logs_channel
            ),
            moderator_role: await Tools.selectNameObject(
                await Guild.getRoles(guild_id),
                row.moderator_role
            ),
            timeout : {
                enabled: row.timeout,
                params : {
                    seconds: {
                        current: row.timeout_seconds,
                        default: 30,
                        min: 1,
                        max: 300
                    }
                }
            },
            raid_protection: {
                enabled: row.raid_protection
            },
            duplicated_moderation: {
                enabled: row.duplicated_moderation
            },
            spam_moderation: {
                enabled: row.spam_moderation
            },
            uppercase_moderation: {
                enabled: row.uppercase_moderation,
                params: {
                    minimum_length: {
                        current: row.uppercase_minimum_length,
                        default: 10,
                        min: 1,
                        max: 20
                    },
                    minimum_percent: {
                        current: row.uppercase_minimum_percent,
                        default: 70,
                        min: 50,
                        max: 100
                    }
                }
            },
            bold_moderation: {
                enabled: row.bold_moderation,
                params: {
                    minimum_length: {
                        current: row.bold_minimum_length,
                        default: 10,
                        min: 1,
                        max: 20
                    },
                    minimum_percent: {
                        current: row.bold_minimum_percent,
                        default: 70,
                        min: 50,
                        max: 100
                    }
                }
            },
            underline_moderation: {
                enabled: row.underline_moderation,
                params: {
                    minimum_length: {
                        current: row.underline_minimum_length,
                        default: 10,
                        min: 1,
                        max: 20
                    },
                    minimum_percent: {
                        current: row.underline_minimum_percent,
                        default: 70,
                        min: 0,
                        max: 100
                    }
                }
            },
            strikethrough_moderation: {
                enabled: row.strikethrough_moderation,
                params: {
                    minimum_length: {
                        current: row.strikethrough_minimum_length,
                        default: 10,
                        min: 1,
                        max: 20
                    },
                    minimum_percent: {
                        current: row.strikethrough_minimum_percent,
                        default: 70,
                        min: 0,
                        max: 100
                    }
                }
            },
            spoilers_moderation: {
                enabled: row.spoilers_moderation,
                params: {
                    minimum_length: {
                        current: row.spoilers_minimum_length,
                        default: 10,
                        min: 1,
                        max: 20
                    },
                    minimum_percent: {
                        current: row.spoilers_minimum_percent,
                        default: 70,
                        min: 0,
                        max: 100
                    }
                }
            },
            code_moderation: {
                enabled: row.code_moderation,
                params: {
                    minimum_length: {
                        current: row.code_minimum_length,
                        default: 10,
                        min: 1,
                        max: 20
                    },
                    minimum_percent: {
                        current: row.code_minimum_percent,
                        default: 70,
                        min: 0,
                        max: 100
                    }
                }
            },
            blank_lines_moderation: {
                enabled: row.blank_lines_moderation,
                params: {
                    minimum_length: {
                        current: row.blank_lines_minimum_length,
                        default: 5,
                        min: 1,
                        max: 20
                    },
                    minimum_percent: {
                        current: row.blank_lines_minimum_percent,
                        default: 10,
                        min: 0,
                        max: 100
                    }
                }
            },
            zalgo_moderation: {
                enabled: row.zalgo_moderation,
                params: {
                    minimum_length: {
                        current: row.zalgo_minimum_length,
                        default: 1,
                        min: 1,
                        max: 20
                    },
                    minimum_percent: {
                        current: row.zalgo_minimum_percent,
                        default: 0,
                        min: 0,
                        max: 100
                    }
                }
            },
            emoji_moderation: {
                enabled: row.emoji_moderation,
                params: {
                    minimum_count: {
                        current: row.emoji_moderation_count,
                        default: 5,
                        min: 1,
                        max: 20
                    }
                }
            },
            mentions_moderation: {
                enabled: row.mentions_moderation,
                params: {
                    minimum_count: {
                        current: row.mentions_moderation_count,
                        default: 5,
                        min: 1,
                        max: 20
                    }
                }
            },
            text_moderation: {
                enabled: row.text_moderation,
                params: {
                    minimum_percent: {
                        current: row.text_moderation_percent,
                        default: 75,
                        min: 50,
                        max: 100
                    }
                }
            },
            links_moderation: {
                enabled: row.links_moderation,
                params: {
                    authorized_domains: {
                        current: row.authorized_domains !== null ? row.authorized_domains.split(',') : [],
                        default: []
                    },
                    blocked_domains: {
                        current: row.blocked_domains !== null ? row.blocked_domains.split(',') : [],
                        default: ['discord.com']
                    }
                }
            },
            image_moderation: {
                enabled: row.image_moderation,
                params: {
                    key: row.clarifai_api_key,
                    attributes: {
                        current: row.image_moderation_attributes !== null ? row.image_moderation_attributes.split(',') : [],
                        default: ['suggestive', 'explicit', 'gore'],
                        available: ['suggestive', 'explicit', 'gore']
                    },
                    minimum_percent: {
                        current: row.image_moderation_percent,
                        default: 75,
                        min: 50,
                        max: 100
                    }
                }
            },
            virus_moderation: {
                enabled: row.virus_moderation,
                params: {
                    key: row.metadefender_api_key
                }
            }
        }
    }
}

export default Guild
import Database from '/tools/serverside/Database'
import Guild from '/tools/serverside/Discord/Guild'

class SettingsTypes {
    static boolean(value) {
        return {
            type: 'boolean',
            value: value == true
        }
    }

    static integer(display, value, min, max) {
        return {
            type: 'integer',
            value,
            min,
            max,
            display
        }
    }

    static string(display, value, regex) {
        return {
            type: 'string',
            value,
            regex,
            display
        }
    }

    static array(display, value, available, multiselect, regex) {
        function formatArray(array) {
            if (array === null)
                array = []

            if (typeof array === 'string')
                array = array.split(',')
            
            if (typeof array.at(0) !== 'object')
                array = array.map(subValue => ({ id: subValue, display: subValue }))

            return array
        }

        return {
            type: 'array',
            value: formatArray(value),
            available: available !== null ? formatArray(available) : undefined,
            multiselect,
            regex,
            display
        }
    }
}

class Settings {
    static async get(guild_id) {
        const [rawSettings] = await Database.Bot.runQuery({
            sql: `
                SELECT *
                FROM guilds
                WHERE id = ?
            `,
            values: [guild_id]
        })

        return {
            logs: await Settings.logs(rawSettings, guild_id),
            moderation: await Settings.moderation(rawSettings, guild_id),
            timeout: Settings.timeout(rawSettings),
            raid: Settings.raid(rawSettings),
            duplicated: Settings.duplicated(rawSettings),
            spam: Settings.spam(rawSettings),
            uppercase: Settings.uppercase(rawSettings),
            bold: Settings.bold(rawSettings),
            underline: Settings.underline(rawSettings),
            strikethrough: Settings.strikethrough(rawSettings),
            spoiler: Settings.spoiler(rawSettings),
            code: Settings.code(rawSettings),
            blank_line: Settings.blankLine(rawSettings),
            zalgo: Settings.zalgo(rawSettings),
            emoji: Settings.emoji(rawSettings),
            mention: Settings.mention(rawSettings),
            text: Settings.text(rawSettings),
            link: Settings.link(rawSettings),
            image: Settings.image(rawSettings),
            virus: Settings.virus(rawSettings)
        }
    }

    static validate(type, object) {
        try {
            const requiredStructure = Guild[type]()
            const requiredAttributes = Object.entries(requiredStructure.options)

            const returnedAttributes = Object.entries(object)

            if (returnedAttributes.length !== requiredAttributes.length) {
                return false
            }

            for (const [requiredKey, requiredValue] of requiredAttributes) {
                if (!returnedAttributes.some(([returnedKey, returnedValue]) => returnedKey === requiredKey)) {
                    return false
                }

                const [returnedKey, returnedValue] = returnedAttributes.find(([returnedKey, returnedValue]) => returnedKey === requiredKey)

                if (typeof returnedValue !== requiredValue.type) {
                    return false
                }

                if (requiredValue.type === 'integer') {
                    if (returnedValue < requiredValue.min || returnedValue > requiredValue.max) {
                        return false
                    }
                }

                if (requiredValue.type === 'string') {
                    if (returnedValue.test(requiredValue.regex) === false) {
                        return false
                    }
                }

                if (requiredValue.type === 'array') {
                    if (returnedValue.some((value, index) => returnedValue.indexOf(value) !== index)) {
                        return false
                    }

                    if (returnedValue.some(value => typeof value !== 'string')) {
                        return false
                    }

                    if (returnedValue.some(value => value.test(requiredValue.regex) === false)) {
                        return false
                    }
                }

                return true
            }
        } catch (error) {
            return false
        }
    }

    static async logs({ logs_channel: logs_channel_id }, guild_id) {
        const channels = await Guild.getChannels(guild_id)

        const logsChannel = channels.find(({id}) => id === logs_channel_id) || { id: logs_channel_id, display: 'Unknown (' + id + ')' }

        return {
            display: 'Logs',
            channel: SettingsTypes.array(
                'Channel',
                [logsChannel],
                channels,
                false,
                '^[0-9]{18}$'
            )
        }
    }

    static async moderation({ moderator_role: moderation_role_id }, guild_id) {
        const roles = await Guild.getRoles(guild_id)

        const moderatorRole = roles.find(({id}) => id === moderation_role_id) || { id: moderation_role_id, display: 'Unknown (' + id + ')' }

        return {
            display: 'Moderation team',
            role: SettingsTypes.array(
                'Moderator role',
                [moderatorRole],
                roles,
                false,
                '^[0-9]{18}$'
            )
        }
    }

    static timeout({ timeout: enabled, timeout_seconds }) {
        return {
            display: 'Timeout on infractions',
            enabled: SettingsTypes.boolean(enabled),
            seconds: SettingsTypes.integer('Duration (seconds)', timeout_seconds, 10, 300)
        }
    }
    
    static raid({ raid_protection: enabled }) {
        return {
            display: 'Raid protection',
            enabled: SettingsTypes.boolean(enabled),
        }
    }

    static duplicated({ duplicated_moderation: enabled }) {
        return {
            display: 'Duplicated messages',
            enabled: SettingsTypes.boolean(enabled),
        }
    }

    static spam({ spam_moderation: spam_enabled }) {
        return {
            display: 'Spam',
            enabled: SettingsTypes.boolean(spam_enabled),
        }
    }

    static uppercase({ uppercase_moderation: uppercase_enabled, uppercase_minimum_length, uppercase_minimum_percent }) {
        return {
            display: 'Uppercase',
            enabled: SettingsTypes.boolean(uppercase_enabled),
            minimum_length: SettingsTypes.integer('Minimum length', uppercase_minimum_length, 1, 20),
            minimum_percent: SettingsTypes.integer('Minimum percentage', uppercase_minimum_percent, 0, 100)
        }
    }

    static bold({ bold_moderation: bold_enabled, bold_minimum_length, bold_minimum_percent }) {
        return {
            display: 'Bold',
            enabled: SettingsTypes.boolean(bold_enabled),
            minimum_length: SettingsTypes.integer('Minimum length', bold_minimum_length, 1, 20),
            minimum_percent: SettingsTypes.integer('Minimum percentage', bold_minimum_percent, 0, 100)
        }
    }

    static underline({ underline_moderation: underline_enabled, underline_minimum_length, underline_minimum_percent }) {
        return {
            display: 'Underline',
            enabled: SettingsTypes.boolean(underline_enabled),
            minimum_length: SettingsTypes.integer('Minimum length', underline_minimum_length, 1, 20),
            minimum_percent: SettingsTypes.integer('Minimum percentage', underline_minimum_percent, 0, 100)
        }
    }

    static strikethrough({ strikethrough_moderation: strikethrough_enabled, strikethrough_minimum_length, strikethrough_minimum_percent }) {
        return {
            display: 'Strikethrough',
            enabled: SettingsTypes.boolean(strikethrough_enabled),
            minimum_length: SettingsTypes.integer('Minimum length', strikethrough_minimum_length, 1, 20),
            minimum_percent: SettingsTypes.integer('Minimum percentage', strikethrough_minimum_percent, 0, 100)
        }
    }

    static spoiler({ spoilers_moderation: spoiler_enabled, spoilers_minimum_length: spoiler_minimum_length, spoilers_minimum_percent: spoiler_minimum_percent }) {
        return {
            display: 'Spoilers',
            enabled: SettingsTypes.boolean(spoiler_enabled),
            minimum_length: SettingsTypes.integer('Minimum length', spoiler_minimum_length, 1, 20),
            minimum_percent: SettingsTypes.integer('Minimum percentage', spoiler_minimum_percent, 0, 100)
        }
    }

    static code({ code_moderation: code_enabled, code_minimum_length, code_minimum_percent }) {
        return {
            display: 'Code',
            enabled: SettingsTypes.boolean(code_enabled),
            minimum_length: SettingsTypes.integer('Minimum length', code_minimum_length, 1, 20),
            minimum_percent: SettingsTypes.integer('Minimum percentage', code_minimum_percent, 0, 100)
        }
    }

    static blankLine({ blank_lines_moderation: blank_line_enabled, blank_lines_minimum_length: blank_line_minimum_length, blank_lines_minimum_percent: blank_line_minimum_percent }) {
        return {
            display: 'Blank lines',
            enabled: SettingsTypes.boolean(blank_line_enabled),
            minimum_length: SettingsTypes.integer('Minimum length', blank_line_minimum_length, 1, 20),
            minimum_percent: SettingsTypes.integer('Minimum percentage', blank_line_minimum_percent, 0, 100)
        }
    }

    static zalgo({ zalgo_moderation: zalgo_enabled, zalgo_minimum_length, zalgo_minimum_percent }) {
        return {
            display: 'Zalgo',
            enabled: SettingsTypes.boolean(zalgo_enabled),
            minimum_length: SettingsTypes.integer('Minimum length', zalgo_minimum_length, 1, 20),
            minimum_percent: SettingsTypes.integer('Minimum percentage', zalgo_minimum_percent, 0, 100)
        }
    }

    static emoji({ emoji_moderation: emoji_enabled, emoji_moderation_count: emoji_minimum_count }) {
        return {
            display: 'Emojis',
            enabled: SettingsTypes.boolean(emoji_enabled),
            minimum_count: SettingsTypes.integer('Minimum count', emoji_minimum_count, 1, 20)
        }
    }

    static mention({ mentions_moderation: mention_enabled, mentions_moderation_count: mention_minimum_count }) {
        return {
            display: 'Mentions',
            enabled: SettingsTypes.boolean(mention_enabled),
            minimum_count: SettingsTypes.integer('Minimum count', mention_minimum_count, 1, 20)
        }
    }

    static text({ text_moderation: text_enabled, text_moderation_percent: text_minimum_percent }) {
        return {
            display: 'Texts',
            enabled: SettingsTypes.boolean(text_enabled),
            minimum_percent: SettingsTypes.integer('Minimum confidence percentage', text_minimum_percent, 50, 100)
        }
    }

    static link({ links_moderation: link_enabled, authorized_domains: link_authorized_domains, blocked_domains: link_blocked_domains }) {
        return {
            display: 'Links',
            enabled: SettingsTypes.boolean(link_enabled),
            authorized_domains: SettingsTypes.array(
                'Authorized domains',
                link_authorized_domains,
                null,
                true,
                '(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]'
            ),
            blocked_domains: SettingsTypes.array(
                'Blocked domains',
                link_blocked_domains,
                null,
                true,
                '(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]'
            )
        }
    }

    static image({ image_moderation: image_enabled, clarifai_api_key: image_api_key, image_moderation_attributes: image_attributes, image_moderation_percent: image_minimum_percent }) {
        return {
            display: 'Images',
            enabled: SettingsTypes.boolean(image_enabled),
            api_key: SettingsTypes.string('API key (Tutorial: https://cutt.ly/HMsE48e)', image_api_key, '^[a-f0-9]{32}$'),
            attributes: SettingsTypes.array(
                'Attributes',
                image_attributes,
                ['explicit', 'gore', 'suggestive'],
                true,
                '^(?:explicit|gore|suggestive)$'
            ),
            minimum_percent: SettingsTypes.integer('Minimum confidence percentage', image_minimum_percent, 50, 100)
        }
    }

    static virus({ virus_moderation: virus_enabled, metadefender_api_key: virus_api_key }) {
        return {
            display: 'Virus',
            enabled: SettingsTypes.boolean(virus_enabled),
            api_key: SettingsTypes.string(
                'API key (Tutorial: https://cutt.ly/kMsE1OC)',
                virus_api_key,
                '^[a-f0-9]{32}$')
        }
    }
}

export { Settings }
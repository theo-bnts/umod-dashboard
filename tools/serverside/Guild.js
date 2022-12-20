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
        function formatArray(array, mode) {
            if (array === null)
                array = []

            if (typeof array === 'string')
                array = array.split(',')

            if (!Array.isArray(array))
                array = [array]
            
            if (typeof array.at(0) !== 'object' && mode === 'available')
                array = array.map(subValue => ({ id: subValue, display: subValue }))

            return array
        }

        return {
            type: 'array',
            value: formatArray(value, 'selected'),
            available: formatArray(available, 'available'),
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
            blank_line: Settings.blank_line(rawSettings),
            zalgo: Settings.zalgo(rawSettings),
            emoji: Settings.emoji(rawSettings),
            mention: Settings.mention(rawSettings),
            text: Settings.text(rawSettings),
            link: Settings.link(rawSettings),
            image: Settings.image(rawSettings),
            virus: Settings.virus(rawSettings)
        }
    }

    static async validate(type, object) {
        try {
            const defaultSettings = {}

            const requiredStructure = await Settings[type](defaultSettings)
            const requiredAttributes = Object.entries(requiredStructure)

            const returnedAttributes = Object.entries(object)

            if (returnedAttributes.length !== requiredAttributes.length) {
                return false
            }

            for (const [requiredKey, requiredValueMeta] of requiredAttributes) {
                const { value: requiredValue } = requiredValueMeta

                if (!returnedAttributes.some(([returnedKey, returnedValue]) => returnedKey === requiredKey)) {
                    return false
                }

                const [returnedKey, returnedValueMeta] = returnedAttributes.find(([returnedKey, returnedValue]) => returnedKey === requiredKey)
                const { value: returnedValue } = returnedValueMeta

                const isVariable = ['boolean', 'integer', 'string', 'array']
                    .includes(requiredValueMeta.type)

                if (isVariable) {
                    if (requiredValueMeta.type === 'boolean') {
                        if (typeof returnedValue !== 'boolean') {
                            return false
                        }
                    }

                    if (requiredValueMeta.type === 'integer') {
                        if (typeof returnedValue !== 'number') {
                            return false
                        }
                            
                        if (returnedValue < requiredValueMeta.min || returnedValue > requiredValueMeta.max) {
                            return false
                        }
                    }

                    if (requiredValueMeta.type === 'string') {
                        if (requiredValueMeta.type !== 'string') {
                            return false
                        }

                        if (new RegExp(requiredValueMeta.regex).test(returnedValue) === false) {
                            return false
                        }
                    }
                    
                    if (requiredValueMeta.type === 'array') {
                        if (!Array.isArray(returnedValue)) {
                            return false
                        }

                        if (returnedValue.some((value, index) => returnedValue.indexOf(value) !== index)) {
                            return false
                        }

                        if (returnedValue.some(value => typeof value !== 'string')) {
                            return false
                        }

                        if (returnedValue.some(value => new RegExp(requiredValueMeta.regex).test(value) === false)) {
                            return false
                        }
                    }
                } else {
                    if (returnedValue !== requiredValue) {
                        return false
                    }
                }
            }

            return true
        } catch (error) {
            console.error('Guild', 3901, error)

            return false
        }
    }

    static async update(guild_id, type, object) {
        if (!await Settings.validate(type, object))
            throw 400

        const attributes = Object.entries(object)

        for (const [attributeKey, attribute] of attributes) {
            const isVariable = ['boolean', 'integer', 'string', 'array']
                .includes(attribute.type)

            if (isVariable) {
                const value = attribute.type === 'array' ? attribute.value.join(',') : attribute.value

                const databaseColumn = Settings.getDatabaseColumnName(type + '_' + attributeKey)

                await Database.Bot.runQuery({
                    sql: `
                        UPDATE guilds
                        SET ${databaseColumn} = ?
                        WHERE id = ?
                    `,
                    values: [
                        value,
                        guild_id
                    ]
                })
            }
        }
    }

    static async logs({ logs_channel: logs_channel_id }, guild_id) {
        const channels = guild_id !== undefined ? await Guild.getChannels(guild_id) : []

        return {
            display: 'Logs',
            channel_id: SettingsTypes.array(
                'Channel',
                logs_channel_id,
                channels,
                false,
                '^[0-9]{18,19}$'
            )
        }
    }

    static async moderation({ moderator_role: moderation_role_id }, guild_id) {
        const roles = guild_id !== undefined ? await Guild.getRoles(guild_id) : []

        return {
            display: 'Moderation team',
            role_id: SettingsTypes.array(
                'Moderator role',
                moderation_role_id,
                roles,
                false,
                '^[0-9]{18,19}$'
            )
        }
    }

    static timeout({ timeout: timeout_enabled, timeout_seconds }) {
        return {
            display: 'Timeout on infractions',
            enabled: SettingsTypes.boolean(timeout_enabled),
            seconds: SettingsTypes.integer('Duration (seconds)', timeout_seconds, 10, 300)
        }
    }
    
    static raid({ raid_protection: raid_enabled }) {
        return {
            display: 'Raid protection',
            enabled: SettingsTypes.boolean(raid_enabled),
        }
    }

    static duplicated({ duplicated_moderation: duplicated_enabled }) {
        return {
            display: 'Duplicated messages',
            enabled: SettingsTypes.boolean(duplicated_enabled),
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

    static blank_line({ blank_lines_moderation: blank_line_enabled, blank_lines_minimum_length: blank_line_minimum_length, blank_lines_minimum_percent: blank_line_minimum_percent }) {
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


    static getDatabaseColumnName(codeName) {
        switch (codeName) {
            case 'logs_channel_id':
                return 'logs_channel'
            case 'moderation_role_id':
                return 'moderator_role'
            case 'timeout_enabled':
                return 'timeout'
            case 'timeout_seconds':
                return 'timeout_seconds'
            case 'raid_enabled':
                return 'raid_protection'
            case 'duplicated_enabled':
                return 'duplicated_moderation'
            case 'spam_enabled':
                return 'spam_moderation'
            case 'uppercase_enabled':
                return 'uppercase_moderation'
            case 'uppercase_minimum_length':
                return 'uppercase_minimum_length'
            case 'uppercase_minimum_percent':
                return 'uppercase_minimum_percent'
            case 'bold_enabled':
                return 'bold_moderation'
            case 'bold_minimum_length':
                return 'bold_minimum_length'
            case 'bold_minimum_percent':
                return 'bold_minimum_percent'
            case 'underline_enabled':
                return 'underline_moderation'
            case 'underline_minimum_length':
                return 'underline_minimum_length'
            case 'underline_minimum_percent':
                return 'underline_minimum_percent'
            case 'strikethrough_enabled':
                return 'strikethrough_moderation'
            case 'strikethrough_minimum_length':
                return 'strikethrough_minimum_length'
            case 'strikethrough_minimum_percent':
                return 'strikethrough_minimum_percent'
            case 'spoiler_enabled':
                return 'spoilers_moderation'
            case 'spoiler_minimum_length':
                return 'spoilers_minimum_length'
            case 'spoiler_minimum_percent':
                return 'spoilers_minimum_percent'
            case 'code_enabled':
                return 'code_moderation'
            case 'code_minimum_length':
                return 'code_minimum_length'
            case 'code_minimum_percent':
                return 'code_minimum_percent'
            case 'blank_line_enabled':
                return 'blank_lines_moderation'
            case 'blank_line_minimum_length':
                return 'blank_lines_minimum_length'
            case 'blank_line_minimum_percent':
                return 'blank_lines_minimum_percent'
            case 'zalgo_enabled':
                return 'zalgo_moderation'
            case 'zalgo_minimum_length':
                return 'zalgo_minimum_length'
            case 'zalgo_minimum_percent':
                return 'zalgo_minimum_percent'
            case 'emoji_enabled':
                return 'emoji_moderation'
            case 'emoji_minimum_count':
                return 'emoji_moderation_count'
            case 'mention_enabled':
                return 'mentions_moderation'
            case 'mention_minimum_count':
                return 'mentions_moderation_count'
            case 'text_enabled':
                return 'text_moderation'
            case 'text_minimum_percent':
                return 'text_moderation_percent'
            case 'link_enabled':
                return 'links_moderation'
            case 'link_authorized_domains':
                return 'authorized_domains'
            case 'link_blocked_domains':
                return 'blocked_domains'
            case 'image_enabled':
                return 'image_moderation'
            case 'image_api_key':
                return 'clarifai_api_key'
            case 'image_attributes':
                return 'image_moderation_attributes'
            case 'image_minimum_percent':
                return 'image_moderation_percent'
            case 'virus_enabled':
                return 'virus_moderation'
            case 'virus_api_key':
                return 'metadefender_api_key'
            default:
                return 'UNKNOWN_COLUMN'
        }
    }
}

export { Settings }
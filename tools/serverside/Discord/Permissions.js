class Permissions {
    static getTitle(bit_field, owner = false) {
        let title = {
            name: 'unknown',
            display_name: 'Unknown',
            can_manage_guild: false
        }

        if (owner)
            title = {
                name: 'owner',
                display_name: 'Owner',
                can_manage_guild: true
            }

        if (bit_field & 0x00000008)
            title = {
                name: 'admin',
                display_name: 'Administrator',
                can_manage_guild: true
            }

        if (bit_field & 0x00000020)
            title = {
                name: 'manager',
                display_name: 'Manager',
                can_manage_guild: true
            }

        return title
    }
}

export default Permissions
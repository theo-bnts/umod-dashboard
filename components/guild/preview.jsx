import Link from 'next/link'

import { Button, Subtitle1, Subtitle2 } from '@fluentui/react-components'
import { Card, CardPreview, CardHeader, CardFooter } from '@fluentui/react-components/unstable'
import { bundleIcon, BotAddFilled, BotAddRegular, SettingsRegular, SettingsFilled } from '@fluentui/react-icons'

import Styles from '/styles/components/guild/preview.module.css'
import Discord from '/tools/clientside/Discord'
import Page from '/tools/clientside/Page'

export default function GuildPreview({ id, icon, name, user_role, bot_in }) {
    const { width } = Page.useWindowDimensions()

    const BotAddIcon = bundleIcon(BotAddFilled, BotAddRegular)
    const SettingsIcon = bundleIcon(SettingsFilled, SettingsRegular)
    
    return (
        <Card orientation={width <= 768 ? 'vertical' : 'horizontal'}>
            <CardPreview>
                <img
                    src={icon + (width <= 768 ? '?size=512' : '?size=128')}
                    alt={name + '\'s icon'}
                    width='100%'
                    height='100%'
                />
            </CardPreview>
            <CardHeader
                header={<Subtitle1>{name}</Subtitle1>}
                description={<Subtitle2>{user_role}</Subtitle2>}
            />
            <CardFooter className={Styles.card_part + ' ' + Styles.card_footer}>
                {
                    bot_in
                        ?
                            <Link href={'/dashboard/guilds/' + id}>
                                <a>
                                    <Button
                                        appearance='primary'
                                        icon={<SettingsIcon />}
                                    >
                                        Manage
                                    </Button>
                                </a>
                            </Link>
                        :
                            <a href={Discord.getInviteURL(id)}>
                                <Button
                                    icon={<BotAddIcon />}
                                >
                                    Add bot
                                </Button>
                            </a>
                }
            </CardFooter>
        </Card>
    )
}
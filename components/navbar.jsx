import Link from 'next/link'

import { Button, Menu, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger,  } from '@fluentui/react-components'
import { bundleIcon, BotAddRegular, BotAddFilled, HomeRegular, HomeFilled, TextAlignLeftFilled, TextAlignLeftRegular, ToggleMultipleFilled, ToggleMultipleRegular } from '@fluentui/react-icons'

import ProfilePreview from '/components/profile_preview'
import Styles from '/styles/components/navbar.module.css'
import Discord from '/tools/clientside/Discord'
import Page from '/tools/clientside/Page'

export default function GuildPicker() {
    const { width } = Page.useWindowDimensions()

    const MenuIcon = bundleIcon(TextAlignLeftFilled, TextAlignLeftRegular)
    const HomeIcon = bundleIcon(HomeFilled, HomeRegular)
    const DashboardIcon = bundleIcon(ToggleMultipleFilled, ToggleMultipleRegular)
    const BotAddIcon = bundleIcon(BotAddFilled, BotAddRegular)

    return (
        <div className={Styles.navbar}>
            <div className={Styles.profile_preview}>
                <ProfilePreview />
            </div>
            <div className={Styles.titles}>
                {
                    width <= 768
                        ?
                            <Menu>
                                <MenuTrigger disableButtonEnhancement>
                                    <MenuButton icon={<MenuIcon />}>Menu</MenuButton>
                                </MenuTrigger>

                                <MenuPopover>
                                    <MenuList>
                                        <Link href='/'>
                                            <MenuItem icon={<HomeIcon />}>Home</MenuItem>
                                        </Link>
                                        <Link href='/dashboard/guilds'>
                                            <MenuItem icon={<DashboardIcon />}>Dashboard</MenuItem>
                                        </Link>
                                        <a href={Discord.getInviteURL()}>
                                            <MenuItem icon={<BotAddFilled />}>Add bot</MenuItem>
                                        </a>
                                    </MenuList>
                                </MenuPopover>
                            </Menu>
                        :
                            <>
                                <Link href='/'>
                                    <Button icon={<HomeIcon />}>Home</Button>
                                </Link>
                                <Link href='/dashboard/guilds'>
                                    <Button icon={<DashboardIcon />}>Dashboard</Button>
                                </Link>
                                <a href={Discord.getInviteURL()}>
                                    <Button icon={<BotAddIcon />}>Add bot</Button>
                                </a>
                            </>
                }
            </div>
        </div>
    )
}
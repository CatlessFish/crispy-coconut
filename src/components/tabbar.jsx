import { TabBar } from "antd-mobile";
import { 
    // CompassOutline, 
    // FlagOutline,
    MailOpenOutline,
    UserOutline,
    MessageOutline,
    HeartOutline,
    SmileOutline,
} from "antd-mobile-icons";
import "./tabbar.scss"

const AppTabBar = (props) => {
    const items = [
        {
            key: '/home',
            title: '广场',
            icon: <SmileOutline />,
        },
        {
            key:'/wall',
            title: '表白墙',
            icon: <HeartOutline />,
        },
        {
            key:'/msgBox',
            title: '提问箱',
            icon: <MailOpenOutline />,
        },
        {
            key:'/message',
            title: '消息',
            icon: <MessageOutline />,
        },
        {
            key:'/profile',
            title: '我的',
            icon: <UserOutline />,
        }
    ]

    const { pathname, onChange } = props;
    // pathname will be like: /home/aa/bb
    // it will be split into "" "home" "aa" "bb"
    // if we are at one of the five top pages, show the tabbar; hide it otherwise.
    const shouldTabbarHide = pathname.split("/").length > 2
    console.debug(shouldTabbarHide)
    return (
        <TabBar
            activeKey={pathname}
            onChange={onChange}
            className="app-tabbar"
            style={{
                display: shouldTabbarHide ? "none" : ""
            }}
        >
            {items.map(item => (
                <TabBar.Item
                key={item.key}
                title={item.title}
                icon={item.icon}
                />
            ))}
        </TabBar>
    )
}

export default AppTabBar;
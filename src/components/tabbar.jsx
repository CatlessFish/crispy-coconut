import { TabBar } from "antd-mobile";
import { 
    CompassOutline, 
    FlagOutline,
    MailOpenOutline,
    UserOutline,
    MessageOutline
} from "antd-mobile-icons";

const AppTabBar = (props) => {
    const items = [
        {
            key: '/home',
            title: '首页',
            icon: <CompassOutline />,
        },
        {
            key:'/wall',
            title: '表白墙',
            icon: <FlagOutline />,
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
    return (
        <TabBar
        activeKey={pathname}
        onChange={onChange}
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
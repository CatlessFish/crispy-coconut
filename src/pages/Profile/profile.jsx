import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./login";
import { Space, Button, List } from 'antd-mobile'
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/userContext";
import API from "../../api/api";


function Profile () {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [profile, setProfile] = useState()
    const [login_flag, setLoginFlag] = useState(user?.token !== undefined && user?.token !== null)

    useEffect(() => {
        if (user.isLoggedIn) {
            API.userGetProfile(user.token).then(res => {
                console.debug('Entries in the wall', res);
                setProfile(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        }
    }, [user])
    console.log(login_flag)
    return (
        <>
            <Routes>
                <Route path=""Component={() => 
                <>
                <Space style={{ '--gap': '165px' }}>
                    <h1>用户信息</h1>
                    { login_flag ? 
                        <Button style={{'marginTop': '15px' }} color='danger' onClick={() => setLoginFlag(false)}>
                        登出账号
                        </Button>
                    : 
                        <Button style={{'marginTop': '15px' }} onClick={() => navigate(`/profile/login`)}>
                        登入/注册
                        </Button>
                    }
                </Space>
                <List header='用户信息'>
                    <List.Item>用户名：{profile?.username}</List.Item>
                    <List.Item>邮箱：{profile?.email}</List.Item>
                    <List.Item>id：{profile?._id}</List.Item>
                </List>
                </>
                } />
                <Route/>
                <Route path="login" element={<Login />} />
            </Routes>
        </>
    )
}

export default Profile;
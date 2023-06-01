import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppTabBar from "./components/tabbar";
import Home from "./pages/Home/home";
import Wall from "./pages/Wall/wall";
import MsgBox from "./pages/MsgBox/msgbox";
import Profile from "./pages/Profile/profile";
import Login from "./pages/Profile/login";
import Message from "./pages/Message/message";
import _Loading from "./pages/Loading/loading";
import { UserContext } from "./utils/userContext";
import { Loading } from "antd-mobile";

function App() {
    const [userToken, setUserToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const location = useLocation();
    const { pathname } = location;
    const navigate = useNavigate();

    useEffect(() => {
        //相当于componentDidMount
        // TODO: 从localStorage中读取token
        const localToken = localStorage.getItem('userToken');
        if (localToken) {
            setUserToken(localToken);
            setIsLoggedIn(true);
        }
    }, []);
    console.debug('local token:', userToken)

    const handleTabBarChange = (value) => {
        // console.log(value);
        navigate(value);
    };

    const setLoggedIn = (value, token) => {
        // 包装setIsLoggedIn，用于设置token
        if (value === true) {
            if (!token) {
                console.error('token is null');
                return;
            }
            setIsLoggedIn(true);
            setUserToken(token);
            // TODO: 设置token过期时间
            localStorage.setItem('userToken', userToken);
        } else {
            setIsLoggedIn(false);
            setUserToken(null);
            localStorage.removeItem('userToken');
            navigate('/login');
        }
    };

    return (
        <UserContext.Provider value={{
            token: userToken,
            // setToken: setUserToken,
            isLoggedIn: isLoggedIn,
            setIsLoggedIn: setLoggedIn,
        }}>
            {
                isLoggedIn ?
                    <div className="App">
                        <div className="app-body">
                            <Routes>
                                <Route index path="/home/*" Component={Home} />
                                <Route path="/wall/*" Component={Wall} />
                                <Route path="/msgbox/*" Component={MsgBox} />
                                <Route path="/message/*" Component={Message} />
                                <Route path="/profile/*" Component={Profile} />
                                <Route path="/loading/*" Component={_Loading} />
                                <Route path="" Component={() => <Navigate to={'/home'} />} />
                            </Routes>
                        </div>
                        <AppTabBar
                            pathname={pathname}
                            onChange={handleTabBarChange}
                        />
                    </div>
                    :
                    <Login />
            }
        </UserContext.Provider>

    );
}

export default App;

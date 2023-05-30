import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppTabBar from "./components/tabbar";
import Home from "./pages/Home/home";
import Wall from "./pages/Wall/wall";
import MsgBox from "./pages/MsgBox/msgbox";
import Profile from "./pages/Profile/profile";
import Message from "./pages/Message/message";
import _Loading from "./pages/Loading/loading";
import { UserContext } from "./utils/userContext";
import { Loading } from "antd-mobile";

function App() {
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        //相当于componentDidMount
        // TODO: 从localStorage中读取token
        const localToken = localStorage.getItem('userToken');
        if (localToken) {
            setUserToken(localToken);
        }
    }, []);
    // console.log('token:', userToken)

    const location = useLocation();
    const { pathname } = location;
    const navigate = useNavigate();

    const handleTabBarChange = (value) => {
        // console.log(value);
        navigate(value);
    };

    return (
        <UserContext.Provider value={{
            token: userToken,
            setToken: setUserToken
        }}>
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
        </UserContext.Provider>
    );
}

export default App;

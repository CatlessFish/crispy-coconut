import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppTabBar from "./components/tabbar";
import Home from "./pages/Home/home";
import Wall from "./pages/Wall/wall";
import MsgBox from "./pages/MsgBox/msgbox";
import Profile from "./pages/Profile/profile";
import Message from "./pages/Message/message";

function App() {
    const location = useLocation();
    const { pathname } = location;
    const navigate = useNavigate();

    const handleTabBarChange = (value) => {
        // console.log(value);
        navigate(value);
    };

    return (
        <div className="App">
            <div className="App-Page">
                <Routes>
                    <Route index path="/home" Component={Home} />
                    <Route path="/wall" Component={Wall} />
                    <Route path="/msgbox" Component={MsgBox} />
                    <Route path="/message" Component={Message} />
                    <Route path="/profile" Component={Profile} />
                </Routes>
            </div>
            <div className="App-Tabbar" style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
                <AppTabBar
                    pathname={pathname}
                    onChange={handleTabBarChange}
                />
            </div>
        </div>
    );
}

export default App;

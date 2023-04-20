import { Routes, Route, NavLink } from "react-router-dom";
import Login from "./login";

function Profile () {
    return (
        <>
            <h1>Profile</h1>
            <NavLink to="/profile/login">Login</NavLink>
            <Routes>
                <Route path="login" element={<Login />} />
            </Routes>
        </>
    )
}

export default Profile;
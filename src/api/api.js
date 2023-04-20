import serverAxios from "./axios";

const userLogin = (data) => {
    // console.debug("userLogin", data);
    return serverAxios.post("/user/login", data);
}

const userRegister = (data) => {
    // console.debug("userRegister", data);
    return serverAxios.post("/user/register", data);
}

const userGetAll = () => {
    return serverAxios.get("/user/getAll");
}

const API = {
    userLogin,
    userRegister,
    userGetAll,
}

export default API
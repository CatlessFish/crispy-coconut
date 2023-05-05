import axios from "axios";

const config = {
    // baseURL: "http://crispycoconut.cc:3000/api/",
    baseURL: "http://localhost:3000/api/",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
}

const serverAxios = axios.create(config);

export default serverAxios;
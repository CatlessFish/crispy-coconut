import axios from "axios";

const config = {
    // baseURL: "https://coco.catlessfish.cc/api/",
    baseURL: "http://catlessfish.cc:5100/api/",
    // baseURL: "http://localhost:3000/api/",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
    validateStatus: function (status) {
        return status >= 200 && status < 500; // Make 4xx valid here and handle it later
    }
}

const serverAxios = axios.create(config);

// eslint-disable-next-line
const DebugRequestIntercepter = serverAxios.interceptors.request.use(
    function (config) {
        console.debug('Axios Request Sent', config);
        return config;
    },
    function (error) {
        console.debug('Axios Request Error', error);
        return Promise.reject(error);
    }
);

// eslint-disable-next-line
const DebugResponseIntercepter = serverAxios.interceptors.response.use(
    function (response) {
        console.debug('Axios Response Received', response);
        return response;
    },
    function (error) {
        console.debug('Axios Response Error', error);
        return Promise.reject(error);
    }
);

// This is a global interceptor for all responses.
// It will detect if the response is an error, and reject it if it is.
// Also it will check the status code of the response, and reject it if it (!=200 and >= 404).
serverAxios.interceptors.response.use(
    function (response) {
        if (response.status !== 200) {
            // This is cuased by a 4xx response from server.
            if (response.status >= 404) {
                // Unexpected response from server.
                // Throw it to the API caller.
                console.log('Axios Response Error', response)
                return Promise.reject(response);
            }

            // We may expect a 400-403 response from server.
            // This suggests a successful API call, so just return it to the API caller.
            return response;
        }
        return response;
    },
    function (error) {
        if (error.response) {
            // This is cuased by a 5xx response from server.
            console.log('Axios Response Error', error.response)
            return Promise.reject(error.response);
        }
        else if (error.request) {
            // This is cuased by a timeout or network error.
            console.log('Axios Request Error', error.request)
            return Promise.reject(error.request);
        }
        else {
            // Something happened in setting up the request that triggered an Error.
            console.log('Axios Error', error.message)
            return Promise.reject(error.message);
        }
    }
);

export default serverAxios;
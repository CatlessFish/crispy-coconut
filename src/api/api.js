import serverAxios from "./axios";
import assertParam from "../utils/assertParam";

/*
 * Error handling:
 * - 1. Error thrown by axios, like timeout, network error, etc.
 * - 2. Unexpected response from server, like 404, 500, etc.
 *      For this two kinds of error, we have caught them it in the global intercepter (see axios.js)
 *      So we can catch them here in the onRejected callback, and package them into a normal api response,
 *      then reject it. The API caller can handle it in the same way as the third kind of error.
 * - 3. Error returned by server, like { code: 1, error_msg: "xxx" }
 *      For this kind of error, reject the promise and send it to the API caller.
 * 
 * In this way, the API caller can handle all errors in the same way.
 * If the caller receives a rejected promise,
 * the content of the promise will always be { code: x, error_msg: "xxx", data: xxx }
 * 
 * We set a convention here:
 * For rejected promise, the 'code' field will always be a non-zero number.
 * Positive code means the error is unexpected, such as network error, server internal error, etc.
 *   - In this case, the 'data' field will be the error object thrown by axios.
 * Negative code means the error is defined by the server, such as invalid parameter, etc.
 *   - In this case, the 'data' field will be the error object returned by the server (possibly null)
 */

// This function is used as the onRejected callback of all APIs.
// It will package the error into a normal api response, and then reject it.
const onApiCallFailure = (err) => {
    return Promise.reject({
        code: 1,
        error_msg: 'API call unsuccessful, see console for details',
        // the details are printed by the global intercepter, see axios.js
        data: err
    });
}

// This function is used as the onFulfilled callback of all APIs.
// It will check if the code of the response is zero, and decide whether to reject or fulfill it.
const onApiCallSuccess = (res) => {
    // res.data should be in the format of { code: x, error_msg: "xxx", data: xxx }, so is the return value
    // TODO: check if res.data is in the correct format, in case the server returns something unexpected
    const response = res.data
    if (response.code !== 0) {
        console.log('API called successfully, but server returned a non-zero code. See console for details.')
        // the details should be printed by the caller
        return Promise.reject(response)
    }
    return response
}

const rejectOnParamError = (error) => Promise.reject({
    code: 1,
    error_msg: 'API call unsuccessful, see console for details',
    data: error
});

/*
* APIs of USER
*/

const userLogin = async (data) => {
    return serverAxios.post("/user/login", data)
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

const userRegister = async (data) => {
    return serverAxios.post("/user/register", data)
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

const userGetAll = async () => {
    return serverAxios.get("/user/getAll")
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

/* 
 * APIs of WALL 
*/

const wallGetAllEntries = async (userToken) => {
    try {
        assertParam('userToken', userToken, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.get("/wall/getAllEntries", {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

const wallCreateOneEntry = async (userToken, data) => {
    // data = { content: Object }
    // example: { content: { text: "Hello World" }}
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('content', data.content, 'object')
    }
    catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/wall/createOneEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

const wallDeleteOneEntry = async (userToken, data) => {
    // data = { wallEntryId: String }
    // example: { wallEntryId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('wallEntryId', data.wallEntryId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/wall/deleteOneEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

const wallGetAllPostsInEntry = async (userToken, data) => {
    // data = { wallEntryId: String }
    // example: { wallEntryId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('wallEntryId', data.wallEntryId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/wall/getAllPostsInEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

const wallAddPostToEntry = async (userToken, data) => {
    // data = { wallEntryId: String, content: Object }
    // example: { wallEntryId: "abcdef", content: { text: "Hello World" }}
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('wallEntryId', data.wallEntryId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/wall/addPostToEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

const wallDeletePostInEntry = async (userToken, data) => {
    // data = { wallEntryId: String, postId: String }
    // example: { wallEntryId: "abcdef", postId: "123456" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('wallEntryId', data.wallEntryId, 'string')
        assertParam('postId', data.postId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/wall/deletePostInEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

const wallUpdatePostInEntry = async (userToken, data) => {
    // data = { wallEntryId: String, postId: String, content: Object }
    // example: { wallEntryId: "abcdef", postId: "123456", content: { text: "Hello World" }}
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('wallEntryId', data.wallEntryId, 'string')
        assertParam('postId', data.postId, 'string')
        assertParam('content', data.content, 'object')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/wall/updatePostInEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

const API = {
    userLogin,
    userRegister,
    userGetAll,
    wallGetAllEntries,
    wallCreateOneEntry,
    wallDeleteOneEntry,
    wallGetAllPostsInEntry,
    wallAddPostToEntry,
    wallDeletePostInEntry,
    wallUpdatePostInEntry
}

export default API
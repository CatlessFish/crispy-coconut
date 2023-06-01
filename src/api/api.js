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

// This function is used to reject the promise when 'assertParam' throws an error.
const rejectOnParamError = (error) => Promise.reject({
    code: 1,
    error_msg: 'API call unsuccessful, see console for details',
    data: error
});

// TODO: Split this file into multiple files, one for each module

/*
* APIs of USER
*/

/**
 * 
 * @param {object} data { username: String, password: String}
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const userLogin = async (data) => {
    return serverAxios.post("/user/login", data)
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

/**
 * 
 * @param {object} data { username: String, password: String, email?: String | Null}
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const userRegister = async (data) => {
    return serverAxios.post("/user/register", data)
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

/**
 * 
 * @param {string} userToken 
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 * @deprecated
 */
const userGetAll = async () => {
    return serverAxios.get("/user/getAll")
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

/**
 * 
 * @param {string} userToken 
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const userGetProfile = async (userToken) => {
    try {
        assertParam('userToken', userToken, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }
    return serverAxios.get("/user/profile", {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

/* 
 * APIs of WALL 
*/

/**
 * 
 * @param {string} userToken 
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
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


/**
 * 
 * @param {string} userToken 
 * @param {object} data { content: Object }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
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


/**
 * 
 * @param {string} userToken 
 * @param {object} data { wallEntryId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
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


/**
 * 
 * @param {string} userToken 
 * @param {object} data { wallEntryId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
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


/**
 * 
 * @param {string} userToken 
 * @param {object} data { wallEntryId: String, content: Object }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
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


/**
 * 
 * @param {string} userToken 
 * @param {object} data { wallEntryId: String, postId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
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


/**
 * 
 * @param {string} userToken 
 * @param {object} data { wallEntryId: String, postId: String, content: Object }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
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


/*
 * APIs of MsgBox
 */

/**
 * 
 * @param {string} userToken 
 * @param {object} data { ownerId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxGetMsgBoxByOwnerId = async (userToken, data) => {
    // data = { ownerId: String }
    // example: { ownerId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('ownerId', data.ownerId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.get(`/msgBox/getMsgBoxByOwnerId?ownerId=${data.ownerId}`, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { msgBoxId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxGetMsgBoxById = async (userToken, data) => {
    // data = { msgBoxId: String }
    // example: { msgBoxId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('msgBoxId', data.msgBoxId, 'string')
    }
    catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.get(`/msgBox/getMsgBoxById?msgBoxId=${data.msgBoxId}`, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { content: Object }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxCreateOneMsgBox = async (userToken, data) => {
    // data = { content: Object }
    // example: { content: { description: "This is my message box" } }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('content', data.content, 'object')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/msgBox/createOneMsgBox", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { msgBoxId: String, content: Object }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxUpdateOneMsgBox = async (userToken, data) => {
    // data = { msgBoxId: String, content: Object }
    // example: { msgBoxId: "abcdef", content: { description: "This is my message box" } }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('msgBoxId', data.msgBoxId, 'string')
        assertParam('content', data.content, 'object')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/msgBox/updateOneMsgBox", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { msgBoxId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 * @deprecated
 */
const msgBoxDeleteMsgBoxById = async (userToken, data) => {
    // data = { msgBoxId: String }
    // example: { msgBoxId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('msgBoxId', data.msgBoxId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/msgBox/deleteMsgBoxById", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { msgBoxId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxGetAllEntriesInMsgBox = async (userToken, data) => {
    // data = { msgBoxId: String }
    // example: { msgBoxId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('msgBoxId', data.msgBoxId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.get(`/msgBox/getAllEntriesInMsgBox?msgBoxId=${data.msgBoxId}`, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { msgBoxId: String, content: Object }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxCreateOneEntryInMsgBox = async (userToken, data) => {
    // data = { msgBoxId: String, content: Object }
    // example: { msgBoxId: "abcdef", content: { text: "This is a message box entry post" } }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('msgBoxId', data.msgBoxId, 'string')
        assertParam('content', data.content, 'object')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/msgBox/createOneEntryInMsgBox", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { msgBoxId: String, entryId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxDeleteOneEntryInMsgBox = async (userToken, data) => {
    // data = { msgBoxId: String, entryId: String }
    // example: { msgBoxId: "abcdef", entryId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('msgBoxId', data.msgBoxId, 'string')
        assertParam('entryId', data.entryId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/msgBox/deleteOneEntryInMsgBox", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { entryId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxGetAllPostsInMsgBoxEntry = async (userToken, data) => {
    // data = { entryId: String }
    // example: { entryId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('entryId', data.entryId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.get(`/msgBox/getAllPostsInMsgBoxEntry?entryId=${data.entryId}`, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { entryId: String, content: Object }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxCreateOnePostInMsgBoxEntry = async (userToken, data) => {
    // data = { entryId: String, content: Object }
    // example: { entryId: "abcdef", content: { text: "This is a message box post" } }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('entryId', data.entryId, 'string')
        assertParam('content', data.content, 'object')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/msgBox/createOnePostInMsgBoxEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { entryId: String, postId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxDeleteOnePostInMsgBoxEntry = async (userToken, data) => {
    // data = { entryId: String, postId: String }
    // example: { entryId: "abcdef", postId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('entryId', data.entryId, 'string')
        assertParam('postId', data.postId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/msgBox/deleteOnePostInMsgBoxEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}


/**
 * 
 * @param {string} userToken 
 * @param {object} data { entryId: String, postId: String, content: Object }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const msgBoxUpdateOnePostInMsgBoxEntry = async (userToken, data) => {
    // data = { entryId: String, postId: String, content: Object }
    // example: { entryId: "abcdef", postId: "abcdef", content: { text: "This is a message box post" } }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('entryId', data.entryId, 'string')
        assertParam('postId', data.postId, 'string')
        assertParam('content', data.content, 'object')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/msgBox/updateOnePostInMsgBoxEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

/*
 * APIs of Post
 */

/**
 * 
 * @param {string} userToken
 * @param {object} data { postId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 * @description Get one post by post id
 */
const postGetOnePostById = async (userToken, data) => {
    // data = { postId: String }
    // example: { postId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('postId', data.postId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }
    return serverAxios.get(`/post/getOnePostById?postId=${data.postId}`, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

/**
 * 
 * @param {string} userToken 
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const squareGetAll = async (userToken) => {
    // data = { entryId: String }
    // example: { entryId: "abcdef" }
    try {
        assertParam('userToken', userToken, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.get(`/square/getAll`, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

/**
 * 
 * @param {string} userToken 
 * @param {object} data { owner: String, msgBoxId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const squareAddOne = async (userToken, data) => {
    // data = { owner: String, msgBoxId: String }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('owner', data.owner, 'string')
        assertParam('msgBoxId', data.msgBoxId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/square/addOne", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

/**
 * 
 * @param {string} userToken 
 * @param {object} data { squareEntryId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const squareDeleteOne = async (userToken, data) => {
    // data = { owner: String, msgBoxId: String }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('squareEntryId', data.squareEntryId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/square/deleteOne", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
        .catch(onApiCallFailure)
        .then(onApiCallSuccess);
}

/**
 * 
 * @param {string} userToken 
 * @param {object} data { msgBoxId: String }
 * @returns A promise of API call result, which is in the format of { code: x, error_msg: "xxx", data: xxx }
 */
const squareDeleteOneByBoxId = async (userToken, data) => {
    // data = { owner: String, msgBoxId: String }
    try {
        assertParam('userToken', userToken, 'string')
        assertParam('squareEntryId', data.msgBoxId, 'string')
    } catch (error) {
        return rejectOnParamError(error)
    }

    return serverAxios.post("/square/deleteOneByMsgBoxId", data, {
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
    userGetProfile,
    userGetAll,
    wallGetAllEntries,
    wallCreateOneEntry,
    wallDeleteOneEntry,
    wallGetAllPostsInEntry,
    wallAddPostToEntry,
    wallDeletePostInEntry,
    wallUpdatePostInEntry,
    msgBoxGetMsgBoxByOwnerId,
    msgBoxGetMsgBoxById,
    msgBoxCreateOneMsgBox,
    msgBoxUpdateOneMsgBox,
    msgBoxDeleteMsgBoxById,
    msgBoxGetAllEntriesInMsgBox,
    msgBoxCreateOneEntryInMsgBox,
    msgBoxDeleteOneEntryInMsgBox,
    msgBoxGetAllPostsInMsgBoxEntry,
    msgBoxCreateOnePostInMsgBoxEntry,
    msgBoxDeleteOnePostInMsgBoxEntry,
    msgBoxUpdateOnePostInMsgBoxEntry,
    postGetOnePostById,
    squareGetAll,
    squareAddOne,
    squareDeleteOne,
    squareDeleteOneByBoxId
}

export default API
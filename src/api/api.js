import serverAxios from "./axios";
import assertParam from "../utils/assertParam";

/*
* APIs of USER
*/

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

/* 
 * APIs of WALL 
*/

const wallGetAllEntries = (userToken) => {
    assertParam('userToken', userToken, 'string')

    return serverAxios.get("/wall/getAllEntries", {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    });
}

const wallCreateOneEntry = (userToken, data) => {
    // data = { content: Object }
    // example: { content: { text: "Hello World" }}
    assertParam('userToken', userToken, 'string')
    assertParam('content', data.content, 'object')

    return serverAxios.post("/wall/createOneEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    });
}

const wallDeleteOneEntry = (userToken, data) => {
    // data = { wallEntryId: String }
    // example: { wallEntryId: "abcdef" }
    assertParam('userToken', userToken, 'string')
    assertParam('wallEntryId', data.wallEntryId, 'string')

    return serverAxios.post("/wall/deleteOneEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    });
}

const wallGetAllPostsInEntry = (userToken, data) => {
    // data = { wallEntryId: String }
    // example: { wallEntryId: "abcdef" }
    assertParam('userToken', userToken, 'string')
    assertParam('wallEntryId', data.wallEntryId, 'string')

    return serverAxios.post("/wall/getAllPostsInEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    });
}

const wallAddPostToEntry = (userToken, data) => {
    // data = { wallEntryId: String, content: Object }
    // example: { wallEntryId: "abcdef", content: { text: "Hello World" }}
    assertParam('userToken', userToken, 'string')
    assertParam('wallEntryId', data.wallEntryId, 'string')

    return serverAxios.post("/wall/addPostToEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    });
}

const wallDeletePostInEntry = (userToken, data) => {
    // data = { wallEntryId: String, postId: String }
    // example: { wallEntryId: "abcdef", postId: "123456" }
    assertParam('userToken', userToken, 'string')
    assertParam('wallEntryId', data.wallEntryId, 'string')
    assertParam('postId', data.postId, 'string')

    return serverAxios.post("/wall/deletePostInEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    });
}

const wallUpdatePostInEntry = (userToken, data) => {
    // data = { wallEntryId: String, postId: String, content: Object }
    // example: { wallEntryId: "abcdef", postId: "123456", content: { text: "Hello World" }}
    assertParam('userToken', userToken, 'string')
    assertParam('wallEntryId', data.wallEntryId, 'string')
    assertParam('postId', data.postId, 'string')
    assertParam('content', data.content, 'object')

    return serverAxios.post("/wall/updatePostInEntry", data, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    });
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
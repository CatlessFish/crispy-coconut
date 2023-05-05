// import { Route, Routes } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import API from "../../api/api";
import { UserContext } from "../../utils/userContext";

function Wall () {
    const user = useContext(UserContext);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        API.wallGetAllEntries(user.token).then(res => {
            console.log(res);
            setEntries(res.data);
        })
    }, [user.token])

    const handleCreateEntry = () => {
        const text = '一条创建于' + new Date().toLocaleString() + '的测试帖子';
        API.wallCreateOneEntry(user.token, {content: {text}}).then(res => {
            console.log('创建了一条帖子', res);
            setEntries([...entries, res.data])
        })
    }

    const handleDeleteEntry = (id) => {
        API.wallDeleteOneEntry(user.token, {wallEntryId: id}).then(res => {
            console.log('删除了一条帖子', res);
            setEntries(entries.filter(entry => entry._id !== id));
        })
    }

    return (
        <>
            <h1>Wall</h1>
            <div>
                <button onClick={handleCreateEntry}>创建一条测试帖子</button>
                {entries.map(entry => (
                    <div key={entry._id}>
                        <span>ID: {entry._id}</span>
                        <button onClick={() => handleDeleteEntry(entry._id)}>删除</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Wall;
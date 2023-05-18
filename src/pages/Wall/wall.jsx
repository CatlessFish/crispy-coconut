// import { Route, Routes } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom"
import API from "../../api/api";
import { UserContext } from "../../utils/userContext";
import WallEntryDetail from "./wallEntryDetail";
import WallEntryCard from "../../components/wallEntryCard";
import "./wall.scss"

function Wall () {
    // TODO: 先登录后查看，否则跳转到登录页面
    const user = useContext(UserContext);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        API.wallGetAllEntries(user.token).then(res => {
            console.debug('Entries in the wall', res);
            setEntries(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [user.token])

    const handleCreateEntry = () => {
        const text = '一条创建于' + new Date().toLocaleString() + '的测试帖子';
        API.wallCreateOneEntry(user.token, {content: {text}}).then(res => {
            console.log('创建了一条帖子', res);
            setEntries([...entries, res.data])
        })
        .catch(err => {
            console.log(err);
        })
    }

    // eslint-disable-next-line
    const handleDeleteEntry = (id) => {
        API.wallDeleteOneEntry(user.token, {wallEntryId: id}).then(res => {
            console.log('删除了一条帖子', res);
            setEntries(entries.filter(entry => entry._id !== id));
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <>
            <h1>Wall</h1>
            <Routes>
                <Route path="" Component={() => 
                <div className="wall-entry-list">
                    <button onClick={handleCreateEntry}>创建一条测试帖子</button>
                    {entries.map(entry => (
                        // <div key={entry._id}>
                        //     <span>ID: {entry._id}</span>
                        //     <button onClick={() => handleDeleteEntry(entry._id)}>删除</button>
                        // </div>
                        <WallEntryCard 
                            key={entry._id}
                            entry={entry}
                        />
                    ))}
                </div>
                } />
                <Route path="detail">
                    <Route path=":wallEntryId" Component={WallEntryDetail} />
                    <Route path="*" Component={<h1>404</h1>}/>
                </Route>
            </Routes>
        </>
    )
}

export default Wall;
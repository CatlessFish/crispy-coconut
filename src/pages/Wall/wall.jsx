// import { Route, Routes } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom"
import API from "../../api/api";
import { UserContext } from "../../utils/userContext";
import WallEntryDetail from "./wallEntryDetail";
import WallNewEntry from "./wallNewEntry";
import WallEntryCard from "../../components/wallEntryCard";
import { Space, InfiniteScroll } from 'antd-mobile'
import "./wall.scss"
import { AddCircleOutline } from 'antd-mobile-icons'

function Wall () {
    // TODO: 先登录后查看，否则跳转到登录页面
    const user = useContext(UserContext);
    const [entries, setEntries] = useState([]);
    const [hasMore, setHasMore] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        API.wallGetAllEntries(user.token).then(res => {
            console.debug('Entries in the wall', res);
            setEntries(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [user.token])

    const handleCreateEntry = () => 
        navigate(`/wall/newEntry/`);

    async function loadMore() {
        // const append = ?
        // setEntries(val => [...val, ...append])
        setHasMore(false)
        }

    return (
        <>
            <Space style={{ '--gap': '190px' }}>
                <h1>今日表白墙</h1> 
                <h1><AddCircleOutline onClick={handleCreateEntry} fontSize={36}/></h1>
            </Space>
            <Routes>
                <Route path="" Component={() => 
                <>
                    <div className="wall-entry-list">
                        {entries.slice().reverse().map(entry => (
                            <WallEntryCard 
                                key={entry._id}
                                entry={entry}
                            />

                        ))}
                    </div>
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                </>
                } />
                <Route path="detail">
                    <Route path=":wallEntryId/*" Component={() => 
                        <WallEntryDetail
                            entries={entries}
                            setEntries={setEntries}
                        />
                    } />
                    <Route path="*" Component={<h1>404</h1>}/>
                </Route>

                <Route path="newEntry" Component={() => 
                    <WallNewEntry
                        entries={entries}
                        setEntries={setEntries}
                    />
                } />
                
            </Routes>
        </>
    )
}

export default Wall;
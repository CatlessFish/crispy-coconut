import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes } from "react-router-dom"
import API from "../../api/api";
import { UserContext } from "../../utils/userContext";
import SquareCard from "../../components/squareCard";
import MsgboxDetailinSquare from "./msgboxDetail";
import { InfiniteScroll } from 'antd-mobile'

function Home() {
    const user = useContext(UserContext);
    const [boxes, setBoxes] = useState([]);
    const [hasMore, setHasMore] = useState(false)

    async function loadMore() {
        // const append = ?
        // setEntries(val => [...val, ...append])
        setHasMore(false)
        }
    
    useEffect(() => {
        API.squareGetAll(user.token).then(res => {
            console.debug('boxes in the square', res);
            setBoxes(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [user.token])

    return (
    <>
        <h1>广场</h1>
        <Routes>
                <Route path="" Component={() => 
                <>
                    <div className="wall-entry-list">
                        {boxes.map(box => (
                            <SquareCard 
                                key={box.msgBoxId}
                                msgboxId={box.msgBoxId}
                            />

                        ))}
                    </div>
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                </>
                } />
                <Route path="detail">
                    <Route path=":msgBoxId/*" Component={() => 
                        <MsgboxDetailinSquare
                        />
                    } />
                    <Route path="*" Component={<h1>404</h1>}/>
                </Route>
            </Routes>
    </>
        
    )
}

export default Home;
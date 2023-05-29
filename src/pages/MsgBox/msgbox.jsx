import React from 'react'
import { useContext, useEffect, useState } from "react";
import { Card, Toast, Button, InfiniteScroll, List } from 'antd-mobile'
import { Route, Routes, useNavigate } from "react-router-dom"
import './msgbox.scss'
import { UserContext } from "../../utils/userContext";
import API from "../../api/api";
import "../../components/Card.scss";

function MsgBox () {
    const user = useContext(UserContext);
    // const [entries, setEntries] = useState([]);
    const [msgbox, setMsgbox] = useState({});
    const [hasMore, setHasMore] = useState(true)
    const navigate = useNavigate();
    let user_id;
    let box_data;

    useEffect(() => {
        API.userGetProfile(user.token).then(
            res=>{
                user_id = res.data._id;
                API.msgBoxGetMsgBoxByOwnerId(user.token, {ownerId: user_id}).then(res => {
                    console.log(res.data);
                    setMsgbox(res.data);
                    console.log(msgbox);
                })
                .catch(err => {
                    console.log(err);
                })
            }
        )
    }, [user.token])

    return (
    <>
        <h1>我的提问箱</h1>
        <Routes>
                <Route path="" Component={() => 
                <>
                    <Card
                        key={user_id}
                        // onClick={handleClickOnEntry}
                        className="msgbox-card"
                        bodyClassName="msgbox-card-body"
                    >
                        <div className="msgbox-card-body__title">
                            {/* {box_data.content.description} */}
                            这里将会是描述这里将会是描述这里将会是描述这里将会是描述
                        </div>
                        <div className="msgbox-card-body__time">
                            {msgbox.updateAt}
                        </div>
                            
                    </Card>
                    {/* <InfiniteScroll loadMore={loadMore} hasMore={hasMore} /> */}
                </>
                } />
        </Routes>
    </>
    )
}

export default MsgBox;
// import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import API from "../../api/api";
import BackButtonByPath from "../../components/backButtonByPath";
import MsgboxPostCard from "../../components/msgboxPostCard";
import { UserContext } from "../../utils/userContext";
import "./msgbox.scss"
import { Route, Routes, useNavigate } from "react-router-dom"
import { Button, Space, NavBar } from 'antd-mobile'
import MsgboxNewReply from "./msgboxNewReply";

function MsgboxEntryDetail (props) {
    // const navigate = useNavigate()
    const user = useContext(UserContext)
    const {msgboxEntryId} = useParams()
    const [posts, setPosts] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        API.msgBoxGetAllPostsInMsgBoxEntry(user.token, {entryId: msgboxEntryId}).then(res => {
            console.debug('Posts in the entry:', res);
            setPosts(res.data);
            // res.data is an array of posts
        })
        .catch(err => {
            console.log(err);
        })
    }, [msgboxEntryId, user.token])

    const handleDeleteEntry = (entryId) => {
        API.msgBoxDeleteOneEntryInMsgBox(user.token, {msgBoxId: props.msgboxId, entryId: entryId}).then(res => {
            console.log('删除了一张卡片', res);
            props.setEntries(props.entries.filter(entry => entry._id !== entryId));
        })
        .catch(err => {
            console.log(err);
        })
        navigate(`/loading`)
        setTimeout(() => {
            navigate(`/msgbox`)
        }, 1000);
    }

    const handleReply = (id) => {
        navigate(`/msgbox/detail/${id}/newReply`)
    }

    const handle = () => {
    }

    const right = (
        <div style={{ fontSize: 24 }}>
          <Space style={{ '--gap': '16px' }}>
          <Button onClick={() => handleDeleteEntry(msgboxEntryId)}>删除</Button>
          <Button onClick={() => handleReply(msgboxEntryId)}>回复</Button>
          </Space>
        </div>
      )
    
      const back = (
            <BackButtonByPath path="/msgbox" />
      )

    return (
        <>
            <Routes>
                <Route path="" Component={() => 
                <div>
                    <NavBar right={right} left={back} backArrow={false}>
                    卡片详情
                    </NavBar>
                    <div className="msgbox-post-list">
                        {posts.map(post => (
                            <MsgboxPostCard key={post._id} post={post} />
                        ))}
                    </div>
                </div>
                } />
                <Route path="newReply" Component={() => 
                    <MsgboxNewReply
                        id={msgboxEntryId}
                        posts={posts}
                        setPosts={setPosts}
                    />
                } />
            </Routes>
        </>
    )
}

export default MsgboxEntryDetail;
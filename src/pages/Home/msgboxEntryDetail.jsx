// import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import BackButtonByPath from "../../components/backButtonByPath";
import MsgboxPostCard from "../../components/msgboxPostCard";
import { UserContext } from "../../utils/userContext";
import { Route, Routes, useNavigate } from "react-router-dom"
import { Button, Space, NavBar } from 'antd-mobile'
import MsgboxEntryNewReply from './msgboxEntryNewReply'

function MsgboxEntryDetailinSquare (props) {
    // const navigate = useNavigate()
    const user = useContext(UserContext)
    const {msgBoxId, msgboxEntryId} = useParams()
    const [posts, setPosts] = useState([])
    const [own, setOwn] = useState(false)
    const [userId, setUserId] = useState()
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
        API.userGetProfile(user.token).then(res => {
            setUserId(res.data._id);
            setOwn((userId === props.msgbox?.owner ) ? true : false)
        })
    }, [msgboxEntryId, user.token, userId, props.msgbox])

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
            navigate(`/home/detail/${msgBoxId}`)
        }, 1000);
    }

    const handleReply = (id) => {
        navigate(`/home/detail/${msgBoxId}/${msgboxEntryId}/newReply`)
    }


    const right = (
        <div style={{ fontSize: 24 }}>
        {own ?
            <Space style={{ '--gap': '16px' }}>
            <Button onClick={() => handleDeleteEntry(msgboxEntryId)}>删除</Button>
            <Button onClick={() => handleReply(msgboxEntryId)}>回复</Button>
            </Space>
        :
            <Button onClick={() => handleReply(msgboxEntryId)}>回复</Button>
        }
          
        </div>
      )
    
      const left = (
            <BackButtonByPath path={`/home/detail/${msgBoxId}`} />
      )

    return (
        <>
            <Routes>
                <Route path="" Component={() => 
                <div>
                    <NavBar right={right} left={left} backArrow={false}>
                    卡片详情
                    </NavBar>
                    <div className="msgbox-post-list">
                        {posts.map(post => (
                            <MsgboxPostCard 
                                key={post._id} 
                                entryId={msgboxEntryId} 
                                msgBoxId={msgBoxId}
                                msgboxEntryId={msgboxEntryId}
                                post={post}
                                msgbox={props.msgbox}
                            />
                        ))}
                    </div>
                </div>
                } />
                <Route path="newReply" Component={() => 
                    <MsgboxEntryNewReply
                        id={msgboxEntryId}
                        msgBoxId={msgBoxId}
                        msgboxEntryId={msgboxEntryId}
                        posts={posts}
                        setPosts={setPosts}
                    />
                } />
            </Routes>
        </>
    )
}

export default MsgboxEntryDetailinSquare;
// import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import API from "../../api/api";
import BackButton from "../../components/backButton";
import WallPostCard from "../../components/wallPostCard";
import { UserContext } from "../../utils/userContext";
import "./wall.scss"
import { Route, Routes, useNavigate } from "react-router-dom"
import { Button, Space, NavBar } from 'antd-mobile'
import WallNewReply from "./wallNewReply";

function WallEntryDetail (props) {
    // const navigate = useNavigate()
    const user = useContext(UserContext)
    const {wallEntryId} = useParams()
    const [posts, setPosts] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        API.wallGetAllPostsInEntry(user.token, {wallEntryId}).then(res => {
            console.debug('Posts in the entry:', res);
            setPosts(res.data);
            // res.data is an array of posts
        })
        .catch(err => {
            console.log(err);
        })
    }, [wallEntryId, user.token])

    const handleDeleteEntry = (id) => {
        API.wallDeleteOneEntry(user.token, {wallEntryId: id}).then(res => {
            console.log('删除了一条帖子', res);
            props.setEntries(props.entries.filter(entry => entry._id !== id));
        })
        .catch(err => {
            console.log(err);
        })
        navigate(`/wall`)
    }

    const handleReply = (id) => {
        // API.wallAddPostToEntry(user.token, {wallEntryId: id, content: {text:'123'}}).then(res => {
        //     console.log('增加了一条回复', res);
        //     setPosts([...posts, res.data])
        // })
        // .catch(err => {
        //     console.log(err);
        // })
        navigate(`/wall/detail/newReply`)
    }

    const right = (
        <div style={{ fontSize: 24 }}>
          <Space style={{ '--gap': '16px' }}>
          <Button onClick={() => handleDeleteEntry(wallEntryId)}>删除</Button>
          <Button onClick={() => handleReply(wallEntryId)}>回复</Button>
          </Space>
        </div>
      )
    
      const back = (
            <BackButton />
      )

    return (
        <>
            <Routes>
                <Route path="" Component={() => 
                <div>
                    <NavBar right={right} left={back} backArrow={false}>
                    表白详情
                    </NavBar>
                    <div className="wall-entry-post-list">
                        {posts.map(post => (
                            <WallPostCard key={post._id} post={post} />
                        ))}
                    </div>
                </div>
                } />
                <Route path="newReply" Component={() => 
                    <WallNewReply
                        posts={posts}
                        setPosts={setPosts}
                    />
                } />
            </Routes>
        </>
    )
}

export default WallEntryDetail;
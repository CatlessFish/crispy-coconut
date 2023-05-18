// import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import API from "../../api/api";
import BackButton from "../../components/backButton";
import WallPostCard from "../../components/wallPostCard";
import { UserContext } from "../../utils/userContext";
import "./wall.scss"

function WallEntryDetail () {
    // const navigate = useNavigate()
    const user = useContext(UserContext)
    const {wallEntryId} = useParams()
    const [posts, setPosts] = useState([])
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

    return (
        <>
            <BackButton />
            <div className="wall-entry-post-list">
                {posts.map(post => (
                    <WallPostCard key={post._id} post={post} />
                ))}
            </div>
        </>
        // TODO: 回复帖子
    )
}

export default WallEntryDetail;
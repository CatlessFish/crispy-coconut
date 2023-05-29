import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "antd-mobile";

import API from "../api/api";
import { UserContext } from "../utils/userContext";
import "./Card.scss";

function MsgboxEntryCard(props) {
    // console.log(props)
    const user = useContext(UserContext);
    const [entry, setEntry] = useState(props.entry);
    const navigate = useNavigate()

    useEffect(() => {
        API.postGetOnePostById(user.token, {postId: props.entry.initialPost}).then(res => {
            // console.log(res);
            // This is called 'a functional update' using lamda syntax, it's to avoid infinite loops
            setEntry(prevEntry => ({...prevEntry, initialPostData: res.data}))
        })
        .catch(err => {
            console.log(err);
        })
    }, [props.entry, user.token])

    //TODO: delivery the whole entry
    const handleClickOnEntry = () => navigate(`/msgBox/detail/${entry._id}`);

    return (
        <Card
            key={entry._id}
            onClick={handleClickOnEntry}
            className="post-card"
            bodyClassName="post-card-body"
        >
            <div className="post-card-body__title">
                    {entry.initialPostData?.content.description}
            </div>
            <div className="post-card-body__time">
                {entry.initialPostData?.updatedAt}
            </div>
                
        </Card>
    );
}

export default MsgboxEntryCard;
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "antd-mobile";

import API from "../api/api";
import { UserContext } from "../utils/userContext";
import "./Card.scss";

function SquareCard(props) {
    // console.log(props)
    const user = useContext(UserContext);
    const navigate = useNavigate()
    const [msgbox, setMsgbox] = useState('');
    const [userName, setUserName] = useState('');


    useEffect(() => {
        API.msgBoxGetMsgBoxById(user.token, {msgBoxId: props.msgboxId}).then(res => {
            setMsgbox(res.data)
            API.userGetNameById(user.token, {userId: res.data.owner}).then(_res => {
                setUserName(_res.data.username)
            })
            .catch(err => {
                console.log(err);
            })   
        })
        .catch(err => {
            console.log(err);
        }) 
        
    }, [props.msgboxId, user.token])

    const handleClickOnBox = () => navigate(`/home/detail/${props.msgboxId}`);

    return (
        <Card
            key={props.msgboxId}
            onClick={handleClickOnBox}
            className="post-card"
            bodyClassName="post-card-body"
        >
            <div className="post-card-body__title">
                    {msgbox?.content?.description}
            </div>
            <div className="post-card-body__time">
                {userName}
            </div>
                
        </Card>
    );
}

export default SquareCard;
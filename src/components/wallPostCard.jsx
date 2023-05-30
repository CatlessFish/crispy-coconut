import { Card, Toast, Button, Modal, Popup, Input } from "antd-mobile";
import API from "../api/api";
import "./Card.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/userContext";


function WallPostCard(props) {
    const { entryId, post } = props;
    const user = useContext(UserContext);
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    let text;

    const handleInputChangeUpdate = (event) => {
        text = event;
    };

    const handlePostUpdate = () => {
        setVisible(false)
        API.wallUpdatePostInEntry(user.token, {wallEntryId: entryId, postId: post._id, content:{text: text } })
        .then( res => {
            navigate(`/loading`)
            setTimeout(() => {
                navigate(`/wall/detail/${entryId}`)
            }, 1000);
        })
    }

    const handlePop = () => { 
        setVisible(true);
    };

    const handlePostDelete = () => {
        API.wallDeletePostInEntry(user.token, {wallEntryId: entryId, postId: post._id})
        .then( res => {
            navigate(`/loading`)
            setTimeout(() => {
                navigate(`/wall/detail/${entryId}`)
            }, 1000);
        })
        .catch( err => {
            Toast.show(err.error_msg)
        })
    };

    const onClick = () => {
        Modal.show({
            content: '木叶飞舞之处，火亦生生不息',
            closeOnAction: true,
            showCloseButton: true,
            actions: [
                {
                    key: 'update',
                    onClick: handlePop,
                    text: '编辑',
                },
                {
                    key: 'delete',
                    text: '删除',
                    onClick: handlePostDelete,
                    danger: true,
                },
            ],
            })
      }
    return (
    <>
        <Card
            key={post._id}
            className="post-card"
            bodyClassName="post-card-body"
            onClick={onClick}
        >
            <div className="post-card-body__title">
                    {post.content.text}
            </div>
            <div className="post-card-body__time">
                {post.updatedAt}
            </div>
        </Card>
        <Popup
                visible={visible}
                onMaskClick={() => {
                setVisible(false)
                }}
                bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                minHeight: '40vh',
                }}
            >
            <h2>修改你的贴子内容～</h2>
            <Input placeholder='请输入内容' onChange={handleInputChangeUpdate} clearable />
            <Button onClick={handlePostUpdate}>提交</Button>
        </Popup>
    </>
    );
}

export default WallPostCard;
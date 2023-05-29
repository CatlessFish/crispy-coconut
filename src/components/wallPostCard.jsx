import { Card } from "antd-mobile";

import "./Card.scss";

function WallPostCard(props) {
    const { post } = props;
    // TODO: 修改/删除自己的帖子
    return (
        <Card
            key={post._id}
            className="post-card"
            bodyClassName="post-card-body"
        >
            <div className="post-card-body__title">
                    {post.content.text}
            </div>
            <div className="post-card-body__time">
                {post.updatedAt}
            </div>
        </Card>
    );
}

export default WallPostCard;
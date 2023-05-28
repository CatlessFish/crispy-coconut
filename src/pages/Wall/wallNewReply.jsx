import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import API from "../../api/api";
import BackButton from "../../components/backButton";
import { UserContext } from "../../utils/userContext";
import { Input, Button } from 'antd-mobile'


function WallNewReply (props) {
    const user = useContext(UserContext)
    // const [entries, setEntries] = useState(props.entries, );
    const navigate = useNavigate();
    let text;
    const handleInputChange = (event) => {
        text = event;
    };
    const handleReply = () => {
        API.wallAddPostToEntry(user.token, {wallEntryId: props.id, content: {text}}).then(res => {
            console.log('增加了一条回复', res);
            props.setPosts([...props.posts, res.data])
        })
        .catch(err => {
            console.log(err);
        })
        navigate(`/wall`)
      };

    return (
        <>
            <BackButton />
            <div>
                <Input placeholder='请输入内容' onChange={handleInputChange} clearable />
                <Button onClick={handleReply}>提交</Button>
            </div>
        </>
    )
}
 
export default WallNewReply;
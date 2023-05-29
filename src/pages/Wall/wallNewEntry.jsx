import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import API from "../../api/api";
import BackButton from "../../components/backButton";
import { UserContext } from "../../utils/userContext";
import { Input, Button } from 'antd-mobile'


function WallNewEntry (props) {
    const user = useContext(UserContext)
    // const [entries, setEntries] = useState(props.entries, );
    const navigate = useNavigate();
    let text;
    const handleInputChange = (event) => {
        text = event;
    };
    const handleSubmit = () => {
        API.wallCreateOneEntry(user.token, {content: {text}}).then(res => {
            console.log('创建了一条帖子', res);
            props.setEntries([...props.entries, res.data])
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
                <Button onClick={handleSubmit}>提交</Button>
            </div>
        </>
    )
}
 
export default WallNewEntry;
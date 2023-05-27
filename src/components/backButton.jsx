import { useNavigate } from "react-router-dom"
import { LeftOutline } from "antd-mobile-icons";

function BackButton () {
    const navigate = useNavigate()
    return (
        // <button onClick={() => navigate(-1)}>Back</button>
        <LeftOutline onClick={() => navigate(-1)} fontSize={24} />
    )
}

export default BackButton;
import { useNavigate } from "react-router-dom"
import { LeftOutline } from "antd-mobile-icons";

function BackButtonByPath (path) {
    const navigate = useNavigate()
    const real_path = path.path
    return(
        <LeftOutline onClick={() => navigate(real_path)} fontSize={24} />
    );
}

export default BackButtonByPath;
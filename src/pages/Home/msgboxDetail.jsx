import { useParams} from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import BackButtonByPath from "../../components/backButtonByPath";
import MsgboxEntryCardinSquare from "../../components/squareEntryCard";
import MsgboxEntryDetailinSquare from "./msgboxEntryDetail";
import { UserContext } from "../../utils/userContext";
import { Route, Routes } from "react-router-dom"
import { Button, Space, Popup, Input, Card, InfiniteScroll, Checkbox } from 'antd-mobile'



function MsgboxDetailinSquare (props) {
    // const navigate = useNavigate()
    const user = useContext(UserContext)
    const {msgBoxId} = useParams()
    const [msgbox, setMsgbox] = useState('');
    const [entries, setEntries] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false)
    let text, isPrivate = false;

    useEffect(() => {
        API.msgBoxGetMsgBoxById(user.token, {msgBoxId: msgBoxId}).then(res => {
            API.msgBoxGetMsgBoxByOwnerId(user.token, {ownerId: res.data.owner}).then(_res => {
                setMsgbox(_res.data)
                API.msgBoxGetAllEntriesInMsgBox(user.token, {msgBoxId: _res.data._id}).then(res => {
                    console.debug('Entries in the msgbox', res);
                    setEntries(res.data);
                })
                .catch(err => {
                    console.log(err);
                })
            })
        })
    }, [user.token, msgBoxId])

    async function loadMore() {
        // const append = ?
        // setEntries(val => [...val, ...append])
        setHasMore(false)
        }


    const handleInputChangeAdd = (event) => {
        text = event;
    };

    const handleIsPrivateChangeAdd = (event) => {
        isPrivate = event;
    };

    const handleAdd = () => {
        API.msgBoxCreateOneEntryInMsgBox(user.token, {
            msgBoxId: msgbox._id,
            content:{description: text}},
            isPrivate,
        )
        .then( res => {
            setEntries([...entries, res.data])
        })
        setVisibleAdd(false)
    }

    
    return (
    <>
        <Routes>
                <Route path="" Component={() => 
                <>
                    <Space style={{ '--gap': '90px'}}>
                        <BackButtonByPath path='/home'/>

                        <Space style={{ '--gap': '10px', 'marginTop': '5px' }}>

                        <Button
                        onClick={() => {
                            setVisibleAdd(true)
                        }}
                        >
                        给箱子主人提问
                        </Button>
                        <Popup
                        visible={visibleAdd}
                        onMaskClick={() => {
                            setVisibleAdd(false)
                        }}
                        bodyStyle={{
                            borderTopLeftRadius: '8px',
                            borderTopRightRadius: '8px',
                            minHeight: '40vh',
                        }}
                        >
                        <h2>增加一张卡片~</h2>
                        <Input placeholder='请输入内容' onChange={handleInputChangeAdd} clearable />
                        <Checkbox onChange={handleIsPrivateChangeAdd}>私密提问</Checkbox>
                        <Button onClick={handleAdd}>提交</Button>
                        </Popup>

                        </Space>
                    </Space>
                    <div className="msgbox-entry-list">
                        <Card
                            className="msgbox-card"
                            bodyClassName="msgbox-card-body"
                        >
                            <div className="msgbox-card-body__title">
                                {msgbox?.content?.description}
                            </div>
                            <div className="msgbox-card-body__time">
                                {msgbox?.updatedAt}  
                            </div>
                        </Card>
                    </div>
                    
                    <div className="msgbox-entry-list">
                        {entries.map(entry => (
                            <MsgboxEntryCardinSquare 
                                key={entry._id}
                                msgBoxId={msgBoxId}
                                entry={entry}
                            />
                        ))}
                    </div>

                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                </>
                } />
                <Route path=":msgboxEntryId/*" Component={() => 
                    <MsgboxEntryDetailinSquare
                        msgbox={msgbox}
                        msgboxId={msgbox._id}
                        entries={entries}
                        setEntries={setEntries}
                    />
                } />
                <Route path="*" Component={<h1>404</h1>}/>
        </Routes>
    </>
    )
}

export default MsgboxDetailinSquare;
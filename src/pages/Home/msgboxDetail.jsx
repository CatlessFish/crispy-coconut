import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import BackButton from "../../components/backButton";
import MsgboxPostCard from "../../components/msgboxPostCard";
import MsgboxEntryCardinSquare from "../../components/squareEntryCard";
import { UserContext } from "../../utils/userContext";
import { Route, Routes, useNavigate } from "react-router-dom"
import { Button, Space, NavBar, Popup, Input, Card, InfiniteScroll } from 'antd-mobile'
import MsgboxNewReply from "../MsgBox/msgboxNewReply";



function MsgboxDetailinSquare (props) {
    // const navigate = useNavigate()
    const user = useContext(UserContext)
    const {msgBoxId} = useParams()
    const [msgbox, setMsgbox] = useState('');
    const [entries, setEntries] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false)
    const navigate = useNavigate();
    let text;

    useEffect(() => {
        API.msgBoxGetMsgBoxById(user.token, {msgBoxId: msgBoxId}).then(res => {
            setMsgbox(res.data)
            API.msgBoxGetAllEntriesInMsgBox(user.token, {msgBoxId: res.data._id}).then(res => {
                console.debug('Entries in the msgbox', res);
                setEntries(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        })
    }, [user.token, msgBoxId])

    async function loadMore() {
        // const append = ?
        // setEntries(val => [...val, ...append])
        setHasMore(false)
        }

    const handle = () => {
        
    }

    const handleInputChangeAdd = (event) => {
        text = event;
    };


    const handleAdd = () => {
        API.msgBoxCreateOneEntryInMsgBox(user.token, {msgBoxId: msgbox._id, content:{description: text}}).then( res => {
            setEntries([...entries, res.data])
        })
        setVisibleAdd(false)
    }

    
    return (
    <>
        <Space style={{ '--gap': '28px'}}>
            <BackButton></BackButton>

            <Space style={{ '--gap': '10px', 'marginTop': '15px' }}>

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
            <Button onClick={handleAdd}>提交</Button>
            </Popup>

            </Space>
        </Space>
        <Routes>
                <Route path="" Component={() => 
                <>
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
                    
                    <div className="msgbox-entry-list">
                        {entries.map(entry => (
                            <MsgboxEntryCardinSquare 
                                key={entry._id}
                                entry={entry}
                            />
                        ))}
                    </div>

                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                </>
                } />
                {/* <Route path="detail">
                    <Route path=":msgboxEntryId/*" Component={() => 
                        <MsgboxEntryDetail
                            msgboxId={msgbox._id}
                            entries={entries}
                            setEntries={setEntries}
                        />
                    } />
                    <Route path="*" Component={<h1>404</h1>}/>
                </Route> */}

                {/* <Route path="newEntry" Component={() => 
                    <WallNewEntry
                        entries={entries}
                        setEntries={setEntries}
                    />
                } /> */}
        </Routes>
    </>
    )
}

export default MsgboxDetailinSquare;
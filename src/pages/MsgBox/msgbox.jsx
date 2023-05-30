import React from 'react'
import { useContext, useEffect, useState } from "react";
import { Card, Toast, Button, InfiniteScroll, List, Space, Popup, Input} from 'antd-mobile'
import { Route, Routes, useNavigate, useLocation  } from "react-router-dom"
import './msgbox.scss'
import { UserContext } from "../../utils/userContext";
import API from "../../api/api";
import "../../components/Card.scss";
import MsgboxEntryCard from "../../components/msgboxEntryCard";
import MsgboxEntryDetail from './msgEntryDetail';

function MsgBox () {
    const user = useContext(UserContext);
    const [entries, setEntries] = useState([]);
    const [msgbox, setMsgbox] = useState('');
    // const [hasMore, setHasMore] = useState(true)
    const navigate = useNavigate();
    const [user_id, setUserId] = useState('');
    const [visibleUpdate, setVisibleUpdate] = useState(false)
    const [visibleAdd, setVisibleAdd] = useState(false)
    const location = useLocation();
    const [hasMore, setHasMore] = useState(true);
    let text, flush = 0;

    useEffect(() => {
        API.userGetProfile(user.token).then(res => {
            console.debug('setUserID', res);
            setUserId(res.data._id);
            API.msgBoxGetMsgBoxByOwnerId(user.token, {ownerId: res.data._id}).then(_res => {
                setMsgbox(_res.data)
                API.msgBoxGetAllEntriesInMsgBox(user.token, {msgBoxId: _res.data._id}).then(res => {
                    console.debug('Entries in the msgbox', res);
                    setEntries(res.data);
                })
                .catch(err => {
                    console.log(err);
                })
            })
            .catch(err => {
                // console.log(err);
                API.msgBoxCreateOneMsgBox(user.token, {content:{ description: "这是你的提问箱，快来更新描述吧~" }})
                .then(res => {
                    flush++;
                }
                )
            })
        })
        .catch(err => {
            console.log(err);
        })
        return () => {
            setEntries([]);
        };
    }, [user_id, user.token, flush])

    async function loadMore() {
        // const append = ?
        // setEntries(val => [...val, ...append])
        setHasMore(false)
        }

    const handle = () => {
        
    }

    const handleInputChangeUpdate = (event) => {
        text = event;
    };

    const handleUpdate = () => {
        API.msgBoxUpdateOneMsgBox(user.token, {msgBoxId: msgbox._id, content:{description: text}}).then( res => {
            setMsgbox(res.data)
        })
        setVisibleUpdate(false)
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
            <h1>我的提问箱</h1>

            <Space style={{ '--gap': '10px', 'marginTop': '15px' }}>

            <Button
              onClick={() => {
                setVisibleUpdate(true)
              }}
            >
              更新描述
            </Button>
            <Popup
              visible={visibleUpdate}
              onMaskClick={() => {
                setVisibleUpdate(false)
              }}
              bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                minHeight: '40vh',
              }}
            >
            <h2>想要被提问什么样的问题呢~</h2>
            <Input placeholder='请输入内容' onChange={handleInputChangeUpdate} clearable />
            <Button onClick={handleUpdate}>提交</Button>
            </Popup>

            <Button
              onClick={() => {
                setVisibleAdd(true)
              }}
            >
              增加卡片
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
                        key={user_id}
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
                        {entries.slice().reverse().map(entry => (
                            <MsgboxEntryCard 
                                key={entry._id}
                                entry={entry}
                            />
                        ))}
                    </div>

                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                </>
                } />
                <Route path="detail">
                    <Route path=":msgboxEntryId/*" Component={() => 
                        <MsgboxEntryDetail
                            msgboxId={msgbox._id}
                            entries={entries}
                            setEntries={setEntries}
                        />
                    } />
                    <Route path="*" Component={<h1>404</h1>}/>
                </Route>

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

export default MsgBox;
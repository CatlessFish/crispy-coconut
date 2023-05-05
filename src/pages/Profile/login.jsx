import { Card, Tabs, Form, Input, Button, Dialog, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../utils/userContext";

import api from "../../api/api";

function LoginPage() {
    return (
        <>
            <Card>
                <Tabs>
                    <Tabs.Tab title="登录" key={'Login'}>
                        <LoginForm />
                    </Tabs.Tab>
                    <Tabs.Tab title="注册" key={'Register'}>
                        <RegisterForm />
                    </Tabs.Tab>
                </Tabs>
            </Card>
        </>
    )
}

function LoginForm() {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const user = useContext(UserContext); // user是全局状态，结构为{token, setToken}，在App.jsx中定义

    const onLogin = (values) => {
        api.userLogin(values).then(res => {
            // 这里的res由后端返回
            // 保存token到全局状态
            const token = res.data;
            // console.log(token);
            user.setToken(token)

            form.resetFields();
            Toast.show('登录成功', 1000);
            navigate('/profile');
        }).catch(err => {
            console.log(err);
            Dialog.alert({
                title: '登录失败',
                content: err.message
            })
        })
    }

    return (
        <div>
            <Form
                footer={
                    <Button block size="large" color="primary" type="submit">登录</Button>
                }
                form={form}
                onFinish={onLogin}
            >
                <Form.Item
                    label={'用户名'}
                    name={'username'}
                >
                    <Input placeholder="请输入用户名" clearable/>
                </Form.Item>
                <Form.Item 
                    label={'密码'} 
                    name={'password'}
                    extra={
                        visible ? <EyeInvisibleOutline onClick={() => setVisible(false)}/> 
                        : <EyeOutline onClick={() => setVisible(true)}/>
                    }
                >
                    <Input placeholder="请输入密码" clearable type={visible ? 'text' : 'password'}/>
                </Form.Item>
            </Form>
        </div>
    )
}

function RegisterForm() {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onRegister = (values) => {
        api.userRegister(values).then(res => {
            console.log(res);
            form.resetFields();
            Toast.show('注册成功', 1000);
            navigate('/profile/login');
        }).catch(err => {
            console.log(err);
            Dialog.alert({
                title: '注册失败',
                content: err.message
            })
        })
    }

    return (
        <div>
            <Form
                footer={
                    <Button block type='submit' size="large" color="primary">注册</Button>
                }
                form={form}
                onFinish={onRegister}
            >
                <Form.Item
                    label={'用户名'}
                    name={'username'}
                    required
                >
                    <Input placeholder="请输入用户名" clearable/>
                </Form.Item>
                <Form.Item 
                    label={'密码'} 
                    name={'password'}
                    extra={
                        visible ? <EyeInvisibleOutline onClick={() => setVisible(false)}/> 
                        : <EyeOutline onClick={() => setVisible(true)}/>
                    }
                    required
                >
                    <Input placeholder="请输入密码" clearable type={visible ? 'text' : 'password'}/>
                </Form.Item>
                <Form.Item
                    name='email'
                    label='邮箱'
                    rules={[
                    { type: 'string', min: 6 },
                    { type: 'email', warningOnly: true },
                    ]}
                >
                    <Input placeholder="请输入邮箱" clearable/>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginPage;


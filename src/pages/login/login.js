import React ,{Component} from 'react';
import './login.less';
import logo from '../../assets/images/logo.png';
import { Form, Input, Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {reqLogin} from '../../api';
import mermoryUtils from '../../utils/mermoryUtils'
import storageUtils from '../../utils/storageUtils';
import { Redirect } from 'react-router';
// const item=Form.Item;
// 可以替换下面的Form.Item，这个表达式不可以写在任何一个import前面



// 登录的路由组件
class Login extends Component{
    onFinish=(async(values)=>{
        const {username,password}=values; 
        console.log('校验成功');

        // 请求登录
            // const response=await reqLogin(username,password);
            const result=await reqLogin(username,password);
            // console.log('请求成功',response.data);
            // const result=response.data;
            // 在发送ajax请求时返回的就是response中的数据
            const user =result.data;
            if(result.status===0){
                // 登录成功
                message.success('登陆成功');
                // 在内存中保存用户信息
                mermoryUtils.user=user;
                // 在内存中保存的信息刷新之后就没了，关闭浏览器之后也没了
                // 保存在local中
                storageUtils.saveUser(user);
                // 跳转到管理界面
                this.props.history.replace('/');
                // 如果需要回退使用push方法

            }else{
                // 登录失败
                message.error(result.msg);
            }
    })
    validatePwd=(rule,value,callback)=>{
        console.log('validatePwd()',rule,value)
        if(!value){
            callback('密码必须输入')
        }else if(value.length<4){
            callback('密码长度不能小于4')
        }else if(value.length>12){
            callback('密码长度不能大于12')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文，数字或下划线组成')
        }else{
            callback()
        }
    }
    render(){
        // 如果用户已经登录，自动跳转到管理界面
        const user=mermoryUtils.user;
        if(user&&user._id){
           return <Redirect  to='/' />
        }else{
            return (
                <div className='login'>
                    <header className='login-header'>
                        <img src={logo} alt='logo' />
                        <h1>React:后台管理系统</h1>
                    </header>
                    <section className='login-content'>
                        <h2>用户登录</h2>
                        <Form
                        // 配置对象：属性名是特定的一些名称
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.onFinish}
                            >
                                {/* whitespace:true,空格输入代表没输入 */}
                            <Form.Item name='username' rules={[
                                // 声明式验证：直接使用别人定义好的验证规则进行验证
                                { required: true,whitespace:true, message: '用户名必须输入' },
                                {min:4,message:'用户名最少4位'},
                                {max:12,message:'用户名最多12位'},
                                {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文，数组或者下划线组成'}
                            ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item name='password' rules={[
                                {
                                    // 自定义验证
                                    validator:this.validatePwd
                                }
                            ]}>
                                <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                                </Button>
                            </Form.Item>
                         </Form>
                    </section>
                </div>
            )
        }

       
    }
}

// 高阶函数：一类特别的函数
//  1.接收函数类型的参数
//  2.返回值是函数
// 常见的高阶函数：1.定时器setTimeout()/setInterval()，2.Promise:Promise(()=>{}).then(()=>{}),3.数组遍历相关方法：forEach()/filter()/map()/reduce()/find()/findIndex()
// 4.fn.bind()函数对象的bind()
// 高阶函数更新动态，更加具有扩展性


// 高阶组件
/*
    1.本质是一个函数
    2.接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
    3.作用：扩展组件的功能
    4.高阶组件也是高阶函数，接收一个组件函数，返回是一个新的组件函数
*/



/*
async和await
作用：简化promise对象的使用，不需要使用then（）来指定成功/失败的回调函数，以同步编码方式（没有回调函数）来实现异步流程


在返回promise对象的表达式左侧写await：不要promise对象，直接得到promise异步执行的成功的value数据
await所在函数（最近的）定义的左侧写async

*/
export default Login;

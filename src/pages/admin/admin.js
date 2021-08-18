import React ,{Component} from 'react'
import { Redirect ,Route,Switch} from 'react-router';
import mermoryUtils from '../../utils/mermoryUtils';
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav/left-nav';
import Header  from '../../components/header/header';
import Home from '../../pages/home/home';
import Category from '../../pages/category/category';
import Pie from '../../pages/charts/pie';
import Line from '../../pages/charts/line';
import Bar from '../../pages/charts/bar';
import Product from '../../pages/product/product';
import User from '../../pages/user/user';
import Role from '../../pages/role/role';
const {  Footer, Sider, Content } = Layout;
// 管理的路由组件
export default class Admin extends Component{
    render(){
        const user =mermoryUtils.user;
        // 如果内存中没有存储user===》当前没有登录
        if(!user||!user._id){
            // 自动跳转到login页面
            return <Redirect  to='/login' />
        }else{
            return (
                <Layout style={{minHeight:'100%'}}>
                    <Sider><LeftNav /></Sider>
                    <Layout>
                        <Header />
                        <Content style={{margin:20,background:'#fff'}}>
                            <Switch>
                                <Route path='/home' component={Home} />
                                <Route path='/category' component={Category} />
                                <Route path='/product' component={Product} />
                                <Route path='/role' component={Role} />
                                <Route path='/user' component={User} />
                                <Route path='/charts/line' component={Line} />
                                <Route path='/charts/bar' component={Bar} />
                                <Route path='/charts/pie' component={Pie} />
                                <Redirect to='/home' />
                            </Switch>
                        </Content>
                        <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                    </Layout>
                </Layout>
            )
        }
    }
}



// 在render函数中实现自动跳转页面（使用Redirect）
// 在事件回调函数中实现自动跳转页面（使用this.props.history.push/this.props.history.replace====>前者可以回退，后者不能回退）
import React ,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import './header.less';
import {formateDate} from '../../utils/dateUtils';
import memoryUtils from '../../utils/mermoryUtils';
import storageUtils from '../../utils/storageUtils';
import {reqWeather} from '../../api/index';
import menuList from '../../config/menuConfig';
import { Modal } from 'antd';
import LinkButton from '../link-button';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import mermoryUtils from '../../utils/mermoryUtils';
class Header extends Component{
    state={
        currentTime:formateDate(Date.now()),//时间
        weather:''//天气
    }
// 第一次render（）之后执行一次，全程只执行一次
// 一般在此执行异步操作：发ajax请求/启动定时器
    componentDidMount(){
        this.getTime();
        // 获取时间
        this.getWeather();
        // 获取天气
    }
// 当前组件卸载之前调用
    componentWillUnmount(){
        // 清除定时器
        clearInterval(this.intervalId);
    }
    //如果在组件被销毁时不清除定时器，会导致报错
    /*
    index.js:1 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but 
    it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method
     */ 
    // 因为react组件已经被销毁，但是此时的异步操作也就是现在的定时器，还会在异步完成后执行setState的操作，但是组件销毁之后已经没有了state所以导致了报错

    getTime=()=>{
        // 每隔1s获取当前时间,并更新状态数据，currentTime
        this.intervalId=setInterval(() => {
            const currentTime=formateDate(Date.now());
            this.setState({currentTime});
        }, 1000);
    }
    getWeather=async()=>{
        const weather=await reqWeather();
        this.setState({weather});
    }
    getTitle=()=>{
        const path=this.props.location.pathname;//获取当前路径
        let title;
        menuList.forEach(item=>{
            if(item.key===path){
                title=item.title
            }else if(item.children){
                item.children.forEach(citem=>{
                    if(path.indexOf(citem.key)===0){
                        title=citem.title
                    }
                })
            }
        })
        return title;
    }
    // 退出登录，显示确认框；
    logout=()=>{
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗？',
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
                // console.log('ok');
                //删除保存的user数据
                storageUtils.removeUser();
                mermoryUtils.user={};
                //跳转到login
                this.props.history.replace('/login')
            }
          });
    }
    render(){
        const {currentTime,weather}=this.state;
        const username=memoryUtils.user.username;
        const title=this.getTitle();
        // console.log(title);
        // 不能把这一步放在componentwillMount或DidMount中，这样跳转路由时不会重新渲染，标题不会改变
        return(
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton herf='javascript:' onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        {/* <img src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.25pp.com%2Fuploadfile%2Fsoft%2Fimages%2F2015%2F0508%2F20150508092836442.jpg&refer=http%3A%2F%2Fimg.25pp.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1630897966&t=73adddc2371d730ae85275ec961a2a4f' alt='weather'/> */}
                        <span style={{marginLeft:10,color:'green'}} >{weather} </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);
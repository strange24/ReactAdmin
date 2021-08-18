import React ,{Component} from 'react';
import './left-nav.less';
import {Link,withRouter} from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { Menu } from 'antd';
// import {
//   AppstoreOutlined,
//   HomeOutlined,
//   PieChartOutlined,
//   BarsOutlined,
//   ToolOutlined,
//   UserOutlined,
//   SafetyCertificateOutlined,
//   AreaChartOutlined,
//   BarChartOutlined,
//   LineChartOutlined,
// } from '@ant-design/icons';
import { Icon } from '@ant-design/compatible';
import menuList from '../../config/menuConfig'; 
import mermoryUtils from '../../utils/mermoryUtils';
const { SubMenu } = Menu;
class LeftNav extends Component{
    // LeftNav这个组件不是路由组件props中没有history，location，match属性


    
    // 动态生成左侧导航
    // 使用递归解决subMenu中Menu.item的问题+map
    getMenuNodes_map=(menuList)=>{
        return menuList.map(item=>{
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                           <span> {item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else{
                // 查找一个与当前请求路径匹配的子Item
                console.log(this.openkey);                  
                return (
                    <SubMenu key={item.key} title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                    }> 
                    {this.getMenuNodes(item.children)}
                     </SubMenu>
                )
            }
        })
    }
    // 根据menu的数据数组生成对应的标签数组
    // 使用reduce实现
    getMenuNodes=(menuList)=>{
        const path=this.props.location.pathname;
        
        return menuList.reduce((pre,item)=>{
            if(this.hasAuth(item)){
                if(!item.children){
                    pre.push((
                        <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                           <span> {item.title}</span>
                        </Link>
                    </Menu.Item>          
                    ))
                }else{
                    const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0);
                    if(cItem){
                    this.openkey=item.key;                      
                    }
                    pre.push((
                        <SubMenu key={item.key} title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }> 
                        {this.getMenuNodes(item.children)}
                         </SubMenu>
                    ))
                }
            }
            
            return pre;
        },[])
    }
    // 判断当前登录用户对item是否有权限
    hasAuth=(item)=>{   
        const {key,isPublic}=item;
        const menus=mermoryUtils.user.role.menus;
        const username=mermoryUtils.user.username;
        //如果是admin----直接通过
        // 如果当前item是公开的，直接通过
        // 当前用户有次item的权限:key有没有meuns中
        if(username==='admin'||isPublic||menus.indexOf(key)!==-1){
            return true;
        }else if(item.children){//如果当前用户有此item某个子item的权限
            return !!item.children.find(child=>menus.indexOf(child.key)!==-1);

        }
        return false;
    }
    componentWillMount(){
        this.menuNodes=this.getMenuNodes(menuList);
    }
    // 在第一次人的人之前执行一次，为第一个render（）准备数据（必须同步）
    render(){ 
        let path=this.props.location.pathname;
        if(path.indexOf('/product')===0){//表示页面在product或在她的子路由页面
            path='/product';
        }
        // 获取需要打开菜单项的key
        const subpath=this.openkey;
        return(
            <div  className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt='' />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    // defaultSelectedKeys={[path]}
                    // 如果使用第一个在访问'/'时不会自动点中首页
                    selectedKeys={[path]}
                    // 随时更新选中的菜单项
                    defaultOpenKeys={[subpath]}
                    mode="inline"
                    theme="dark"
                    >
                        {/* 可以用路由名当作key值，不会重复/home */}
                    {/* <Menu.Item key="1" icon={<HomeOutlined />}>
                        
                        <Link to='/home'>
                        首页
                        </Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<AppstoreOutlined />} title="商品">
                        <Menu.Item key="2" icon={<BarsOutlined />}><Link to='/category'>品类管理</Link></Menu.Item>
                        <Menu.Item key="3" icon={<ToolOutlined />}><Link to='/product'>商品管理</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="4" icon={<UserOutlined />}>
                        <Link to='/user'>
                        用户管理
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<SafetyCertificateOutlined />}>
                        <Link to='./role'>
                        角色管理
                        </Link>
                    </Menu.Item>
                    <SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形图表"> 
                        <Menu.Item key="6" icon={<PieChartOutlined />}>
                            <Link to='/pie'>
                            扇形图
                            </Link>
                            </Menu.Item>
                        <Menu.Item key="7" icon={<BarChartOutlined />}><Link to='/bar'>柱形图</Link></Menu.Item>
                        <Menu.Item key="8" icon={<LineChartOutlined />}><Link to='/line'>折线图</Link></Menu.Item>
                    </SubMenu>*/}
                    {this.menuNodes}
        </Menu>
            </div>
        )
    }
}


// withRouter是一个高阶组件
// 作用：包装非路由组件，返回一个新的组件
// 新的组件向非路由组件传递三个属性：history，location，match
export default withRouter( LeftNav);
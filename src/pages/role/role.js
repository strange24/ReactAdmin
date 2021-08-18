import React,{Component} from 'react';
import {Card,Button,Table,Modal, message} from 'antd';
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api';
import { PAGE_SIZE } from '../../utils/constants';
import AddForm from './add-form';
import AuthForm from './auth-form';
import storageUtils from '../../utils/storageUtils';
import { formateDate } from '../../utils/dateUtils';
import mermoryUtils from '../../utils/mermoryUtils';
class Role extends Component{
    state={
        roles:[],//所有角色的列表
        role:{},//选中的role
        showStatus:0,//渲染框的显示   0==>不显示渲染框，1===>显示添加角色页面 ，2===>显示管理权限界面
        loading:false,//     
    }
    constructor(props){
        super(props);

        this.auth=React.createRef();
    }
    initColumns=()=>{
        this.columns=[
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:formateDate
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:formateDate
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            },
        ]
    }
    getRoles=async()=>{
        this.setState({loading:true});
        const result=await reqRoles();
        this.setState({loading:false});
        if(result.status===0){
            // console.log(result.data);
            const roles=result.data;
            this.setState({
                roles
            })
        }
    }
    onRow=(role)=>{
        return {
            onClick:event=>{
                // console.log(role);
                this.setState({
                    role
                })
            }
        }
    }
    // 添加角色
    addRole=()=>{
        this.form.validateFields(async (err,values)=>{
            if(!err){
                // 隐藏确认框
                this.setState({showStatus:0});
                // 发送请求添加分类
                const roleName=this.form.getFieldValue('roleName');
                const result=await reqAddRole(roleName);
                // 清除输入数据,否则下次输入的时候会默认显示
                this.form.resetFields();
                // 重新显示列表
                if(result.status===0){
                    message.success('添加成功');
                    // this.getRoles();
                    // const role=result.data;
                    // const roles=[...this.state.roles];
                    // roles.push(role);
                    // this.setState({
                    //     roles
                    // })
                    // 更新roles状态：基于原本状态数据更新
                    const role=result.data;
                    this.setState(({
                        roles:[...this.state.roles,role]
                    }))
                }else{
                    message.error('添加失败');
                }
            }
        })
    }
    // 更新角色
    updateRole=async()=>{
        const role=this.state.role;
        // console.log(role);
        //获取角色更新的权限
        // const menus=this.auth.current.getMeuns();
        // console.log(this.auth.current)
        const menus=this.auth.current.getMenus();
        // console.log(menus);
        role.menus=menus;
        // console.log(this.auth.current.getMenus());
        const name=storageUtils.getUser().username;
        // console.log(storageUtils.getUser());
        role.auth_name=name;
        const result =await reqUpdateRole(role);
        const user=mermoryUtils.user;
        console.log(user);
        console.log(role);
        if(result.status===0){
          
            // 如果当前更新的是自己角色的权限，强制退出
            if(user.role._id===role._id){
                message.success('当前用户角色权限修改了，请重新登录');
                mermoryUtils.user={};
                storageUtils.removeUser();
                this.props.history.replace('/login');
            }else{
                message.success('更新权限成功');
                this.setState({
                    showStatus:0
                })
                this.getRoles();
            }       
        }else{
            message.error('更新权限失败');
        }
        
    }
    handleCancel=()=>{
        this.setState({
            showStatus:0
        })
        if(this.form){
            this.form.resetFields();
        }
    }
    showAdd=()=>{
        this.setState({
            showStatus:1
        })
    }
    showUpdate=()=>{
        this.setState({
            showStatus:2
        })
    }
    componentWillMount(){
        this.initColumns();
    }
    componentDidMount(){
        this.getRoles();
    }
    render(){
        const {roles,role,showStatus} =this.state;
        const title=(
            <span>
                <Button type='primary' style={{marginRight:10}} onClick={this.showAdd} >创建角色</Button>
                <Button type='primary' disabled={role._id?false:true} onClick={this.showUpdate}>设置角色权限</Button>
            </span>
        )
        return (
        <Card title={title}>
             <Table 
                columns={this.columns}
                dataSource={roles}  
                bordered rowKey='_id'
                pagination={{defaultPageSize:PAGE_SIZE}}
                loading={this.state.loading}
                rowSelection={{
                    type:'radio',
                    selectedRowKeys:[role._id],
                    rowSelection:(role)=>{
                        this.setState({
                            role
                        })
                    }
                }}
                onRow={this.onRow}
                style={{cursor:'pointer'}}
                />; 
                 <Modal title="添加角色" 
                    visible={showStatus===1} 
                    onOk={this.addRole} 
                    onCancel={this.handleCancel} >
                   <AddForm 
                   setForm={(form=>{this.form=form})}
                   />
                 </Modal>
                 <Modal title="设置角色权限" 
                    visible={showStatus===2} 
                    onOk={this.updateRole} 
                    onCancel={this.handleCancel} >
                    <AuthForm 
                    role={role}
                    ref={this.auth}
                    />
                 </Modal>
        </Card>
        )
    }
}
export default Role;
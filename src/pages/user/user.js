import React,{Component} from 'react';
import {Card,Table,Button,Modal, message} from 'antd'; 
import {formateDate} from '../../utils/dateUtils';
import LinkButton from '../../components/link-button';
import {reqGetUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api';
import UserForm from './user-form';
class User extends Component{
    state={
        users:[],
        showStatus:0,//0==不显示，1===》显示创建 ，2===》显示修改
        loading:false,
        roles:[],
        roleNames:{},
    } 
    handleCancel=()=>{
        this.setState({
            showStatus:0
        })
        this.form.resetFields();
    }

    initColumns=()=>{
        this.columns=[
              {
                title: '用户名',
                dataIndex: 'username',
              },
              {
                title: '邮箱',
                dataIndex: 'email',
              },
              {
                title: '电话',
                dataIndex: 'phone',
              },
              {
                title: '注册时间',
                dataIndex: 'create_time',
                render:formateDate
              },
              {
                  title:'所属角色',
                  dataIndex:'role_id',
                  render:(role_id)=>this.roleNames[role_id]
              },
              {
                  title:'操作',
                  render:(user)=>(
                      <span>
                          <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                          <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                      </span>
                  )
              }
        ]
    }
    // 显示更新用户的渲染框
    showUpdate(user){
        this.setState({
            showStatus:2
        })
        this.user=user;
        // 保存user
    }
    // 显示添加用户的渲染框
    showAdd=()=>{
        this.user={};
        // 去除前面保存的user
        this.setState({
            showStatus:1
        })
        
    }
    // 根据roles数组，生成包含所有角色名的对象（属性名用角色id值）
    initRoleNames=(roles)=>{
        this.roleNames=roles.reduce((pre,value)=>{
            pre[value._id]=value.name;
            return pre;
        },{})
    }
    // 获取所有用户
    getUsers=async()=>{
        this.setState({
            loading:true
        });
        const result=await reqGetUsers();
        this.setState({loading:false});
        if(result.status===0){
            const {users,roles}=result.data;
            // console.log(users);
            // console.log(roles);
            this.initRoleNames(roles);
            const {roleNames}=this;
            this.setState({
                users,
                roles,
                roleNames
            });
        }else{
            message.error('出错了，请稍后再试');
        }
    }
    // 删除用户
    deleteUser=(user)=>{
        Modal.confirm({
            title:`确认删除${user.username}吗?`,
            onOk:async ()=>{
                const {_id} =user;
                const result=await reqDeleteUser(_id);
                if(result.status===0){
                    message.success('删除成功');
                    this.getUsers();
                }else{
                    message.error('删除失败');
                }
            }
        })
    }
    // 添加用户/更新用户
    addOrUpdateUser=async()=>{
        const username=this.form.getFieldValue('username');
        const password=this.form.getFieldValue('password');
        const email=this.form.getFieldValue('email');
        const role_id=this.form.getFieldValue('role_id');
        const phone=this.form.getFieldValue('phone');
        const user={};
        if(this.user){
            user._id=this.user._id;
        }
        user.username=username;
        user.password=password;
        user.email=email;
        user.phone=phone;
        user.role_id=role_id;
        // console.log(user);
        const result=await reqAddOrUpdateUser(user);
        if(result.status===0){
            if(user._id){
                message.success('修改成功');
            }else{
                message.success('添加成功');
            }
            this.setState({showStatus:0});
            this.getUsers();
        }
        this.form.resetFields();
    }
    componentWillMount(){
        this.initColumns();
    }
    componentDidMount(){
        this.getUsers();
    }
    render(){
        const {users,showStatus,roles}=this.state;
        const title=<Button type='primary' onClick={this.showAdd}>创建用户</Button>     
        return (
         <Card title={title}>
                <Table 
                dataSource={users} 
                columns={this.columns}  
                bordered rowKey='_id'
                pagination={{defaultPageSize:5,showQuickJumper:true}}
                loading={this.state.loading}
                />;
                <Modal title={showStatus===1?"创建用户":"修改用户"} 
                    visible={showStatus===1||showStatus===2} 
                    onOk={this.addOrUpdateUser} 
                    onCancel={this.handleCancel} >
                    <UserForm 
                    setForm={form=>this.form=form}
                    roles={roles}
                    user={this.user}
                    />
                 </Modal>
                 {/* <Modal title="修改用户" 
                    visible={showStatus===2} 
                    onOk={this.updateUser} 
                    onCancel={this.handleCancel} >
                 </Modal> */}
         </Card>
        )
    }
}
export default User;
import React,{Component} from 'react';
import { Form } from '@ant-design/compatible';
import {Input,Select} from 'antd';
import PropTypes from 'prop-types';
const Item=Form.Item;
const Option=Select.Option;
// 添加用户  更新用户
class UserForm extends Component{
    static propTypes={
        setForm:PropTypes.func.isRequired,//子组件向父组件传递Form
        roles:PropTypes.array.isRequired,//传递角色列表
        user:PropTypes.object||{}
    }
    getRoles=()=>{
        return this.props.roles.map((role)=>(
            <Option value={role._id} key={role._id}>{role.name}</Option>
        ))
    }
    componentWillMount(){
        this.props.setForm(this.props.form);
    }
    render(){
        const {getFieldDecorator}=this.props.form;
        const formItemLayout={
            labelCol:{span:3},
            wrapperCol:{span:12}
        }
        const {user}=this.props;
        return (
            <Form  {...formItemLayout}>
            <Item label='用户名:' name='username' style={{alignItems:'center',marginTop:20}}>
                {
                     getFieldDecorator('username',{
                        initialValue:user.username,
                        rules:[
                            { required: true,whitespace:true, message: '用户名必须输入' },
                                {min:4,message:'用户名最少4位'},
                                {max:12,message:'用户名最多12位'},
                                {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文，数组或者下划线组成'}
                        ]
                     })(
                        <Input placeholder='请输入用户名' style={{width:400,marginLeft:10}}/>
                     )
                }
            </Item>
            {
                user._id ?null:(
                    <Item label='密码:' name='password' style={{alignItems:'center',marginTop:20}}>
                    {
                         getFieldDecorator('password',{
                            initialValue:user.password,
                            rules:[
                                {required:true,message:'密码不能为空'},
                                {min:4,message:'密码长度不能小于4'},
                                {max:12,message:'密码长度不能大于12'},
                                {pattern:/^[a-zA-Z0-9_]+$/,message:'密码必须是英文，数字或下划线组成'}
                            ]
                         })(
                            <Input placeholder='请输入密码' style={{width:400,marginLeft:10}} type='password'/>
                         )
                    }
                </Item>
                )
            }
            <Item label='手机号:' name='phone' style={{alignItems:'center',marginTop:20}}>
                {
                     getFieldDecorator('phone',{
                        initialValue:user.phone,
                        rules:[
                            {required:true,message:'手机号不能为空'},
                            {pattern:/[0-9]{11}/,message:'手机号必须为11位数字'}
                        ]
                     })(
                        <Input placeholder='请输入手机号' style={{width:400,marginLeft:10}}/>
                     )
                }
            </Item>
            <Item label='邮箱:' name='email' style={{alignItems:'center',marginTop:20}}>
                {
                     getFieldDecorator('email',{
                        initialValue:user.email,
                        rules:[
                            {required:true,message:'邮箱不能为空'},
                            {type:'email',message:'请按照邮箱标准填写'}
                        ]
                     })(
                        <Input placeholder='请输入邮箱' style={{width:400,marginLeft:10}}/>
                     )
                }
            </Item>
            <Item label='角色:' name='role_id' style={{alignItems:'center',marginTop:20}}>
                {
                     getFieldDecorator('role_id',{
                        initialValue:user.role_id,
                     })(
                        <Select 
                        placeholder=''
                        style={{width:400,marginLeft:10}}
                        >
                            {this.getRoles()}
                        </Select>
                     )
                }
            </Item>
           
        </Form>
        )
    }
}
export default Form.create()(UserForm);
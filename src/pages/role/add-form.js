import React,{Component} from 'react';
import {Input} from 'antd';
import { Form } from '@ant-design/compatible';
import PropTypes from 'prop-types';

const Item=Form.Item;

class AddForm extends Component{
    static propTypes={
        setForm:PropTypes.func.isRequired
    }
    componentWillMount(){
        this.props.setForm(this.props.form);
    }
    render(){
        const {getFieldDecorator}=this.props.form;
        return(
            <Form >
                <Item name='roleName' label='角色名称:' style={{alignItems:'center'}}>
                    {
                         getFieldDecorator('roleName',{
                            rules:[
                                {required:true,message:'角色名称不能为空'}
                            ]
                         })(
                            <Input placeholder='请输入角色名称' style={{width:400,marginLeft:10}}/>
                         )
                    }
                </Item>
               
               
            </Form>
        )
    }
}
export default Form.create()(AddForm);
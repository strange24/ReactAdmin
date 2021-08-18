import React,{Component} from 'react';
import {Select,Input} from 'antd';
import { Form } from '@ant-design/compatible';
import PropTypes from 'prop-types';


const Item=Form.Item;
const Option=Select.Option;
class AddForm extends Component{
    static propTypes={
        categorys:PropTypes.array.isRequired,//一级分类的数组
        parentId:PropTypes.string.isRequired,//父分类id
        setForm:PropTypes.func.isRequired
    }
    componentWillMount(){
        this.props.setForm(this.props.form);
    }
    render(){
        const {getFieldDecorator}=this.props.form;
        const {categorys,parentId}=this.props;
        return(
            <Form 
               name="select-form"
               initialValues={{
                remember: true,
            }}>
                <Item>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:parentId
                        })(
                        <Select style={{marginBottom:15,width:400}}>
                            <Option value='0'>一级分类</Option>
                            {
                                categorys.map(item=><Option value={item._id}>{item.name}</Option>)
                            }
                        </Select>)
                    }
                </Item>
                <Item name='categoryName'>
                    {
                         getFieldDecorator('categoryName',{
                            rules:[
                                {required:true,message:'分类名称必须输入'}
                            ]
                         })(
                            <Input placeholder='请输入分类名称' style={{width:400}}/>
                         )
                    }
                     
                </Item>
               
               
            </Form>
        )
    }
}
export default Form.create()(AddForm);
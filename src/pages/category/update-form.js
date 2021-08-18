import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Input} from 'antd';
import {Form} from  '@ant-design/compatible';
import './category.less';
const Item=Form.Item;

class UpdateForm extends Component{
    static propTypes={
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }
    componentWillMount(){
        // 将子组件的form传递给负组件
        this.props.setForm(this.props.form)
    }
    render(){
        const {categoryName} =this.props;
        const {getFieldDecorator}=this.props.form;
        return(
            <Form >
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:categoryName,
                            rules:[
                                {required:true,message:'分类名称必须输入'}
                            ]
                        })(<Input placeholder='请输入分类名称' style={{width:400 }}/>)
                    }
                     
                </Item>
               
               
            </Form>
        )
    }
}
export default Form.create()(UpdateForm);
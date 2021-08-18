import React,{Component} from 'react';
import {Card,Input, Cascader ,Upload,Button, message} from 'antd';
import { Form } from '@ant-design/compatible';
import LinkButton from '../../components/link-button';
import { Icon } from '@ant-design/compatible';
import { reqCategorys,reqAddOrUpdateProduct} from '../../api';
import PicturesWall from './pictures-wall';
import RichTextEditor from './RichTextEditor';
import './product.less';
const Item=Form.Item;
const { TextArea } = Input;
// 商品分类的对象
// const optionLists = [
//     {
//       value: 'zhejiang',
//       label: 'Zhejiang',
//       isLeaf: false,  //是否是分支
//     },
//     {
//       value: 'jiangsu',
//       label: 'Jiangsu',
//       isLeaf: false,
//     },
//   ];
// Product的添加和更新子路由
class ProductAddUpdate extends Component{
    state={
        options:[],
        pName:'',//一级分类名称
        name:'',//二级分类名称
    }
    // 获取一级/二级分类列表
    //async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
    constructor(props){
        super(props)
        // 创建用来保存ref标识的标签对象的容器
       this.pw = React.createRef();//图片组件
       this.rte=React.createRef();//商品详情
    }
    getCategorys=async (parentId)=>{
       const result=await reqCategorys(parentId);
       if(result.status===0){
           const categorys=result.data;
           if(parentId==='0'){
               //一级分类列表
               this.initOptions(categorys);
           }else{//二级分类列表
            return categorys;
           }
       }
    }
    initOptions=async (categorys)=>{
        // 根据categorys数组生成options数组
        const options=categorys.map((c)=>({
            value:c._id,
            label:c.name,
            isLeaf:false,
        }))
        // 如果是更新二级分类列表下的商品
        const {product,isUpdate}=this;
        const {pCategoryId,categoryId}=product;
        // console.log(pCategoryId);
        // console.log(product);
        if(isUpdate&&pCategoryId!=0){
            // 获取对应的二级分类列表
          const subCategorys=await this.getCategorys(pCategoryId);
        //   console.log(subCategorys);
        //   console.log(pCategoryId);
        //   console.log(subCategorys);
        //   生成二级下拉列表
          const childOptions=subCategorys.map((c)=>({
            value:c._id,
            label:c.name,
            isLeaf:true,
        }))
        // 找到当前商品对应的一级option对象
        const targetOption=options.find(option=>option.value===pCategoryId);
        targetOption.children=childOptions;
        }


        // 更新options数组
        this.setState({
            options   
        })
    }
    submit= ()=>{
        // 进行表单验证,如果通过了,才发送请求
        this.props.form.validateFields(async(error,values)=>{
            if(!error){
                // 收集数据,并封装成product对象
                const {name,desc,price,categoryIds}=values;
                let pCategoryId,categoryId;
                if(categoryIds.length===1){
                    pCategoryId='0';
                    categoryId=categoryIds[0];
                }else{
                    pCategoryId=categoryIds[0];
                    categoryId=categoryIds[1];
                }
                // 发送ajax请求
                // console.log(values);
                const imgs=this.pw.current.getImgs();
                const detail=this.rte.current.getDetail();
                // console.log(this.pw.current.getImgs());
                // console.log(detail);
                // console.log(imgs);
                const product={
                    name,
                    price,
                    desc,
                    pCategoryId,
                    categoryId,
                    imgs,
                    detail
                }
                console.log(product);
                // alert('success');
                if(this.isUpdate){
                    product._id=this.product._id;                   
                }
              // 调用接口请求函数去添加/更新
              const result=await reqAddOrUpdateProduct(product);  
              // 根据结果提示
              if(result.status===0){
                //   if(product._id){
                //       message.success('商品修改成功!');
                //   }else{
                //       message.success('商品添加成功!');
                //   }
                message.success(`${this.isUpdate?'更新':'添加'}商品成功!`);
                  this.props.history.goBack();
              }else{
                  message.error('出错了');
              }
            }
        })
    }
    // 验证价格的自定义验证函数
    validatePrice=(rule,value,callback)=>{
        if(value*1>0){
            callback();
        }else{
            callback('价格必须大于0');
        }
    }
    // 用于加载下一级列表的回调函数
    loadData=async (selectedOptions)=>{
        //得到选择的option
        const targetOption=selectedOptions[0];
        // 显示loading
        targetOption.loading=true;
        // 根据选中的分类，来发送请求获取二级分类列表
        const subCategorys=await this.getCategorys(targetOption.value);
            // 隐藏loading
        targetOption.loading=false;
        if(subCategorys&&subCategorys.length>0){
            // 生成一个二级列表的options
            const childOptions=subCategorys.map((c)=>({
                value:c._id,
                label:c.name,
                isLeaf:true,
            }))
            // 关联到当前的option上
            targetOption.children=childOptions;
        }else{//当前选中的分类没有二级列表
            targetOption.isLeaf=true;
        }
        // 更新options
        this.setState({
            // options:this.state.options
            options:[...this.state.options]
        })

    }
    onChange=()=>{

    }
    componentWillMount(){
        const product=this.props.location.state;//如果是添加没值，否则有值
        this.isUpdate=!!product;
        this.product=product||{};
    }
    componentDidMount(){
        this.getCategorys('0');
    }
    render(){
        const {isUpdate,product}=this;
        const {pCategoryId,categoryId,imgs,detail}=product;
        const categoryIds=[];
        if(isUpdate){
            //如果是更新
            if(pCategoryId==='0'){
                // 一级分类下面的商品
                categoryIds.push(categoryId);
            }else{
                // 二级分类下面的商品
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);

            }
            console.log(imgs);
           
        }
        // 指定Item布局的配置对象
        const layout = {
            labelCol: { span: 2 },//左侧labal的宽度
            wrapperCol: { span: 8 ,},//指定右侧包裹的宽度
          }
        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{marginRight:10,fontSize:20}}/>
                    <span style={{color:'black'}} >{isUpdate?'修改商品':'添加商品'}</span>
                </LinkButton>
            </span>
        )
        const {getFieldDecorator}=this.props.form;
        return (
            <Card title={title} className='product-addUpdata'>
                <Form {...layout} className='addUpdata-form'>
                    <Item label='商品名称:' style={{textAlign:'right',placeItems:'center',marginRight:100}} >
                      {
                       getFieldDecorator('name',{
                        initialValue:product.name,
                        rules:[
                            {required:true,message:'必须输入商品名称'}
                        ]
                       }) (<Input/>)
                     }
                    </Item>
                    <Item label='商品描述:' style={{textAlign:'right',placeItems:'center',marginRight:100}}  >
                        {/* <Input/> */}
                        {
                            getFieldDecorator('desc',{
                                initialValue:product.desc,
                                rules:[
                                    {required:true,message:'必须输入商品描述'}
                                ]
                            })(<TextArea  autoSize={{minRows:2,maxRows:6}}/>)
                        }
                        
                    </Item>
                    <Item label='商品价格:' style={{textAlign:'right',placeItems:'center',marginRight:100}}  >
                    {
                            getFieldDecorator('price',{
                                initialValue:product.price,
                                rules:[
                                    {required:true,message:'必须输入商品价格'},
                                    {validator:this.validatePrice}
                                ]
                            })(<Input type='number' addonAfter='元'/>)
                        }
                        
                    </Item>
                    <Item label='商品分类:' style={{textAlign:'right',placeItems:'center',marginRight:100}}  >
                        {
                            getFieldDecorator('categoryIds',{
                                initialValue:categoryIds,
                                rules:[
                                    {required:true,message:'必须指定商品分类'}
                                ]
                            })(
                            <Cascader
                            options={this.state.options}
                            loadData={this.loadData} //需要显示的列表数据
                            onChange={this.onChange} //指定当选择某个列表项,加载下一级列表的监听回调
                        />
                            )
                        }
                        
                    </Item>
                    <Item label='商品图片:' style={{textAlign:'right',placeItems:'center',marginRight:100}}  >
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label='商品详情:' style={{textAlign:'right',placeItems:'center',marginRight:100}} labelCol={{span:2}} wrapperCol={{span:20}}  >
                        <RichTextEditor  ref={this.rte} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit} >提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate);


/*
1.子组件调用父组件的方法:将父组件的方法以函数属性的形式传递给子组件,子组件就可以调用
2.父组件调用子组件方法:在父组件中通过ref得到子组件标签对象(也就是组件对象),调用其方法

*/
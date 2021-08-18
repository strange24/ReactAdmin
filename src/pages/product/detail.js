import React,{Component} from 'react';
import {Card,List} from 'antd';
import { Icon } from '@ant-design/compatible';
import LinkButton from '../../components/link-button';
import {BASE_IMG_URL} from '../../utils/constants';
import {reqCategory} from '../../api';
const Item=List.Item;
// Product的详情子路由组件
class ProductDetail extends Component{
    state={
        cName1:'',//一级分类
        cName2:'',//二级分类
    }
    async componentDidMount(){
        // 得到当前商品的分类ID
        const {categoryId,pCategoryId}=this.props.location.state.product;
        // 获取分类名称
        // if(pCategoryId==='0'){
        //     this.getCategoryName(categoryId);
        // }else{
        //     this.getCategoryName(pCategoryId);
        //     this.getCategoryName(categoryId);
        // }

    //    const result1=await reqCategory(pCategoryId);
    //    const result2=await reqCategory(categoryId);
    // 通过多个await方式发多个请求，后面一个请求是在前一个请求成功返回之后才发送请求，这样效率偏低
    // 一次性发送多个请求，只有都成功了，在正常处理)
        if(pCategoryId==='0'){
            const result=await reqCategory(categoryId);
            const cName1=result.data.name;
            this.setState({cName1});
        }else{
            // 一次性发送多个请求，只有都成功，在正常处理
            const results=await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)]);
            const cName1=results[0].data.name;
            const cName2=results[1].data.name;
            this.setState({
                cName1,
                cName2
            })
        }
    }

    // 获取分类名称，这个方法一样的在前一个请求成功之后才发送下一个请求，这样效率一样很低
    // getCategoryName= async(categoryId)=>{
    //     const result=await reqCategory(categoryId);
    //     if(result.status===0){
    //         const {parentId,name}=result.data;
    //         if(parentId==='0'){
    //             this.setState({cName1:name});
    //         }else{
    //             this.setState({cName2:name});
    //         }
    //     }
    // }
    render(){

        // 读取携带过来的product
        const {name,price,desc,detail,imgs}=this.props.location.state.product;
        // console.log(this.props.location.state.product);
        console.log(imgs);
        const {cName1,cName2}=this.state;
        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{marginRight:10,fontSize:20}} />
                    <span>商品详情</span>
                </LinkButton>
                
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item className='detail-li'>
                        <span className='detail-left'>商品名称:</span>
                        <span className='detail-right'>{name}</span>
                    </Item>
                    <Item className='detail-li'>
                        <span className='detail-left'>商品描述:</span>
                        <span className='detail-right'>{desc}</span>
                    </Item>
                    <Item className='detail-li'>
                        <span className='detail-left'>价格:</span>
                        <span className='detail-right'>{price}元</span>
                    </Item>
                    <Item className='detail-li'>
                        <span className='detail-left'>所属分类:</span>
                        <span>{cName1}{cName2?'-->'+cName2:''}</span>
                    </Item>
                    <Item className='detail-li'>
                        <span className='detail-left'>商品图片:</span>
                        <span className='detail-right'>
                            {
                                imgs.map(img=>(
                                    <img  src={BASE_IMG_URL+img} alt='img' key={img}/>
                                )
                                )
                            }
                        </span>
                    </Item>
                    <Item className='detail-li' style={{display:'inline-block'}}>
                        <span className='detail-left'>商品详情:</span>
                        <span className='detail-right' dangerouslySetInnerHTML={{__html:detail}} >   
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}
export default ProductDetail;
import React,{Component} from 'react';
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    Space,
    message,  
} from 'antd';
import LinkButton from '../../components/link-button';
import { Icon } from '@ant-design/compatible';
import {reqProducts,reqSearchProducts,reqUpdateCategory} from '../../api/index';
import {PAGE_SIZE} from '../../utils/constants';
const Option=Select.Option;

// Product的默认子路由组件
class ProductHome extends Component{
    state={
        products:[],//商品的数组
        total:0,//商品的总数量
        loading:false,//是否显示加载
        searchName:'',//搜索的关键字
        searchType:'productName',//搜索的类型
    }
    // 初始化table列的数组
    initColumns=()=>{
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex:'price',
              render:(price)=>  '￥'+price//当前指定了对应的属性，传入的是对应的属性值
            },
            {
                width:100,
                title: '状态',
                // dataIndex: 'status',
                render:(product)=>{
                    const {status,_id}=product;
                    console.log(product);
                    console.log('product.status',status);
                    return (
                    <div>
                        <Button type='primary' onClick={()=>this.getCategoryUpdata(status===1?2:1,_id)}>{status===1?'下架':'上架'}</Button>
                        <span>{status===1?'在售':'已下架'}</span>
                    </div>
                    )
                    
                }
            },
            {
                width:100,
                title: '操作',
                render:(product)=>(
                    <Space>
                        <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>详情</LinkButton>
                        <LinkButton onClick={()=>this.props.history.push('/product/addupdata',product)}>修改</LinkButton>
                    </Space>
                )
              }
          ];
    }
    // 对商品状态的修改
    getCategoryUpdata=async (status,productId)=>{
        const result=await reqUpdateCategory({productId,status});
        console.log(result);
        if(result.status===0){
            message.success('更新成功！');
            this.getProducts(this.pageNum);
        }else{
            message.error('更新失败');
        }
    }
    // 获取指定页码的列表数据显示
    getProducts=async(pageNum)=>{
        this.pageNum=pageNum;
        this.setState({loading:true});

        const {searchName,searchType}=this.state;
        let result;
        // 如果搜索关键字有值，说明我们要搜索分页
        if(searchName){
            result=await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType});
        }else{
            result=await reqProducts(pageNum,PAGE_SIZE);
        }
        this.setState({loading:false});
        if(result.status===0){
            // 取出分页数据，更新状态，显示分页列表
            // console.log(result.data);
            const {total,list}=result.data;
            this.setState({
                total,
                products:list,
            })
        }
    }
    componentWillMount(){
        this.initColumns();
    }
    componentDidMount(){
        this.getProducts(1);
    }
    render(){

        // 取出状态数据
        const {products,total,loading,searchName,searchType}=this.state;
        const columns=this.columns;

        const title=(
            <span>
                <Select 
                value={searchType}
                onChange={value=>this.setState({searchType:value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input 
                placeholder='关键字' 
                style={{width:150,margin:'0 15px'}}
                value={searchName}
                onChange={e=>this.setState({searchName:e.target.value})}
                />
                <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra=(
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdata')}><Icon type='plus'  />添加商品</Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table 
                loading={loading}
                rowKey='_id' 
                dataSource={products} 
                columns={columns}  
                bordered
                pagination={{
                    current:this.pageNum,//指定当前显示的页数
                    defaultPageSize:PAGE_SIZE,
                    showQuickJumper:true,
                    total:total,
                    // onChange:(pageNum)=>this.getProducts(pageNum),
                    onChange:this.getProducts
                    // 可以简化为下面这种写法，因为传入回调函数的实参也是调用函数需要传入的实参所以可以简化为下面这种
                }}
                /> 
            </Card>
        )
    }
}

export default ProductHome;
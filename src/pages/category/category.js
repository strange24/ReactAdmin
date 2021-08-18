import React,{Component} from 'react';
import {Card,Button,Table,Space, message,Modal} from 'antd';
import { Icon } from '@ant-design/compatible';
import LinkButton from '../../components/link-button';
import {reqCategorys,reqUpdateCategory,reqAddCategory} from '../../api/index';
import AddForm from './add-form';
import UpdateForm from './update-form';
class Category extends Component{
   
    state={
        categorys:[],//一级分类列表
        subCateforys:[],//二级分类列表
        loading:false,//是否正在获取数据中
        parentId:'0',//当前需要显示的分类列表的parentId
        parentName:'',//当前需要显示的分类列表的一级列表名称
        showStatus:0,//标识添加/更新确认框是否显示，0：都不显示，1：显示添加，2：显示更新
    }


    //初始化列数据
    initColumns=()=>{
        this.columns = [
            {
              title: '分类名称',
              dataIndex: 'name',//显示数据对应的属性名
            },
            {
              title: '操作',
              width:300,
              render:(category)=>(//返回需要显示的界面标签
                  <Space>
                      <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
                      {/* 如何向事件回调函数传递参数：先定义一个箭头函数，在函数种调用处理的函数并传递数据，在react中，onClick会在渲染中就执行，在外面包裹一层函数可以在点击时执行处理的函数 */}
                      {this.state.parentId==='0'?<LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton>:null}
                      {/* 只有在一级分类的时候才显示这个 */}
                      
                  </Space>
              )
            }]
    }
    showSubCategorys=(category)=>{
        // 显示指定一级分类对象的二级分类列表
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{//这个回调函数在数据更新且重新render（）完成后执行
            this.getCategorys();
        })
        // setstate（）不能立即获取最新的状态，因为setstate（）是异步更新状态的
    }
    /*
        异步获取一级/二级分类列表显示
        parentId：如果没有指定根据状态中的parentId请求，如果指定了用指定的parentId请求
    */
    getCategorys=async (parentId)=>{


        //在发送请求前，显示loading
        this.setState({loading:true});

        parentId=parentId?parentId:this.state.parentId;
        //异步ajax请求，获取数据一级/二级
        const result=await reqCategorys(parentId);
        //在请求完成后，隐藏loading
        this.setState({loading:false});
        if(result.status===0){
            const categorys=result.data;
            if(parentId==='0'){
                this.setState({categorys});
            }else{
                this.setState({subCateforys:categorys})
            } 
        }else{
            message.error('获取分类列表失败！');
        }

    }
    backToParent=()=>{
        // 更新为显示一级列表的状态
        this.setState({
            parentId:'0',
            parentName:'',
            subCateforys:[]
    })
    }
    // 隐藏确定框
     handleCancel = () => {
          // 清除输入数据
        this.form.resetFields();
        // 隐藏确认框
        this.setState({
            showStatus:0
        })
      };
      addCategory=()=>{
        //   添加分类
        this.form.validateFields(async (err,values)=>{
            if(!err){
                // 隐藏确认框
                this.setState({showStatus:0});
                // 发送请求添加分类
                const categoryName=this.form.getFieldValue('categoryName');
                const parentId=this.form.getFieldValue('parentId');
                const result=await reqAddCategory(categoryName,parentId);
                // 清除输入数据
                this.form.resetFields();
                // 重新显示列表
                if(result.status===0){
                    if(parentId===this.state.parentId){
                        // 重新获取当前分类列表显示
                    this.getCategorys();                
                    }else if(parentId==='0'){
                        // 在某一个二级列表中添加一级列表
                        this.getCategorys('0');
                    }

                }
            }
        })

        
      }
      updateCategory= ()=>{
        //   更新分类 
        // 进行表单验证，只有通过了再处理
        this.form.validateFields(async (err,values)=>{
            // values是表单中所有的数据
            if(!err){
                // 隐藏确认框
                this.setState({showStatus:0});
                // 发请求更新分类
                const categoryId=this.category._id;
                // const categoryName=this.form.getFieldValue('categoryName');
                const {categoryName}=values;
                const result=await reqUpdateCategory({categoryId,categoryName});
                // 清除输入数据
                this.form.resetFields();
                if(result.status===0){
                // 重新显示列表
                this.getCategorys();
                }
            }
        })
       
      }
      showAdd=()=>{
        //   显示添加的确认框
        this.setState({
            showStatus:1
        });
      }
      showUpdate=(category)=>{
        //   显示更新的确认框
        this.setState({
            showStatus:2
        })
        //保存分类对象
        this.category=category;
      }
    //为第一次render（）准备数据
    componentWillMount(){
       this.initColumns();
   }
    //执行异步任务：发异步ajax请求   
   componentDidMount(){
       this.getCategorys();
   }
   
    render(){
        // 读取
        // const dataSource = [
        //     {
        //         "parentId":"0",
        //         "_id":"5ca9d6e9b49ef916541160bd",
        //         "name":"服装",
        //         "__v":0
        //     },{
        //         "parentId":"0",
        //         "_id":"5ca9d6e9b49ef916541160be",
        //         "name":"食品",
        //         "__v":0
        //     },{
        //         "parentId":"0",
        //         "_id":"5ca9d6e9b49ef916541160bf",
        //         "name":"玩具",
        //         "__v":0
        //     }
        //   ];
        // card的左侧


        // 读取指定的分类
        const category=this.category||{name:''};
        // 如果还没有指定一个空对象这样才不会报错，如果不要这个，最开始的时候渲染183行传入的category是没有值得会报错，catgory在点击之后才会有
        const {categorys,subCateforys,parentName,parentId,showStatus}=this.state;
        const title=parentId==='0'?'一级分类列表':(
            <span>
                <LinkButton onClick={this.backToParent}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{marginRight:5}}/>
                <span>{parentName}</span>
            </span>
        )
        const extra=(
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus' />
                添加
            </Button>
        )

        return (
            <div>
            <Card title={title} extra={extra} >
                <Table 
                dataSource={parentId==='0'?categorys:subCateforys} 
                columns={this.columns}  
                bordered rowKey='_id'
                pagination={{defaultPageSize:5,showQuickJumper:true}}
                loading={this.state.loading}
                />;
                {/* defaultPageSize===>每页的条数showQuickJumper===>快速跳转 */}
                {/* bordered===>带边框 */}
            </Card>
            <Modal title="添加分类"
             visible={showStatus===1} 
             onOk={this.addCategory} 
             onCancel={this.handleCancel} >
            <AddForm  
            categorys={categorys} 
            parentId={parentId}
            setForm={(form)=>{this.form=form}}
            />
          </Modal>
          <Modal title="更新分类" 
          visible={showStatus===2} 
          onOk={this.updateCategory} 
          onCancel={this.handleCancel} >
            <UpdateForm 
            categoryName={category.name} 
            setForm={(form)=>{this.form=form}}
            />
        </Modal>
        </div>
        )
        
    }
}
export default Category;
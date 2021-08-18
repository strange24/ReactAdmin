import React,{Component,} from 'react';
import {Input,Tree} from 'antd';
import { Form } from '@ant-design/compatible';
import PropTypes from 'prop-types';
import menuList from '../../config/menuConfig';
const Item=Form.Item;
const {TreeNode} =Tree;
class AuthForm extends Component{
    static propTypes={
        role:PropTypes.object.isRequired
    }
    constructor(props){
        super(props);

        const {menus} =this.props.role;
        this.state={
            checkedKeys:menus
        }
    }
   onCheck = (checkedKeys) => {
        // console.log('onCheck', checkedKeys);
        this.setState({checkedKeys})
      };  
    //   为父组件得到最新的menus
    getMenus=()=>{
        // this.state={
        //     checkedKeys:[]
        // }
        return this.state.checkedKeys
    }
    getTreeNodes=(menuList)=>{
        return menuList.reduce((pre,item)=>{
                pre.push({
                    title:item.title,
                    key:item.key,
                    children:item.children?this.getTreeNodes(item.children):null,
                })

            // pre.push(
            //     <TreeNode title={item.title} key={item.key} >
            //         {item.children?this.getTreeNodes(item.children):null}
            //     </TreeNode>
            // )
            // console.log('item.key()',item.key);
            return pre;
        },[])
    }
    componentWillMount(){
        this.treeNode=this.getTreeNodes(menuList);
         this.treeNodes=[{
            title:'平台权限',
            key:'all',
            children:[...this.treeNode]
        }]
        // console.log(this.treeNodes);
        // console.log(treeData);
        // console.log(this.treeNode);
    }
    // 传入新的role时更新chekedKeys
    // 在接受新的props时会执行，且在render之前

    UNSAFE_componentWillReceiveProps(nextProps){
        const menus=nextProps.role.menus;
        // console.log(menus);
        // console.log(nextProps.role);
        // this.state={
        //     checkedKeys:menus
        // }
        // 上面这种给写法在这里可以写，不能再事件回调函数中写
        this.setState({
            checkedKeys:menus
        })
        // 不会导致两次rrender

    }
    render(){
        const {menus}=this.props.role;
        // console.log('render');
        const {role}=this.props;
        const {checkedKeys}=this.state;
        console.log('auth_form render');
        // console.log(role );
        // console.log(menus);
        // console.log(checkedKeys);
        // console.log(role);
        // console.log(role.menus);
        // console.log(role.name);
        // console.log(this.treeNodes);
        return(
            <Form >
                <Item label='角色名称' style={{alignItems:'center'}}>
                    <Input value={role.name} disabled style={{marginLeft:10}} />
                </Item>
                <Item>
                <Tree
                checkable
                // onExpand={onExpand}
                // expandedKeys={expandedKeys}
                // autoExpandParent={autoExpandParent}
                onCheck={this.onCheck}
                // checkedKeys='role'//选中的权限
                // selectable
                // onSelect={onSelect}
                checkedKeys={checkedKeys}
                defaultExpandAll='true' //默认展开全部子节点
                treeData={this.treeNodes}
                >
                    {/* <TreeNode title='平台权限' key='all'>
                     {this.treeNodes}
                    </TreeNode> */}
                </Tree>
                </Item>
            </Form>
        )
    }
}
export default AuthForm;
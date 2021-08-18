import ajax from './ajax'
import jsonp from 'jsonp';
import { message } from 'antd';
// 包含应用中所有请求函数接口
// 每个函数返回值都是promise

// 登录
export const reqLogin=(username,password)=>ajax('/login',{username,password},'POST');
// json请求的接口请求函数
export const reqWeather=()=>{
    return new Promise((resolve,reject)=>{
        const url='	 https://restapi.amap.com/v3/weather/weatherInfo?key=a8b82c8d95a28f3ea4fa38ff55d926bf&city=510100'
        jsonp(url,{},(err,data)=>{
            console.log('jsonp',err,data);
            if(!err&&data.status){
                const {weather} =data.lives[0];
                // console.log(weather,reporttime);
                resolve(weather);
            }else{
                message.error('获取天气信息失败！');
            }
        })
    })
//    jsonp解决ajax跨域原理：
// 1.jsonp只能解决GET类型的ajax的请求跨域问题
// 2.jsonp请求不是ajax请求，二十一般的get请求
// 原理：
/*
浏览器端：动态生成<script>来请求后台接口（src就是接口的url），定义好用于接收响应数据的函数，并将函数名通过请求参数提交给后台（ex：callback=fn）
服务器端：接收到请求处理产生结果数据后，返回一个函数调用的js代码，并将结果数据作为实参传入函数调用
浏览器端：收到响应自动执行函数调用的js代码，也就执行了提前定义好的回调函数，并得到了需要的结果数据
*/
}
// reqWeather();



// 获取一级/二级分类的列表
export const reqCategorys=(parentId)=>ajax('/manage/category/list',{parentId});
// 添加分类
export const reqAddCategory=(categoryName,parentId)=>ajax('/manage/category/add',{categoryName,parentId},'POST');
// 更新分类
export const reqUpdateCategory=({categoryName,categoryId})=>ajax('/manage/category/update',{categoryId,categoryName},'POST');
// 获取商品分页列表
export const reqProducts=(pageNum,pageSize)=>ajax('/manage/product/list',{pageNum,pageSize});
// 搜索商品分页列表
// searchType:搜索的类型，productName/productDesc
export const reqSearchProducts=({pageNum,pageSize,searchName,searchType})=>ajax('/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName,
});
// 获取一个分类
export const reqCategory=(categoryId)=>ajax('/manage/category/info',{categoryId});


// 更新商品的状态（上架/下架操作）
export const reqUpdateStatus=({productId,status})=>ajax('/manage/product/updateStatus',{productId,status},'POST');

// 删除图片
export const reqDeleteImg=(name)=>ajax('/manage/img/delete',{name},'POST');

// 添加商品// 修改商品
export const reqAddOrUpdateProduct=(product)=>ajax(product._id?'/manage/product/update':'/manage/product/add',product,'POST')

// 获取角色列表
export const reqRoles=()=>ajax('/manage/role/list',{});
// 添加角色
export const reqAddRole=(roleName)=>ajax('/manage/role/add',{roleName},'POST');
// 更新角色给角色设置权限
export const reqUpdateRole=(role)=>ajax('/manage/role/update',role,'POST');
//获取角色列表
export const reqGetUsers=()=>ajax('/manage/user/list');
// 添加角色   更新角色
export const reqAddOrUpdateUser=(user)=>ajax(user._id?'/manage/user/update':'/manage/user/add',user,'POST');
// 删除用户
export const reqDeleteUser=(userId)=>ajax('/manage/user/delete',{userId},'POST');
// 发送接口请求函数，ComponentDidMount或者事件回调函数中 
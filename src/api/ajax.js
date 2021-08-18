// 能发送异步ajax请求模块
// 封装axios
// 函数返回值是promise对象

// "proxy":"http://localhost:5000"
// 代理服务器解决跨域问题


// 优化：统一处理请求异常
// 在外层包裹一个自己创建的promise对象，在出错时不适用reject，直接弹出异常信息
// 优化：异步得到的不是response二十response.data，在请求成功时resolve(response.data)

import axios from 'axios';
import {message} from 'antd';
export default function ajax(url,data={},method='GET'){
    // 这里定义了method='GET'====》形参默认值
    return new Promise((resolve,reject)=>{
        let promise;
        // 1.执行异步ajax请求
        if(method==='GET'){
            promise= axios.get(url,//配置对象
                {params:data   })//指定请求参数
        }else{
            promise=axios.post(url,data) 
        }
        // 2.如果成功了，调用resolve
        promise.then(response=>{
            console.log(response);
            resolve(response.data);
            // 直接得到resolve中的数据
        }).catch(error=>{
            message.error('请求出错了'+error.message);
        })
        // 3.如果失败了，不调用reject，提示异常信息

    })
    
}
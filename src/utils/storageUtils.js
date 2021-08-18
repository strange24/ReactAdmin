// 保存到本地
const USER_KEY='user_key';
// import store from 'store';
export default{
    // 保存user
    saveUser(user){
        localStorage.setItem(USER_KEY,JSON.stringify(user));
    },
    // 读取user
    getUser(){
        return JSON.parse(localStorage.getItem(USER_KEY)||'{}');
    },
    // 删除user
    removeUser(){
        localStorage.removeItem(USER_KEY);
    }
}



// // 如果使用store方式
// export default{
//     // 保存user
//     saveUser(user){
//         store.set(USER_KEY,user);
//     },
//     // 读取user
//     getUser(){
//         return store.get(USER_KEY);
//     },
//     // 删除user
//     removeUser(){
//         store.remove(USER_KEY);
//     }
// }
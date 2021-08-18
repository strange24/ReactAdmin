const {override,fixBabelImports,addLessLoader}=require('customize-cra');

module.exports=override(
    // 针对antd实现按需打包，根据import来打包{如：我只使用了antd中的Button和message则打包的时候只打包这两个}（使用babel-plugin-import来打包）
    fixBabelImports('import',{
        libraryName:'antd',
        libraryDirectory:'es',
        style:true, //自动打包相关样式
    }),
    addLessLoader({
        lessOptions:{
            javascriptEnable:true,
            modifyVars:{"@primary-color":'pink'}
        }
    })
);
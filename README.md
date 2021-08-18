# 分页列表
    1.纯前台分页
        请求获取数据：一次性获取所有数据，翻页时不需要再发请求
        请求接口：不需要指定：页码(pageNum)和每页数量（pageSize）
    2.基于后台的分页
        请求获取数据：每次只获取当前页面的数据，翻页时需要再次发送请求
        请求接口：需要指定：页码(pageNum)和每页数量（pageSize）
        响应数据：当前页的数据的数组+总记录数（total）
    3.如何选择？
        基本根据数据的多少来选择

# setState
    1.setState中的回调函数在状态更新且界面更新之后执行
    2.setState(updater[,callback])中upadter有两种写法
        a.函数 this.setState((state)=>{count:state.count+1})
        b.对象 this.setState({count})
    3.需要依赖原状态的改变state建议用函数
      不需要依赖原状态的改变建议使用对象
    4.如果要获取改变状态后的state建议在callback回调函数中执行，callback在状态改变之后执行(setState是异步函数)

## setState更新状态是异步还是同步
    1.取决于setState使用的位置
        a.react相关回调中：异步
        b.其他异步回调中：同步
    2.react相关回调：react生命周期函数，事件回调函数
    3.其他异步回调：Promise回调，定时器回调，原生事件监听回调

    setState的异步是依靠react中的事务来实现的，只有在react相关回调中执行事务才能起到作用

### 异步的setState多次执行的合并（多次执行只会引发一次render）
#### setState(updater[,callback])===>updater函数中接收的state和props都保证为最新，updater的返回值会和state进行浅合并
    count=0;
    update=()=>{
        console.log(this.state.count);0
        this.setState({count:this.state.count+1})
        console.log(this.state.count);0
        console.log(this.state.count);0
        this.setState({count:this.state.count+1})
        console.log(this.state.count);0
    }
    render(){
        cosole.log(this.state.count);1
    }
    count=0;
    update=()=>{
        console.log(this.state.count);0
        this.setState(state=>({count:state.count+1}));
        console.log(this.state.count);0
        console.log(this.state.count);0
        this.setState(state=>({count:state.count+1}));
        console.log(this.state.count);0
    }
    render(){
        cosole.log(this.state.count);2
    }

    1.多次更新状态的合并
        a.setState({}):合并多次更新----多次执行setState，只执行一次render，状态更新合并，组件更新也合并
        b.setState(fn):多次更新---多次执行setState，只执行一次render，状态更新合并，组件更新不合并


# Component和PureComponent
    1.Component存在的问题
        a.父组件重新render（）当前组件也会重新执行render（），即使没有任何变化
        b.当前组件setState（）重新执行render（），即使state没有任何变化

    //用来决定当组件是否应该重新render，如果返回true会重新render否则结束
    //比较新旧props中和state中的数据，如果没有一个变化则返回false否则返回true
    shouldComponentUpdate(nextProps,nextState){
        return true;//会执行组件更新----在Component中默认为true
        return false;//不会执行组件更新
    }
    2.解决Component存在的问题
        a.原因：组件的componentShouldUpdate()默认返回为true，即使数据没有变化render（）都会重新执行
        b.办法1：重写shouldComponentUpdate（），判断数据有咩有变化，如果有变化返回true，没有变化返回false
        c.办法2：使用PureComponent代替Component
        d.说明：一般都使用PureComponent来优化组件性能
        <!-- Component和PureComponent很相似，区别：前者没有实现ShouldComponentUpdate()而后者中以浅层的对比prop和state的方式来实现了该函数 -->
    3.PureComponent的基本原理
        a.重写实现ShouldComponentUpdate()
        b.对组件的新旧state和props中的数据进行浅比较，如果都没有变化返回false，否则返回true【浅比较：只比较变量，对象中的值变化不会返回false】
        c.一旦componentShouldUpdate()返回false不再执行用于更新的render（）
    4.面试题:
        a.那个生命周期勾子可以实现组件优化
        b.ShouldComponentUpdate的基本原理
        c.PureComponent和Component的区别
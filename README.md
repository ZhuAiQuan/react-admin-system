# romoss-com-admin-front

### **官网后台前端**
> 官网后台管理系统 使用vite+react+ts构建。页面交互使用axios请求；状态使用react-redux+redux-toolkit管理，放置在store目录里；router使用react-router-dom##最新版本，基于配置式路由来控制权限；
> 包管理工具推荐使用pnpm (当然npm yarn之类的也支持) 没有的话使用`npm i -g pnpm`安装一个全局的pnpm工具
---

#### 安装依赖
`pnpm i`

#### 开启服务
`pnpm dev`

---

### 特点

1. vite构建开发服务，急速开启服务；
2. typescript 类型校验，方便后期维护；
3. react+周边全家桶；

#### src下目录说明

- api/*
  公共api 管理 所有的请求接口都来自这里。
- assets
  静态资源放置，包括图片字体等；
- components
  公共组件目录；已设置路径别名_c可以直接访问
- config
  系统配置文件，存放一些公共配置。
- layout
  页面的公共布局模块，包括左侧导航 顶部功能区域等；
- router 
  路由配置目录
- store 
  全局状态管理，使用了官方推荐的redux-toolkit工具
     - hook.ts 包装出useSelector 和 useDispath方法，使其在使用时具有推导类型的作用；暴露出useAppSelector 和 useAppDispatch方法供使用；
     - slice 文件夹包括所有状态和对应的reducer方法；获取状态需要通过useAppSelector获取，useAppSelector有一个回调 返回对应的state状态；修改state状态通过暴露出去的reducer方法，用useAppDispatch触发
- styles
  全局样式文件夹
- types
  暴露的全局类型，可以直接使用；
- utils
  自行封装的工具函数
- views
  视图文件

---

#### 本地预览

##### 构建打包
`pnpm build`

##### 全局安装serve
`pnpm add -g serve`

##### 本地开启服务
打包完了进入到项目根目录 运行如下命令 dist是打包后项目的文件夹名字
`serve dist` 等运行完打开3000端口即可预览

---

## 写在最后
~~本项目算~~
页面的逻辑是主页面控制状态，子组件通过父组件提供的方法来改变数据，算是实现了数据单向传递的思想。所以后期维护人员最好也是能通过父组件的方法来改变状态！
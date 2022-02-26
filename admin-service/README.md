

## express ts node后端模板

数据库mysql，集成jwt验证，graphQL基础使用等

### 环境需求

    yarn install
    npm install apidoc -g

### npm run build:apidoc

生成api文档，打开项目目录下_apidoc文件夹以访问静态html文件

### npm run dev

ts-node直接运行，并监听文件修改自动重启服务

### npm run build

使用webpack打包ts项目为用于部署的文件

### npm run serve

实验功能，使用webpack/tsc编译ts，supervisor/pm2监听编译后文件变动重启服务，gulp自动化任务

### GraphQl

http://localhost:9999/graphql


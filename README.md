# Crispy Coconut

一款类似Tape的匿名提问社交App

Course PA for Mobile Internet 2023 Spring, Fudan Univ.



## 食用指南

### Prerequisites

- `npm`
- Cordova与Android开发环境



### 本地调试

使用`npm start`在本地开启测试服务器，使用浏览器DevTools进行调试；



### Android打包

- 使用`npm run build`将应用打包（默认输出路径为`./build`）
- 将`build`内的所有内容复制到Cordova项目路径的`www`文件夹下，并替换原有内容
- 在Cordova项目路径下使用`cordova build android`打包生成APK文件，在真机或模拟器上测试



### Web打包

- 编辑`src/api/axios.js`中的`baseURL`项，将其更改为需要连接的后端服务器的地址
- `npm run build -o ./build`将应用打包成静态文件到`build`目录下
- `docker build . --tag <image-name:tag>`构建一个由nginx提供静态文件服务的Docker镜像
- `docker run --name <container-name> -p 8000:80 -d <image-name:tag>`启动一个容器。`-p`参数指定本机端口）。然后浏览器访问本地相应端口即可。


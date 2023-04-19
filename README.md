# Crispy Coconut

一款类似Tape的匿名提问社交App

Course PA for Mobile Internet 2023 Spring, Fudan Univ.



## 食用指南

### Prerequisites

- `npm`
- Cordova与Android开发环境



### 本地调试

使用`npm start`在本地开启测试服务器，使用浏览器DevTools进行调试；



### 打包

- 使用`npm build`将应用打包（默认输出路径为`./build`）
- 将`build`内的所有内容复制到Cordova项目路径的`www`文件夹下，并替换原有内容
- 在Cordova项目路径下使用`cordova build android`打包生成APK文件，在真机或模拟器上测试




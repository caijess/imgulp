<div align=center><img  src="http://image.zgxyzx.net/logo.gif"/></div>

**校园在线高中生涯教育信息化教学云平台-微信家长端**
======================================================

[![Build Status](https://travis-ci.org/meolu/walle-web.svg?branch=master)](https://travis-ci.org/meolu/walle-web)
[![npm (scoped)](https://img.shields.io/badge/npm-%3E=%203.0.0-blue.svg)]()
[![node](https://img.shields.io/badge/node-%3E=4.0.0-brightgreen.svg)]()
[![gulp](https://img.shields.io/badge/gulp-3.9.0-red.svg)]()
[![jquery](https://img.shields.io/badge/jquery-2.1.4-brightgreen.svg)]()
[![jquery-weui](https://img.shields.io/badge/jqueryWeui-1.2.0-brightgreen.svg)]()

# 如何开始/To start


``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8018
gulp         --开发环境
# build for production with minification
gulp build --env -dev        --开发环境打包
gulp build --env -test       --测试环境打包
gulp build --env -pro        --正式环境打包
```

``` bash
# Folder structure
 dist - build                    --最终发布的代码存放位置
 src                             --the source files/项目文档
    css                          --theme file/样式文件
    images                       --logo/pic file/图片文件等
    js                           --js file/js脚本文件
```


# 项目简介/project
校园在线高中生涯教育信息化教学云平台-微信家长端
进入入口-校园在线官微-孩子选科

功能：
1、绑定手机/绑定孩子
2、孩子选科确认
3、家庭关系修改

* 项目主要使用gulp开发脚手架。
* 使用jquery-weui进行页面切片，ajax进行数据交互。
* 正式环境js/css/jpg/png/gif进行hash数组命名，babelEs6JS语法并压缩图片。


<div align=center><img width="500" height="900" src="http://image.zgxyzx.net/TIM%E5%9B%BE%E7%89%8720180115100452.png"/></div>
<div align=center><img width="500" height="900" src="http://image.zgxyzx.net/TIM%E5%9B%BE%E7%89%8720180115100501.png"/></div>
<div align=center><img width="500" height="900" src="http://image.zgxyzx.net/TIM%E5%9B%BE%E7%89%8720180115100508.png"/></div>

# 分支简介/branch
 *master  -主分支
 *develop -生产分支

# 样式简介/theme
jquery-weui样式库

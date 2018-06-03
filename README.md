# 打包工具集

学习 antd-tools，组件开发工具集

## 1.8.0~2 (2018-05-29)

+ [feat] 例行更新

## 1.7.4 (2018-04-17)

+ [refactor] 根据 npm scripts 调整，prepublish 修改为 prepublishOnly

## 1.7.2 (2018-01-15)

+ [docs] 调整文档说明

## 1.7.1 (2018-01-13)

+ [style] 优化 webpack 配置信息

## 1.7.0 (2018-01-05)

+ [feat] 新增 jest 相关配置

## 1.5.0~1.6.1 (2017-12-29)

+ [feat] 新增 pub 命令，用以整合 compile、dist、publish 三个命令，暂时还不包括 git push
+ [fix] 暂时移除 update-self 命令
+ [fix] 解决利用 swpan 执行 npm 无法跨平台问题
+ [fix] 丢失 guard 任务
+ [fix] publish 中丢失 with 参数
+ [feat] 暂时去掉 dist 打包，不完善
+ [fix] 解决对于 less、css 打包中的问题

## 1.4.3~6 (2017-12-28)

+ 修复 webpack-dev-server 无法在 ie10 中运行的问题
+ 调整启动命令，改为 npm run dev
+ 移除 Hot Module Replacement 内容
+ 调整 babelConfig.plugins 加载顺序，解决启动时报错：AssertionError [ERR_ASSERTION]
+ 修复 npm run dev 启动后，页面无法打开的问题

## 1.2.0~1.4.2 (2017-12-27)

+ 新增 clean 方法，一键清除打包所生成的文件夹
+ 新增 test 方法，用以进行组件测试
+ webpack.config.js 只作为可选调价存在
+ 修复若干问题
+ 调整部分依赖包
+ 修复依赖包配置错误

## 1.0.0 (2017-12-26)

+ 支持 js、jsx 打包为 lib 以及 es
+ 支持 less 打包

## 0.0.2 (2017-12-25)

+ 丢失了 bin 目录

## 0.0.1 (2017-12-25)

+ 第一个测试版本，针对 jsx、less 进行 gulp 打包

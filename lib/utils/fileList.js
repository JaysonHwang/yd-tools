'use strict';

const fs = require('fs');
const { join } = require('path');

// 遍历读取文件
function readFile(path, filesList) {
  const files = fs.readdirSync(path); // 需要用到同步读取
  files.forEach((file) => {
    const currentPath = join(path, file);
    const states = fs.statSync(currentPath);
    if (states.isDirectory()) {
      readFile(currentPath, filesList);
    } else {
      filesList.push({
        size: states.size, // 文件大小，以字节为单位
        name: file,
        path: currentPath, // 文件绝对路径
      });
    }
  });
}

// 遍历文件夹，获取所有文件夹里面的文件信息
/*
 * @param path 路径
 *
 */
function geFileList(path) {
  const filesList = [];
  readFile(path, filesList);
  return filesList;
}

module.exports = {
  geFileList,
};

// 写入文件utf-8格式
// function writeFile(fileName, data) {
//   fs.writeFile(fileName, data, "utf-8", complete);
//   function complete() {
//     console.log("文件生成成功");
//   }
// }

// var filesList = geFileList("G:/nodejs");
// filesList.sort(sortHandler);
// function sortHandler(a, b) {
//   if (a.size > b.size) return -1;
//   else if (a.size < b.size) return 1;
//   return 0;
// }
// var str = "";
// for (var i = 0; i < filesList.length; i++) {
//   var item = filesList[i];
//   var desc =
//     "文件名:" +
//     item.name +
//     " " +
//     "大小:" +
//     (item.size / 1024).toFixed(2) +
//     "/kb" +
//     " " +
//     "路径:" +
//     item.path;
//   str += desc + "\n";
// }

// writeFile("test.txt", str);

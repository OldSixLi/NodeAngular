/*
 * 遍历某个目录下文件
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2017年4月19日14:40:20
 * @Last Modified by: 马少博 
 */
var fs = require('fs')


//遍历文件夹，获取所有文件夹里面的文件信息
/*
 * @param path 路径
 *
 */

function geFileList(path) {
  var filesList = [];
  readFile(path, filesList);
  return filesList;
}

//遍历读取文件
function readFile(path, filesList) {
  files = fs.readdirSync(path); //需要用到同步读取
  files.forEach(walk);

  function walk(file) {
    states = fs.statSync(path + '/' + file);
    if (states.isDirectory()) {
      readFile(path + '/' + file, filesList);
    } else {
      //创建一个对象保存信息
      var obj = new Object();
      obj.size = states.size; //文件大小，以字节为单位
      obj.name = file; //文件名
      obj.path = path + '/' + file; //文件绝对路径
      filesList.push(obj);
    }
  }
}

//写入文件utf-8格式 
function writeFile(fileName, data) {
  //   fs.writeFile(fileName, data, 'utf-8', complete);
  console.log(data);

  function complete() {
    console.log("文件生成成功");
  }
}

//在此输入路径
var filesList = geFileList("./");
filesList.sort(sortHandler);

function sortHandler(a, b) {
  if (a.size > b.size)
    return -1;
  else if (a.size < b.size) return 1
  return 0;
}
var str = '';
for (var i = 0; i < filesList.length; i++) {
  var item = filesList[i];
  var desc = (i + 1) + "文件名:" + chuliStr(item.name, 40) + " " +
    "Size:" + chuliStr((item.size / 1024).toFixed(2) + "/kb", 20) + " " +
    "路径:" + item.path;
  str += desc + "\n"
}


writeFile("test.txt", str);

/**
 * 处理字符长度固定（方便输出处理）
 * BUG:未做中文处理
 * @param {any} str 字符
 * @param {any} size  总字符长度
 * @returns 
 */
function chuliStr(str, size) {
  var length = size - str.length;
  var addStr = "";
  for (var i = 0; i < length; i++) {
    addStr += " ";
  }
  return str + addStr + "|";
}
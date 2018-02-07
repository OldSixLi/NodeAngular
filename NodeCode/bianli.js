/*
 * 遍历某个目录下文件
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2017年4月19日14:40:20
 * @Last Modified by: 马少博 
 */
var fs = require('fs');
var path = require('path');

//在此输入路径
var reslovePath = "F:/个人相关文件/表情包/35242408—拥有丰富的表情包是一种什么样的体验是种怎样的体验？";
var filesList = geFileList(reslovePath);
filesList.sort(_sortHandler);

/**
 *  循环写入文件
 * @returns 
 */
filesList.forEach(x => {
  var str = "文件名:" + normalStr(x.name, 50) + " " +
    "Size:" + normalStr((x.size / 1024).toFixed(2) + "/kb", 20) + " " +
    "路径:" + x.path + '\r\n';
  writeFile(path.resolve(reslovePath, "当前记录.txt"), str);
});

//遍历文件夹，获取所有文件夹里面的文件信息
/*
 * @param path 路径
 */
function geFileList(path) {
  var filesList = [];
  readFile(path, filesList);
  return filesList;
}

//遍历读取文件
function readFile(path, filesList) {
  files = fs.readdirSync(path); //需要用到同步读取(因为后期需要汇总进行大小排序)
  files.forEach(_walk);

  function _walk(file) {
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
  //追加内容
  fs.appendFile(fileName, data, 'utf-8');
  //写入文件
  // fs.writeFile(fileName, data, 'utf-8');
  // console.log(data);
}

function _sortHandler(a, b) {
  // return a.size - b.size; //倒序
  return b.size - a.size; //正序
}

/**
 * 处理字符长度固定（方便输出处理）
 * @param {any} str 字符
 * @param {any} length  总字符长度
 * @returns 
 */
function normalStr(str, length) {
  try {　　
    //  做中文处理
    let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    let nowLen = str.length + (!!str.match(reg) ? str.match(reg).join('').length : 0);
    return nowLen > length ? str : str + Array(length - nowLen).fill(" ").join('');
  } catch (error) {
    console.log(error);
  }
}
/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * 工具类 尽量避免影响逻辑
 * @Date: 2018年6月4日13:31:43
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月4日13:31:47
 * 
 */
/* jshint esversion: 6 */

let https = require("https");
let fs = require("fs");
let path = require('path');
let colors = require('colors');
var cheerio = require('cheerio');

class Handle {
  constructor() {

  };

  /**
   * 获取字符串中纯数字[静态方法]
   * @param {*} text
   */
  static getNum(text) {
    var value = text.replace(/[^0-9]/ig, "");
    return value;
  };

  /**
   * 处理标题[静态方法]
   * @param {string} [title="标题"] 传入的标题名
   */
  static handleTitle(title = "标题") {
    title = this.dirName(title);
    var index = title.indexOf(" - ");
    return index > -1 ? title.substring(0, index) : title;
  };

  /**
   * 去除特殊符号[静态方法]
   * @param {*} str 字符串
   */
  static dirName(str) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < str.length; i++) {
      rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
  };
  /**
   *创建目录
   * @static
   * @param {*} dir 当前目录的相对路径
   * @memberof Handle
   */
  static createDir(dir) {
    let filePath = path.resolve(__dirname, dir);
    !fs.existsSync(filePath) && fs.mkdirSync(filePath); //创建目录
  };

  /**
   * 注释
   * @static
   * @param {*} str
   * @memberof Handle
   */
  static log(str) {
    console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
    console.log(str);
    console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
  };

  /**
   * 根据问题ID和index 获取对应页的答案地址
   *
   * @static
   * @param {*} qId 问题Id
   * @param {*} index 答案页数
   * @returns 处理过的地址
   * @memberof Handle
   */
  static getAnswerUrlByPageIndex(qId, index) {
    return `https://500px.me/community/contest/cb9bea96466f4dc39f5d5fe2d927a5f8/photos?orderby=createdTime&type=json&page=${index+1}&size=20`;
  };
  /**
   * 获取处理后图片路径 
   */
  static handleImgUrl(url) {
    if (url == "//zhstatic.zhihu.com/assets/zhihu/ztext/whitedot.jpg") {
      return ''; //空图片不处理
    }
    if (url != null && url != "") {
      if (url.indexOf('https') > -1) {
        url = "http" + url.substr(5);
      }
    }
    return url;
  };

  /**
   * 替换某个字符串为另外一个字符串函数
   * 
   * @param {any} bigStr  全部字符
   * @param {any} str1 被替换的字符
   * @param {any} str2 新字符
   * @returns 新的字符串
   */
  static replaceAll(bigStr, str1, str2) { //把bigStr中的所有str1替换为str2
    var reg = new RegExp(str1, 'gm');
    return bigStr.replace(reg, str2);
  };



  /**
   * 下载图片
   * @static
   * @param {*} imgSrc 图片网络地址
   * @param {*} dirName 存储目录
   * @param {*} anstitle 问题名称
   * @param {boolean} [isGif=false] 是否为Gif
   * @returns
   * @memberof Handle
   */
  static startDownloadTask(imgSrc, dirName, anstitle, isGif = false) {
    if (isGif) {
      dirName = this.replaceAll(dirName, '.jpg', '.gif')
      imgSrc = this.replaceAll(imgSrc, '.jpg', '.gif')
    }
    let self = this;
    //返回一个promise对象才可以调用then等函数
    return new Promise(function(resolve, reject) {
      setTimeout(() => {
        if (imgSrc.indexOf('http') !== -1) {
          //回调
          // let req = https.request(imgSrc, this.getHttpReqCallback(imgSrc, dirName, anstitle));
          let req = https.request(imgSrc, (res) => {
            var fileBuff = [];
            res.on('data', chunk => {
              var buffer = new Buffer(chunk);
              fileBuff.push(buffer);
            });
            res.on('end', () => {
              var totalBuff = Buffer.concat(fileBuff);
              fs.appendFile(dirName, totalBuff, err => {
                if (err) {
                  reject(err);
                  console.log(`路径：${imgSrc}获取答案出错:${err}`);
                } else {
                  console.log(` ${++self.DOWNLOAD_INDEX_NUM} ■■ 标题:${anstitle}, ■■ 路径: ${dirName.substr(dirName.lastIndexOf('\\')+1)} ■■ download success！`);
                  resolve();
                }
              });
            });
          });

          //报错
          req.on('error', function(error) { reject(error); });
          //超时
          req.setTimeout(20 * 1000, function() {
            console.log(`请求${imgSrc}超时,结束当前请求！`);
            fs.appendFile(dirName.substr(0, dirName.lastIndexOf('/')) + '/错误日志.txt', '请求超时：' + imgSrc + '\r\n');
            req.abort();
            reject("超时请求");
          });
          req.end();
        } else {
          reject("不存在值")
        };
      }, 0);
    });
  };

}
Handle.DOWNLOAD_INDEX_NUM = 0;
module.exports = Handle;
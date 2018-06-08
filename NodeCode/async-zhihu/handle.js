/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * 工具类 尽量避免影响逻辑
 * @Date: 2018年6月4日13:31:43
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月4日13:31:47
 * 
 */
/* jshint esversion: 6 */

let https = require("http");
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
    return `https://www.zhihu.com/node/QuestionAnswerListV2?method=next&params={"url_token":${qId},"pagesize":10,"offset":${index * 10}}`;
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
                  console.log(`路径：${imgSrc}获取答案出错' + err`);
                } else {
                  console.log(` ${++self.DOWNLOAD_INDEX_NUM} ■■ 问题:${anstitle}, ■■ 路径: ${dirName.substr(dirName.lastIndexOf('\\')+1)} ■■ download success！`);
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

  /**
   * 生成随机代理
   *
   * @static
   * @returns
   * @memberof Handle
   */
  static randomUserAgent() {
    const userAgentList = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
      'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
      'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
      'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
      'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
      'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
      'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
      'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'
    ]
    const num = Math.floor(Math.random() * userAgentList.length)
    return userAgentList[num]
  }

}
Handle.DOWNLOAD_INDEX_NUM = 0;
module.exports = Handle;
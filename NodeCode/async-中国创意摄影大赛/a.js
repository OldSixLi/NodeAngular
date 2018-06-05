/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @note: async 版获取
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月4日11:26:56
 */
var nodegrass = require('nodegrass');
let Handler = require('./handle');
let path = require('path');
let fs = require("fs");
var cheerio = require('cheerio');

let START_INDEX = 0; //从第几页开始请求
let PAGE_COUNT = 1; //每次爬虫处理多少页
let IS_GIF = false; //是否为GIF格式下载
let MIN_DIANZAN = 0; //最小点赞数
let USER_INPUT = "41710758"; //用户输入内容

//开始调用方法
// getPage(isNaN(USER_INPUT) ? USER_INPUT : `https://www.zhihu.com/question/${USER_INPUT}`).
// then(data => CircleGetAnswer(data), err => { console.log(err); });

/*
███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
*/

/**
 * 获取页面信息并返回
 * @param {*} url 请求的页面地址
 */
function getPage(url) {
  //返回一个promise对象才可以调用then等函数
  return new Promise(function(resolve, reject) {
    let questionId = url.substr(url.lastIndexOf('/') + 1);
    nodegrass.get(url, (data, status, headers) => {
      if (!data) {
        reject(error);
      } else {
        let $ = cheerio.load(data);
        let anstitle = Handler.handleTitle($(data).find('title').text().trim());
        Handler.log(anstitle);

        //返回答案数,获取纯数字
        let answerCount = Handler.getNum($(data).find('.List-headerText span').text());
        Handler.log(`当前答案回答数:${answerCount}`);
        var pageInfo = {
          ansCount: answerCount,
          questionId: questionId,
          anstitle: anstitle
        }
        resolve(pageInfo);
      }
    });
  });
}

/**
 * 获取到问题基本信息后,开始遍历答案
 * @param {*} pageInfo 初步抓取页面获取到的信息
 */
async function CircleGetAnswer(pageInfo) {
  let ansCount = pageInfo.ansCount,
    questionId = pageInfo.questionId,
    anstitle = pageInfo.anstitle;
  //创建目录
  for (var json_index = START_INDEX; json_index < START_INDEX + PAGE_COUNT; json_index++) {
    console.log("1");
    var data = await getAnswer(json_index, 1);
    for (let i = 0; i < data.length; i++) {
      let filePath = path.resolve(__dirname, './img/摄影/' + data[i].userName + '-' + data[i].answerId);
      Handler.createDir(filePath);
      try {　　
        var imgList = await getImg2(data[i]);
        for (var j = 0; j < imgList.length; j++) {
          await Handler.startDownloadTask(imgList[j], filePath + '/' + data[i].userName + j + imgList[j].substr(-14, 11), data[i].userName, IS_GIF);
        }
      } catch (error) {　　
        console.log(error);　　
      }

    }
  };
}

/**
 * 分页获取当前问题的答案
 * @param {*} index
 * @param {*} questionId
 * @param {*} anstitle
 * @returns
 */
function getAnswer(index, questionId, anstitle) {
  //URL地址
  Handler.log(`请求第${index}页`)
  var posturl = Handler.getAnswerUrlByPageIndex(questionId, index);
  //返回一个promise对象才可以调用then等函数
  return new Promise(function(resolve, reject) {
    nodegrass.post(posturl, (data, status, headers) => {
      if (data) {
        resolve(parseResult(data));
      } else {
        reject(`问题:${anstitle}当前第${index}页答案获取失败,请检查程序`);
      }
    })
  });
}

CircleGetAnswer(1)

/**
 * 下载单个答案中的图片
 * @returns 
 */
async function ansList(obj, filePath, anstitle) {
  function getInfo(i) {
    return {
      url: obj.imgList[i] || "",
      path: filePath + "\\" + obj.answerId + '--' + i + '--' + path.basename(obj.imgList[i] || "").substr(-10),
    };
  }

  if (obj.imgList.length > 0) {
    for (let i = 0; i < obj.imgList.length; i += 2) {
      await Promise.all([
        Handler.startDownloadTask(getInfo(i).url, getInfo(i).path, anstitle, IS_GIF),
        Handler.startDownloadTask(getInfo(i + 1).url, getInfo(i + 1).path, anstitle, IS_GIF),
      ]).
      then(() => console.log("✲✲✲✲✲✲✲✲✲完成两个✲✲✲✲✲✲✲✲✲✲✲"), err => console.log(err));
    }
  }
}

/**
 * 对获取到的答案内容进行解析,提取出有用内容
 * @param {*} data 请求到的JSON内容
 * @returns 当前答案列表中answerId,imgList,dianzanCount
 */
function parseResult(data) {
  let dataObj = JSON.parse(data);
  let $ = cheerio.load(data);
  //遍历JSON操作
  if (dataObj.data && dataObj.data.length > 0) {
    let arr = dataObj.data;
    var ansList = [];

    for (let i = 0; i < dataObj.data.length; i++) {
      //当前答案的点赞数量
      let obj = dataObj.data[i];

      let ansObj = {
        answerId: obj.id,
        userName: obj.uploaderName,
        imgUrl: `https://500px.me/community/tag?photoId=${obj.id}&startTime=&page=1&size=200&type=json`
      };
      ansList.push(ansObj);
    };

    console.log("sss");
    return ansList;
  } else {
    return [];
  }
}

async function getImg2(obj) {
  return new Promise(function(resolve, reject) {
    nodegrass.get(obj.imgUrl, (data, status, headers) => {
      if (data) {
        resolve(parseResult2(data));
      } else {
        reject(`问题:答案获取失败,请检查程序`);
      }
    })
  });
}

function parseResult2(data) {
  var dataList = JSON.parse(data);
  var arr = [];
  dataList.forEach(obj => {
    // console.log(obj.url.baseUrl + "!p5");
    arr.push(obj.url.baseUrl + "!p5");
  });
  return arr;
}
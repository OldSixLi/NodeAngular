/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @note: async 版获取
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月4日11:26:56
 */
var nodegrass = require('nodegrass');
var cheerio = require('cheerio');
let Handler = require('./handle');
let path = require('path');
let fs = require("fs");

getPage("https://www.zhihu.com/question/61572379").then(data => CircleGetAnswer(data));

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
        Handler.log(`当前答案点赞数:${answerCount}`);

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

  let filePath = path.resolve(__dirname, './img/' + anstitle);
  Handler.createDir(filePath);
  let startIndex = 0;
  // json_index < ansCount / 10 + 1
  for (var json_index = startIndex; json_index < startIndex + 2; json_index++) {
    console.log(`index:${json_index}□□□□□□□□□`);
    await getAnswer(json_index, questionId, anstitle).then(async data => {
      for (let i = 0; i < data.length; i++) {
        var obj = data[i];
        await ansList(obj, filePath, anstitle);
      }
    })
  };
}

async function ansList(obj, filePath, anstitle) {
  for (let i = 0; i < obj.imgList.length; i++) {
    let img = obj.imgList[i]
    let imgName = path.basename(img);
    // await down(img, filePath, obj.answerId, i, imgName, anstitle);
    await Handler.startDownloadTask(img, filePath + "\\" + obj.answerId + '--' + i + '--' + imgName.substr(-10), anstitle);
  }
}

/** 
 * 分页获取当前问题的答案
 *
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

/**
 * 对获取到的答案内容进行解析,提取出有用内容
 * @param {*} data 请求到的JSON内容
 * @returns 当前答案列表中answerId,imgList,dianzanCount
 */
function parseResult(data) {
  let dataObj = JSON.parse(data);
  let $ = cheerio.load(data);
  //遍历JSON操作
  if (dataObj.msg.length > 0) {
    let msgArr = dataObj.msg;
    var ansList = [];
    for (let i = 0; i < dataObj.msg.length; i++) {
      //当前答案的点赞数量
      let dianzanCount = $(msgArr[i]).find('.count').text();
      if (dianzanCount >= 100) {
        let answerId = $(msgArr[i]).find('.zm-item-rich-text').attr('data-entry-url');
        answerId = answerId.substr(answerId.lastIndexOf('/') + 1);
        let $imgDomList = $(msgArr[i]).find('.zm-editable-content').find("noscript").remove().end().find('img');

        //输出当前答案的信息
        console.log(`答案ID: ${answerId} ■■■ 点赞数： ${dianzanCount} ■■■ 图片数量： ${$imgDomList.length}`);

        //处理每个答案的图片数量
        let answerImgList = [];
        $imgDomList.each(function(index, element) {
          let imgUrl = Handler.handleImgUrl($(this).attr('data-original') || $(this).attr('data-actualsrc') || "");
          answerImgList.push(imgUrl);
        });

        let ansObj = {
          answerId: answerId,
          dianzan: dianzanCount,
          imgList: answerImgList
        };
        ansList.push(ansObj);
      }
    };
    return ansList;
  } else {
    return [];
  }
}
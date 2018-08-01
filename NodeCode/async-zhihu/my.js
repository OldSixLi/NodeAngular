/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @note: 从某个用户的个人收藏中进行检索
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月4日11:26:56
 */
var nodegrass = require('nodegrass');
let Handler = require('./handle');
let path = require('path');
let fs = require("fs");
var cheerio = require('cheerio');

let KEY_WORD = "日本战后"; //从第几页开始请求
let PERSON_URL = "https://www.zhihu.com/people/wang-jun-yi-73-97/collections";


personalZhihu();


async function personalZhihu() {
  let collectArr = await getPageByUser(PERSON_URL);
  for (let c_index = 0; c_index < collectArr.length; c_index++) {
    const obj = collectArr[c_index];
    await start(obj.href, obj.page);
  }
}

/**
 * 请求某页数据
 *
 * @param {*} url 某个收藏地址
 * @param {*} totalPage 页码
 */
async function start(url, totalPage) {
  for (var i = 1; i <= totalPage; i++) {
    await getPage(`${url}?page=${i}`).then(data => data.length && console.log(JSON.stringify(data)))
  }
}

/*
███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
*/

/**
 * 获取某人的收藏主页
 *
 * @param {*} url
 */
async function getPageByUser(url) {
  return new Promise(function(resolve, reject) {
    nodegrass.get(url, (data, status, headers) => {
      if (!data) {
        reject(error);
      } else {
        let $ = cheerio.load(data);
        //获取当前用户的所有有效信息
        let userCollectAllObj = JSON.parse($("#data").attr('data-state')).entities.favlists;
        // console.log(JSON.stringify(userCollectAllObj));
        let collectArr = [];
        for (let [key, value] of Object.entries(userCollectAllObj)) {
          collectArr.push({
            title: value.title,
            href: `https://www.zhihu.com/collection/${key}`,
            page: Math.ceil(value.answerCount / 10)
          })
        }
        resolve(collectArr)
      }
    })
  })
}

/**
 * 获取页面信息并返回
 * @param {*} url 请求的页面地址
 */
async function getPage(url) {
  // console.log(url);
  //返回一个promise对象才可以调用then等函数
  return new Promise(function(resolve, reject) {
    nodegrass.get(url, (data, status, headers) => {
      if (!data) {
        reject(error);
      } else {
        let $ = cheerio.load(data);
        let arr = [];
        let reg = new RegExp(KEY_WORD);
        if (reg.test(data)) {
          $(".zm-item").each(function(index, element) {
            let hrefUrl = $(element).find('.zm-item-fav .zm-item-answer>link').attr('href');
            let title = $(element).find('.zm-item-title').text();
            let contentHtml = $(element).find('.zm-item-rich-text textarea').val();
            if (reg.test(contentHtml) || reg.test(title)) {
              arr.push({ href: hrefUrl, text: contentHtml });
            }
          });
        }
        resolve(arr);
      }
    });
  });
}
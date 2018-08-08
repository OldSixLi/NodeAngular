/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @note: 从某个用户的个人收藏中进行检索
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月4日11:26:56
 */
let nodegrass = require('nodegrass');
let Handler = require('./handle');
let cheerio = require('cheerio');

let KEY_WORD = "我稍微整理了一下"; // 关键字
let PERSON_URL = "https://www.zhihu.com/people/qiushi-16/collections"; //个人主页地址

personalZhihu();

/**
 * 个人主页地址处理
 */
async function personalZhihu() {
  let collectArr = await getPageByUser(PERSON_URL);
  let arr = [];
  for (let c_index = 0; c_index < collectArr.length; c_index++) {
    const obj = collectArr[c_index];
    let result = await handleMission(obj, 5);
    arr.push(result);
  }
  console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
  console.log("请求完毕");
  // NOTE 因为此处其实是异步处理 所以可以在flattenDepth声明前调用此方法
  console.log(flattenDepth(arr, 0));
  console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
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
 * 递归递减数组深度
 *
 * @param {*} arr 原数组
 * @param {number} [depth=1] 深度
 */
const flattenDepth = (arr, depth = 1) => depth != 1 ? arr.reduce((a, v) => a.concat(Array.isArray(v) ? flattenDepth(v, depth - 1) : v), []) : arr.reduce((a, v) => a.concat(v), []);

/**
 * 请求某页数据
 * 
 * @param {*} url 某个收藏地址
 * @param {*} totalPage 页码
 */
async function getCollectionPage(url, totalPage) {
  for (var i = 1; i <= totalPage; i++) {
    await getPage(`${url}?page=${i}`).then(data => data.length && console.log(JSON.stringify(data)))
  }
}

/**
 * 获取某人的收藏主页
 *
 * @param {*} url
 */
async function getPageByUser(url) {
  return new Promise(function(resolve, reject) {
    nodegrass.get(url, (data) => {
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
  console.log(url);
  //返回一个promise对象才可以调用then等函数
  return new Promise(function(resolve, reject) {
    nodegrass.get(url, (data, status, headers) => {
      if (!data) {
        reject(error);
      } else {
        let $ = cheerio.load(data);
        let arr = [];
        if (data.includes(KEY_WORD)) {
          $(".zm-item").each(function(index, element) {
            let hrefUrl = $(element).find('.zm-item-fav .zm-item-answer>link').attr('href');
            let title = $(element).find('.zm-item-title').text();
            let contentHtml = $(element).find('.zm-item-rich-text textarea').val();
            if (contentHtml.includes(KEY_WORD) || title.includes(KEY_WORD)) { arr.push({ href: hrefUrl, text: contentHtml }); }
          });
        }
        resolve(arr);
      }
    });
  });
}


let a = {
  a: 10,
  log: function() {
    return this.a;
  }
}


/**
 * 批量抓取链接
 *
 * @param {*} collectObj 获取到的某个收藏对象
 * @param {*} num
 */
async function handleMission(collectObj, num) {
  Handler.log(`当前收藏夹:【${collectObj.title}】,一共■■ 【${collectObj.page}】 ■■个页面,并发量为■■ 【${num}】 ■■`);
  let total = [];
  let totalPage = collectObj.page;
  let url = collectObj.href;
  for (let index = 1; index < totalPage; index += num) {
    let arr = [];
    for (let i = 0; i < num; i++) {
      let currentPage = index + i;
      if (currentPage <= totalPage) {
        arr.push(getPage(`${url}?page=${currentPage}`).then(data => {
          data.length && console.log(JSON.stringify(data));
          return Promise.resolve(data);
        }));
      }
    }
    //请求
    let result = [];
    try {
      result = await Promise.all(arr).then(
        data => {
          console.log(`---------完成 ${arr.length} 个---------`);
          return Promise.resolve(data);
        },
        err => console.log(err)
      );
    } catch (error) { console.log(error); }
    //合并处理下
    result = result.reduce((a, v) => a.concat(v), []);
    result.length != 0 && total.push(result);
  }
  return await total;
}
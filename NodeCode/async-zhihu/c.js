/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * collection.js
 * @Date: 2018年6月13日16:38:25
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月13日16:38:28
 */
/* jshint esversion: 6 */
let nodegrass = require('nodegrass');
let Handler = require('./handle');
let path = require('path');
let fs = require("fs");
let cheerio = require('cheerio');
let NUM = 1;

// collect();

async function collect() {
  let htmlStr = '';

  for (let pageIndex = 1; pageIndex <= 18; pageIndex++) {
    let page = await getPage(`https://www.zhihu.com/collection/69867602?page=${pageIndex}`)
      .then(d => pageInfoParse(d));

    for (let index = 0; index < page.length; index++) {
      const obj = page[index];
      htmlStr += `<h4>${NUM++}.<a href="${obj.href}" target="_blank">${obj.title}</a></h4><br>\r\n`;
    }
  }
  console.log(htmlStr);
}

getPage(`https://music.163.com/discover/playlist/?order=hot&cat=%E5%85%A8%E9%83%A8&limit=35&offset=35`).then(d => console.log(d), err => console.log(err))
  /*
  '########:::::'###:::::'######:::'########:
   ##.... ##:::'## ##:::'##... ##:: ##.....::
   ##:::: ##::'##:. ##:: ##:::..::: ##:::::::
   ########::'##:::. ##: ##::'####: ######:::
   ##.....::: #########: ##::: ##:: ##...::::
   ##:::::::: ##.... ##: ##::: ##:: ##:::::::
   ##:::::::: ##:::: ##:. ######::: ########:
  ..:::::::::..:::::..:::......::::........::
  */
  /**
   * 获取页面信息并返回
   * @param {*} url 请求的页面地址
   */
function getPage(url) {
  console.log(url);
  //返回一个promise对象才可以调用then等函数
  return new Promise(function(resolve, reject) {
    let questionId = url.substr(url.lastIndexOf('/') + 1);
    nodegrass.get(url, (data, status, headers) => {
      if (!data) {
        reject('未抓取到数据');
      } else {
        resolve(data);
      }
    });
  });
}


/**
 * 处理页面信息 (转化为可用对象)
 * @returns 
 */
function pageInfoParse(data) {
  let $ = cheerio.load(data);
  let $list = $('.zm-item .zm-item-title').find('a');
  let pageArr = [];
  $list.each(function(index, element) {
    let title = $(this).text();
    let href = "https://www.zhihu.com" + $(this).attr('href');
    let id = href.substr(href.lastIndexOf('/') + 1);
    pageArr.push({ title: title, href: href, id: id });
  });

  return pageArr;
}

/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @note: async 版获取
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月4日11:26:56
 */
let nodegrass = require('nodegrass');
let Handler = require('./handle');
let path = require('path');
let fs = require("fs");
let cheerio = require('cheerio');
const START_INDEX = 0; //从第几页开始请求
const PAGE_COUNT = 10; //每次爬虫处理多少页
const IS_GIF = false; //是否为GIF格式下载
const MIN_DIANZAN = 0; //最小点赞数
const USER_INPUT = "41710758"; //用户输入内容
//开始调用方法
// startSpider();
getJSON('https://music.163.com/discover/playlist/?cat=%E8%AF%B4%E5%94%B1', 'get').then(data => console.log(data));
/**
 * 获取到问题基本信息后,开始遍历答案
 * @param {*} pageInfo 初步抓取页面获取到的信息
 */
async function startSpider(pageInfo) {
  for (let json_index = START_INDEX; json_index < START_INDEX + PAGE_COUNT; json_index++) {
    let data = await getJSON('https://500px.me/community/contest/cb9bea96466f4dc39f5d5fe2d927a5f8/photos?orderby=createdTime&type=json&page=' + (json_index + 1) + '&size=20').then(data => JSON.parse(data).data);
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];　
      let url = `https://500px.me/community/tag?photoId=${obj.id}&startTime=&page=1&size=200&type=json`
      let list = await getJSON(url).then(data => JSON.parse(data));
      let imgList = []
      Handler.createDir(`./img/临时存储`);
      list.forEach((element, index) => {
        imgList.push({
          url: element.url.baseUrl + '!p5',
          path: path.resolve(__dirname, `./临时存储/${element.title}-index${element.url.baseUrl.substr(-10)}`),
          title: element.title
        });
      });
      try {　
        //并发抓取
        await handleDown(imgList, 3);
      } catch (error) {　　
        console.log(`■■■当前捕捉到的错误为://r//nerror//r//n`);　　
      }
    }
  };
}
/*
██████╗  █████╗  ██████╗ ███████╗
██╔══██╗██╔══██╗██╔════╝ ██╔════╝
██████╔╝███████║██║  ███╗█████╗
██╔═══╝ ██╔══██║██║   ██║██╔══╝
██║     ██║  ██║╚██████╔╝███████╗
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
*/
/*
'########:::::'###:::::'######:::'########:
 ##.... ##:::'## ##:::'##... ##:: ##.....::
 ##:::: ##::'##:. ##:: ##:::..::: ##:::::::
 ########::'##:::. ##: ##::'####: ######:::
 ##.....::: #########: ##::: ##:: ##...::::
 ##:::::::: ##.... ##: ##::: ##:: ##:::::::
 ##:::::::: ##:::: ##:. ######::: ########:
..:::::::::..:::::..:::......::::........::
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
        resolve(pageInfoParse(data));
      }
    });
  });
}
/**
 * 处理页面信息 (转化为可用对象)
 * @returns 
 */
function pageInfoParse(data) {
  let $ = cheerio.load(data);
  let anstitle = Handler.handleTitle($(data).find('title').text().trim());
  Handler.log(anstitle);
  //返回答案数,获取纯数字
  let answerCount = Handler.getNum($(data).find('.List-headerText span').text());
  Handler.log(`当前答案回答数:answerCount`);
  let pageInfo = {
    ansCount: answerCount,
    questionId: questionId,
    anstitle: anstitle
  }
  return pageInfo;
}
/*
     ██╗███████╗ ██████╗ ███╗   ██╗
     ██║██╔════╝██╔═══██╗████╗  ██║
     ██║███████╗██║   ██║██╔██╗ ██║
██   ██║╚════██║██║   ██║██║╚██╗██║
╚█████╔╝███████║╚██████╔╝██║ ╚████║
 ╚════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝
*/
/*
::::::'##::'######:::'#######::'##::: ##:
:::::: ##:'##... ##:'##.... ##: ###:: ##:
:::::: ##: ##:::..:: ##:::: ##: ####: ##:
:::::: ##:. ######:: ##:::: ##: ## ## ##:
'##::: ##::..... ##: ##:::: ##: ##. ####:
 ##::: ##:'##::: ##: ##:::: ##: ##:. ###:
. ######::. ######::. #######:: ##::. ##:
:......::::......::::.......:::..::::..::
*/
/**
 * 请求JSON时用到
 *
 * @param {*} { url = "", method = "post" } 传递地址和请求方式
 * @returns
 */
function getJSON(url = "", method = "post") {
  //URL地址
  return new Promise(function(resolve, reject) {
    nodegrass[method](url, (data, status, headers) => {
      if (data) {
        resolve(data);
      } else {
        reject(`地址:url获取失败,请检查程序`);
      }
    })
  });
}
/*
██████╗  ██████╗ ██╗    ██╗███╗   ██╗
██╔══██╗██╔═══██╗██║    ██║████╗  ██║
██║  ██║██║   ██║██║ █╗ ██║██╔██╗ ██║
██║  ██║██║   ██║██║███╗██║██║╚██╗██║
██████╔╝╚██████╔╝╚███╔███╔╝██║ ╚████║
╚═════╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝
*/
/*
'########:::'#######::'##:::::'##:'##::: ##:
 ##.... ##:'##.... ##: ##:'##: ##: ###:: ##:
 ##:::: ##: ##:::: ##: ##: ##: ##: ####: ##:
 ##:::: ##: ##:::: ##: ##: ##: ##: ## ## ##:
 ##:::: ##: ##:::: ##: ##: ##: ##: ##. ####:
 ##:::: ##: ##:::: ##: ##: ##: ##: ##:. ###:
 ########::. #######::. ###. ###:: ##::. ##:
........::::.......::::...::...:::..::::..::
*/
/**
 * 图片下载列表
 * @param {*} list 包含url,path,title属性
 * @param {*} num
 */
async function handleDown(list, num) {
  Handler.log(`当前一共■■ ${list.length} ■■个文件,并发量为■■ num ■■`);
  for (let index = 0; index < list.length; index += num) {
    let arr = [];
    for (let i = 0; i < num; i++) {
      let obj = list[index + i];
      if (obj) {
        arr.push(Handler.startDownloadTask(obj.url, obj.path, obj.title, IS_GIF));
      }
    }
    try {　　
      await Promise.all(arr).then(
        () => console.log(`✲✲✲✲✲✲✲✲✲完成 ${arr.length} 个✲✲✲✲✲✲✲✲✲✲✲`),
        err => console.log(err)
      );
    } catch (error) {　　
      console.log(error);　　
    }
  }
}
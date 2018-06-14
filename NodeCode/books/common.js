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

// const START_INDEX = 0; //从第几页开始请求
// const PAGE_COUNT = 10; //每次爬虫处理多少页
// const IS_GIF = false; //是否为GIF格式下载
// const MIN_DIANZAN = 0; //最小点赞数
// const USER_INPUT = "41710758"; //用户输入内容

let filePath = path.resolve(__dirname, './catlog.txt'); //存储目录
//开始调用方法
startSpider();

/**
 * 获取到问题基本信息后,开始遍历答案
 * @param {*} pageInfo 初步抓取页面获取到的信息
 */
async function startSpider(pageInfo) {
  let data = await getPage('http://www.wanjuanba.com/0/366/', true)
    .then(data => parseBookPage(data));
  let htmlStr = '';
  for (let index = 0; index < data.length; index++) {
    const obj = data[index];
    let word = await getPage(`http://www.wanjuanba.com/0/366/${obj.href}`, true)
      .then(
        data => parseSinglePage(data, obj.title),
        err => console.log(err)
      );
    htmlStr += word;
    if (index % 10 == 0) {
      await appendFile(filePath, htmlStr);
      htmlstr = '';
    }

  }
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
function getPage(url, isGBK = false) {
  //返回一个promise对象才可以调用then等函数
  return new Promise(function(resolve, reject) {
    let questionId = url.substr(url.lastIndexOf('/') + 1);
    nodegrass
      .get(url, (data, status, headers) => {
        if (!data) {
          reject(error);
        } else {
          resolve(data);
        }
      }, isGBK ? 'gbk' : 'utf-8')
      .on('error', function(e) {
        reject(e.message);
      });;
  });
}

function parseBookPage(data) {
  let $ = cheerio.load(data, { decodeEntities: false });
  let $ul = $(data).find("#wjb_body ul");
  console.log($ul.length);
  let htmlstr = '';
  let arr = [];
  $ul.find('li a').each(function(index, element) {
    arr.push({ href: $(element).attr('href'), title: $(element).text() });
  });
  return arr;
}


async function parseSinglePage(data, title) {
  console.log(`开始处理${title}`);
  let $ = cheerio.load(data, { decodeEntities: false });
  let word = $("#wjb_sbody #content").html();
  let bookBody = title + '\r\n' + replaceAll(replaceAll(word, '&nbsp;&nbsp;&nbsp;&nbsp;', '　　'), '<br>', '\r\n') + '\r\n\r\n\r\n\r\n';
  return bookBody;
}

/**
 * 替换某个字符串为另外一个字符串函数
 * 
 * @param {any} bigStr  全部字符
 * @param {any} str1 被替换的字符
 * @param {any} str2 新字符
 * @returns 新的字符串
 */
function replaceAll(bigStr, str1, str2) { //把bigStr中的所有str1替换为str2
  var reg = new RegExp(str1, 'gm');
  return bigStr.replace(reg, str2);
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
  Handler.log(`当前答案回答数:${answerCount}`);
  let pageInfo = {
    ansCount: answerCount,
    questionId: questionId,
    anstitle: anstitle
  }
  return pageInfo;
}

/*
'########:'####:'##:::::::'########:
 ##.....::. ##:: ##::::::: ##.....::
 ##:::::::: ##:: ##::::::: ##:::::::
 ######:::: ##:: ##::::::: ######:::
 ##...::::: ##:: ##::::::: ##...::::
 ##:::::::: ##:: ##::::::: ##:::::::
 ##:::::::'####: ########: ########:
..::::::::....::........::........::
*/

function appendFile(path, str) {
  return new Promise(function(resolve, reject) {
    fs.appendFile(path, str, err => {
      if (err) {
        reject(err);
      } else {
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        console.log("存储成功~");
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        resolve();
      }
    });
  });

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
        reject(`地址:${url}获取失败,请检查程序`);
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
  Handler.log(`当前一共■■ ${list.length} ■■个文件,并发量为■■ ${num} ■■`);
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
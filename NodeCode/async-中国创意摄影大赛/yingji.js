/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @note: 影集下载
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月4日11:26:56
 */
let nodegrass = require('nodegrass');
let Handler = require('./handle');
let path = require('path');
let fs = require("fs");
let cheerio = require('cheerio');

const START_INDEX = 5; //从第几页开始请求
const PAGE_COUNT = 1; //每次爬虫处理多少页
const IS_GIF = false; //是否为GIF格式下载
const MIN_DIANZAN = 0; //最小点赞数
const USER_INPUT = "41710758"; //用户输入内容

//开始调用方法
startSpider();

/**
 * 获取到问题基本信息后,开始遍历答案
 * @param {*} pageInfo 初步抓取页面获取到的信息
 */
async function startSpider(pageInfo) {
  for (let json_index = START_INDEX; json_index < START_INDEX + PAGE_COUNT; json_index++) {
    let data = await getJSON(`https://500px.me/community/search/set?hasCover=1&orderby=rating&page=${json_index + 1}&size=20&type=json`).then(data => JSON.parse(data).data);
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];
      let url = `https://500px.me/community/set/${obj.id}/photos?page=1&size=200&type=json`;
      let filePath = `./img/影集/${Handler.handleTitle(obj.title)}`;
      Handler.createDir(filePath);
      let list = await getJSON(url).then(data => JSON.parse(data).data);
      // Handler.log(list)
      let imgList = []
      Handler.createDir(`./img/临时存储`);
      list.forEach((element, index) => {
        imgList.push({
          url: element.url.baseUrl + '!p5',
          path: path.resolve(__dirname, `${filePath}/${Handler.handleTitle(element.title)||"摄影"}-${index}-${element.url.baseUrl.substr(-10)}`),
          title: element.title
        });
      });
      try {　
        //并发抓取
        await handleDown(imgList, 10);
      } catch (error) {　　
        console.log(`■■■当前捕捉到的错误为:\r\n${error}\r\n`);　　
      }
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
  Handler.log(`当前答案回答数:${answerCount}`);
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
        () => Handler.log(`✲✲✲✲✲✲✲✲✲完成 ${arr.length} 个✲✲✲✲✲✲✲✲✲✲✲`),
        err => console.log(err)
      );
    } catch (error) {　　
      console.log(error);　　
    }
  }
}

// nodejs - 异常处理
process.on('uncaughtException', function(err) {
  //打印出错误
  console.log(err);
  //打印出错误的调用栈方便调试
  console.log(err.stack);
});
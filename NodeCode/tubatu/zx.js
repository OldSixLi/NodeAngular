/*
 * 装修土巴兔 -两室
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年6月21日14:12:59
 * @Last Modified by: 马少博
 * @Last Modified time:date
 */
/* jshint esversion: 6 */

let nodegrass = require('nodegrass');
let Handler = require('./handle');
let path = require('path');
let fs = require("fs");
let cheerio = require('cheerio');

const START_INDEX = 2; //从第几页开始请求
const PAGE_COUNT = 7; //每次爬虫处理多少页
const IS_GIF = false; //是否为GIF格式下载
const MIN_DIANZAN = 0; //最小点赞数
const USER_INPUT = "41710758"; //用户输入内容

//开始调用方法
startSpider();

// getJSON('https://music.163.com/discover/playlist/?cat=%E8%AF%B4%E5%94%B1', 'get').then(data => console.log(data));
/**
 * 获取到问题基本信息后,开始遍历答案
 * @param {*} pageInfo 初步抓取页面获取到的信息
 */
// http://xiaoguotu.to8to.com/list.php?a1=0&a2=0&a3=2&a4=&a5=&a6=&a7=&a8=2&a9=0&p=2
// http://xiaoguotu.to8to.com/list.php?a1=0&a2=0&a3=2&a4=&a5=&a6=&a7=&a8=2&a9=0&p=1


// getPage(``)

async function startSpider(pageInfo) {
  for (let json_index = START_INDEX; json_index < START_INDEX + PAGE_COUNT; json_index++) {
    let data = await getPage(`http://xiaoguotu.to8to.com/list.php?a1=0&a2=0&a3=2&a4=&a5=&a6=&a7=&a8=2&a9=0&p=${json_index}`).
    then(data => pageInfoParse(data));
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];　
      let url = `http://xiaoguotu.to8to.com/case/list?a2=0&a12=&a11=${obj}&a1=0&a17=1`;
      let list = await getJSON(url).then(data => JSON.parse(data).dataImg);
      let currentObj = list.filter(x => x.cid == obj);
      let imgList = currentObj && currentObj.length && currentObj[0].album;
      let downList = [];
      let title = imgList[0].l.t;
      Handler.log(title);
      Handler.createDir(`./img2/${title}-${obj}`);
      imgList.forEach(a => {
        let x = a.l;
        downList.push({
          url: `http://pic2.to8to.com/case/${x.s}`,
          path: path.resolve(__dirname, `./img2/${title}-${obj}/${x.t}-${x.s.substr(-6)}`),
          title: title
        });
      });
      try {　
        //并发抓取
        await handleDown(downList, 3);
      } catch (error) {　　
        console.log(`■■■当前捕捉到的错误为:\r\n${error}\r\n`);　　
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
  //   console.log(data);
  let $ = cheerio.load(data);
  let anstitle = Handler.handleTitle($(data).find('title').text().trim());
  Handler.log(anstitle);
  //返回答案数,获取纯数字
  let $list = $(data).find('.xmp_container .item_img');
  let arr = [];
  $list.each(function(index, element) {
    // element == this
    let href = $(element).attr('href');
    arr.push(parseInt(href.substr(href.lastIndexOf('/') + 2)));
  });

  return arr;
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
    }, 'utf-8')
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
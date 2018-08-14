/**
 * 网易云音乐爬虫
 * @returns
 */

const nodegrass = require('nodegrass');
const DbHelper = require('./../../zhihu/mysql.js');

let SPIDER_INDEX = 1; //抓取到的数量
let PAYLIST_INDEX = 0; //可用的歌单
let PAYLIST_ARR = [];　　　　　
/*
:'######:::'#######::'##::::'##:'##::::'##:'########:'##::: ##:'########:
'##... ##:'##.... ##: ###::'###: ###::'###: ##.....:: ###:: ##:... ##..::
 ##:::..:: ##:::: ##: ####'####: ####'####: ##::::::: ####: ##:::: ##::::
 ##::::::: ##:::: ##: ## ### ##: ## ### ##: ######::: ## ## ##:::: ##::::
 ##::::::: ##:::: ##: ##. #: ##: ##. #: ##: ##...:::: ##. ####:::: ##::::
 ##::: ##: ##:::: ##: ##:.:: ##: ##:.:: ##: ##::::::: ##:. ###:::: ##::::
. ######::. #######:: ##:::: ##: ##:::: ##: ########: ##::. ##:::: ##::::
:......::::.......:::..:::::..::..:::::..::........::..::::..:::::..:::::
*/

//获取歌曲评论
getMusicList(1, 1000);
var MUSICLIST = [];

/**
 * 获取空评论列表并抓取数据填充进数据库中
 * 
 * @param {any} pageIndex 页码
 * @param {any} pageNum 分页偏移量
 */
async function getMusicList(pageIndex, pageNum) {
  console.log("请求第" + pageIndex + "页");
  DbHelper.getEmptyCommentMusicList(
    pageIndex,
    pageNum,
    async result => {
      if (result && result.length) {
        //如果返回结果
        for (var m = 0; m < result.length; m++) {
          var element = result[m];
          MUSICLIST.push(element);
        }
        //延时执行
        setTimeout(
          () => {
            pageIndex++;
            getMusicList(pageIndex, 1000);
          }, 500);
      } else {
        //进行请求操作
        await getMusic(10);
      }
    });
}

/**
 * 批量进行评论量请求
 * 
 * @param {any} asyncNum 每次请求的数量
 */
async function getMusic(num) {
  for (let index = 0; index < MUSICLIST.length; index += num) {
    let arr = [];
    for (let i = 0; i < num; i++) {
      let obj = MUSICLIST[index + i];
      if (obj) {
        arr.push(getCommentById(obj.mid));
      }
    }

    //循环执行
    try {　　
      await Promise.all(arr)
        .then(
          data => {
            return DbHelper.multiUpdateMusic(data);
          },
          err => console.log(err)
        )
        .then(
          data => {
            console.log(((data && data.affectedRows) || 0) + '条数据已更新')
            console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
          }, err => console.log(err)
        );
    } catch (error) {　　
      console.log(error);　　
    }
  }
}

async function getCommentById(mid) {
  return new Promise(function(resolve, reject) {
    nodegrass.get(
        "http://localhost:9999/comment/music?id=" + mid + '&limit=1&offset=2',
        data => {
          let total = JSON.parse(data).total || -1;
          resolve({
            mid,
            total
          });
        })
      .on('error', (e) => {
        resolve(0);
      });
  });
}
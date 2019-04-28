/**
 * 网易云音乐爬虫
 * @returns
 */

const nodegrass = require('nodegrass');
const DbHelper = require('./../../zhihu/mysql.js');

const SPIDER_INDEX = 1; // 开始请求的页面
const TOTAL_PLAY_PAGE = 60; //总页数
const SONG_CAT = "摇滚"; //类别 (从官网上看)

/*
'##::::'##:'########::'##::::'##:'########:'########:::'######::'####::'#######::'##::: ##:
 ##:::: ##: ##.... ##: ##:::: ##: ##.....:: ##.... ##:'##... ##:. ##::'##.... ##: ###:: ##:
 ##:::: ##: ##:::: ##: ##:::: ##: ##::::::: ##:::: ##: ##:::..::: ##:: ##:::: ##: ####: ##:
 ##:::: ##: ########:: ##:::: ##: ######::: ########::. ######::: ##:: ##:::: ##: ## ## ##:
 ##:::: ##: ##.....:::. ##:: ##:: ##...:::: ##.. ##::::..... ##:: ##:: ##:::: ##: ##. ####:
 ##:::: ##: ##:::::::::. ## ##::: ##::::::: ##::. ##::'##::: ##:: ##:: ##:::: ##: ##:. ###:
. #######:: ##::::::::::. ###:::: ########: ##:::. ##:. ######::'####:. #######:: ##::. ##:
:.......:::..::::::::::::...:::::........::..:::::..:::......:::....:::.......:::..::::..::
*/



getPlayListByPage()

/**
 * 一共请求多少页数据
 *
 */
async function getPlayListByPage() {
  for (let i = SPIDER_INDEX; i < TOTAL_PLAY_PAGE; i++) {
    let num = await getPlayLists(i).then(
      data => {
        if (data) {
          // ## 控制台输出 ##
          if (data.affectedRows >= 0) {
            console.log(`第${i}页有${data.affectedRows}条数据被插入数据库中`);
          }

          //如果请求到最大页码或者当前页码请求不到更多数据,执行删除语句
          if (i == TOTAL_PLAY_PAGE - 1 || data.affectedRows == -1) {
            DbHelper.deleteRepeatPlayList().then(
              data => console.log(`■■■■■■■■■■■■■删除${data.affectedRows}条重复数据■■■■■■■■■■■■■`));
          }
          return data.affectedRows;
        }
      },
      err => console.log(err)
    );

    if (num == -1) {
      //已无更多数据
      console.log(`已没有更多数据,停止请求`);
      break;
    }
  }
}


/**
 * 请求第 index_page_num 的歌单列表
 *
 * @param {*} index_page_num 页码
 * @returns
 */
async function getPlayLists(index_page_num) {
  return new Promise(function (resolve, reject) {
    nodegrass.post(
      `http://localhost:9999/top/playlist/highquality?limit=30&offset=${index_page_num * 35}&cat=${encodeURI(SONG_CAT)}`,
      (data, err) => {
        let arr = resolveResult(data, resolve);
        //执行批量添加操作
        DbHelper.multiPlayListAdd(arr)
          .then(
            data => resolve(data),
            err => reject(err)
          );
      });
  });

  function resolveResult(data, resolve) {
    let resultArr = [];
    //获取数据
    try {
      resultArr = JSON.parse(data) && JSON.parse(data).playlists;
    } catch (error) {
      console.log(error);
    }
    //判断当前页面能请求到几条歌单数据
    if (resultArr.length == 0) {
      resolve({ affectedRows: -1 });
    }
    console.log(`第【${index_page_num}】页,有 #${resultArr.length}# 条结果`);
    //遍历数组,将数据插入arr中用于数组批量保存
    let arr = [];
    resultArr.forEach(element => {
      // console.log(`歌单【${element.name}】---- 播放量:${element.playCount}万`);
      arr.push([element.id,
      element.name || "",
      `/playlist?id=${element.id}`,
      element.coverImgUrl || "",
      element.playCount || 0,
      getNowFormatDate()
      ]);
    });
    return arr;
  }
}

/**
 * 获取当天日期
 * @param {规定只返回日期还是返回日期时间} dates
 * @returns {}
 */
function getNowFormatDate(dates) {

  var date = new Date(),
    seperator1 = "-",
    seperator2 = ":",
    month = date.getMonth() + 1,
    strDate = date.getDate();
  if (month >= 1 && month <= 9)
    month = "0" + month;
  if (strDate >= 0 && strDate <= 9)
    strDate = "0" + strDate;
  //返回当前的日期（时间）
  var currentdate = dates !== 'date' ? date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds() : date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate;


}
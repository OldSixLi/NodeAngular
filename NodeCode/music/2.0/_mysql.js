/**
 * 网易云音乐爬虫
 * @returns
 */

const nodegrass = require('nodegrass');
const DbHelper = require('./../../zhihu/mysql.js');
const path = require('path');
const fs = require('fs');

let TOTAL_ERR = [];
String.prototype.replaceAll = function(str1, str2) {
  var reg = new RegExp(str1, 'gm');
  return this.replace(reg, str2);
}

start()
async function start() {
  let arr = await getList();
  console.log(arr.length);
  //  arr.length
  for (let i = 0; i < 1; i++) {
    await playList(arr[i].cid).then(
      data => {
        if (data.indexOf('-----') != -1) {
          TOTAL_ERR.push(data.split('-----')[0]);

          //写入文件中
          writeFile(path.resolve(__dirname, "错误列表.txt"), data.split('-----')[0] + '\r\n');
        }
        console.log(`第${i}条处理结果是:■■■■【 ${data} 】■■■■`);
        console.log();
      }
    );
  }
  console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
  console.log(TOTAL_ERR);
  console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
}

async function getList() {
  // let sql=`select collectid as cid  from  music  group by collectid`;
  let sql = `select  * from (select collectid as cid,count(mid) as c from music where  (name is null or  name="") group by collectid) a where c>100`;
  return DbHelper
    .resloveSql(sql)
    .then(data => [...data]);
}

//写入文件utf-8格式 
function writeFile(fileName, data) {
  //追加内容
  fs.appendFile(fileName, data, 'utf-8');
  //写入文件
  // fs.writeFile(fileName, data, 'utf-8');
}

function handleStr(str = "") {
  console.log(str);
  return str.replaceAll("'", "''").replaceAll('"', "\"");
}

async function playList(playId) {
  let playUrl = `http://localhost:9999/playlist/detail?id=${playId}`
  return new Promise(function(resolve, reject) {
    nodegrass.get(playUrl, data => {
      let playObj = {};
      try {　　
        playObj = data && JSON.parse(data);
      } catch (error) {　　
        console.log(error);　　
      }
      let musicArr = playObj.privileges || [];
      if (musicArr.length > 0) {
        let musicNameArr = playObj.playlist && playObj.playlist.tracks || [];
        let musicObjArr = [];
        let nameStr = "",
          authorStr = "";
        authorIdStr = ""
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        console.log(musicNameArr.length);
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        musicNameArr.forEach((musicObj) => {
          nameStr += ` when ${musicObj.id} then "${handleStr(musicObj.name|| "")}" `;
          authorStr += ` when ${musicObj.id} then "${handleStr(musicObj.ar && musicObj.ar[0] && musicObj.ar[0].name || "")}" `;
          authorIdStr += ` when ${musicObj.id} then "${musicObj.ar && musicObj.ar[0] && musicObj.ar[0].id || ""}" `;
        });


        let sqlStr = `update music set 
        name = case mid 
            ${nameStr}
        end, 
        author = case mid 
            ${authorStr}
        end,
        authorId = case mid 
        ${authorIdStr}
        end
        WHERE collectid IN (${playId})`;


        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        console.log(sqlStr);
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        DbHelper
          .resloveSql(sqlStr)
          .then(
            data => {
              console.log(`歌单【${playObj.playlist.name}--${playId}】--- # ${data.affectedRows} #条数据已在数据库中更新`);
              resolve("处理完成")
            },
            err => {
              resolve(`${playId}-----歌单【${playObj.playlist.name}】插入数据库出现错误:${err},■■■■■■■■■■■■■■■■${sqlStr}`)
            });
      } else {
        resolve(`${playId}--Empty Value`)
      }
    })
  });
}



/*
:'#######::'##:::::::'########::
'##.... ##: ##::::::: ##.... ##:
 ##:::: ##: ##::::::: ##:::: ##:
 ##:::: ##: ##::::::: ##:::: ##:
 ##:::: ##: ##::::::: ##:::: ##:
 ##:::: ##: ##::::::: ##:::: ##:
. #######:: ########: ########::
:.......:::........::........:::
*/

const COLUMN_NAME = "author";

// startReplaceAuthor()
async function startReplaceAuthor() {
  for (let index = 237; index <= 300; index++) {
    try {　　
      // 此处是可能产生例外的语句
      let rows = await resolveByPage(index);
      console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
      console.log(`第${index}页面,影响${rows}条数据`);
      console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
    } catch (error) {　　
      console.log(`第${index}页面出错:${error}`);　　
    }

  }
}



function resolveByPage(pageIndex) {
  return DbHelper.resloveSql(`
  select GROUP_CONCAT(mid) from 
  (select * from music
      where mid  in(select mid from(select mid from music where createtime >'2018-06-08 19:24:17' and createtime <'2018-08-13 18:28:02') a)
    and id  in (select id from(select max(id) as id from  music  group by mid  having count(mid )>1) b) limit ${(pageIndex-1)*100},100) c`)
    .then(
      data => {
        let mids = Object.values(data[0])[0]
        return mids;
      }
    ).then(
      mids => {
        return DbHelper.resloveSql(`
            select GROUP_CONCAT(' WHEN ',mid,' THEN "',${COLUMN_NAME} ,'" ')  from
            (select * from music
              where mid  in(select mid from(select mid from music where createtime >'2018-06-08 19:24:17' and createtime <'2018-08-13 18:28:02') a)
            and id  in (select id from(select max(id) as id from  music  group by mid  having count(mid )>1) b) limit ${(pageIndex-1)*100},100) c`)
          .then(
            data => {
              let datastr = Object.values(data[0])[0];
              datastr = replaceAll(datastr, " , ", "  ");
              // console.log(datastr);
              return `update music set ${COLUMN_NAME}=case mid ${datastr} end where mid in (${mids})`;
            }
          )
      }
    ).then(
      finalStr => {
        return DbHelper.resloveSql(`${finalStr}`).then(
          data => {
            return data;
          },
          err => {
            console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
            console.log(finalStr);
            console.log(err);
            console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");


          }
        )
      }
    )
    .then(
      result => {
        return result.affectedRows;
      },
      err => {
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        console.log(err);
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
      }
    )
}




// HEN "T-Wayne", WHEN 415792028 THEN "Post Malone", WHEN 29326342 THEN "Tinashé", WHEN 27863403 THEN "Wet", WHEN 17683161 THEN "Omarion", WHEN 34040439 THEN "Tinashé"
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
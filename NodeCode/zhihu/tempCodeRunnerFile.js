// import { retry } from './C:/Users/Administrator/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/async';

// import { Promise } from 'C:/Users/Administrator/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/q';
// import { resolve } from 'dns';

/**
 * 知乎抓取数据存储进入数据
 * @李老六(1030809514@qq.com )
 * @date    2016年8月2日13:06:18
 * @version v 0.1.1
 */

var getmoudle_path = 'C:/Program Files/nodejs/node_modules/';
var mysql = require('mysql');
var TEST_DATABASE = 'nodesql';
var TEST_TABLE = 'user';

//创建连接
var client = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  port: '3306'
});
client.connect();
//和哪个数据库建立连接
client.query("use " + TEST_DATABASE);

/**
 * 通用的数据存储方法
 * 后期移出 (统一以Promise方式回调)
 * @returns 
 */

function insert(sql, param, callback) {
  let addSql = sql;
  return new Promise((resolve, reject) => {
    client.query(sql, param, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

//数据存储
function start(questrionModel) {

  //语句
  var userAddSql = 'INSERT INTO Answers(QuestrionId,Question,AnswerUserName,AnswerUserLink,AnswerId,DianzanCount,Detail,CreateTime) VALUES(?,?,?,?,?,?,?,NOW())';
  //参数
  var userAddSqlParams = [
    questrionModel.QuestrionId,
    questrionModel.Question,
    questrionModel.AnswerUserName,
    questrionModel.AnswerUserLink,
    questrionModel.AnswerId,
    questrionModel.DianzanCount,
    questrionModel.Detail
  ];

  //增 add
  client.query(userAddSql, userAddSqlParams, function(err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    console.log('~~~~~~~~~~~~~~~~~~~数据插入成功~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('作者：【' + questrionModel.AnswerUserName + '】,用户链接' + questrionModel.AnswerUserLink);
    console.log('INSERT ID:', result.insertId + ',Anserid:' + questrionModel.AnswerId + ' ,点赞数：【' + questrionModel.DianzanCount + '】 ');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n');

  });

}

/**
 * 数据库中插入用户
 * 
 * @param {any} userModel 用户信息对象
 */
function AddUser(userModel) {
  let userAddSql = 'INSERT INTO music_users(\
    userid,\
    nickname,\
    weibourl,\
    selfword,\
    imgurl,\
    date,\
    level) \
    VALUES(?,?,?,?,?,NOW(),?)';
  let params = [
    userModel.userid,
    userModel.nickname,
    userModel.weibourl,
    userModel.selfword,
    userModel.imgurl,
    userModel.level
  ]
  return new Promise((resolve, reject) => {
    client.query(
      userAddSql,
      params,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve('插入成功');
        }
      });
  });
}

function addFollow(arr) {
  let sql = 'INSERT INTO user_follow(\
    userid,\
    followid,followusername) \
    VALUES';

  let str = "";
  let strArr = arr.map(x => {
    return '(' + x.userID + ',' + x.followID + ',"' + x.followUserName + '")';
  });

  params = strArr.join(',');

  return new Promise((resolve, reject) => {
    client.query(
      sql + params, null,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("成功插入啊");
          resolve('插入成功');
        }
      });
  });
}

function getFollow() {
  let sql = "select * from user_follow";
  //返回一个promise对象才可以调用then等函数
  return new Promise(function(resolve, reject) {
    client.query(findSql, function(err, result) {
      if (err) {
        reject(value);
      } else {
        resolve(result);
      }
    });
  });
}

getFollow().then(result => { console.log(result); })

/**
 * 歌单插入数据库
 * 
 * @param {any} model 
 */
function musicPayListAdd(model) {
  var findSql = "select * from paylist where playid=" + model.playId;
  var sql = "insert  into paylist(playId,name,href,src,collectnum,createtime) values(?,?,?,?,?,NOW())";
  var param = [model.playId, model.name, model.href, model.imgSrc, model.collectCount];
  //查
  client.query(findSql, function(err, result) {
    if (!err && result.length == 0) {
      //增 add
      client.query(sql, param, function(err, result) {
        if (err) {
          console.log('[INSERT ERROR] - ', err.message);
          return;
        }
        console.log('~~~~~~~~~~~~~~~~~~~数据插入成功~~~~~~~~~~~~~~~~~~~~~~~');
        console.log('名称：' + model.name);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n');
      });
    } else {
      console.log(result.length + '个结果已存在');
    }
  });
}

/**
 * 获取歌单ID列表
 * @returns
 */
function playList(next) {
  var sql = 'select DISTINCT playid from paylist';
  client.query(sql, function(err, result) {
    if (!err) {
      next(result);
    } else {
      next([]);
    }
  })
}

//查询当前的问题是否已经遍历过
/**
 * 
 * 
 * @param {any} questionId 
 * @param {any} next 
 */
function finds(questionId, next) {
  if (questionId) {

    var userAddSql = 'select * from  Answers where QuestrionId="' + questionId + '"';
    client.query(userAddSql, function(err, result) {
      if (!err) {
        next(result.length);
      } else {
        next(0);
      }
    });
  };
}



function getMusicList(pageInedx, pageNum, next) {
  var start = (pageInedx - 1) * pageNum;
  var end = pageNum;
  var sql = "select id,mid from music where comment=0  LIMIT " + start + "," + pageNum;
  client.query(sql, function(err, result) {
    if (!err) {
      next(result);
    } else {
      next(0);
    }
  });
}
/**
 * 获取高评论量歌曲
 * 
 * @param {any} next 
 */
function getHighQualityMusicList(next) {
  // var sql = "select mid from music where COMMENT>100000";
  var sql = "select * from music where comment>=50000 and comment<=100000 order by id ";
  // and COMMENT<=50000 order by id limit 1400,200
  client.query(sql, function(err, result) {
    if (!err) {
      next(result);
    } else {
      next(0);
    }
  })
}
/**
 * 更新评论数量以及歌曲名称
 * 
 * @param {any} model 
 */
function updateMusic(model) {
  var sql = "update music set comment=" + model.total + "  where id=" + model.id + " and comment=0";
  client.query(sql, function(err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    console.log('名称：' + getfullStr(model.id) + ",▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇评论量:" + model.total);
  });
}

function getfullStr(str) {
  var a = (10 - str.length);
  var nullstr = "";
  for (var index = 0; index < a; index++) {
    nullstr += ' ';
  }
  return str + nullstr;
}


function musicAdd(model) {
  // var findsql = 'select * from music where mid=' + model.mid;
  var sql = "insert  into music(mid,name,comment,collectid,createtime) values(?,?,?,?,NOW())";
  var param = [model.id, model.name, model.comment, model.collectid];
  // client.query(findsql, function(err, result) {
  // if (!err && result != undefined && result.length == 0) {
  //增 add
  client.query(sql, param, function(err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    console.log('歌曲ID:▇▇▇▇▇▇▇▇' + model.id);
  });
  //   } else {
  //     console.log(model.id + '已存在此歌曲');
  //   }
  // })

  // delete from music
  // where mid  in(select mid from(select mid from  music  group by mid  having count(mid )>1) a)
  // and id not in (select id from(select min(id) as id from  music  group by mid  having count(mid )>1) b)
}
//输出函数
exports.start = start;
exports.finds = finds;
exports.listAdd = musicPayListAdd; //歌单添加内容
exports.musicAdd = musicAdd;
exports.getMusicList = getMusicList;
exports.updateMusic = updateMusic;
exports.getHighQualityMusicList = getHighQualityMusicList;
exports.playList = playList;
exports.addUser = AddUser;
exports.addFollow = addFollow;
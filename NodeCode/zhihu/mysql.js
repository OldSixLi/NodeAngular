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
 * 歌单插入数据库
 * 
 * @param {any} model 
 */
function musicPayListAdd(model) {
  var sql = "insert  into paylist(name,href,src,collectnum,createtime) values(?,?,?,?,NOW())";
  var param = [model.name, model.href, model.imgSrc, model.collectCount];
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
  })
}

function getHighQualityMusicList(next) {
  // var sql = "select mid from music where COMMENT>50000";
  var sql = "select DISTINCT mid from music where COMMENT>10000 and COMMENT<=50000 order by id limit 500,100 ";
  client.query(sql, function(err, result) {
    if (!err) {
      next(result);
    } else {
      next(0);
    }
  })
}

function updateMusic(model) {
  var sql = "update music set comment=" + model.total + " where id=" + model.id + " and comment=0";
  client.query(sql, function(err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    console.log('~~~~~~~~~~~~~~~~~~~数据更新成功~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('名称：' + getfullStr(model.id) + ",▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇评论量:" + model.total);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n');
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
  var sql = "insert  into music(mid,name,comment,collectid,createtime) values(?,?,?,?,NOW())";
  var param = [model.id, model.name, model.comment, model.collectid];
  //增 add
  client.query(sql, param, function(err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    console.log('歌曲ID:▇▇▇▇▇▇▇▇' + model.id);
  });

  //删除重复音乐ID
  // delete from music
  // where mid  in( select mid from (select  mid  from music  group  by  mid   having  count(mid) > 1) a)
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
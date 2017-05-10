/*
 * MySql DbHelper类
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2017年5月9日09:10:31
 * @Last Modified by: 马少博
 * @Last Modified time:2017年5月9日09:11:28
 */

//pre-required params  
var sql = require('msnodesql');
var xml = require('./mysql/operateXML.js');
var paramObj = xml.getParamObj();
var conn_str = "Driver={" + paramObj.mydb_driver + "};Server={" + paramObj.mydb_server + "};Database={" + paramObj.mydb_database + "};uid=" + paramObj.mydb_user + ";PWD=" + paramObj.mydb_pwd + ";";


//open database  
sql.open(conn_str, function(err, conn) {
  if (err) {
    console.log(err);
  }
});

function exeScript(sqlscript) {
  sql.queryRaw(conn_str, sqlscript, function(err, results) {

    if (err) {
      console.log(err);
    } else {
      console.log(results);
    }
  });
}

function select(sqlscript) {
  sql.queryRaw(conn_str, sqlscript, function(err, results) {

    if (err) {
      console.log(err);
    } else {
      var txt = toJson(results, paramObj.table_name);
      var jsonObj = eval("(" + txt + ")");
      console.log(jsonObj);
    }
  });
}

function del(sqlscript) {
  exeScript(sqlscript);
}

function update(sqlscript) {
  exeScript(sqlscript);
}

function add(sqlscript) {
  exeScript(sqlscript);
}
//convert table to json  
function toJson(dt, tbName) {
  var jsonString;
  if (dt != undefined && dt.rows.length > 0) {
    var rowLen = dt.rows.length;
    var colLen = dt.meta.length;
    jsonString = "{";
    jsonString += "\"" + tbName + "\":[";
    for (var i = 0; i < rowLen; i++) {
      jsonString += "{";
      for (var j = 0; j < colLen; j++) {
        if (j < colLen - 1) {
          jsonString += "\"" + dt.meta[j].name + "\":" + "\"" + dt.rows[i][j] + "\",";
        } else if (j == colLen - 1) {
          jsonString += "\"" + dt.meta[j].name + "\":" + "\"" + dt.rows[i][j] + "\"";
        }
      }
      if (i == rowLen - 1) {
        jsonString += "}";
      } else {
        jsonString += "},";
      }
    }
    jsonString += "]}";
    return jsonString;
  }
  return jsonString;
}
exports.add = add;
exports.del = del;
exports.update = update;
exports.select = select;
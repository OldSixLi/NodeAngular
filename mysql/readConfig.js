function params() {
  this.mydb_driver = "";
  this.mydb_server = "";
  this.mydb_database = "";
  this.mydb_user = "";
  this.mydb_pwd = "";
  this.table_name = "";
}

function getParamObj() {
  var libxmljs = require('C:/nodejs/node_modules/libxmljs');
  var fs = require('fs');
  var path = './mysql/config.xml';
  var param = new params();
  var data;
  try {
    data = fs.readFileSync(path, 'utf8');
  } catch (err) {
    throw err;
  }
  var xmlDoc = libxmljs.parseXmlString(data);
  var mydb = xmlDoc.get('//mydb');
  var table = xmlDoc.get('//mydb//table');
  param.mydb_driver = mydb.attr('driver').value();
  param.mydb_server = mydb.attr('server').value();
  param.mydb_database = mydb.attr('database').value();
  param.mydb_user = mydb.attr('user').value();
  param.mydb_pwd = mydb.attr('pwd').value();
  param.table_name = table.attr('name').value();
  //console.log(param.mydb_server+" "+param.table_name);  
  return param;
}
console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
console.log(JSON.stringify(getParamObj()));
console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");

exports.getParamObj = getParamObj;
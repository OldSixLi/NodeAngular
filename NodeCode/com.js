let nodegrass = require('nodegrass');
/**
 * 请求URL
 *
 * @param {*} url
 */
async function getUrl(url) {
  return new Promise(function(resolve, reject) {
    nodegrass.get(url, (data) => {
      if (!data) {
        reject(error);
      } else {
        resolve(data)
      }
    })
  })
}



/**
 * NOTE :第一步,获取TOKEN  
 * @returns 
 */

function getToken() {
  getUrl(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww9ecff2c17e5ae91d&corpsecret=6vMxyoarNw4VsoS-dqVj55Fss7YfXNwCfTZPygSdXLY`)
    .then(data => {
      console.log(data);
      let jsondata = JSON.parse(data);
      return jsondata.access_token;
    })
    .then(
      token => {
        console.log(
          `TOKEN:
      ${token}
    `)
      }
    )
}

const TOKEN = `aPzSdTglajhWXXBPtm4hPj5g5MNir0FBdeGxW5dV9icXhI215ntGy6AZ8ZFttZrTaQJY8mV2is77YE9av0UZ_6fwuyDxMyz56l6jUB_JnZmXf2FPudvC9iqnSlv_H1Q4P2277jjQGmT08CAXrduz67C52SukfNTKvUz-gQJNuA8LeMAPwmIGHuqxUC_GK7rCC8WZgoXV5SSUTYOXHV9eBQ`;
/**
 * NOTE 第二步:获取数据 
 * @returns 
 */

function getDepart() {
  getUrl(`https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${TOKEN}`).then(
    data => {
      console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
      console.log(data);
      console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");

    }
  )
}


let code = `L2zXNQbHgrTYlDrCrNQWFCCOj4DVN5Cq4dzkW8O0RoY`;
function getCode() {
  getUrl(`http://192.168.106.12:8080/self/login?code=${TOKEN}`).then(
    data => {
      console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
      console.log(data);
      console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
    }
  )
}

// getToken();
getDepart();
// getCode();
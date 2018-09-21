let nodegrass = require('nodegrass');
/**
 * 请求URL
 *
 * @param {*} url
 */
async function getUrl(url) {
  return new Promise(function (resolve, reject) {
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
  getUrl(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wxa059996e5d72516b&corpsecret=dyVJZt6tqSkKH8w8goXFH8yRV_dbIi_d0wX1_vPnXsE`)
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

const TOKEN = `0g5_24FDqaNOXquYiot6l3A4NMy6iCxHJ7Dr3L-_cU_B-6l3r0vYz8_tbZ38_411CwPG3EAhi1GD8N51JLOnUU6A9YJTW87X10yXz_L0rBZT5CCYmVr9b4SuosKgHzdCf3a3fNlwG5K2NMVSMoI9wUeuewl5RG4UXVWvlrvocKlcrzB28_kGqxAAGb6BFdFmgengsQcIEC4O3oP_IIz7uw`;
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
// getDepart();
getCode();
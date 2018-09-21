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

const TOKEN = `0g9chnESSCHL34CfA6tZ5Q6aBkVcWNM7ynPsPX3MSTOgpM0x3FemQWsICLUQNYVs6JemeyVSp6-MZAemvTn4cfdN335BqqqITW3nSjpUhTR7M2K8VtEfy_eSou3hcGW-ljS8RgG2JI_nFINa8cCWsrXHnf596Szp4E0S5OoTSDQ95DwPMMYEPptTnsDx4iyEgbSYQ2MFsOtvHq3lEB6lcw`;

/**
 * NOTE :第一步,获取TOKEN  
 * @returns 
 */
getUrl(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wxa059996e5d72516b&corpsecret=dyVJZt6tqSkKH8w8goXFH8yRV_dbIi_d0wX1_vPnXsE`)
  .then(data => {
    let jsondata = JSON.parse(data);
    return jsondata.access_token;
  })
  .then(
    token => {
      console.log(
        `TOKEN:
                ${token}`)
    }
  )

/**
 * NOTE 第二步:获取数据 
 * @returns 
 */

// getUrl(`https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=${TOKEN}&department_id=1&fetch_child=0`).then(
//   data => {
//     console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
//     console.log(data);
//     console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
//   }
// )
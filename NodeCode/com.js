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

const TOKEN = `zin6ppMNNgzoMwCgf11ZZfFNoHw_cz1RW-OF81yQVrqJJBg-lG6IpuAVEHiszW_-Xaxo-MUEC3_zricOPD4zFQKquiXKJMs8EUMHOhBPh9O4w6nMl8ubmBBMWmbpkJzZt_lNfcHuCCM8WhBlhpBHJd1LzJS9D4Un-_9zz9ivWHSKa5SaIGY-8XtL6eOJWU_gb6R1Pv4OzklGrv8EVKOIjg`;

/**
 * NOTE :第一步,获取TOKEN  
 * @returns 
 */
getUrl(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wxa059996e5d72516b&corpsecret=dyVJZt6tqSkKH8w8goXFH8yRV_dbIi_d0wX1_vPnXsE`)
  .then(data => {
    // console.log(data);
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

/**
 * NOTE 第二步:获取数据 
 * @returns 
 */

// getUrl(`https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${token}`).then(
//   data => {
//     console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
//     console.log(data);
//     console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
//   }
// )
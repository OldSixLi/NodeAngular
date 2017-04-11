 //   ********************马少博 2017年3月31日11:23:11 新增代码 ***********************
 $("#phoneModal").modal({
   show: false,
   backdrop: false
 });
 $("#phoneRemoveModal").modal({
   show: false,
   backdrop: false
 });
 $("#emailModal").modal({
   show: false,
   backdrop: false
 });
 $("#emailRemoveModal").modal({
   show: false,
   backdrop: false
 });

 $(function() {

   $(".close-erweima").click(function() {
     $(".erweima").hide(300);
   });
   $("#erweimaLink").click(function(e) {
     $(".erweima").show(300);

   });
   //  *****************手机号码操作部分********************
   //发送验证码 1.判断是否存在手机号  2.判断是否可用手机号  3.请求发送验证码
   $("#getNumber").click(function(e) {
     e.preventDefault();
     var phone = $.trim($("#newPhone").val());
     if (phone == "" || phone == null) {
       //没有输入手机号提示
       //    alert("");
       tool.alert("提示", "请输入手机号码后在进行操作");
     } else if (!checkPhone(phone)) {
       tool.alert("提示", "手机号码格式不正确,请修改后再进行操作");
     } else {
       //异步请求操作
       //校验手机号是否存在
       $.ajax({
         type: "POST",
         url: "/user/info/checkPhone",
         data: {
           cell_phone_number: phone
         },
         dataType: "json",
         success: function(data) {
           if (data != null && data != "") {
             if (data.success) {
               //可用手机号
               sendCode(phone);
               //   tool.alert("提示", "保存成功");
             } else {
               // 不可用手机号
               alert("该手机号已存在,请重试其他手机号进行操作");
               //   tool.alert("提示", "该手机号已存在,请重试其他手机号进行操作");
             }
           } else {
             //failed  do something
           }
         },
         error: function(response) {
           //    tool.alert("提示", "请求服务失败,请重试!");
         }
       });

     }
   });

   //修改手机号操作 1.判断是否存在必要数据 2.校验验证码正确性 3.发送修改请求
   $("#savePhoneNum").click(function(e) {
     e.preventDefault();
     // var phone = $("#newPhone").val(),
     //   code = ("#newNumber").val();

     var saveInfo = {
       phone: $.trim($("#newPhone").val()),
       code: $.trim($("#newNumber").val())
     };
     var __error = [];
     if (saveInfo.phone == "") {
       __error.push("请输入手机号后再进行操作！");
     }
     if (saveInfo.code == "") {
       __error.push("请输入验证码后再进行操作！");
     }

     if (__error.length > 0) {
       //有错误  do something
       //    tool.alert("提示", __error.join("<br />"));
       return false;
     }
     //验证是否匹配并且发送修改请求
     checkCode(saveInfo.phone, saveInfo.code);
   });

   //解除手机绑定 操作
   $("#removePhoneBtn").click(function(e) {
     e.preventDefault();
     $.ajax({
       type: "POST",
       url: "/user/info/reBundlingPhone",
       dataType: "json",
       success: function(data) {
         if (data != null && data != "") {
           if (data.success) {
             tool.alert("提示", "解绑成功");
           } else {
             tool.alert("提示", "解绑失败");
           }

         } else {
           //failed  do something
         }
       }
     });
   });
   //  *****************手机号码操作部分END********************

   //  *****************邮箱地址操作部分********************
   //发送邮箱地址验证码
   $("#getEmailNumber").click(function(e) {
     e.preventDefault();
     var email = $.trim($("#newEmail").val());
     if (email == "" || email == null) {
       //没有输入手机号提示
       alert("请输入邮箱地址后在进行操作");
     } else {
       //异步请求操作
       //校验邮箱地址是否已存在
       $.ajax({
         type: "POST",
         url: "/user/info/checkEmail", //校验邮箱地址(待确定)
         data: {
           email: email
         },
         dataType: "json",
         success: function(data) {
           if (data != null && data != "") {
             if (data.success) {
               //可用邮箱地址
               //发送验证码
               sendEmailCode(email);
               //   tool.alert("提示", "保存成功");
             } else {
               // 不可用邮箱地址
               alert("该邮箱地址已存在,请重试其他邮箱进行操作");
               //   tool.alert("提示", "该邮箱地址已存在,请重试其他邮箱进行操作");
             }
           } else {
             //failed  do something
           }
         }
       });

     }
   });
   //修改邮箱绑定地址
   $("#saveEmailNum").click(function(e) {
     e.preventDefault();
     var saveInfo = {
       email: $.trim($("#newEmail").val()),
       code: $.trim($("#newEmailNumber").val())
     };
     var __error = [];
     if (saveInfo.email == "") {
       __error.push("请输入邮箱地址后再进行操作！");
     }
     if (saveInfo.code == "") {
       __error.push("请输入邮箱地址后再进行操作！");
     }

     if (__error.length > 0) {
       //有错误  do something
       //    tool.alert("提示", __error.join("<br />"));
       return false;
     }
     //验证邮箱地址与验证码是否匹配并且发送修改请求
     checkEmailCode(saveInfo.email, saveInfo.code);
   });

   //解除邮箱绑定 操作
   $("#removeEmailBtn").click(function(e) {
     e.preventDefault();
     $.ajax({
       type: "POST",
       url: "/user/info/reBundlingEmail",
       dataType: "json",
       success: function(data) {
         if (data != null && data != "") {
           if (data.success) {
             tool.alert("提示", "解绑邮箱成功");
           } else {
             tool.alert("提示", "解绑邮箱失败");
           }

         } else {
           //failed  do something
         }
       }
     });
   });
   //  *****************邮箱地址操作部分END********************
 });

 /**
  * 发送手机验证码 
  * 
  * @param {any} num 手机号 
  */
 function sendCode(num) {
   $.ajax({
     url: "/user/info/sendMsgToPhone",
     data: {
       mobicell_phone_number: num
     },
     dataType: "JSON",
     type: "POST",
     success: function(data) {
       if (data.success) {
         console.info("发送成功");
         // $("#getNumber").addClass("disabled").text("已发送");
       } else {
         console.info("发送失败");
       }
     }
   });
 }

 /**
  * 验证手机号与验证码是否匹配
  * 
  * @param {any} phone 手机号
  * @param {any} code 验证码
  */
 function checkCode(phone, code) {
   $.ajax({
     type: "POST",
     url: "/user/info/checkPhoneCode",
     data: {
       cell_phone_number: phone,
       phoneCode: code
     },
     dataType: "json",
     success: function(data) {
       if (data != null && data != "") {
         //校验手机号是否匹配验证码
         if (data.success) {
           //匹配  进行修改操作

           $.ajax({
             type: "POST",
             url: "/user/info/bundlingPhone",
             data: {
               cell_phone_number: phone
             },
             dataType: "json",
             success: function(data) {
               if (data != null && data != "") {
                 if (data.success) {
                   //    tool.alert("提示", "修改手机号成功");
                   alert("修改手机号成功");
                 } else {
                   //    tool.alert("提示", "修改手机号失败");
                   alert("修改手机号失败");
                 }
               } else {
                 //failed  do something
                 //  tool.alert("提示", "修改手机号失败");
               }
             }
           });

         } else {
           //不匹配 提示用户修改
           //    tool.alert("提示", "保存失败");
           alert("手机号码与验证码不匹配");
         }

       } else {
         //failed  do something
       }
     }
   });
 }


 // ****************************************************************************
 /**
  * 发送邮箱验证码 
  * 
  * @param {any} email  邮箱地址
  */
 function sendEmailCode(email) {
   $.ajax({
     url: "/user/info/sendMsgtoEmail",
     data: {
       email: email
     },
     dataType: "JSON",
     type: "POST",
     success: function(data) {
       if (data.success) {
         console.info("发送成功");
         // $("#getNumber").addClass("disabled").text("已发送");
       } else {
         console.info("发送失败");
       }
     }
   });
 }


 /**
  * 校验邮箱验证码是否匹配
  * 
  * @param {any} email 邮箱地址
  * @param {any} code 邮箱验证码
  */
 function checkEmailCode(email, code) {
   $.ajax({
     type: "POST",
     url: "/user/info/checkEmailCode",
     data: {
       email: email,
       emailCode: code
     },
     dataType: "json",
     success: function(data) {
       if (data != null && data != "") {
         //校验邮箱地址是否匹配验证码
         if (data.success) {
           //匹配  进行修改操作

           $.ajax({
             type: "POST",
             url: "/user/info/bundlingEmail",
             data: {
               email: email
             },
             dataType: "json",
             success: function(data) {
               if (data != null && data != "") {
                 if (data.success) {
                   //    tool.alert("提示", "修改手机号成功");
                   alert("绑定邮箱地址成功");
                 } else {
                   //    tool.alert("提示", "修改手机号失败");
                   alert("绑定邮箱地址失败");
                 }
               } else {
                 //failed  do something
                 //  tool.alert("提示", "修改手机号失败");
               }
             }
           });

         } else {
           //不匹配 提示用户修改
           //    tool.alert("提示", "保存失败");
           alert("手机号码与验证码不匹配");
         }

       } else {
         //failed  do something
       }
     }
   });
 }


 /**
  * 电话校验
  * 
  * @param {any} phone 手机号
  * @returns 是否有效 T/F
  */
 function checkPhone(phone) {
   if (!(正则表达式.test(phone))) {
     return false;
   } else {
     return true;
   }
 }




 /**
  * 邮箱校验
  * 
  * @param {any} mail 邮箱地址
  * @returns 是否有效 T/F
  */
 function CheckMail(mail) {
   var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   if (filter.test(mail)) {
     return true;
   } else {
     return false;
   }
 }

 // ******************************代码结束***************************

 //  自定义代码部分
 //  console.log(${1:"数据" 
 for (var i = 0; i < length; i++) {

 }
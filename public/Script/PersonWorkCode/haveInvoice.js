var params = "&";
$(function() {
    $(".breadcrumb,#search_block").height("45px");

    //隐藏输入框：发票代码 发票号码 收据单号
    $(".secondInput").hide();

    //修改下拉菜单样式
    tool.changeSelect($("#sltInvoiceType"), false);



    //点击确定按钮时根据条件进行请求（拼接请求字符串）
    $("#btnSearch").click(function() {
        var type = $("#sltInvoiceType").val();
        if (type == "") {
            params = "";
            pageing(1, params);
        } else {
            var fpdm = $("#inputInvoiceCode").val(),
                fphm = $("#inputInvoiceNum").val();
            params = "&invoicetype=" + type + "&fpdm=" + fpdm + "&fphm=" + fphm;
            pageing(1, params);
        }
    });
});

//请求数据
$(function() {
    //请求第一页的内容
    pageing(1, "");
});

//已开具发票数据部分 翻页的异步请求方法
function pageing(pageindex, params) {
    //拼接的table字符串
    var htmlstr = "";
    //请求参数地址
    var url = "http://" + tool.getUrlArea() + "/csfwpt_console/restful/invoice/list?currentPage=" + pageindex + "&invoicestate=2" + params;
    $.getJSON(url, function(data) {
        if (data != null && data != "" && data != "null") {
            var content = data.list; //获取主体数据
            if (content != null && content.length > 0) {
                for (var i = 0; i < content.length; i++) {
                    //但行数据字符串
                    var singleDataStr = (content[i].状态 === "已作废") ? "<tr class='tr-cancel'>" : "<tr>";

                    //发票状态
                    var FP_StateStr = "";
                    if (content[i].INVOICE_STATE == 10) {
                        FP_StateStr = "正常";
                    } else if (content[i].INVOICE_STATE == 20) {
                        FP_StateStr = "作废";
                    } else if (content[i].INVOICE_STATE == 30) {
                        FP_StateStr = "冲红";
                    } else if (content[i].INVOICE_STATE == 31) {
                        FP_StateStr = "被冲红";
                    }

                    //发票类型 000：收据；004：增值税专用发票；007：增值税普通发票；025：卷式发票
                    var FP_TypeStr = "",
                        FPCH_Class = "";
                    if (content[i].FPLXDM == "000") {
                        FP_TypeStr = "收据";
                        FPCH_Class = "disable"; //如果为收据类型  则将此样式添加到作废冲红DOM中
                    } else if (content[i].FPLXDM == "004") {
                        FP_TypeStr = "增值税专用发票";
                    } else if (content[i].FPLXDM == "007") {
                        FP_TypeStr = "增值税普通发票";
                    } else if (content[i].FPLXDM == "025") {
                        FP_TypeStr = "卷式发票";
                    }

                    //开票日期
                    var KP_DateStr = content[i].KPRQ ? content[i].KPRQ : "未获取";

                    //发票金额（如果为null,默认为0）
                    var FP_Amount = content[i].AMOUNT == null ? 0 : content[i].AMOUNT;
                    //发票号码
                    var FP_HM = content[i].FP_HM ? content[i].FP_HM : "";
                    //发票代码
                    var FP_DM = content[i].FP_DM ? content[i].FP_DM : "";

                    //拼接单行字符串
                    singleDataStr += "<td>" + (10 * pageindex + i - 9) + "</td><td>" + content[i].ORDER_ID + "</td>" +
                        "<td>" + FP_HM + "</td>" +
                        "<td>" + FP_DM + "</td>" +
                        "<td>" + content[i].NSRMC + "</td>" +
                        "<td>" + FP_TypeStr + "</td>" +
                        "<td>" + FP_Amount + "</td>" +
                        "<td>" + FP_StateStr + "</td>" +
                        "<td>" + KP_DateStr + "</td>" +
                        "<td>" + "<button class='btn btn-link' onclick='seeDetail(\"" + content[i].ORDER_ID + "\")'>订单详情</button>|" +
                        "<button class='btn btn-link' onclick='invoiceDetail();'>发票详情</button>|" +
                        "<button class='btn btn-link' onclick='change(" + content[i].ID + ",\"" + content[i].ORDER_ID + "\",\"" + content[i].FPLXDM + "\");'>置换发票</button>|" +
                        "<button class='btn btn-link a-delete " + FPCH_Class + " '' onclick='cancel(" + content[i].ID + ",\"" + content[i].ORDER_ID + "\",\"" + content[i].FPLXDM + "\");' class='a-delete'>作废冲红</button>" + "</td>" +
                        "</tr>";
                    htmlstr += singleDataStr;
                }

                //添加数据至当前页面主体中
                $("#databody").html(htmlstr);
                $("#alreadyPage").show();

            } else {
                $("#databody").html('<tr><td colspan="100" class="text-center notFound">没有相关数据</td></tr> ');
                $("#alreadyPage").hide(); //未获取到数据时删除操作
            }
        }
        tool.initPageDiv($("#alreadyPage"), //在哪里生成页码
            pageindex, //当前页
            data.page.totalPage, //一共多少页
            10, //每次显示多少页
            $("#currentPage"), //将每次的分页的页码放到这个input里
            function() {
                pageing($("#currentPage").val(), params);
            }
        );
    });

}



//发票置换
function change() {
    $("#changeForm").submit();
}

//作废冲红
var kind = "1"; //作废测试值
function cancel(invoiceId, orderId, fplxdm) {
    $("#invoiceId").val(invoiceId);
    $("#orderId").val(orderId);
    $("#fplxdm").val(fplxdm);
    //获取参数
    $.ajax({
        type: "post",
        url: "<c:url value='/invoice/order/getPdfpzfParameter'/>",
        data: {
            orderId: orderId
        },
        dataType: "json"
    }).done(function(data) {
        console.info(data)
        if (data.success) {
            //先判断是否可以作废
            var cancelResult = window.top['_CACHE'].canInvalidateInvoice(getKeyno(), data.bean.fplxdm, data.bean.fpdm, data.bean.fphm); //要传参
            //				if(cancelResult.success){//查询成功
            // 						if(cancelResult.bean.fpzt=="00" || cancelResult.bean.fpzt=="01"){//可作废
            if (kind == "0") { //可作废
                //去作废
                tool.confirm("提示", "是否确认作废发票?", function() {
                    //跳到输入作废原因页
                    $("#kind").val("delete");
                    $("#cancelForm").submit();
                }, function() {});
            } else { //不可作废查是否可冲红
                tool.confirm("提示", "该发票已不能作废，是否进行冲红发票申请?", function() {
                    //判断是否能开票
                    var keyInfo = window.top['_CACHE'].queryNextInvoice(getKeyno(), data.bean.fplxdm);
                    if (!keyInfo.success) {
                        //跳到输入冲红原因页
                        $("#kind").val("red");
                        $("#cancelForm").submit();
                    } else {
                        //不能点击下一步，并给出提示
                        tool.alert("提示", "查询未开发票失败，失败原因：" + keyInfo.message, function() {});
                    }
                }, function() {});
            }
            //				}else{//查询失败存失败原因  cancelResult.message

            //				}
        }
    });

}

//发票详情
function invoiceDetail() {
    $("#previewForm1").submit();
}

//订单详情
function seeDetail(id) {
    var goToDetail = "<c:url value='/sales/ordermaintenance/detail'/>";
    window.location.href = goToDetail + "?locState=5&orderId=" + id;
}

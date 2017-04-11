/*   发票开具页面JS逻辑代码		*/
var params = "&";
$(function() {
    $(".breadcrumb,#search_block").height("45px");
    //点击事件
    $("#btnSearch").click(function() {
        params = $("#sltPoint").val() == "" ? "" : "&pointid=" + $("#sltPoint").val();
        pageing(1, params);
    });
});


$(function() {
    //请求地址填充下拉菜单
    $.getJSON('http://' + tool.getUrlArea() + '/csfwpt_console/restful/util/point/list', function(data) {
        if (data != null && data != "" && data != "null") {
            for (var i = 0; i < data.length; i++) {
                $("#sltPoint").append("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
            }
        }
    });

    //修改下拉菜单样式
    tool.changeSelect($("#sltPoint"), false);
});

//请求数据
$(function() {
    pageing(1, "");
});


//未开具发票数据部分 翻页的异步请求方法
function pageing(pageindex, params) {
    var htmlstr = "";
    var url = "http://" + tool.getUrlArea() + "/csfwpt_console/restful/invoice/list?currentPage=" + pageindex + "&invoicestate=1" + params;
    $.getJSON(url, function(data) {
        if (data != null && data != "" && data != "null") {
            var content = data.list; //获取主体数据
            console.info(content);
            if (content != null && content.length > 0) {
                for (var i = 0; i < content.length; i++) {
                    var singleDataStr = "<tr>";
                    //开票日期
                    var KP_DateStr = content[i].KPRQ ? content[i].KPRQ : "未获取";

                    //发票金额（如果为null,默认为0）
                    var FP_Amount = content[i].AMOUNT == null ? 0 : content[i].AMOUNT;

                    //拼接单行数据操作
                    singleDataStr += "<td>" + (10 * pageindex + i - 9) + "</td><td>" + content[i].ID + "</td>" +
                        "<td>" + content[i].NSRMC + "</td>" +
                        "<td>" + content[i].POINTNAME + "</td>" +
                        "<td>" + content[i].SALESNAME + "</td>" +
                        "<td>" + FP_Amount + "</td>" +
                        "<td>" + content[i].TIME + "</td>" +
                        "<td>" + "<a href='javascript:kaipiao(\"" + content[i].ID + "\");'>开票</a>|" +
                        "<a href='javascript:seeDetail(\"" + content[i].ID + "\");'>订单详情</a>" +
                        "</tr>";
                    htmlstr += singleDataStr;
                }

                //添加数据至当前页面主体中
                $("#databody").html(htmlstr);
                $("#alreadyPage").show();
            } else {

                $("#databody").html('<tr><td colspan="100" class="text-center notFound">没有相关数据</td></tr> ');
                $("#alreadyPage").hide(); //未获取到数据时隐藏分页控件
            }

            tool.initPageDiv($("#alreadyPage"), //在哪里生成页码
                pageindex, //当前页
                data.page.totalPage, //一共多少页
                10, //每次显示多少页
                $("#currentPage"), //将每次的分页的页码放到这个input里
                function() {
                    pageing($("#currentPage").val(), params);
                });

        }
    });
}

function kaipiao(id) {
    $("#orderId").val(id);
    $("#rkUrl").val("/invoice/not");

    $("#kaipiaoForm").submit();
}

//订单详情
function seeDetail(id) {
    var goToDetail = "<c:url value='/sales/ordermaintenance/detail'/>";
    window.location.href = goToDetail + "?locState=4&orderId=" + id;
}

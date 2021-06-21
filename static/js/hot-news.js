
window.onload = function () {
    let oXmlHttp = new XMLHttpRequest();
    let oXmlHttp2 = new XMLHttpRequest();
    let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
    let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
    let oStyle = document.getElementById("style-switch");
    let oHotNews = document.getElementsByClassName("hot-news")[0];
    let oOnePoem = document.getElementsByClassName("one-poem")[0];
    let arrInfo = document.getElementsByClassName("info")[0].children;
    let oDate = new Date();
    let flag = 0;

    // 主题切换
    oThemeSwitcher.onclick = function () {
        if (flag % 2 === 0) {
            oThemeCircle.style.left = "28px";
            oStyle.href = "/static/css/hot-news-dark.css"
        } else {
            oThemeCircle.style.left = "0px";
            oStyle.href = "/static/css/hot-news-white.css"
        }
        flag += 1;
    }

    // 获取新闻数据
    function fnGetDate() {
        oXmlHttp.open("POST", "/hotnews/", true);
        oXmlHttp.send();
        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4 && oXmlHttp.status == 200) {
                for (i = 0; i < JSON.parse(oXmlHttp.responseText)["data"]["items"].length; i++) {
                    let oNewsItem = document.createElement("li");
                    let oNewsUrl = document.createElement("a");
                    let oNewsRank = document.createElement("p");
                    let oNewsFrom = document.createElement("a");
                    let oNewsClick = document.createElement("p");
                    let strNewsFrom;
                    oNewsRank.innerText = i + 1;
                    switch (JSON.parse(oXmlHttp.responseText)["data"]["items"][i]["sitename"]) {
                        case "zhihu.com":
                            strNewsFrom = "知乎";
                            break;
                        case "s.weibo.com":
                            strNewsFrom = "微博";
                            break;
                        case "mp.weixin.qq.com":
                            strNewsFrom = "微信";
                            break;
                        case "52pojie.cn":
                            strNewsFrom = "52破解";
                            break;
                        case "huxiu.com":
                            strNewsFrom = "虎嗅网";
                            break;
                        case "36kr.com":
                            strNewsFrom = "36氪";
                            break;
                        case "so.toutiao.com":
                            strNewsFrom = "头条";
                            break;
                        case "bbs.hupu.com":
                            strNewsFrom = "虎扑社区";
                            break;
                        case "baidu.com":
                            strNewsFrom = "百度";
                            break;
                        case "bilibili.com":
                            strNewsFrom = "哔哩哔哩";
                            break;
                        default:
                            strNewsFrom = JSON.parse(oXmlHttp.responseText)["data"]["items"][i]["sitename"];
                    }
                    oNewsUrl.innerText = JSON.parse(oXmlHttp.responseText)["data"]["items"][i]["title"];
                    oNewsUrl.href = JSON.parse(oXmlHttp.responseText)["data"]["items"][i]["url"];
                    oNewsFrom.innerText = strNewsFrom;
                    oNewsFrom.href = "https://www." + JSON.parse(oXmlHttp.responseText)["data"]["items"][i]["sitename"];
                    oNewsClick.innerText = JSON.parse(oXmlHttp.responseText)["data"]["items"][i]["views"] + "🔥";
                    oNewsItem.appendChild(oNewsRank);
                    oNewsItem.appendChild(oNewsUrl);
                    oNewsItem.appendChild(oNewsFrom);
                    oNewsItem.appendChild(oNewsClick);
                    oHotNews.appendChild(oNewsItem);
                }

            }
        }
    }
    fnGetDate();

    // 获取天气
    function fnTransferDate(method, url) {
        oXmlHttp2.open(method, url, true);
        oXmlHttp2.send();
        oXmlHttp2.onreadystatechange = function () {
            if (oXmlHttp2.readyState == 4 && oXmlHttp2.status == 200) {
                arrInfo[1].innerText = "天气" + (JSON.parse(oXmlHttp2.responseText)["data"]["weather"]) + "&温度" + (JSON.parse(oXmlHttp2.responseText)["data"]["temp"]);
                fnAdvice();
            }
        }
    }

    fnTransferDate("GET", "https://api.muxiaoguo.cn/api/tianqi?city=%E5%8C%97%E4%BA%AC&type=1");

    // 推荐话语检测(依据天气)
    function fnAdvice() {   
        if (arrInfo[1].innerText.substring(0, 3) === "天气晴") {
            arrInfo[2].innerText = "适合走一走";
        }
        else {
            arrInfo[2].innerText = "适合学习和思考";
        }
    }




    // 设置标题时间
    function fnSetDate() {
        arrInfo[0].innerText = oDate.getFullYear() + "-" + (oDate.getMonth() + 1) + "-" + oDate.getDate();
    }

    fnSetDate();

    // 一言API调用
    function fnGetOneSaying() {
        fetch('https://v1.hitokoto.cn?c=i')
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                oOnePoem.innerText = "“ " + data.hitokoto.replace("。", "") + " ”";

            })
            .catch(function (err) {
                console.error(err);
            })
    }
    // fnGetOneSaying();

    // setInterval(fnGetOneSaying, 10000);
}

window.onload = function () {
    let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
    let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
    let oTime = document.getElementsByClassName("time")[0]
    let oDateBox = document.getElementsByClassName("date-box")[0].children;
    let oWeatherBox = document.getElementsByClassName("weather-box")[0].children;
    let oStyle = document.getElementById("style-switch");
    let oNewsContent = document.getElementsByClassName("content")[0];
    let oNextButton = document.getElementsByClassName("next")[0];
    let oXmlHttpGetNews = new XMLHttpRequest();
    let oXmlHttpGetWeather = new XMLHttpRequest();
    let dicTransferredData = { "translate-type": "谷歌翻译", "keyword": "晓", "theme": "white-theme" };
    let flag = 0;
    let intNewsNumber = 10;
    let arrGetNews = {};

    // 主题切换
    // 1.点击进行切换
    oThemeSwitcher.onclick = function () {
        if (flag % 2 === 0) {
            oThemeCircle.style.left = "28px";
            oStyle.href = "/static/css/mobile-hotnews-dark.css"
            dicTransferredData["theme"] = "dark-theme";

        } else {
            oThemeCircle.style.left = "0px";
            oStyle.href = "/static/css/mobile-hotnews-white.css"
            dicTransferredData["theme"] = "white-theme";
        }
        flag += 1;
    }

    // 通用数据传输组件
    function fnTransferData(oXmlHttp, method, url, transferData, fnSomeActions) {
        oXmlHttp.open(method, url, true);
        if (transferData) {
            oXmlHttp.setRequestHeader('content-type', 'application/json');
            oXmlHttp.send(JSON.stringify(transferData));
        }
        else {
            oXmlHttp.send();
        }
        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4 && oXmlHttp.status == 200) {
                if (fnSomeActions) {
                    fnSomeActions();
                }
                else {
                    return 0;
                }
            }
        }

    }

    // 获取天气和日期
    function fnAfterGetWeather() {
        let oDate = new Date();
        // 设置时间
        oTime.innerText = fnJudgeNumber(oDate.getHours()) + ":" + fnJudgeNumber(oDate.getMinutes());
        // 设置月份
        oDateBox[0].innerText = (oDate.getDate());
        oDateBox[1].innerText = fnTransformMonth(oDate.getMonth() + 1);

        // 设置天气
        let strTodayWeather = JSON.parse(oXmlHttpGetWeather.responseText)["data"]["weather"];
        let strTemperature = JSON.parse(oXmlHttpGetWeather.responseText)["data"]["temp"];
        oWeatherBox[0].innerHTML = strTodayWeather+ " | " + strTemperature + "&#176;";
        // 设置运动
        oWeatherBox[1].innerText = fnChooseSport(strTodayWeather);
    }

    fnTransferData(oXmlHttpGetWeather, "GET", "https://api.muxiaoguo.cn/api/tianqi?city=%E5%8C%97%E4%BA%AC&type=1", "", fnAfterGetWeather);

    setInterval(function () { fnTransferData(oXmlHttpGetWeather, "GET", "https://api.muxiaoguo.cn/api/tianqi?city=%E5%8C%97%E4%BA%AC&type=1", "", fnAfterGetWeather);}, 60000);


    // 判断数字是几位
    function fnJudgeNumber(intTarget) {
        if (intTarget < 10) {
            intTarget = "0" + intTarget;
        }
        return intTarget;
    }

    // 转换月份
    function fnTransformMonth(intTarget) {
        let strMonths = "JanFebMarAprMayJunJulAngSepOctNovDec";
        return strMonths.slice((intTarget - 1) * 3, (intTarget - 1) * 3 + 3);
    }

    // 依据天气状况选择运动
    function fnChooseSport(strWeather) {
        if (strWeather === "晴") {
            return "今日宜外出散心";
        }
        else {
            return "今日宜学习提升";
        }
    }

    // 获得热点数据之后的操作
    function fnAfterGetNews() {
        arrGetNews = JSON.parse(oXmlHttpGetNews.responseText)["data"]["items"];
        for (let i = intNewsNumber-10; i < intNewsNumber; i++) {
            let oNewsItem = document.createElement("li");
            let oRank = document.createElement("h1");

            let oNews = document.createElement("div");
            let oNewsLink = document.createElement("a");

            let oNewsTitle = document.createElement("h3");

            let oNewsAbout = document.createElement("div");
            let oNewsFever = document.createElement("p");
            let oNewsFrom = document.createElement("p");
            let oNewsFromLink = document.createElement("a");

            // 新闻排名
            oRank.innerText = i + 1;
            oRank.className = "rank";


            // 新闻标题和链接
            oNewsLink.innerText = arrGetNews[i]["title"];
            oNewsLink.href = arrGetNews[i]["url"];
            oNewsTitle.appendChild(oNewsLink);
            oNewsTitle.className = "news-title";

            // 新闻热度
            oNewsFever.innerText = arrGetNews[i]["views"];
            oNewsFever.className = "news-fever";

            // 新闻来源
            let strNewsFrom;
            switch (arrGetNews[i]["sitename"]) {
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
                    strNewsFrom = arrGetNews[i]["sitename"];
            }

            oNewsFrom.className = "news-from";
            oNewsFromLink.innerText = strNewsFrom;
            oNewsFromLink.href = "https://www." + arrGetNews[i]["sitename"];
            oNewsFrom.appendChild(oNewsFromLink);

            oNewsAbout.className = "news-about";
            oNewsAbout.appendChild(oNewsFever);
            oNewsAbout.appendChild(oNewsFrom);

            oNews.className = "news";
            oNews.appendChild(oNewsTitle);
            oNews.appendChild(oNewsAbout);

            oNewsItem.appendChild(oRank);
            oNewsItem.appendChild(oNews);

            oNewsContent.appendChild(oNewsItem);
        }
        intNewsNumber += 10;
    }

    fnTransferData(oXmlHttpGetNews,"POST", "/hotnews/", "", fnAfterGetNews);

    oNextButton.onclick = function () {
        if (arrGetNews.length===intNewsNumber-10){
            alert("到底了");
        }else{
            fnAfterGetNews();
        }
    }


}
window.onload = function() {
    let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
    let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
    let oStyle = document.getElementById("style-switch");
    let oWeatherDate = document.getElementsByClassName("date-weather")[0];
    let oXmlHttp = new XMLHttpRequest();
    let flag = 0;

    // app加载完成之后提示
    // alert("别来无恙啊!\n我是开发者武轲\n感谢你使用我的产品“晓”\n-------------------------------\n现阶段客户端开放前三个功能，如果想体验完整功能，可以使用浏览器进行操作！");

    // 主题切换
    // 1.点击进行切换
    oThemeSwitcher.onclick = function () {
        if (flag % 2 === 0) {
            oThemeCircle.style.left = "28px";
            oStyle.href = "/static/css/mobile-app-dark.css"

        } else {
            oThemeCircle.style.left = "0px";
            oStyle.href = "/static/css/mobile-app-white.css"
        }
        flag += 1;
    }

    // 通用数据传输组件
    function fnTransferData(method, url, transferData, fnSomeActions) {
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

    // 天气和日期

    fnTransferData("GET", "https://api.muxiaoguo.cn/api/tianqi?city=%E5%8C%97%E4%BA%AC&type=1", "", fnAfterGetWeather);

    // 获取天气和日期
    function fnAfterGetWeather() {
        let oDate = new Date();
        oWeatherDate.innerText = fnJudgeNumber(oDate.getHours()) + ":" + fnJudgeNumber(oDate.getMinutes()) + " | " + (JSON.parse(oXmlHttp.responseText)["data"]["weather"]);
    }

    setInterval(fnAfterGetWeather, 60000);


    // 判断数字是几位
    function fnJudgeNumber(intTarget) {
        if (intTarget < 10) {
            intTarget = "0" + intTarget;
        }
        return intTarget;
    }

}
window.onload = function () {
    let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
    let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
    let oStyle = document.getElementById("style-switch");
    let oSearchResult = document.querySelectorAll(".search-result ul")[0];
    let arrSearchType = document.querySelectorAll(".search-type li span");
    let oSearchInput = document.getElementsByClassName("search-input")[0];
    let oSearchButton = document.getElementsByClassName("search-button")[0];
    let oNext = document.getElementById("next");
    let oPrevious = document.getElementById("previous");
    let oRightChart = document.getElementsByClassName("result-chart")[0];
    let arrChartSwitch = document.getElementsByClassName("switch-chart")[0].children;
    let dicChartOption = "";
    let arrResultInfo = document.getElementsByClassName("info")[0].children;
    let dicTransferredData = { "theme": "white-theme", "keyword": "晓", "search-type": "综合", "page": 0 };
    let loginState = 0;

    // 检测登陆状态
    // if (loginState === 0) {
    //     arrSearchType[8].parentNode.href = "/login/";
    // }

    let dicChartDate = [{
        name: "谷歌",
        value: 419000000,
        itemStyle: {
            color: '#A163F7',
        }
    }, {
        name: "必应",
        value: 59500000,
        itemStyle: {
            color: '#6F88FC'
        }
    }, {
        name: "百度",
        value: 100000000,
        itemStyle: {
            color: "#00E0C7",
        }
    },
    {
        name: "360",
        value: 51200000,
        itemStyle: {
            color: "#A5DEF1",
        }
    },
    {
        name: "搜狗",
        value: 310228,
        itemStyle: {
            color: "#FF7582",
        }
    }
    ]
    let oXmlHttp = new XMLHttpRequest();
    let flag = 0;

    // 数据可视化搜索结果
    // 右边绘图
    let optionOfPie, optionOfHistogram;
    let myChart = echarts.init(oRightChart);


    // 饼图配置
    optionOfPie = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: '搜索数量',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '15',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                ]
                , itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{d}%',
                            position: "bottom",
                            textStyle: {
                                color: "auto",
                                fontSize: 10,
                            }
                        }
                    }
                }
            }
        ]
    };
    // 柱状图配置
    optionOfHistogram = {
        legend: {
            show: true,
            data: ['谷歌', '必应', '百度', '360', '搜狗']
        },
        xAxis: {
            type: 'category',
            data: ['谷歌', '必应', '百度', '360', '搜狗'],
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [
            ],
            type: 'bar',
            barWidth: 40,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        formatter: '{c}',
                        position: "top",
                        textStyle: {
                            color: "auto",
                            fontSize: 10,
                        }
                    }
                }
            }
        }]
    }


    // 页面加载去除文字加粗效果
    oSearchResult.style.fontWeight = "400";

    // 获取当前的url状态并发送一个POST请求
    function getQueryArgs() {
        var qs = (location.search.length > 0 ? location.search.substr(1) : ''),
            //保存每一项
            args = {},
            //得到每一项
            items = qs.length ? qs.split('&') : [],
            item = null,
            name = null,
            value = null,
            i = 0,
            len = items.length;

        for (i = 0; i < len; i++) {
            item = items[i].split('='),
                name = decodeURIComponent(item[0])
            value = decodeURIComponent(item[1])
            if (name.length) {
                args[name] = value;
            }
        }
        return args;
    }
    let dicQueryArgs = getQueryArgs();
    oSearchInput.value = dicQueryArgs["keyword"];
    if (dicQueryArgs["keyword"]) {
        dicTransferredData["keyword"] = dicQueryArgs["keyword"];
    }

    dicTransferredData["search-type"] = dicQueryArgs["search-type"];
    dicTransferredData["page"] = Number(dicQueryArgs["page"]);
    dicTransferredData["theme"] = dicQueryArgs["theme"];

    // 页面加载完成之后，会根据当前查询字符串的值进行搜索
    // 1.单个搜索
    function fnGetSingleResult() {
        oXmlHttp.open("POST", "/search/", true);
        oXmlHttp.setRequestHeader('content-type', 'application/json')
        oXmlHttp.send(JSON.stringify(dicTransferredData));
        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4 && oXmlHttp.status == 200) {
                oSearchResult.innerHTML = "";
                let arrResult = JSON.parse(oXmlHttp.responseText)["results"];
                console.log(dicTransferredData);
                for (i = 0; i < arrResult.length; i++) {
                    let oResultItem = document.createElement("li");
                    let strTitle = arrResult[i]["title"];
                    let strDescription = arrResult[i]["description"];
                    // 描述变色
                    if (dicTransferredData["keyword"]) {
                        let regExp = new RegExp(dicTransferredData["keyword"], 'ig');
                        strDescription = strDescription.replace(regExp, "<span style='color: #FF557D;'>$&</span>");
                    }
                    oResultItem.innerHTML = strTitle + strDescription;
                    if (oResultItem.innerText !== "当前没有搜索到\n此搜索条目没有描述") {
                        // 标题变色
                        if (dicTransferredData["keyword"]) {
                            let regExp = new RegExp(dicTransferredData["keyword"], 'ig');
                            if (oResultItem.children[0] && oResultItem.children[0].children[0]) {
                                oResultItem.children[0].children[0].innerHTML = oResultItem.children[0].children[0].innerHTML.replace(regExp, "<span style='color: #FF557D;'>$&</span>");
                            }
                            if (oResultItem.children[0] && oResultItem.children[0].children[1]) {
                                oResultItem.children[0].children[1].innerHTML = oResultItem.children[0].children[1].innerHTML.replace(regExp, "<span style='color: #FF557D;'>$&</span>");
                            }
                            if (dicTransferredData["search-type"] !== "谷歌") {
                                oCite = document.createElement("cite");
                                if (oResultItem.querySelectorAll("a")[0]) {
                                    oCite.innerText = oResultItem.querySelectorAll("a")[0].href;
                                    oResultItem.insertBefore(oCite, oResultItem.children[1]);
                                }
                            }
                        }
                        oSearchResult.appendChild(oResultItem);
                    }
                }
                if (dicTransferredData["search-type"] === "搜狗") {
                    let arrSogouImg = document.querySelectorAll("li img");
                    console.log(arrSogouImg);
                    if (arrSogouImg) {
                        for (let i = 0; i < arrSogouImg.length; i++) {
                            arrSogouImg[i].remove();
                        }
                    }
                }
                fnTransferDate("POST", "/result_num/", dicTransferredData, fnGetResultNum);
            }

        }

        dicChartOption = optionOfPie;
        myChart = echarts.init(oRightChart);
        if (dicChartOption && typeof dicChartOption === 'object') {
            myChart.setOption(dicChartOption);
        }
    }

    // 2.页面加载完成之后，获取综合搜索结果
    function fnGetComprehensiveResults() {
        oXmlHttp.open("POST", "/search/", true);
        oXmlHttp.setRequestHeader('content-type', 'application/json')
        oXmlHttp.send(JSON.stringify(dicTransferredData));
        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4 && oXmlHttp.status == 200) {
                oSearchResult.innerHTML = "";
                let dictComprehensiveResult = JSON.parse(oXmlHttp.responseText);
                for (i = 0; i < 10; i++) {
                    let oResultRank = document.createElement("li");
                    let oResultRankText = document.createElement("h3")

                    // 设置关于排名的内容
                    oResultRank.className = "rank-number";
                    oResultRankText.innerText = "第 " + (dicTransferredData["page"] + i + 1) + " 搜索结果";
                    oResultRank.appendChild(oResultRankText);
                    oSearchResult.appendChild(oResultRank);

                    // Bing搜索结果设置
                    oSearchResult.appendChild(fnSetResultContent("Bing"));

                    // 百度搜索结果设置
                    oSearchResult.appendChild(fnSetResultContent("Baidu"));

                    // 搜狗搜索结果设置
                    oSearchResult.appendChild(fnSetResultContent("Sogou"));

                    // 360搜索结果设置
                    oSearchResult.appendChild(fnSetResultContent("360"));

                    // 谷歌搜索结果设置
                    oSearchResult.appendChild(fnSetResultContent("Google"));

                    // 用函数添加各个搜索选项
                    function fnSetResultContent(search_type) {
                        // 创建搜索来源标识
                        let oResultItem = document.createElement("li");
                        let oLogo = document.createElement("p");
                        oLogo.className = "search-logo";
                        let strTitle = "<h3>当前没有搜索到</h3>";
                        if (dictComprehensiveResult[search_type]["results"][i]) {
                            strTitle = dictComprehensiveResult[search_type]["results"][i]["title"];
                        }
                        let strDescription = "此搜索条目没有描述";
                        if (dictComprehensiveResult[search_type]["results"][i]) {
                            strDescription = dictComprehensiveResult[search_type]["results"][i]["description"];
                        }

                        // 对内容的一些操作和变换
                        // 描述变色
                        if (dicTransferredData["keyword"]) {
                            let regExp = new RegExp(dicTransferredData["keyword"], 'ig');
                            strDescription = strDescription.replace(regExp, "<span style='color: #FF557D;'>$&</span>");
                        }
                        oResultItem.innerHTML = strTitle + strDescription;
                        if (oResultItem.innerText !== "当前没有搜索到此搜索条目没有描述") {
                            // 标题变色
                            if (dicTransferredData["keyword"]) {
                                let regExp = new RegExp(dicTransferredData["keyword"], 'ig');

                                oResultItem.children[0].children[0].innerHTML = oResultItem.children[0].children[0].innerHTML.replace(regExp, "<span style='color: #FF557D;'>$&</span>");
                                if (oResultItem.children[0].children[1]) {
                                    oResultItem.children[0].children[1].innerHTML = oResultItem.children[0].children[1].innerHTML.replace(regExp, "<span style='color: #FF557D;'>$&</span>");
                                }

                                oCite = document.createElement("cite");
                                if (oResultItem.querySelectorAll("a")[0]) {
                                    oCite.innerText = oResultItem.querySelectorAll("a")[0].href;
                                    oResultItem.insertBefore(oCite, oResultItem.children[1]);

                                }
                            }
                        }
                        if (search_type === "Bing") {
                            oResultItem.className = "bing";
                            oLogo.innerText = "必应";

                        }
                        if (search_type === "Baidu") {
                            oResultItem.className = "baidu";
                            oLogo.innerText = "百度";

                        }
                        if (search_type === "Sogou") {
                            oResultItem.className = "sogou";
                            oLogo.innerText = "搜狗";

                        }
                        if (search_type === "360") {
                            oResultItem.className = "s360";
                            oLogo.innerText = "360";

                        }
                        if (search_type === "Google") {
                            oResultItem.className = "google";
                            oLogo.innerText = "谷歌";

                        }
                        oResultItem.insertBefore(oLogo, oResultItem.children[0]);

                        return oResultItem;
                    }
                }
                // 去除引用
                let arrCite = document.querySelectorAll(".google a div cite");
                if (arrCite) {
                    for (let i = 0; i < arrCite.length; i++) {
                        arrCite[i].remove();
                    }
                }

                let arrSogouImg = document.querySelectorAll(".sogou h3 img");
                if (arrSogouImg) {
                    for (let i = 0; i < arrSogouImg.length; i++) {
                        arrSogouImg[i].remove();
                    }
                }

                // let arrLink = document.querySelectorAll(".google>a");
                // if (arrLink) {
                //     for (let i = 0; i < arrLink.length; i++) {
                //         arrLink[i].onmusedown = "";

                //     }
                // }

                // 去除换行符
                let arrBr = document.querySelectorAll(".google br");

                console.log(arrBr);
                // 清除换行符
                if (arrBr) {
                    console.log(arrBr);
                    for (let i = 0; i < arrBr.length; i++) {
                        arrBr[i].remove();
                    }
                }
                fnTransferDate("POST", "/result_num/", dicTransferredData, fnGetResultNum);
            }
        }
    }

    // 选择性的显示搜索结果(综合/单个)
    if (dicTransferredData["search-type"] === "综合") {
        fnGetComprehensiveResults();
    }
    else {
        fnGetSingleResult();
    }


    // 向后台发送数据通用函数
    function fnTransferDate(method, url, dicSendData, fnSomeActions) {
        oXmlHttp.open(method, url, true);
        oXmlHttp.setRequestHeader('content-type', 'application/json')
        oXmlHttp.send(JSON.stringify(dicSendData));
        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4 && oXmlHttp.status == 200) {
                if (fnSomeActions)
                    fnSomeActions();
                else {
                    return 1;
                }
            }
        }
    }


    // 当前页面进行搜索

    oSearchInput.onkeypress = function (e) {
        if (e.keyCode === 13) {
            if (this.value) {
                dicTransferredData["keyword"] = this.value;
            }
            window.location.href = "?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=0";
        }
    }

    oSearchInput.onblur = function () {
        if (this.value) {
            dicTransferredData["keyword"] = this.value;
        }
    }

    oSearchButton.onclick = function () {
        if (oSearchInput.value) {
            dicTransferredData["keyword"] = oSearchInput.value;
        }
        window.location.href = "?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=0";

    }

    // 切换搜索引擎样式
    function fnSwitchEngineTheme(strWhichTheme) {
        if (strWhichTheme === "dark-theme") {
            if (dicQueryArgs["search-type"] === "必应") {
                oStyle.href = "/static/css/bing-result-dark.css";
                oThemeCircle.style.left = "28px";
            }
            else if (dicQueryArgs["search-type"] === "百度") {
                oStyle.href = "/static/css/baidu-result-dark.css";
                oThemeCircle.style.left = "28px";
            }
            else if (dicQueryArgs["search-type"] === "搜狗") {
                oStyle.href = "/static/css/sogou-result-dark.css";
                oThemeCircle.style.left = "28px";
            }
            else if (dicQueryArgs["search-type"] === "360") {
                oStyle.href = "/static/css/360-result-dark.css";
                oThemeCircle.style.left = "28px";
            }
            else if (dicQueryArgs["search-type"] === "综合") {
                oStyle.href = "/static/css/comprehensive-result-dark.css";
                oThemeCircle.style.left = "28px";
            }
            else {
                oStyle.href = "/static/css/google-result-dark.css";
                oThemeCircle.style.left = "28px";
            }
        }
        else {
            if (dicQueryArgs["search-type"] === "必应") {
                oStyle.href = "/static/css/bing-result-white.css";
                oThemeCircle.style.left = "0px";
            }
            else if (dicQueryArgs["search-type"] === "百度") {
                oStyle.href = "/static/css/baidu-result-white.css";
                oThemeCircle.style.left = "0px";
            }
            else if (dicQueryArgs["search-type"] === "搜狗") {
                oStyle.href = "/static/css/sogou-result-white.css";
                oThemeCircle.style.left = "0px";
            }
            else if (dicQueryArgs["search-type"] === "360") {
                oStyle.href = "/static/css/360-result-white.css";
                oThemeCircle.style.left = "0px";
            }
            else if (dicQueryArgs["search-type"] === "综合") {
                oStyle.href = "/static/css/comprehensive-result-white.css";
                oThemeCircle.style.left = "0px";
            }
            else {
                oStyle.href = "/static/css/google-result-white.css";
                oThemeCircle.style.left = "0px";
            }

        }
    }

    fnSwitchEngineTheme(dicQueryArgs["theme"]);

    // 主题切换
    oThemeSwitcher.onclick = function () {
        if (flag % 2 === 0) {
            oThemeCircle.style.left = "28px";
            echarts.init(oRightChart).dispose();
            let myChart = echarts.init(oRightChart, 'dark');
            dicChartOption = optionOfPie;
            if (dicChartOption && typeof dicChartOption === 'object') {
                myChart.setOption(dicChartOption);
            }
            dicTransferredData["theme"] = "dark-theme";
            fnSwitchEngineTheme(dicTransferredData["theme"]);
            for (let j = 0; j < arrSearchType.length - 1; j++) {
                if (arrSearchType[j].style.borderBottom) {
                    arrSearchType[j].style.borderBottom = "2px solid #fff";
                }
            }
        } else {
            oThemeCircle.style.left = "0px";
            echarts.init(oRightChart).dispose();
            let myChart = echarts.init(oRightChart);
            dicChartOption = optionOfPie;
            if (dicChartOption && typeof dicChartOption === 'object') {
                myChart.setOption(dicChartOption);
            }
            dicTransferredData["theme"] = "white-theme";
            fnSwitchEngineTheme(dicTransferredData["theme"]);
            for (let j = 0; j < arrSearchType.length - 1; j++) {
                if (arrSearchType[j].style.borderBottom) {
                    arrSearchType[j].style.borderBottom = "2px solid #555555";
                }
            }
        }
        flag += 1;
    }


    // 页面加载完成之后，根据传过来的参数定位搜索类型
    function fnAutoLocateSearchType() {
        for (let i = 0; i < arrSearchType.length; i++) {
            if (arrSearchType[i].innerText === dicQueryArgs["search-type"]) {
                if (dicQueryArgs["theme"] === "dark-theme") {
                    arrSearchType[i].style.borderBottom = "2px solid #fff"
                }
                else {
                    arrSearchType[i].style.borderBottom = "2px solid #555"
                }
            }
        }
    }
    fnAutoLocateSearchType();

    // 选择搜索类型
    function fnChooseSearchType() {
        for (let i = 0; i < arrSearchType.length - 5; i++) {
            arrSearchType[i].onclick = function () {
                dicTransferredData["search-type"] = this.innerText;
                window.location.href = "/search" + "/?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=" + dicTransferredData["page"];
            }
        }
    }

    fnChooseSearchType();

    // 上下页切换

    oNext.onclick = function () {
        dicTransferredData["page"] += 10;
        window.location.href = "?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=" + dicTransferredData["page"];
    }

    oPrevious.onclick = function () {
        if (dicTransferredData["page"] !== 0) {
            dicTransferredData["page"] -= 10;
            window.location.href = "/search" + "/?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=" + dicTransferredData["page"];

        }

    }
    arrChartSwitch[0].onclick = function () {
        echarts.init(oRightChart).dispose();
        if (dicTransferredData["theme"] === "dark-theme") {
            let myChart = echarts.init(oRightChart, 'dark');
            dicChartOption = optionOfPie;
            if (dicChartOption && typeof dicChartOption === 'object') {
                myChart.setOption(dicChartOption);
            }
        }
        else {
            let myChart = echarts.init(oRightChart);
            dicChartOption = optionOfPie;
            if (dicChartOption && typeof dicChartOption === 'object') {
                myChart.setOption(dicChartOption);
            }
        }
    }

    arrChartSwitch[1].onclick = function () {
        echarts.init(oRightChart).dispose();
        if (dicTransferredData["theme"] === "dark-theme") {
            let myChart = echarts.init(oRightChart, 'dark');
            dicChartOption = optionOfHistogram;
            if (dicChartOption && typeof dicChartOption === 'object') {
                myChart.setOption(dicChartOption);
            }
        }
        else {
            let myChart = echarts.init(oRightChart);
            dicChartOption = optionOfHistogram;
            if (dicChartOption && typeof dicChartOption === 'object') {
                myChart.setOption(dicChartOption);
            }
        }

    }


    // 加载各搜索引擎搜索结果数量
    function fnGetResultNum() {
        let dicResultInfo = JSON.parse(oXmlHttp.responseText);
        for (let key in dicResultInfo) {
            for (i = 0; i < dicChartDate.length; i++) {
                if (dicChartDate[i]["name"] === fnTransformChinese(key)) {
                    dicChartDate[i]["value"] = dicResultInfo[key];
                }
            }
        }
        optionOfPie["series"][0]["data"] = dicChartDate;
        optionOfHistogram["series"][0]["data"] = dicChartDate;

        // 找最值，并设置
        arrResultInfo[1].children[0].innerText = "搜索最多：" + fnFromValueToKey(fnFindExtremeValue("MaxValue", dicResultInfo), dicResultInfo);
        arrResultInfo[1].children[1].innerText = "搜索最少：" + fnFromValueToKey(fnFindExtremeValue("MinValue", dicResultInfo), dicResultInfo);

    }

    // 英文转换为中文
    function fnTransformChinese(text) {
        if (text === "Google") {
            return "谷歌"
        }
        if (text === "Bing") {
            return "必应"
        }
        if (text === "360") {
            return "360"
        }
        if (text === "Sougou") {
            return "搜狗"
        }
        if (text === "Baidu") {
            return "百度"
        }
    }

    // 搜索数量描述
    arrResultInfo[0].innerText = "本次搜索关键词：" + dicTransferredData["keyword"];

    // 从JSON中找极值
    function fnFindExtremeValue(flag, dicTarget) {
        let arrTemp = [];
        for (let key in dicTarget) {
            arrTemp.push(parseInt(dicTarget[key]));
        }
        if (flag === "MaxValue") {
            return Math.max(...arrTemp);
        }
        else {
            return Math.min(...arrTemp);
        }
    }

    // 从在JSON从value找key
    function fnFromValueToKey(value, dicTarget) {
        for (let key in dicTarget) {
            if (value === dicTarget[key]) {
                return key;
            }
        }
    }
}
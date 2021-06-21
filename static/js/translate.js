window.onload = function () {
    let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
    let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
    let oOnePoem = document.getElementsByClassName("one-poem")[0];
    let arrTranslateType = document.getElementsByClassName("translate-type")[0].children;
    let arrTranslateBox = document.getElementsByClassName("translate-box")[0].children;
    let dicTransferredData = { "translate-type": "谷歌翻译", "keyword": "晓" };
    let oStyleSwitch = document.getElementById("style-switch");
    let oSayHello = document.getElementsByClassName("hello")[0];
    let oXmlHttp = new XMLHttpRequest();
    let flag = 0;


    // 切换主题
    oThemeSwitcher.onclick = function () {
        if (flag % 2 === 0) {
            oThemeCircle.style.left = "28px";
            oStyleSwitch.href = "/static/css/translate-dark.css";
        }
        else {
            oThemeCircle.style.left = "0px";
            oStyleSwitch.href = "/static/css/translate-white.css";
        }
        flag += 1;
    }

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
    if (dicQueryArgs["username"]) {
        oSayHello.children[0].innerText =  dicQueryArgs["username"]+"👏";
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

    // 页面加载完成之后，按照从主页传过来的数据进行翻译
    function fnSomeActions() {
        arrTranslateBox[2].value = oXmlHttp.responseText;
    }
    fnTransferDate("POST", "/translate/", dicTransferredData, fnSomeActions);
    // 点击操作进行翻译
    arrTranslateBox[0].onblur = function () {
        if (this.value) {
            dicTransferredData["keyword"] = arrTranslateBox[0].value;
        }
    }

    // 翻译框清空操作
    arrTranslateBox[0].oninput = function () {
        if (!arrTranslateBox[0].value) {
            arrTranslateBox[2].value = "";
            dicTransferredData["keyword"] = "";
        }
        else {
            dicTransferredData["keyword"] = this.value;
            fnTransferDate("POST", "/translate/", dicTransferredData, fnSomeActions);
        }
    }

    arrTranslateBox[0].onblur = function () {
        dicTransferredData["keyword"] = this.value;
        fnTransferDate("POST", "/translate/", dicTransferredData, fnSomeActions);
    }

    arrTranslateBox[0].onkeypress = function (e) {
        if (e.keyCode === 13) {
            dicTransferredData["keyword"] = this.value;
            fnTransferDate("POST", "/translate/", dicTransferredData, fnSomeActions);
        }
    }


    arrTranslateBox[1].onclick = function () {
        dicTransferredData["keyword"] = arrTranslateBox[0].value;
        fnTransferDate("POST", "/translate/", dicTransferredData, fnSomeActions);
    }


    // 选择翻译方式
    function fnChooseTranslateType() {
        for (i = 0; i < arrTranslateType.length; i++) {
            arrTranslateType[0].style.color = "#f07c82";
            arrTranslateType[i].onclick = function () {
                if (this.style.color) {
                    this.style.color = "";
                    arrTranslateType[0].style.color = "#f07c82";
                    dicTransferredData["translate-type"] = "谷歌翻译";
                }
                else {
                    for (j = 0; j < arrTranslateType.length; j++) {
                        arrTranslateType[j].style.color = "";
                    }
                    this.style.color = "#f07c82"
                    dicTransferredData["translate-type"] = this.innerText;
                    fnTransferDate("POST", "/translate/", dicTransferredData, fnSomeActions);
                }
            }
        }
    }
    fnChooseTranslateType();


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

    // setInterval(fnGetOneSaying, 5000);
}
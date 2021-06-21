window.onload = function () {
    let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
    let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
    let oStyle = document.getElementById("style-switch");
    let oStateTitle = document.getElementsByTagName("h2")[0];
    let oLoginForm = document.getElementsByTagName("form")[0];
    let oStateSwitch = document.getElementsByClassName("state-switch")[0];
    let oLoginTips = document.getElementsByClassName("tips")[0];
    let oSubmitButton = document.getElementsByClassName("submit-button")[0];
    let oXmlHttp = new XMLHttpRequest();
    let flag = 0;
    let dicUserInfo = { "username": { "width": 4, "value": "" }, "password": { "width": 4, "value": "" }};

    // 主题切换
    oThemeSwitcher.onclick = function () {
        if (flag % 2 === 0) {
            oThemeCircle.style.left = "28px";
            oStyle.href = "/static/css/login-dark.css"
        }
        else {
            oThemeCircle.style.left = "0px";
            oStyle.href = "/static/css/login-white.css"
        }
        flag += 1;
    }

    // 注册登录切换
    oStateSwitch.onclick = function() {
        if(this.innerText === "登录") {
            oLoginForm.action = "/login/";
            oStateTitle.innerText = "登录晓";
            oSubmitButton.value = "登录";
            oLoginTips.childNodes[0].data = "没有账号，点击 "
            this.innerText = "注册";

        }
        else {
            oLoginForm.action = "/register/";
            oStateTitle.innerText = "加入晓";
            oSubmitButton.value = "注册";
            oLoginTips.childNodes[0].data = "已有账号，点击 "
            this.innerText = "登录";
        }
        console.log(oLoginTips.childNodes);

    }

    // 账号和密码验证
    dicUserInfo["username"]["width"] = oLoginForm.children[0].value.length;
    dicUserInfo["password"]["width"] = oLoginForm.children[1].value.length;
    function fnVerifyUserInfo() {
        oLoginForm.children[0].onblur = oLoginForm.children[1].onblur= function() {
            if (this.value.length > 8 || this.value.length < 4) {
                this.style.color = "#f07c82";
                dicUserInfo[this.getAttribute("class")]["width"] = this.value.length;
            }
            else {
                this.style.color = "#1070EC";
                dicUserInfo[this.getAttribute("class")]["width"] = this.value.length;
            }
        }
    }

    fnVerifyUserInfo();

    // 点击登陆/注册按钮
    oLoginForm.children[2].onclick = function() {
        if ((9 > dicUserInfo["password"]["width"]) && (dicUserInfo["password"]["width"] > 3) && (9 > dicUserInfo["username"]["width"]) && (dicUserInfo["username"]["width"] > 3)) {
            dicUserInfo["username"]["value"] = oLoginForm.children[0].value;
            dicUserInfo["password"]["value"] = oLoginForm.children[1].value;
            if (this.value==="登录") {
                fnTransferDate("POST", "/login/", dicUserInfo, fnAfterLogin);
            }
            if (this.value === "注册") {
                fnTransferDate("POST", "/register/", dicUserInfo, fnAfterRegister);
            }
        }
        else {
            alert("您的用户名/密码有问题！");
        }
    }

    // 注册后的操作
    function fnAfterRegister() {
        dicRegisterState = JSON.parse(oXmlHttp.responseText);
        console.log(dicRegisterState);
        if (dicRegisterState["state"]==="success"){
            alert("欢迎加入晓，现在登陆一下吧！");
        }
        else {
            alert("用户名可能重复了，换一个吧！比如：作者真帅");
        }
    }

    // 登陆后的操作
    function fnAfterLogin() {
        if (oXmlHttp.responseText)
            dicLoginState = JSON.parse(oXmlHttp.responseText);
            if (dicLoginState["state"]==="fail") {
                alert("用户信息可能有点错误！")
            }
            else {
                alert("请尽情享用吧!")
                window.location.href = "/translate"+"?username="+dicUserInfo["username"]["value"];
            }
    }

    // 向后台发送数据
    function fnTransferDate(method, url, sendData, fnSomeActions) {
        oXmlHttp.open(method, url, true);
        oXmlHttp.setRequestHeader('content-type', 'application/json')
        oXmlHttp.send(JSON.stringify(sendData));
        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4 && oXmlHttp.status == 200) {
                if (fnSomeActions) {
                    fnSomeActions();
                }
                else{
                    return 1;
                }
            }
        }
    }
}






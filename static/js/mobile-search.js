window.onload = function () {
	let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
	let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
	let oWeather = document.getElementsByClassName("weather")[0];
	let oSearchResult = document.getElementsByClassName("search-result")[0];
	let arrSearch = document.getElementsByClassName("search-object")[0].children;
	let arrSearchType = document.getElementsByClassName("search-type")[0].children;
	let oStyle = document.getElementById("style-switch");
	let oNext = document.getElementsByClassName("next")[0];
	let oXmlHttp = new XMLHttpRequest();
	let dicTransferredData = { "theme": "white-theme", "keyword": "晓", "search-type": "必应", "page": "0" };
	let flag = 0;
	let oDate = new Date();


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
	if (getQueryArgs()["keyword"]) {
		arrSearch[0].value = getQueryArgs()["keyword"];
		dicTransferredData["keyword"] = getQueryArgs()["keyword"];
		dicTransferredData["page"] = getQueryArgs()["page"];
	}
	else {
		arrSearch[0].value = "晓";
	}



	// 设置时间显示
	function fnAfterGetWeather() {
		let oDate = new Date();
		oWeather.innerText = fnJudgeNumber(oDate.getHours()) + ":" + fnJudgeNumber(oDate.getMinutes()) + " | " + (JSON.parse(oXmlHttp.responseText)["data"]["weather"]);
	}
	setInterval(fnAfterGetWeather, 60000);

	// 判断数字是几位
	function fnJudgeNumber(intTarget) {
		if (intTarget < 10) {
			intTarget = "0" + intTarget;
		}
		return intTarget;
	}


	// 主题切换
	// 1.根据地址栏里面的主题类型自动切换
	if (getQueryArgs()["theme"] === "dark-theme") {
		oThemeCircle.style.left = "28px";
		oStyle.href = "/static/css/mobile-search-dark.css"
		dicTransferredData["theme"] = "dark-theme";
	}

	// 2.点击进行切换
	oThemeSwitcher.onclick = function () {
		if (flag % 2 === 0) {
			oThemeCircle.style.left = "28px";
			oStyle.href = "/static/css/mobile-search-dark.css"
			dicTransferredData["theme"] = "dark-theme";
			for (let j = 0; j < arrSearchType.length - 1; j++) {
				if (arrSearchType[j].style.borderBottom) {
					arrSearchType[j].style.borderBottom = "1px solid #dcdce0";
				}
			}

		} else {
			oThemeCircle.style.left = "0px";
			oStyle.href = "/static/css/mobile-search-white.css"
			dicTransferredData["theme"] = "white-theme";
			for (let j = 0; j < arrSearchType.length - 1; j++) {
				if (arrSearchType[j].style.borderBottom) {
					arrSearchType[j].style.borderBottom = "1px solid #666666";
				}
			}
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

	// 页面加载完成之后，会根据当前查询字符串的值进行搜索
	function fnAfterPageCompleted() {
		oSearchResult.innerHTML = "";
		let arrResult = JSON.parse(oXmlHttp.responseText)["results"];
		console.log(dicTransferredData);
		for (i = 0; i < arrResult.length; i++) {
			let oResultItem = document.createElement("li");
			let strTitle = arrResult[i]["title"];
			let strDescription = arrResult[i]["description"];
			if (dicTransferredData["keyword"]) {
				let regExp = new RegExp(dicTransferredData["keyword"], 'ig');
				strDescription = strDescription.replace(regExp, "<span style='color: #FF557D;'>$&</span>");
			}
			oResultItem.innerHTML = strTitle + strDescription;

			// 标题变色
			if (dicTransferredData["keyword"]) {
				let regExp = new RegExp(dicTransferredData["keyword"], 'ig');
				oResultItem.children[0].children[0].innerHTML = oResultItem.children[0].children[0].innerHTML.replace(regExp, "<span style='color: #FF557D;'>$&</span>");
				if (oResultItem.children[0].children[1]) {
					oResultItem.children[0].children[1].innerHTML = oResultItem.children[0].children[1].innerHTML.replace(regExp, "<span style='color: #FF557D;'>$&</span>");
				}
			}
			oSearchResult.appendChild(oResultItem);
		}
		fnTransferData("GET", "https://api.muxiaoguo.cn/api/tianqi?city=%E5%8C%97%E4%BA%AC&type=1", "", fnAfterGetWeather);
	}

	fnTransferData("POST", "/search/", dicTransferredData, fnAfterPageCompleted);


	// 1.初始搜索类别
	arrSearchType[0].style.borderBottom = "1px solid #666666";
	// 2.选择搜索类别
	function fnChooseSearchType() {
		for (let i = 0; i < arrSearchType.length; i++) {
			arrSearchType[i].onclick = function () {
				fnClearAllStyle();
				if (dicTransferredData["theme"] === "white-theme") {
					this.style.borderBottom = "1px solid #666666";
				}
				else {
					this.style.borderBottom = "1px solid #dcdce0";
				}
			}
		}
	}
	fnChooseSearchType();

	// 清除所有选中的样式
	function fnClearAllStyle() {
		for (let i = 0; i < arrSearchType.length; i++) {
			arrSearchType[i].style.borderBottom = "";
		}
	}

	// 向后台发送要搜索的关键词
	arrSearch[0].onblur = arrSearch[0].oninput = function () {
		dicTransferredData["keyword"] = this.value;
	}

	arrSearch[1].onclick = function () {
		dicTransferredData["page"] = 0;
		window.location.href = "/mobile_search/?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=" + dicTransferredData["page"];
	}

	arrSearch[0].onkeypress = function (e) {
		if (e.keyCode === 13) {
			window.location.href = "/mobile_search"+"/?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=" + dicTransferredData["page"];
		}
	}

	// 切换下一页
	oNext.onclick = function () {
		console.log(dicTransferredData);
		console.log(getQueryArgs());
		dicTransferredData["page"] = Number(dicTransferredData["page"]) + 10;
		window.location.href = "/mobile_search/?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=" + dicTransferredData["page"];
	}


}
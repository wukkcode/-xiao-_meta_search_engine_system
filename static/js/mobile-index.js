window.onload = function () {
	let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
	let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
	let arrOneSaying = document.getElementsByClassName("one-saying")[0].children;
	let oWeather = document.getElementsByClassName("weather")[0];
	let arrSearch = document.getElementsByClassName("search-object")[0].children;
	let arrSearchType = document.getElementsByClassName("search-type")[0].children;
	let oStyle = document.getElementById("style-switch");
	let oXmlHttp = new XMLHttpRequest();
	let dicTransferredData = { "theme": "white-theme", "keyword": "晓", "search-type": "必应","page":"0" };
	let flag = 0;
	let oDate = new Date();


	// 主题切换
	oThemeSwitcher.onclick = function () {
		if (flag % 2 === 0) {
			oThemeCircle.style.left = "28px";
			oStyle.href = "/static/css/mobile-index-dark.css"
			dicTransferredData["theme"] = "dark-theme";
			for (let j = 0; j < arrSearchType.length - 1; j++) {
				if (arrSearchType[j].style.borderBottom) {
					arrSearchType[j].style.borderBottom = "1px solid #dcdce0";
				}
			}

		} else {
			oThemeCircle.style.left = "0px";
			oStyle.href = "/static/css/mobile-index-white.css"
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
	function fnTransferDate(method, url, transferDate, fnSomeActions) {
		oXmlHttp.open(method, url, true);
		if (transferDate) {
			oXmlHttp.setRequestHeader('content-type', 'application/json');
			oXmlHttp.send(transferDate);
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
		oWeather.innerText = oDate.getHours() + ":" + oDate.getMinutes() + " | " + (JSON.parse(oXmlHttp.responseText)["data"]["weather"]);
	}

	fnTransferDate("GET", "https://api.muxiaoguo.cn/api/tianqi?city=%E5%8C%97%E4%BA%AC&type=1", "", fnAfterGetWeather);




	// 1.初始搜索类别
	arrSearchType[0].style.borderBottom = "1px solid #666666";
	// 2.选择搜索类别
	function fnChooseSearchType() {
		for (let i = 0; i < arrSearchType.length; i++) {
			arrSearchType[i].onclick = function(){
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
		console.log(dicTransferredData);
	}

	arrSearch[1].onclick = function() {
		window.location.href = "/mobile_search"+"/?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=" + dicTransferredData["page"];
	}

	arrSearch[0].onkeypress = function (e) {
		if (e.keyCode === 13) {
			window.location.href = "/mobile_search"+"/?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=" + dicTransferredData["page"];
		}
	}

	// 一言API调用
	function fnGetOneSaying() {
		fetch('https://v1.hitokoto.cn?c=d')
			.then(function (res) {
				return res.json();
			})
			.then(function (data) {
				arrOneSaying[0].innerText = "“ " + data.hitokoto.replace("。", "") + " ”";
				arrOneSaying[1].innerText = "— " + data.from + " —";
			})
			.catch(function (err) {
				console.error(err);
			})
	}

	fnGetOneSaying();


	// 喜欢和切换一言
	arrOneSaying[2].onclick = function () {
		if (this.style.color) {
			this.style.color = "";
		} else {
			this.style.color = "#f07c82";
		}
	}

	arrOneSaying[3].onclick = function () {
		arrOneSaying[2].style.color = "";
		fnGetOneSaying();
	}

}
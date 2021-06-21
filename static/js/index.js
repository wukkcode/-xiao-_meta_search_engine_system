window.onload = function () {
	let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
	let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
	let arrOneSaying = document.getElementsByClassName("one-saying")[0].children;
	let arrSearchType = document.querySelectorAll(".content .search-about .search-type li span");
	let arrSearch = document.getElementsByClassName("search-object")[0].children;
	let oStyle = document.getElementById("style-switch");
	let oXmlHttp = new XMLHttpRequest();
	let dicTransferredData = { "theme": "white-theme", "keyword": "晓", "search-type": "综合", "page": "0" };
	let flag = 0;
	let loginState = 0;
	let oWeatherInfo = document.getElementsByClassName("weather")[0];
	let oXmlHttpGetWeather = new XMLHttpRequest();

	// 检测登陆状态

	// if (loginState === 0) {
	// 	arrSearchType[8].parentNode.href = "/login/";
	// }

	// 主题切换
	oThemeSwitcher.onclick = function () {
		if (flag % 2 === 0) {
			oThemeCircle.style.left = "28px";
			oStyle.href = "/static/css/index-dark.css"
			dicTransferredData["theme"] = "dark-theme";
			for (let j = 0; j < arrSearchType.length - 1; j++) {
				if (arrSearchType[j].style.borderBottom) {
					arrSearchType[j].style.borderBottom = "2px solid #fff";
				}
			}
		} else {
			oThemeCircle.style.left = "0px";
			oStyle.href = "/static/css/index-white.css"
			dicTransferredData["theme"] = "white-theme";
			for (let j = 0; j < arrSearchType.length - 1; j++) {
				if (arrSearchType[j].style.borderBottom) {
					arrSearchType[j].style.borderBottom = "2px solid #555555";
				}
			}
		}
		flag += 1;
	}


	// 向后台发送数据通用函数
	function fnTransferDate(method, url, dicSendData, fnSomeActions) {
		oXmlHttp.open(method, url, true);
		// oXmlHttp.setRequestHeader('content-type', 'application/json')
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

	// 搜索操作
	arrSearch[1].onclick = function () {
		let strCurrentUrl = window.location.href;
		if (arrSearch[0].value) {
			dicTransferredData["keyword"] = arrSearch[0].value;
		}

		window.location.href = strCurrentUrl + "/search/?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=" + dicTransferredData["page"]
	}

	arrSearch[0].onkeypress = function (e) {
		let strCurrentUrl = window.location.href;
		if (e.keyCode === 13) {
			if (this.value) {
				dicTransferredData["keyword"] = this.value;
			}
			window.location.href = strCurrentUrl + "/search/?search-type=" + dicTransferredData["search-type"] + "&theme=" + dicTransferredData["theme"] + "&keyword=" + dicTransferredData["keyword"] + "&page=" + dicTransferredData["page"]
		}
	}


	// 搜索框验证
	arrSearch[0].onblur = function () {
		if (this.value) {
			dicTransferredData["keyword"] = this.value;
		}

	}


	// 选择搜索类型
	function fnChooseSearchType() {
		let flag = 0;
		for (let i = 0; i < arrSearchType.length - 5; i++) {
			arrSearchType[0].style.borderBottom = "2px solid #555555";
			arrSearchType[i].onclick = function () {
				if (dicTransferredData["theme"] === "white-theme") {
					if (this.style.borderBottom) {
						this.style.borderBottom = "";
						dicTransferredData["search-type"] = "综合";
						arrSearchType[0].style.borderBottom = "2px solid #555555";
					} else {
						for (let j = 0; j < arrSearchType.length - 1; j++) {
							arrSearchType[j].style.borderBottom = "";
						}
						this.style.borderBottom = "2px solid #555555"
						dicTransferredData["search-type"] = this.innerText;
					}
				} else {
					if (this.style.borderBottom) {
						this.style.borderBottom = "";
						dicTransferredData["search-type"] = "综合";
						arrSearchType[0].style.borderBottom = "2px solid #555555";
					} else {
						for (let j = 0; j < arrSearchType.length - 1; j++) {
							arrSearchType[j].style.borderBottom = "";
						}
						this.style.borderBottom = "2px solid #fff"
						dicTransferredData["search-type"] = this.innerText;
					}
				}
				console.log(dicTransferredData);
			}
		}
	}

	fnChooseSearchType();

	// 获取天气和日期
	function fnAfterGetWeather() {
		// 设置天气
		let strTodayWeather = JSON.parse(oXmlHttpGetWeather.responseText)["data"]["weather"];
		let strTemperature = JSON.parse(oXmlHttpGetWeather.responseText)["data"]["temp"];
		oWeatherInfo.innerHTML = strTodayWeather + " | " + strTemperature + "&#176;";
	}

	fnTransferData(oXmlHttpGetWeather, "GET", "https://api.muxiaoguo.cn/api/tianqi?city=%E5%8C%97%E4%BA%AC&type=1", "", fnAfterGetWeather);


	// 一言API调用
	function fnGetOneSaying() {
		fetch('https://v1.hitokoto.cn?c=i&c=h&c=j&c=k&c=d')
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

	setInterval(fnGetOneSaying, 10000);


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

}
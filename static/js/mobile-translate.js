window.onload = function () {
	let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
	let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
	let oWeather = document.getElementsByClassName("weather")[0];
	let oTranslateResult = document.getElementsByClassName("translate-result")[0];
	let arrTranslate = document.getElementsByClassName("translate-object")[0].children;
	let arrTranslateType = document.getElementsByClassName("translate-type")[0].children;
	let oStyle = document.getElementById("style-switch");
	let oClearAll = document.getElementsByClassName("clear-all")[0];
	let oXmlHttp = new XMLHttpRequest();
	let dicTransferredData = { "translate-type": "谷歌翻译", "keyword": "晓", "theme": "white-theme" };
	let flag = 0;

	// 页面加载完成之后进行翻译，提高用户体验
	fnTransferData("POST", "/translate/", dicTransferredData, fnAferGetTranslate);
	arrTranslate[0].value = dicTransferredData["keyword"];

	// 主题切换
	// 1.点击进行切换
	oThemeSwitcher.onclick = function () {
		if (flag % 2 === 0) {
			oThemeCircle.style.left = "28px";
			oStyle.href = "/static/css/mobile-translate-dark.css"
			dicTransferredData["theme"] = "dark-theme";
			for (let j = 0; j < arrTranslateType.length - 1; j++) {
				if (arrTranslateType[j].style.borderBottom) {
					arrTranslateType[j].style.borderBottom = "1px solid #dcdce0";
				}
			}

		} else {
			oThemeCircle.style.left = "0px";
			oStyle.href = "/static/css/mobile-translate-white.css"
			dicTransferredData["theme"] = "white-theme";
			for (let j = 0; j < arrTranslateType.length - 1; j++) {
				if (arrTranslateType[j].style.borderBottom) {
					arrTranslateType[j].style.borderBottom = "1px solid #666666";
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

	// 获取天气和日期
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

	// 获取翻译框里面的内容
	arrTranslate[0].oninput = arrTranslate[0].onblur = function () {
		if (this.value) {
			dicTransferredData["keyword"] = this.value;
		}
	}

	arrTranslate[0].onkeypress = function (e) {
		if (e.keyCode===13) {
			fnTransferData("POST", "/translate/", dicTransferredData, fnAferGetTranslate);
		}
	}

	// 翻译按钮进行翻译
	arrTranslate[1].onclick = function () {
		if (arrTranslate[0].value) {
			dicTransferredData["keyword"] = arrTranslate[0].value;
		}
		fnTransferData("POST", "/translate/", dicTransferredData, fnAferGetTranslate);
	}


	// 1.初始翻译类别
	arrTranslateType[0].style.borderBottom = "1px solid #666666";
	// 2.选择翻译方式
	function fnChooseTranslateType() {
		for (i = 0; i < arrTranslateType.length; i++) {
			arrTranslateType[i].onclick = function () {
				fnClearAllStyle();
				if (dicTransferredData["theme"] === "white-theme") {
					this.style.borderBottom = "1px solid #666666";
				}
				else {
					this.style.borderBottom = "1px solid #dcdce0";
				}
				dicTransferredData["translate-type"] = this.innerText + "翻译";
				fnTransferData("POST", "/translate/", dicTransferredData, fnAferGetTranslate);
				console.log(dicTransferredData);

			}
		}
	}
	fnChooseTranslateType();

	// 判断翻译文本类型
	function fnJudgeLanguage(strTarget) {
		// 中文返回False
		let strRegular = /[^\u4e00-\u9fa5]/;
		return strRegular.test(strTarget);
	}

	// 获取到翻译数据之后的操作
	function fnAferGetTranslate() {
		let strTranslateResult = oXmlHttp.responseText;
		let oChinese = document.createElement("p");
		let oEnglish = document.createElement("p");
		let oTranslateFrom = document.createElement("p");
		let oTranslateResultItem = document.createElement("li");
		oTranslateFrom.className = "from";


		// 依据原始文本类型做出相应的操作

		if (fnJudgeLanguage(dicTransferredData["keyword"])) {
			// 原始文本为英文
			oTranslateResultItem.className = "en-ch";

			oEnglish.className = "en";
			oEnglish.innerText = dicTransferredData["keyword"];

			oChinese.className = "zh";
			oChinese.innerText = strTranslateResult;

			oTranslateFrom.innerText = dicTransferredData["translate-type"];

			oTranslateResultItem.appendChild(oEnglish);
			oTranslateResultItem.appendChild(oChinese);
			oTranslateResultItem.appendChild(oTranslateFrom)
		}
		else {
			// 原始文本为中文
			oTranslateResultItem.className = "zh-en";

			oChinese.className = "zh";
			oChinese.innerText = dicTransferredData["keyword"];

			oEnglish.className = "en";
			oEnglish.innerText = strTranslateResult;

			oTranslateFrom.innerText = dicTransferredData["translate-type"];

			oTranslateResultItem.appendChild(oChinese);
			oTranslateResultItem.appendChild(oEnglish);
			oTranslateResultItem.appendChild(oTranslateFrom)
		}

		oTranslateResult.insertBefore(oTranslateResultItem, oTranslateResult.children[0]);
		fnTransferData("GET", "https://api.muxiaoguo.cn/api/tianqi?city=%E5%8C%97%E4%BA%AC&type=1", "", fnAfterGetWeather);

	}

	// 清除所有选中的样式
	function fnClearAllStyle() {
		for (let i = 0; i < arrTranslateType.length; i++) {
			arrTranslateType[i].style.borderBottom = "";
		}
	}


	// 清空翻译内容
	oClearAll.onclick = function () {
		oTranslateResult.innerHTML = "";
	}

}
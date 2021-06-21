window.onload = function () {
	let arrNewsChoice = document.getElementsByClassName("news-choice")[0].children;
	let arrNewsContent = document.getElementsByClassName("news-content")[0].children;
	let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
	let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
	let oStyle = document.getElementById("style-switch");
	let oMap = document.getElementsByClassName("map")[0];
	let dicContentInfo = { "newstype": "news", "page": "1" };
	let oUpdate = document.getElementsByClassName("update")[0];
	let dicNewsInfo = { "newstype": "news", "page": "1" };
	let dicRumorsInfo = { "newstype": "rumors", "page": "1" };
	let dicOverall = { "newstype": "overall" }
	let listEpidemicData = [];
	let dicGetOverallData = {};
	let oDataFlag = 0;
	let flag = 0;
	let oMapFlag = 0;
	let arrEpidemicOverall = document.querySelectorAll(".content .news-content .epidemic-tips")[0].children;
	let dicCurrentTheme = {"theme": ""};
	// 指定图表的配置项和数据
	let option = {
		title: {
			text: '国内疫情图',
			left: 'center'
		},
		tooltip: {
			trigger: 'item'
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: ['国内疫情图']
		},
		visualMap: {
			type: 'piecewise',
			pieces: [
				{ min: 10000, max: 10000000, label: '大于等于10000人', color: '#ff6666' },
				{ min: 1000, max: 10000, label: '确诊1000-10000人', color: '#ff8c67' },
				{ min: 100, max: 999, label: '确诊100-999人', color: '#ffd101' },
				{ min: 10, max: 99, label: '确诊10-99人', color: '#4e80ed' },
				{ min: 1, max: 9, label: '确诊1-9人', color: '#55bb8a' },
			],
			color: ['#E0022B', '#E09107', '#A3E00B'],
			textStyle: {
				color: "#666",
			}
		},
		toolbox: {
			show: true,
			orient: 'vertical',
			left: 'right',
			top: 'center',
			feature: {
				mark: { show: true },
				dataView: { show: true, readOnly: false },
				restore: { show: true },
				saveAsImage: { show: true }
			}
		},
		roamController: {
			show: true,
			left: 'right',
			mapTypeControl: {
				'china': true
			}
		},
		series: [
			{
				name: '现存确诊数',
				type: 'map',
				mapType: 'china',
				roam: false,
				data: listEpidemicData,
				nameMap: '',
			}
		]
	};

	// 疫情地图切换
	oMap.onclick = function () {
		echarts.init(oMap).dispose();
		if (oMapFlag % 2 === 0) {
			let oMapChart = echarts.init(oMap, dicCurrentTheme["theme"]);
			option["series"][0]["mapType"] = 'world';
			option["roamController"]['world'] = true;
			option["title"]["text"] = "国外疫情图";
			option["legend"]["data"][0] = "国外疫情图";
			option["series"][0]["nameMap"] = dicNameMap;
			oMapChart.setOption(option);

		}
		else {
			let oMapChart = echarts.init(oMap, dicCurrentTheme["theme"]);
			option["series"][0]["mapType"] = 'china';
			option["roamController"]['china'] = true;
			option["title"]["text"] = "国内疫情图";
			option["legend"]["data"][0] = "国内疫情图";
			oMapChart.setOption(option);
		}
		oMapFlag++;

	}

	// 加载完成之后隐藏地图
	oMap.style.display = "none";

	// 主题切换
	oThemeSwitcher.onclick = function () {
		if (flag % 2 === 0) {
			dicCurrentTheme["theme"] = "dark";
			echarts.init(oMap).dispose();
			let oMapChart = echarts.init(oMap, dicCurrentTheme["theme"]);
			option["visualMap"]["textStyle"]["color"] = "#DCDCE0";
			oMapChart.setOption(option);
			oThemeCircle.style.left = "28px";
			oStyle.href = "/static/css/about-epidemic-dark.css";
		} else {
			dicCurrentTheme["theme"] = "";
			oThemeCircle.style.left = "0px";
			oStyle.href = "/static/css/about-epidemic-white.css";
			echarts.init(oMap).dispose();
			let oMapChart = echarts.init(oMap, dicCurrentTheme["theme"]);
			option["visualMap"]["textStyle"]["color"] = "#666";
			oMapChart.setOption(option);
		}
		flag += 1;
	}


	// 点击刷新按钮进行刷新
	oUpdate.onclick = function () {
		if (dicContentInfo["newstype"] === "news") {
			dicNewsInfo["page"] = Number(dicNewsInfo["page"]) + 1;
			fnTransferData("POST", "/epidemic/", dicNewsInfo, fnAfterGetNews);
		}

		if (dicContentInfo["newstype"] === "rumors") {
			dicRumorsInfo["page"] = Number(dicRumorsInfo["page"]) + 1;
			fnTransferData("POST", "/epidemic/", dicRumorsInfo, fnAfterGetRumors);
		}


	}

	// 点击选择类型
	function fnChooseType() {
		for (let i = 0; i < arrNewsChoice.length; i++) {
			arrNewsChoice[i].onclick = function () {
				if (this.innerText === "新闻") {
					fnClearAll();
					arrNewsChoice[i].style.color = "#4e80ed";
					arrNewsContent[3].style.display = "block";
					dicContentInfo["newstype"] = "news";
					oUpdate.style.display = "block";
					oUpdate.style.backgroundColor = "#4e80ed";
					oUpdate.style.color = "#fff";

				}
				if (this.innerText === "辟谣") {
					fnClearAll();
					arrNewsChoice[i].style.color = "#55bb8a";
					arrNewsContent[4].style.display = "block";
					dicContentInfo["newstype"] = "rumors";
					oUpdate.style.display = "block";
					oUpdate.style.backgroundColor = "#55bb8a";
					oUpdate.style.color = "#fff";
					if (oDataFlag === 0) {
						fnTransferData("POST", "/epidemic/", dicContentInfo, fnAfterGetRumors);
					}
					flag += 1;
				}
				if (this.innerText === "地图") {
					fnClearAll();
					arrNewsChoice[i].style.color = "#f74c31";
					arrNewsContent[5].style.display = "block";
					dicContentInfo["newstype"] = "map";
					oUpdate.style.display = "none";
					fnTransferData("POST", "/epidemic/", dicContentInfo, fnAfterGetEpidemicData);
				}
				if (this.innerText === "关于") {
					fnClearAll();
					arrNewsChoice[i].style.color = "#7980ed";
					arrNewsContent[6].style.display = "block";
					oUpdate.style.display = "none";
				}
			}

		}
	}
	fnChooseType();

	// 获得谣言信息之后的操作
	function fnAfterGetRumors(oGetData) {
		let dicGetRumors = JSON.parse(oGetData)["results"];
		arrNewsContent[4].innerHTML = "";
		for (let i = 0; i < dicGetRumors.length; i++) {
			let oNewsItem = document.createElement("li");
			let oTitle = document.createElement("h2");
			let oSummary = document.createElement("p");
			let oType = document.createElement("span");
			let oResult = document.createElement("p");

			// 添加标题
			oTitle.innerText = dicGetRumors[i]["title"];
			oType.innerText = "辟谣";
			oTitle.appendChild(oType);

			// 添加内容
			oSummary.innerText = dicGetRumors[i]["body"];
			oResult.innerText = dicGetRumors[i]["mainSummary"];

			// 列表项添加所有节点
			oNewsItem.appendChild(oTitle);
			oNewsItem.appendChild(oSummary);
			oNewsItem.appendChild(oResult);

			arrNewsContent[4].appendChild(oNewsItem);
		}
	}

	// 获取新闻内容
	function fnAfterGetNews(oGetData) {
		let dicGetData = JSON.parse(oGetData)["results"];
		arrNewsContent[3].innerHTML = "";
		for (let i = 0; i < dicGetData.length; i++) {
			let oNewsItem = document.createElement("li");
			let oTitle = document.createElement("h2");
			let oSummary = document.createElement("p");
			let oFromAndDate = document.createElement("p");
			let oInfoLink = document.createElement("a");
			let oType = document.createElement("span");

			// 给标题和链接添加内容
			oInfoLink.href = dicGetData[i]["sourceUrl"];
			oInfoLink.innerText = dicGetData[i]["title"];
			oType.innerText = "新闻";
			// oTitle.innerHTML = oInfoLink + oType;
			oTitle.appendChild(oInfoLink);
			oTitle.appendChild(oType);

			// 添加内容和来源
			oSummary.innerText = dicGetData[i]["summary"];
			oFromAndDate.innerText = dicGetData[i]["infoSource"] + " | " + fnTransformDate(Number(dicGetData[i]["pubDate"]));
			oNewsItem.appendChild(oTitle);
			oNewsItem.appendChild(oSummary);
			oNewsItem.appendChild(oFromAndDate);

			// 都添加进消息对象中
			arrNewsContent[3].appendChild(oNewsItem);

		}
		function sleep(millisecond) {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve()
				}, millisecond)
			})
		}


		async function fnDelayExecute() {
			await sleep(2000);
			fnTransferData("POST", "/epidemic/", dicOverall, fnAfterGetEpidemicOverall);
		}
		fnDelayExecute();
	}

	fnTransferData("POST", "/epidemic/", dicContentInfo, fnAfterGetNews);


	// 获取中国疫情数据绘制地图
	function fnAfterGetEpidemicData(oGetData) {
		let dicGetData = JSON.parse(oGetData)["results"];
		for (let i = 0; i < dicGetData.length; i++) {
			dicTemp = {};
			dicTemp["name"] = dicGetData[i]["provinceShortName"];
			dicTemp["value"] = Number(dicGetData[i]["currentConfirmedCount"]);
			listEpidemicData.push(dicTemp);
		}

		let oMapChart = echarts.init(oMap, dicCurrentTheme["theme"]);
		oMapChart.setOption(option);
	}

	// 获取疫情的一些概览
	function fnAfterGetEpidemicOverall(oGetData) {
		dicGetOverallData = JSON.parse(oGetData)["results"][0];
		arrEpidemicOverall[0].children[1].innerText = dicGetOverallData["currentConfirmedCount"];
		arrEpidemicOverall[1].children[1].innerText = dicGetOverallData["confirmedCount"];
		arrEpidemicOverall[2].children[1].innerText = dicGetOverallData["curedCount"];
		arrEpidemicOverall[3].children[1].innerText = dicGetOverallData["deadCount"];
	}

	// 国内国外数据概况进行切换
	function fnSwitchOverall() {
		for (let i = 0; i < arrEpidemicOverall.length; i++) {
			if (arrEpidemicOverall[i].children[0].innerText === "国内") {
				arrEpidemicOverall[i].children[0].innerText = "国外";
			}
			else {
				arrEpidemicOverall[i].children[0].innerText = "国内";
			}
		}
		if (arrEpidemicOverall[0].children[0].innerText === "国内") {
			arrEpidemicOverall[0].children[1].innerText = dicGetOverallData["currentConfirmedCount"];
			arrEpidemicOverall[1].children[1].innerText = dicGetOverallData["confirmedCount"];
			arrEpidemicOverall[2].children[1].innerText = dicGetOverallData["curedCount"];
			arrEpidemicOverall[3].children[1].innerText = dicGetOverallData["deadCount"];
		}
		else {
			arrEpidemicOverall[0].children[1].innerText = dicGetOverallData["globalStatistics"]["currentConfirmedCount"];
			arrEpidemicOverall[1].children[1].innerText = dicGetOverallData["globalStatistics"]["confirmedCount"];
			arrEpidemicOverall[2].children[1].innerText = dicGetOverallData["globalStatistics"]["curedCount"];
			arrEpidemicOverall[3].children[1].innerText = dicGetOverallData["globalStatistics"]["deadCount"];

		}
	}

	for (let i = 0; i < arrEpidemicOverall.length; i++) {
		arrEpidemicOverall[i].children[0].onclick = function () {
			fnSwitchOverall();
		}
	}

	// 设置时间和天气
	function fnSetDate() {
		let oDate = new Date();
		let arrAboutDate = arrNewsContent[2].children[0].children[0];
		arrAboutDate.children[0].innerText = String(oDate.getFullYear()) + "-" + String(oDate.getMonth() + 1) + "-" + String(oDate.getDate());
		arrAboutDate.children[1].innerText = String(oDate.getHours()) + ":" + String(oDate.getMinutes()) + ":" + String(oDate.getSeconds());
	}

	setInterval(fnSetDate, 1000);

	// 设置天气
	function fnSetWeather(oGetData) {
		dicGetWeatherData = JSON.parse(oGetData)["data"];
		let arrAboutWeather = arrNewsContent[2].children[0].children[1];
		arrAboutWeather.children[0].innerHTML = dicGetWeatherData["weather"] + " | " + dicGetWeatherData["temp"] + "&#176;";
		arrAboutWeather.children[1].innerText = fnChooseSport(dicGetWeatherData["weather"]);

	}
	fnTransferData("GET", "https://api.muxiaoguo.cn/api/tianqi?city=%E5%8C%97%E4%BA%AC&type=1", "", fnSetWeather);

	// 依据天气状况选择运动
	function fnChooseSport(strWeather) {
		if (strWeather === "晴") {
			return "宜外出散心";
		}
		else {
			return "宜学习提升";
		}
	}

	// 将1970时间戳转换为标准日期
	function fnTransformDate(target) {
		let oDate = new Date(target);
		oNormalDate = oDate.getFullYear() + "-" + (oDate.getMonth()+1) + "-" + oDate.getDate();
		return oNormalDate;
	}


	// 清除所有已经选择的
	function fnClearAll() {
		for (let i = 3; i < arrNewsContent.length; i++) {
			arrNewsContent[i].style.display = "none";
		}

		for (let j = 0; j < arrNewsChoice.length; j++) {
			arrNewsChoice[j].style.color = ""
		}
	}

	arrNewsChoice[0].style.color = "#4e80ed";


	// 向后台发送数据通用函数
	function fnTransferData(method, url, transferDate, fnSomeActions) {
		let oXmlHttp = new XMLHttpRequest();
		oXmlHttp.open(method, url, true);
		if (transferDate) {
			oXmlHttp.setRequestHeader('content-type', 'application/json')
			oXmlHttp.send(JSON.stringify(transferDate));
		}
		else {
			oXmlHttp.send();
		}
		oXmlHttp.onreadystatechange = function () {
			if (oXmlHttp.readyState == 4 && oXmlHttp.status == 200) {
				let oGetData = oXmlHttp.responseText;
				if (fnSomeActions) {
					fnSomeActions(oGetData);
				}
			}
		}
	}

	// 中英文对照

	let dicNameMap = {
		Afghanistan: '阿富汗',
		Singapore: '新加坡',
		Angola: '安哥拉',
		Albania: '阿尔巴尼亚',
		'United Arab Emirates': '阿联酋',
		Argentina: '阿根廷',
		Armenia: '亚美尼亚',
		'French Southern and Antarctic Lands':
			'法属南半球和南极领地',
		Australia: '澳大利亚',
		Austria: '奥地利',
		Azerbaijan: '阿塞拜疆',
		Burundi: '布隆迪',
		Belgium: '比利时',
		Benin: '贝宁',
		'Burkina Faso': '布基纳法索',
		Bangladesh: '孟加拉国',
		Bulgaria: '保加利亚',
		'The Bahamas': '巴哈马',
		'Bosnia and Herzegovina': '波斯尼亚和黑塞哥维那',
		Belarus: '白俄罗斯',
		Belize: '伯利兹',
		Bermuda: '百慕大',
		Bolivia: '玻利维亚',
		Brazil: '巴西',
		Brunei: '文莱',
		Bhutan: '不丹',
		Botswana: '博茨瓦纳',
		'Central African Republic': '中非共和国',
		Canada: '加拿大',
		Switzerland: '瑞士',
		Chile: '智利',
		China: '中国',
		'Ivory Coast': '象牙海岸',
		Cameroon: '喀麦隆',
		'Democratic Republic of the Congo': '刚果民主共和国',
		'Republic of the Congo': '刚果共和国',
		Colombia: '哥伦比亚',
		'Costa Rica': '哥斯达黎加',
		Cuba: '古巴',
		'Northern Cyprus': '北塞浦路斯',
		Cyprus: '塞浦路斯',
		'Czech Republic': '捷克共和国',
		Germany: '德国',
		Djibouti: '吉布提',
		Denmark: '丹麦',
		'Dominican Republic': '多明尼加共和国',
		Algeria: '阿尔及利亚',
		Ecuador: '厄瓜多尔',
		Egypt: '埃及',
		Eritrea: '厄立特里亚',
		Spain: '西班牙',
		Estonia: '爱沙尼亚',
		Ethiopia: '埃塞俄比亚',
		Finland: '芬兰',
		Fiji: '斐',
		'Falkland Islands': '福克兰群岛',
		France: '法国',
		Gabon: '加蓬',
		'United Kingdom': '英国',
		Georgia: '格鲁吉亚',
		Ghana: '加纳',
		Guinea: '几内亚',
		Gambia: '冈比亚',
		'Guinea Bissau': '几内亚比绍',
		Greece: '希腊',
		Greenland: '格陵兰',
		Guatemala: '危地马拉',
		'French Guiana': '法属圭亚那',
		Guyana: '圭亚那',
		Honduras: '洪都拉斯',
		Croatia: '克罗地亚',
		Haiti: '海地',
		Hungary: '匈牙利',
		Indonesia: '印度尼西亚',
		India: '印度',
		Ireland: '爱尔兰',
		Iran: '伊朗',
		Iraq: '伊拉克',
		Iceland: '冰岛',
		Israel: '以色列',
		Italy: '意大利',
		Jamaica: '牙买加',
		Jordan: '约旦',
		Japan: '日本',
		Kazakhstan: '哈萨克斯坦',
		Kenya: '肯尼亚',
		Kyrgyzstan: '吉尔吉斯斯坦',
		Cambodia: '柬埔寨',
		Kosovo: '科索沃',
		Kuwait: '科威特',
		Laos: '老挝',
		Lebanon: '黎巴嫩',
		Liberia: '利比里亚',
		Libya: '利比亚',
		'Sri Lanka': '斯里兰卡',
		Lesotho: '莱索托',
		Lithuania: '立陶宛',
		Luxembourg: '卢森堡',
		Latvia: '拉脱维亚',
		Morocco: '摩洛哥',
		Moldova: '摩尔多瓦',
		Madagascar: '马达加斯加',
		Mexico: '墨西哥',
		Macedonia: '马其顿',
		Mali: '马里',
		Myanmar: '缅甸',
		Montenegro: '黑山',
		Mongolia: '蒙古',
		Mozambique: '莫桑比克',
		Mauritania: '毛里塔尼亚',
		Malawi: '马拉维',
		Malaysia: '马来西亚',
		Namibia: '纳米比亚',
		'New Caledonia': '新喀里多尼亚',
		Niger: '尼日尔',
		Nigeria: '尼日利亚',
		Nicaragua: '尼加拉瓜',
		Netherlands: '荷兰',
		Norway: '挪威',
		Nepal: '尼泊尔',
		'New Zealand': '新西兰',
		Oman: '阿曼',
		Pakistan: '巴基斯坦',
		Panama: '巴拿马',
		Peru: '秘鲁',
		Philippines: '菲律宾',
		'Papua New Guinea': '巴布亚新几内亚',
		Poland: '波兰',
		'Puerto Rico': '波多黎各',
		'North Korea': '北朝鲜',
		Portugal: '葡萄牙',
		Paraguay: '巴拉圭',
		Qatar: '卡塔尔',
		Romania: '罗马尼亚',
		Russia: '俄罗斯',
		Rwanda: '卢旺达',
		'Western Sahara': '西撒哈拉',
		'Saudi Arabia': '沙特阿拉伯',
		Sudan: '苏丹',
		'South Sudan': '南苏丹',
		Senegal: '塞内加尔',
		'Solomon Islands': '所罗门群岛',
		'Sierra Leone': '塞拉利昂',
		'El Salvador': '萨尔瓦多',
		Somaliland: '索马里兰',
		Somalia: '索马里',
		'Republic of Serbia': '塞尔维亚',
		Suriname: '苏里南',
		Slovakia: '斯洛伐克',
		Slovenia: '斯洛文尼亚',
		Sweden: '瑞典',
		Swaziland: '斯威士兰',
		Syria: '叙利亚',
		Chad: '乍得',
		Togo: '多哥',
		Thailand: '泰国',
		Tajikistan: '塔吉克斯坦',
		Turkmenistan: '土库曼斯坦',
		'East Timor': '东帝汶',
		'Trinidad and Tobago': '特里尼达和多巴哥',
		Tunisia: '突尼斯',
		Turkey: '土耳其',
		'United Republic of Tanzania': '坦桑尼亚',
		Uganda: '乌干达',
		Ukraine: '乌克兰',
		Uruguay: '乌拉圭',
		'United States': '美国',
		Uzbekistan: '乌兹别克斯坦',
		Venezuela: '委内瑞拉',
		Vietnam: '越南',
		Vanuatu: '瓦努阿图',
		'West Bank': '西岸',
		Yemen: '也门',
		'South Africa': '南非',
		Zambia: '赞比亚',
		Korea: '韩国',
		Tanzania: '坦桑尼亚',
		Zimbabwe: '津巴布韦',
		Congo: '刚果',
		'Central African Rep.': '中非',
		Serbia: '塞尔维亚',
		'Bosnia and Herz.': '波黑',
		'Czech Rep.': '捷克',
		'W. Sahara': '西撒哈拉',
		'Lao PDR': '老挝',
		'Dem.Rep.Korea': '朝鲜',
		'Falkland Is.': '福克兰群岛',
		'Timor-Leste': '东帝汶',
		'Solomon Is.': '所罗门群岛',
		Palestine: '巴勒斯坦',
		'N. Cyprus': '北塞浦路斯',
		Aland: '奥兰群岛',
		'Fr. S. Antarctic Lands': '法属南半球和南极陆地',
		Mauritius: '毛里求斯',
		Comoros: '科摩罗',
		'Eq. Guinea': '赤道几内亚',
		'Guinea-Bissau': '几内亚比绍',
		'Dominican Rep.': '多米尼加',
		'Saint Lucia': '圣卢西亚',
		Dominica: '多米尼克',
		'Antigua and Barb.': '安提瓜和巴布达',
		'U.S. Virgin Is.': '美国原始岛屿',
		Montserrat: '蒙塞拉特',
		Grenada: '格林纳达',
		Barbados: '巴巴多斯',
		Samoa: '萨摩亚',
		Bahamas: '巴哈马',
		'Cayman Is.': '开曼群岛',
		'Faeroe Is.': '法罗群岛',
		'IsIe of Man': '马恩岛',
		Malta: '马耳他共和国',
		Jersey: '泽西',
		'Cape Verde': '佛得角共和国',
		'Turks and Caicos Is.': '特克斯和凯科斯群岛',
		'St. Vin. and Gren.': '圣文森特和格林纳丁斯'
	}
}
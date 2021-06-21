window.onload = function () {
    let arrScienceType = document.querySelectorAll(".science-type li");
    let oScienceContent = document.getElementsByClassName("science-content")[0];
    let oThemeCircle = document.getElementsByClassName("theme-circle")[0];
    let oThemeSwitcher = document.getElementsByClassName("theme-switcher")[0];
    let oStyle = document.getElementById("style-switch");
    let flag = 0;
    let dicScienceType = {
        "谷歌学术": "https://scholar.chongbuluo.com/GoogleScholar.html",
        "微软学术": "https://academic.microsoft.com/home",
        "百度学术": "https://xueshu.baidu.com/",
        "OALib": "https://www.oalib.com/",
        "AMiner": "https://aminer.org/",
        "Sci-Hub": "https://sci-hub.se/",
        "CNKI": "https://www.cnki.net/",
        "Open-i": "https://openi.nlm.nih.gov/",
        "国图文津": "https://scholar.chongbuluo.com/wenjin.html",
        "世界数字图书馆": "https://www.wdl.org/zh/",
        "X-MOL": "https://www.x-mol.com/journal/advanceSearch",
        "术语搜索": "https://www.termonline.cn/index.htm",
        "比勒费尔德学术": "https://www.base-search.net/",
        "SJR": "https://www.scimagojr.com/index.php",
        "SCI影响因子": "https://www.letpub.com.cn/index.php?page=journalapp",
        "CINII": "https://ci.nii.ac.jp/",
        "英文DOI": "https://dx.doi.org/",
        "RSC Publishing": "https://pubs.rsc.org/en/search/advancedsearch",
        "麻省理工文献": "https://web.mit.edu/search.html",
        "剑桥大学知识库": "https://www.repository.cam.ac.uk/discover",
    }

    // JS设置学术类别
    function fnSetScienceType() {
        for (i = 0; i < arrScienceType.length - 1; i++) {
            arrScienceType[i].children[0].setAttribute("science-type", dicScienceType[arrScienceType[i].children[0].innerText]);
        }
    }

    fnSetScienceType();

    // 点击学术类型进行切换
    function fnSwitchScienceType() {
        for (i = 0; i < arrScienceType.length - 1; i++) {
            arrScienceType[i].onclick = function () {
                oScienceContent.src = this.children[0].getAttribute("science-type");
                for (j = 0; j < arrScienceType.length - 1; j++) {
                    arrScienceType[j].style.color = "";
                }
                this.style.color = "#14a2f5";
            }
        }
    }

    fnSwitchScienceType();

    // 主题切换
    oThemeSwitcher.onclick = function () {
        if (flag % 2 === 0) {
            oThemeCircle.style.left = "28px";
            oStyle.href = "/static/css/science-dark.css"
        } else {
            oThemeCircle.style.left = "0px";
            oStyle.href = "/static/css/science-white.css"
        }
        flag += 1;
    }

}
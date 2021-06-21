from flask import Flask, render_template, request
from spiders.search_engine_spider import SearchEngineSpider
from spiders.translate_enigine import TranslateSpider
from spiders.hot_news_spider import HotNewsSpider
# from login.login import UserInfoTable
from spiders.about_epidemic import EpidemicSpider

app = Flask(__name__)


search_engine_spider = SearchEngineSpider()
translate_spider = TranslateSpider()
hot_news_spider = HotNewsSpider()
# user_info = UserInfoTable()
epidemic_spider = EpidemicSpider()



# These views below are belong to PC browser
@app.route("/", methods=["GET", "POST"])
def index():
    # Index page
    if request.method == "GET":
        return render_template("index.html")


@app.route("/search/", methods=["GET", "POST"])
def search():
    # Search page
    if request.method == "GET":
        return render_template("search-result.html")

    if request.method == "POST":
        get_data = request.get_json()
        page = get_data["page"]
        search_type = ""
        if get_data["search-type"] == "综合":
            return search_engine_spider.get_comprensive_results(get_data["keyword"], page)
        else:
            if get_data["search-type"] == "谷歌":
                search_type = "Google"
            elif get_data["search-type"] == "必应":
                search_type = "Bing"
            elif get_data["search-type"] == "百度":
                search_type = "Baidu"
            elif get_data["search-type"] == "360":
                search_type = "360"
                if get_data["page"] == 0:
                    print(get_data["page"])
                    page = int(get_data["page"])+1
                else:
                    page = int(get_data["page"])//10+1
            elif get_data["search-type"] == "搜狗":
                if get_data["page"] == 0:
                    print(get_data["page"])
                    page = int(get_data["page"])+1
                else:
                    page = int(get_data["page"])//10+1
                search_type = "Sogou"
            else:
                search_type = "Bing"
            return search_engine_spider.run(search_type, get_data["keyword"], page)


@app.route("/result_num/", methods=["GET", "POST"])
def get_result_num():
    # Return the number of all search engines' result
    if request.method == "POST":
        get_data = request.get_json()
        print(get_data)
        return search_engine_spider.parse_result_num(get_data["keyword"])


# @app.route("/login/", methods=["GET", "POST"])
# def login():
#     # Login page from my useful class
#     if request.method == "GET":
#         return render_template("login.html")

#     if request.method == "POST":
#         login_state = {"state": ""}
#         get_data = request.get_json()
#         if user_info.verify_user(get_data["username"]["value"], get_data["password"]["value"]):
#             login_state["state"] = "success"
#         else:
#             login_state["state"] = "fail"
#         print(login_state)
#         return login_state


# @app.route("/register/", methods=["GET", "POST"])
# def register():
#     # regiser function for adding an user
#     if request.method == "GET":
#         return render_template("login.html")

#     if request.method == "POST":
#         register_state = {"state": ""}
#         get_data = request.get_json()
#         print(get_data)
#         if user_info.add_user(get_data["username"]["value"], get_data["password"]["value"]):
#             register_state["state"] = "success"
#         else:
#             register_state["state"] = "fail"
#         print(register_state)
#         return register_state


@app.route("/translate/", methods=["GET", "POST"])
def translate():
    # Translate page
    if request.method == "GET":
        return render_template("translate.html")
    if request.method == "POST":
        get_data = request.get_json()
        print(get_data)
        result = translate_spider.translate(
            get_data["keyword"], get_data["translate-type"])
        return result


@app.route("/science/", methods=["GET", "POST"])
def science():
    # science page
    return render_template("science.html")


@app.route("/hotnews/", methods=["GET", "POST"])
def hotnews():
    # Hotnews page
    if request.method == "GET":
        return render_template("hot-news.html")
    if request.method == "POST":
        return hot_news_spider.run()


@app.route("/epidemic/", methods=["GET", "POST"])
def epidemic():
    # Epidemic function page
    if request.method == "GET":
        return render_template("about-epidemic.html")

    if request.method == "POST":
        get_data = request.get_json()
        print(get_data)
        if get_data["newstype"] == "rumors":
            return epidemic_spider.get_rumors(f"https://lab.isaaclin.cn/nCoV/api/rumors?page={get_data['page']}")
        elif get_data["newstype"] == "news":
            return epidemic_spider.get_news(f"https://lab.isaaclin.cn/nCoV/api/news?page={str(get_data['page'])}")
        elif get_data["newstype"] == "overall":
            return epidemic_spider.get_overall("https://lab.isaaclin.cn/nCoV/api/overall")
        else:
            return epidemic_spider.get_data("https://lab.isaaclin.cn/nCoV/api/area?latest=1")


# These views below are belong to mobile design page.
@app.route("/mobile/", methods=["GET", "POST"])
def mobile():
    # Mobile index page
    if request.method == "GET":
        return render_template("mobile-index.html")


@app.route("/mobile_search/", methods=["GET", "POST"])
def mobile_search():
    # Mobile search page
    if request.method == "GET":
        return render_template("mobile-search.html")


@app.route("/mobile_translate/", methods=["GET", "POST"])
def mobile_translate():
    # Mobile translate page
    if request.method == "GET":
        return render_template("mobile-translate.html")


@app.route("/mobile_hotnews/", methods=["GET", "POST"])
def mobile_hotnews():
    # Mobile hotnews page
    if request.method == "GET":
        return render_template("mobile-hotnews.html")



@app.route("/mobile_app/", methods=["GET", "POST"])
def mobile_app():
    # A mobile app
    return render_template("mobile-app.html")


if __name__ == "__main__":
    app.run(debug=True)

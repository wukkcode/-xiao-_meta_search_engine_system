import requests
from lxml import etree
from .search_engine_settings import search_engine_dict, proxies, google_mirrors
import re
import random
import threading


class SearchEngineSpider(object):
    """
    This is a spider of all search engines.
    This spider can get search results including titls and description.
    This spider uses xpath parse lib and requests HTTP lib.
    This functions are very useful and elegant.
    So, enjoy it !!!! 
    """

    def __init__(self):
        # Initialize all properties of this spider
        self.search_engine = search_engine_dict
        self.search_type = "Bing"
        self.keyword = "晓"
        self.all_results_dict = {"results": ["访问太过频繁，请稍后再试！"]}
        self.response = "访问太过频繁，请稍后再试！"
        self.page = 0
        self.result_num_dict = {"Bing": 0, "Google": 0,
                                "360": 0, "Baidu": 0, "Sogou": 0}

        self.comprehensive_results_dict = {
            "Bing": {}, "Sogou": {}, "Baidu": {}, "360": {}, "Google":{}}
        self.proxies = proxies
        self.google_mirrors = google_mirrors

    def request_link(self, search_type, keyword, page):
        # To request HTML text by requests lib
        self.search_type = search_type
        self.page = page
        if keyword:
            self.keyword = keyword
        url = ""
        if self.search_type == "Google":
            google_mirror = random.choice(self.google_mirrors)
            url = self.search_engine[self.search_type]["url"].format(
                google_mirror, self.keyword, self.page)
            # url = self.search_engine[self.search_type]["url"].format(
            #     "https://www.google.com.hk/", self.keyword, self.page)
        else:
            url = self.search_engine[self.search_type]["url"].format(
                self.keyword, self.page)
        print(url)
        random_proxie = random.choice(self.proxies)
        print(random_proxie)
        try:
            response = requests.get(
                url, headers=self.search_engine[self.search_type]["headers"], proxies=random_proxie, timeout=2).text
            if response:
                self.response = response
        except:
            print("这边请求错误了")
        return self.response

    def parse_result_num(self, keyword):
        # To parse all search result num
        threading_list = []
        for search_type in self.result_num_dict:
            temp_threading = threading.Thread(
                target=self.parse_result_num_threading, args=(search_type, keyword))
            threading_list.append(temp_threading)
        for my_threading in threading_list:
            my_threading.start()

        for my_threading in threading_list:
            my_threading.join()
        return self.result_num_dict

    def parse_result_num_threading(self, search_type, keyword):
        # parse result number threading
        print(search_type)
        page = 1
        if search_type == "Bing":
            page = 10
        if self.response != "访问太过频繁，请稍后再试！":
            try:
                if self.format_to_tree(self.request_link(search_type, keyword, page)).xpath(self.search_engine[search_type]["result_num_regular"]):
                    self.result_num_dict[search_type] = self.transform_to_num(self.format_to_tree(self.request_link(
                        search_type, keyword, page)).xpath(self.search_engine[search_type]["result_num_regular"])[0])
            except:
                print("错了错了")

    def parse_result(self):
        # Parse search result of single search engine.
        self.all_results_dict = {"results": []}
        if self.response == "访问太过频繁，请稍后再试！":
            self.all_results_dict["results"] = "访问太过频繁，请稍后再试！"
        else:
            html_tree = etree.HTML(self.response)
            all_results_list = html_tree.xpath(
                self.search_engine[self.search_type]["all_results_regular"])
            for i in range(len(all_results_list)):
                each_result_tree = etree.HTML(etree.tostring(
                    all_results_list[i]).decode("utf-8"))

                # parse each result title
                each_result_title = "当前没有搜索到"
                if each_result_tree.xpath(self.search_engine[self.search_type]["result_title_regular"]):
                    each_result_title = etree.tostring(each_result_tree.xpath(
                        self.search_engine[self.search_type]["result_title_regular"])[0]).decode("utf-8")

                # parse each result description
                if each_result_tree.xpath(self.search_engine[self.search_type]["result_description_regular"]):
                    each_result_description = etree.tostring(each_result_tree.xpath(
                        self.search_engine[self.search_type]["result_description_regular"])[0]).decode("utf-8")
                else:
                    each_result_description = "此搜索条目没有描述"

                # merge search result
                each_result_dict = {}
                each_result_dict["title"] = each_result_title
                each_result_dict["description"] = each_result_description
                self.all_results_dict["results"].append(each_result_dict)

    def get_comprensive_results(self, keyword, page):
        # Get all search engines' results for comparing result.
        for search_type in self.comprehensive_results_dict:
            print(search_type)
            temp_page = page
            if search_type == "360" or search_type == "Sogou":
                if temp_page == 0:
                    temp_page = int(temp_page)+1
                else:
                    temp_page = int(temp_page)//10+1
            self.request_link(search_type, keyword, temp_page)
            self.parse_result()
            self.comprehensive_results_dict[search_type] = self.all_results_dict
        return self.comprehensive_results_dict
    
    
    def format_to_tree(self, html_text):
        return etree.HTML(html_text)

    def transform_to_num(self, string):
        temp_string = string.replace(",", "")
        return int("".join(re.findall("[0-9]+(?=[^0-9]*$)", temp_string)))

    def run(self, search_type, keyword, page):
        self.request_link(search_type, keyword, page)
        self.parse_result()
        return self.all_results_dict



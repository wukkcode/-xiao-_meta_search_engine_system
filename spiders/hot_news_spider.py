import requests
import json

# 热点爬虫类
class HotNewsSpider(object):
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36 Edg/90.0.818.39"}
        self.response = ""
        self.jsonData = ""
        self.url = "https://open.tophub.today/hot"

    def request(self):
        # 请求数据
        self.response = requests.get(self.url, headers=self.headers).text

    def formatData(self):
        # 格式化数据
        self.jsonData = json.loads(self.response)
        
    def run(self):
        # 执行爬取业务
        self.request()
        self.formatData()
        return self.jsonData
    

from .translate_spider import *

youdao_translator = Youdao()
google_translator = Google()
baidu_translator = Baidu()
tencent_translator = Tencent()
microsoft_translator = Microsoft()
deepl_translator = Deepl()
alibaba_translator = Alibaba()


class TranslateSpider(object):
    def __init__(self):
        self.translate_engine = {"谷歌翻译": google_translator,
                                 "有道翻译": youdao_translator, "百度翻译": baidu_translator, "腾讯翻译": tencent_translator, "微软翻译": microsoft_translator, "deepl翻译": deepl_translator, "阿里翻译":alibaba_translator}
        self.translate_type = "有道翻译"

    def translate(self, text, translate_type):
        if translate_type in self.translate_engine:
            if self.translate_engine[translate_type]:
                result = self.translate_engine[translate_type].translate(text)
        else:
            result = self.translate_engine[self.translate_type].translate(text)
        return result
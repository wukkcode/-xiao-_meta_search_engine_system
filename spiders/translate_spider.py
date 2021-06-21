# -*- coding:utf-8 -*-
import requests
import execjs
import re
import urllib.request
import http.cookiejar
from google_trans_new import google_translator as google_translator_lib
import urllib3
import json
import translators
import random
from hashlib import md5


# 百度翻译爬虫
# class Baidu(object):

#     def __init__(self):

#         self.url = 'https://fanyi.baidu.com/v2transapi?from=zh&to=en'
#         self.header = {
#             'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
#             'origin': 'https://fanyi.baidu.com',
#             'referer': 'https://fanyi.baidu.com/?aldtype=16047',
#             'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
#             'x-requested-with': 'XMLHttpRequest',
#             'cookie': 'BIDUPSID=D3290C65C03AEF0E98D97B8641DFFB15; PSTM=1570785944; REALTIME_TRANS_SWITCH=1; FANYI_WORD_SWITCH=1; HISTORY_SWITCH=1; SOUND_SPD_SWITCH=1; SOUND_PREFER_SWITCH=1; BAIDUID=0CC6F13854E81A68D3C564D36E7C8A03:FG=1; APPGUIDE_8_2_2=1; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; BDSFRCVID=wt_OJeC626EDLgju-c_JbHce7gSxbKcTH6aoxbIy4_AgXmAxrp74EG0PJf8g0Ku-dWitogKKBmOTHg-F_2uxOjjg8UtVJeC6EG0Ptf8g0M5; H_BDCLCKID_SF=JJkO_D_atKvjDbTnMITHh-F-5fIX5-RLf5TuLPOF5lOTJh0RbtOkjnQD-UL82bT2fRcQ0tJLb4DaStJbLjbke6cbDa_fJ5Fs-I5O0R4854QqqR5R5bOq-PvHhxoJqbbJX2OZ0l8KtDQpshRTMR_V-p4p-472K6bML5baabOmWIQHDPnPyJuMBU_sWMcChnjjJbn4KKJxWJLWeIJo5Dcf3PF3hUJiBMjLBan7056IXKohJh7FM4tW3J0ZyxomtfQxtNRJ0DnjtpChbRO4-TF-D5jXeMK; delPer=0; PSINO=2; H_PS_PSSID=1435_21104_18560_26350; Hm_lvt_64ecd82404c51e03dc91cb9e8c025574=1580216234,1580216243,1580458514,1580458537; Hm_lpvt_64ecd82404c51e03dc91cb9e8c025574=1580458539; __yjsv5_shitong=1.0_7_ed303110bee0e644d4985049ba8a5cd1f28d_300_1580458537306_120.10.109.208_66a3b40c; yjs_js_security_passport=630340c0505f771135167fa6df3e5215699dcf0b_1580458538_js; to_lang_often=%5B%7B%22value%22%3A%22zh%22%2C%22text%22%3A%22%u4E2D%u6587%22%7D%2C%7B%22value%22%3A%22en%22%2C%22text%22%3A%22%u82F1%u8BED%22%7D%5D; from_lang_often=%5B%7B%22value%22%3A%22vie%22%2C%22text%22%3A%22%u8D8A%u5357%u8BED%22%7D%2C%7B%22value%22%3A%22en%22%2C%22text%22%3A%22%u82F1%u8BED%22%7D%2C%7B%22value%22%3A%22zh%22%2C%22text%22%3A%22%u4E2D%u6587%22%7D%5D'
#         }

#         self.data = None
#         self.text = "晓"
#         self.from_lan = "zh"
#         self.to_lan = "en"

#     def get_sign_ctx(self):
#         ctx = execjs.compile(
#             r"""

#              function n(r, o) {
#                 for (var t = 0; t < o.length - 2; t += 3) {
#                     var a = o.charAt(t + 2);
#                     a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a),
#                     a = "+" === o.charAt(t + 1) ? r >>> a : r << a,
#                     r = "+" === o.charAt(t) ? r + a & 4294967295 : r ^ a
#                     }
#                 return r
#                  }

#             function e(r) {
#         var o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
#         if (null === o) {
#             var t = r.length;
#             t > 30 && (r = "" + r.substr(0, 10) + r.substr(Math.floor(t / 2) - 5, 10) + r.substr(-10, 10))
#         } else {
#             for (var e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), C = 0, h = e.length, f = []; h > C; C++)
#                 "" !== e[C] && f.push.apply(f, a(e[C].split(""))),
#                 C !== h - 1 && f.push(o[C]);
#             var g = f.length;
#             g > 30 && (r = f.slice(0, 10).join("") + f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join("") + f.slice(-10).join(""))
#         }
#         var u = void 0
#           , l = "" + String.fromCharCode(103) + String.fromCharCode(116) + String.fromCharCode(107);
#         u =' """+str(self.get_gtk())+r""" ';
#         for (var d = u.split("."), m = Number(d[0]) || 0, s = Number(d[1]) || 0, S = [], c = 0, v = 0; v < r.length; v++) {
#             var A = r.charCodeAt(v);
#             128 > A ? S[c++] = A : (2048 > A ? S[c++] = A >> 6 | 192 : (55296 === (64512 & A) && v + 1 < r.length && 56320 === (64512 & r.charCodeAt(v + 1)) ? (A = 65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v)),
#             S[c++] = A >> 18 | 240,
#             S[c++] = A >> 12 & 63 | 128) : S[c++] = A >> 12 | 224,
#             S[c++] = A >> 6 & 63 | 128),
#             S[c++] = 63 & A | 128)
#         }
#         for (var p = m, F = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(97) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(54)), D = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(51) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(98)) + ("" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(102)), b = 0; b < S.length; b++)
#             p += S[b],
#             p = n(p, F);
#         return p = n(p, D),
#         p ^= s,
#         0 > p && (p = (2147483647 & p) + 2147483648),
#         p %= 1e6,
#         p.toString() + "." + (p ^ m)
#     }
#             """
#         )
#         return ctx

#     def get_sign(self):
#         ctx = self.get_sign_ctx()
#         sign = ctx.call("e", self.text)
#         return sign

#     def get_token(self):
#         s = requests.session()
#         url = 'https://fanyi.baidu.com/'
#         html = requests.get(url, headers=self.header)
#         html = html.text
#         raw_tk_str = str(re.search('token:.*,', html))
#         token = raw_tk_str.split('\'')[1]
#         return token

#     def is_Chinese(self):
#         if "\u4e00" <= self.text <= "\u9fa5":
#             self.from_lan = "zh"
#             self.to_lan = "en"
#         else:
#             self.from_lan = "en"
#             self.to_lan = "zh"

#     def get_cookie(self):
#         cookie = http.cookiejar.CookieJar()
#         handler = urllib.request.HTTPCookieProcessor(cookie)
#         opener = urllib.request.build_opener(handler)
#         response = opener.open(
#             'https://fanyi.baidu.com/?aldtype=16047#zh/en/aa%E9%80%9F%E5%BA%A6')
#         for item in cookie:
#             print('%s = %s' % (item.name, item.value))

#     def get_gtk(self):
#         url = 'https://fanyi.baidu.com/'
#         html = requests.get(url)
#         html = html.text
#         raw_gtk_str = str(re.search('window.gtk = .*;', html))
#         gtk = raw_gtk_str.split('\'')[1]
#         return gtk

#     def get_data(self):
#         data = {}
#         data['from'] = self.from_lan
#         data['to'] = self.to_lan
#         data['query'] = self.text
#         data['simple_means_flag'] = 3
#         data['transtype'] = 'realtime'
#         data['sign'] = self.get_sign()
#         data['token'] = self.get_token()
#         return data

#     def translate(self, text):
#         if text:
#             self.text = text
#         self.is_Chinese()
#         self.data = self.get_data()
#         s = requests.session()
#         response = requests.post(self.url, headers=self.header, data=self.data)
#         return response.json()['trans_result']['data'][0]['dst']

# 百度翻译API版

class Baidu(object):
    def __init__(self):
        self.appid = '你的appid'
        self.appkey = '你的appkey'
        self.salt = random.randint(32768, 65536)
        self.text = "晓"
        self.from_lan = "zh"
        self.to_lan = "en"
        self.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'}
        self.url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'

    def make_md5(self, s, encoding='utf-8'):
        return md5(s.encode(encoding)).hexdigest()

    def is_Chinese(self):
        if "\u4e00" <= self.text <= "\u9fa5":
            self.from_lan = "zh"
            self.to_lan = "en"
        else:
            self.from_lan = "en"
            self.to_lan = "zh"

    def translate(self, text):
        if text:
            self.text = text
        self.is_Chinese()
        self.payload = {'appid': self.appid, 'q': self.text, 'from': self.from_lan,
                        'to': self.to_lan, 'salt': self.salt, 'sign': self.make_md5(self.appid + self.text + str(self.salt) + self.appkey)
                        }
        response = json.loads(requests.post(
            self.url, params=self.payload, headers=self.headers).text)
        result = ""
        for each_line in response["trans_result"]:
            if self.to_lan == "zh":
                result += each_line["dst"]
            else:
                result += each_line["dst"]+" "
        return result


# 谷歌翻译爬虫
urllib3.disable_warnings()


class Google(object):

    def __init__(self):
        self.text = "晓"
        self.from_lan = "zh-cn"
        self.to_lan = "en"

    def is_Chinese(self):
        if "\u4e00" <= self.text <= "\u9fa5":
            self.from_lan = "zh-cn"
            self.to_lan = "en"
        else:
            self.from_lan = "en"
            self.to_lan = "zh-cn"

    def translate(self, text):
        if text:
            self.text = text
        else:
            self.text = "晓"
        self.is_Chinese()
        google_translator = google_translator_lib()
        result = google_translator.translate(
            self.text, self.to_lan)
        return result


# 有道翻译爬虫（纪念版）
class Youdao(object):
    def __init__(self):
        self.url = r'http://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule'
        self.text = "晓"
        self.headers = {
            "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36 Edg/78.0.276.20"
        }

    def translate(self, text):
        if text:
            self.text = text
        self.form_data = {
            'i': self.text,
            'from': 'AUTO',
            'to': 'AUTO',
            'smartresult': 'dict',
            'client': 'fanyideskweb',
            'salt': '15807895564842',
            'sign': 'f2d561d53bb76619e26218ba7e91d7b3',
            'ts': '1580789556484',
            'bv': '75a84f6fbcebd913f0a4e81b6ee54608',
            'doctype': 'json',
            'version': 2.1,
            'keyfrom': 'fanyi.web',
            'action': 'FY_BY_REALTlME'
        }
        result_dict = json.loads(requests.post(
            self.url, data=self.form_data, headers=self.headers).text)
        result = result_dict['translateResult'][0][0]['tgt']
        return result

# 有道翻译爬虫

# class Youdao(object):

#     def __init__(self):
#         self.text = "晓"
#         self.from_lan = "zh"
#         self.to_lan = "en"

#     def is_Chinese(self):
#         if "\u4e00" <= self.text <= "\u9fa5":
#             self.from_lan = "zh"
#             self.to_lan = "en"
#         else:
#             self.from_lan = "en"
#             self.to_lan = "zh"

#     def translate(self, text):
#         if text:
#             self.text = text
#         self.is_Chinese()
#         result = translators.youdao(
#             self.text, self.from_lan, self.to_lan)
#         return result


# 腾讯翻译
class Tencent(object):
    def __init__(self):
        self.url = "https://api.muxiaoguo.cn/api/Tn_tencent?text="
        self.keyword = "晓"

    def translate(self, keyword):
        if keyword:
            self.keyword = keyword
        result = json.loads(requests.get(self.url+keyword).text)
        return result["data"]["Translation"]


# deepl翻译

class Deepl(object):

    def __init__(self):
        self.text = "晓"
        self.from_lan = "zh"
        self.to_lan = "en"

    def is_Chinese(self):
        if "\u4e00" <= self.text <= "\u9fa5":
            self.from_lan = "zh"
            self.to_lan = "en"
        else:
            self.from_lan = "en"
            self.to_lan = "zh"

    def translate(self, text):
        if text:
            self.text = text
        self.is_Chinese()
        result = translators.deepl(
            self.text, self.from_lan, self.to_lan)
        return result

# 微软翻译爬虫（纪念版）


class Microsoft(object):
    def __init__(self):
        self.url = r'https://cn.bing.com/ttranslatev3?isVertical=1&&IG=7D82746CDCCF495582F3D3E3E70872FC&IID=translator.5024.7'
        self.text = "晓"
        self.from_lan = "zh-Hans"
        self.to_lan = "en"
        self.headers = {
            "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36 Edg/78.0.276.20",
            "cookie": "cookie: MUID=2AE68155F2356E89153F9167F31B6F07; MUIDB=2AE68155F2356E89153F9167F31B6F07; _EDGE_V=1; SRCHD=AF=NOFORM; SRCHUID=V=2&GUID=2FF11FEB1DC9453BBB3A1367686EBBF3&dmnchg=1; BFBUSR=BAWAS=1&BAWFS=1; _bw=1; _UR=MC=1&TC=C1; ULC=P=CF81|3:2&H=CF81|3:2&T=CF81|3:2; ANON=A=E5201619162767FE692D5CC7FFFFFFFF&E=198c&W=1; NAP=V=1.9&E=1932&C=UgbLxRn-e7GGicokslB_FKstz2J-NJOkg3AeG82xHto6pYy03RwHxw&W=1; PPLState=1; KievRPSSecAuth=FABaBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACGUwSJGquaPUGAS7Z4E4SSlR+4/cARjmWF5FcRSRTXWTkTEA50w4XMGL9xRc1LNuC6jEMhBh+QqYAqgj9UF7yGgeewYb1vzM8TRxlC86c5V7NNA4NACmN98CSJaQtW1YpBxP8tcmBTqwFwFjd4GwOuq05MTHeeiR7kJLhO0UBXr6RXSohYNnRQ2hm3nH3BiFiGtaXhfUsS95B3UHITtZ6PP0Q9wv8BjLvDM62s57EqCYrhl7vQ563cIkN+Gk82b2IUmmhPsYVCS5Yqyrl6E8gdNWrydsngzeRT3AWmeLsRMy6IO5PbiH4zn4qyE6YgF3ieahu95cMC2sy8b67AaMwGPwNEV1sPOKPi7yW+fhhiJLHMA44fUhqySrCK4RZ+4sIq+B7hOB/n8Q4AEq9MlbPonXC1LZaeLVatVj+N3XDOsYcA9iCGXzX7guU4ZXbauQhJ/VhMyl8weDBVo2KY07kOmt0+GMKaShbhGCzy7wy6MPojPZy/DBj4nGY6XFPjct7lf6q37fHbBQTkuA1vq1OC//Cs3ztvjjyzglXOoVBBiyLbsuunOmeQAvXx42hpAwjxQHXorKgKpLPYhCluYeYRuO4gsK3o0aozWq6irDBPdEZDaQ2yhH9SyNVG3AjgKwzsG/7B4zGW0vfPmexcJaHHPA04gVB4RWp/+cnpL4hv0vstYQ2ceK+eo8eWi55I5RGRq2nOmxNMIeYbX3bQlSmkvhUqrQP8faBk7C5COWk6GrQXebLC8986bbAuFF6WcJKZ2egzNPP4RG4MpGWU1UXnIBWTC+rmIN/AWq//f4OiYW8zibUCmJpHSY9UsDJT/4YmhTUu/aScca85RXnrDtVG8c7w0lvfI0qbur9eguf4lWfWzEJIJ/2GLWuaDHkWMmYLm7ZR7i5nVUXCyYpQZsS5WDbztJjz2MogqWkp+sJbFc/IdpICpw5Jt5jMoLYWUv5wu+WHeLCZ+bnrLjUKJox6SqyQaV2RUDKGs0Fu/2EPCg7bBe4yjVqouJ9McUEbYc0MXWYBgPcjTodV+zVC8ebbZ85cSrQfDDWhbwilPnyuepHSTgw6OT6EaJAQjeorBwr1CpKn6D76y3XN43ODNfZ3x/9NyrnpJWx3qHGM7M2ULCz/J6YVdL7OjS/sqJE7IHAAyDCqbVnME2XokU1mp+MFKdjF72Mkq0fH90a00JmLs7lFt3HN8srBN8egkLJ6pwJQvfPczJXvRp4lwO96Rb5xaVatGjvjvpK93h/6D+MJXfS2/pQtiPvhb7seIZHzeJ7F991xHEaOcLeuSGblPg9uagqkGzbPg35NLIpH5ZsyO8xmWw7NRg45tCq4Vx9/q7u6KEAUCY99xa+56ifbW3CrMJD9VeRnt9L2QZ9UX3gl5Utjw9GCi/WpjMN60aaLD5gOJDFAAXw7EMAeG+53Anu1aEK0mIhnqGrg==; WLID=RVan0dV1/CqcYWuwaatWflk90HfFEk1B2YA7ZFbt7bARrUbyD5aICzTl3kBJ4SymSBWRQOZPk6QE3DHWTpj4x0dKpq5LTsKIJRR5yClBFPI=; imgv=flts=20210515&lodlg=1; SRCHUSR=DOB=20210509&T=1622712211000; BFB=AhC6K77srP6F-gE6ZhHfMKBAJV28fQphWyo5Dq4LFjHgCWHJcbjKLRAREluyeZ1xKEiEnvg8ecWpwxiDmajNKFWqDBEVNdCPJuJvwBL9MoQu6hxJKxiGVEdQc4lyYMy2_AhZP1aq9AXmhx9QYYIcR_z24l35dZ5WTxIpkqgWJLPfAg; OID=AhB0HV6RSwvwvUWwntPTIC0Ry5oJr6r3vcQzwWITwrYXGXefxeutDFVeYB-_GNjno7vBDCRWq6PNELkEJ1DjUCCo; OIDI=AhCYckOOrgrRwJzIRsptgiKq3RR1H5mfohy5FwL30manHw; _TTSS_IN=hist=WyJkZSIsInpoLUhhbnMiLCJlbiIsImF1dG8tZGV0ZWN0Il0=; btstkn=%252FKLCFh8JwJ%252BJxF6D5FxlJ2rKqEBkLIIfNiV0IonhnSNF0dyEdNyTFeioWiAwou9WD0VxcwJqN%252BXeToHKSrJBLI1FUAHegdfiysSQsKkMgzc%253D; ABDEF=V=13&ABDV=13&MRNB=0&MRB=1622982399491; WLS=C=fb1401f04444ca60&N=%e5%ad%a6%e9%95%bf; _SS=SID=314CADB5195668FE14DFBDFA18786905; _U=1eukHgFjA8T7xTWevy8geXisBkXV9tkZB15RgCrHt0iz6BiG0ijfKFq4daaej_hdVJhQQ9kPw34qqvY5N_MulBmak5fatsw8374xYfW0pmkG1-_oVeXSHIKtPy385R9T4mp-zeM9zrAG3RgKc93ECxjrf0yM9UGPudsOv7CTURIkWBWkmikLPMPWOh0rUR8s4s6dhIinZONXVWvk7X-7AvQ; _EDGE_S=ui=zh-cn&SID=314CADB5195668FE14DFBDFA18786905; SNRHOP=I=&TS=; _tarLang=default=en; _TTSS_OUT=hist=WyJ6aC1IYW5zIiwiZW4iXQ==; SRCHHPGUSR=SRCHLANGV2=zh-Hans&BZA=0&BRW=XW&BRH=M&CW=1536&CH=792&DPR=1.25&UTC=480&DM=0&EXLTT=31&HV=1623035903&EXLKNT=0&PR=1.25&OR=0; ipv6=hit=1623039501880&t=4"
        }

    def is_Chinese(self):
        if "\u4e00" <= self.text <= "\u9fa5":
            self.from_lan = "zh-Hans"
            self.to_lan = "en"
        else:
            self.from_lan = "en"
            self.to_lan = "zh-Hans"

    def translate(self, text):
        if text:
            self.text = text
        else:
            self.text = "晓"
        self.is_Chinese()
        self.form_data = {
            "fromLang": self.from_lan,
            "text": self.text,
            "to": self.to_lan,
            "token": "hBhlqGWrTPWyNFfx4kXltSPuUL4IIZV2",
            "key": "1623035898951"
        }
        result_dict = json.loads(requests.post(
            self.url, data=self.form_data, headers=self.headers).text)
        print(result_dict)
        result = result_dict[0]['translations'][0]["text"]
        return result


# 微软翻译
# class Microsoft(object):

#     def __init__(self):
#         self.text = "晓"
#         self.from_lan = "zh"
#         self.to_lan = "en"

#     def is_Chinese(self):
#         if "\u4e00" <= self.text <= "\u9fa5":
#             self.from_lan = "zh"
#             self.to_lan = "en"
#         else:
#             self.from_lan = "en"
#             self.to_lan = "zh"

#     def translate(self, text):
#         if text:
#             self.text = text
#         self.is_Chinese()
#         result = translators.bing(
#             self.text, self.from_lan, self.to_lan)
#         return result


# 阿里翻译
class Alibaba():

    def __init__(self):
        self.text = "晓"
        self.from_lan = "zh"
        self.to_lan = "en"

    def is_Chinese(self):
        if "\u4e00" <= self.text <= "\u9fa5":
            self.from_lan = "zh"
            self.to_lan = "en"
        else:
            self.from_lan = "en"
            self.to_lan = "zh"

    def translate(self, text):
        if text:
            self.text = text
        self.is_Chinese()
        result = translators.alibaba(
            self.text, self.from_lan, self.to_lan)
        return result

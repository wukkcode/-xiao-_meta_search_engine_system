"""
This is a strong search spider engine settings including result regulars, IP proxies and Google mirrors.
So, we can make our search spider and regulars separate.
It is very Cool.

"""
search_engine_dict = {"Bing": {"url": "https://cn.bing.com/search?q={}&first={}", "headers": {"User-Agent":
                                                                                              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36 Edg/90.0.818.39"}, "result_num_regular": '//div[@id="b_tween"]/span/text()', "all_results_regular": '//ol[@id="b_results"]/li[@class="b_algo"]', "result_title_regular": '//h2', "result_description_regular": '//div[contains(@class, "b_caption")or contains(@class, "b_caption hasdl")]/p|//div[contains(@class, "b_imagePair square_mp")]/p|//ul[@class="b_vList b_divsec"]/li/div'},
                      "Baidu": {"url": "https://www.baidu.com/s?wd={}&pn={}", "headers": {
                          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                          "Accept-Encoding": "gzip, deflate, br",
                          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                          "Cache-Control": "max-age=0",
                          "Connection": "keep-alive",
                          "Cookie": "BIDUPSID=09B674BE40FA15F36A7FFC7300FA8F40; PSTM=1614006882; BD_UPN=12314753; BAIDUID=317D376524A157F120E4CCF843EEC803:FG=1; ispeed_lsm=0; BDUSS=Us1RTlPRm5NZjBOWEFWV0dUYUVCY3J2bVREeElvem12bE1KeERZT2dUWTJ2NmxnRVFBQUFBJCQAAAAAAAAAAAEAAAB633vHzdvfx9~HMTIzMzQ0MzUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADYygmA2MoJgQ; BDUSS_BFESS=Us1RTlPRm5NZjBOWEFWV0dUYUVCY3J2bVREeElvem12bE1KeERZT2dUWTJ2NmxnRVFBQUFBJCQAAAAAAAAAAAEAAAB633vHzdvfx9~HMTIzMzQ0MzUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADYygmA2MoJgQ; __yjs_duid=1_4677cb34739ad3af2d6728c63252933a1619322851417; ab_sr=1.0.0_NGM0NjllZDRiNjJlNjM5MDY4MGJkZjQwOWY4YmQ4NWVmYjViNmZiOTA3ZTY2NmJmYjlkMzg1MGZhMTY3YWM2NmEzYjM3ZTQ5ZmQ1ODQ2ZDk3Zjk4NDA4MmNhYzI5ODE4MGM4YjNjZDcwNWQwMDVjYTM4YTlhNDg4YWU2ODk5YmM=; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; H_PS_PSSID=33799_33822_31254_33849_33855_33607; sug=3; sugstore=1; ORIGIN=0; bdime=0; H_PS_645EC=3bc0XkIRUnk5eC5zLAcgDiSjkE9s9jURagCTBPQOcQsNBZaSNZq8lun7du8",
                          "Host": "www.baidu.com",
                          "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="90", "Microsoft Edge";v="90"',
                          "sec-ch-ua-mobile": "?0",
                          "Sec-Fetch-Dest": "document",
                          "Sec-Fetch-Mode": "navigate",
                          "Sec-Fetch-Site": "none",
                          "Sec-Fetch-User": "?1",
                          "Upgrade-Insecure-Requests": "1",
                          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 Edg/90.0.818.49"
                      }, "result_num_regular": '//span[@class="nums_text"]/text()', "all_results_regular": '//div[@id<1000]', "result_title_regular": '//h3[contains(@class, "c-title")or contains(@class, "t")]', "result_description_regular": '//div[contains(@class, "c-row c-gap-top-small")]/div[@class="c-span9 c-span-last op-bk-polysemy-piccontent"]|//div[contains(@class, "op_exactqa_word_word_info c-span20 c-span-last")]|//span[@class="op-img-address-link-menu op-img-address-tagCon0"]|//div[contains(@class,"c-abstract")]|//div[@class="c-span10 c-span-last op-tieba-general-col-top-xs"]|//div[@class="head-right_2OyG6 c-gap-left-large"]|//div[@class="op_sp_realtime_bigpic5_wrapper_new"]/div[@class="c-row c-color-text"]|//div[@class="c-span-last c-span9"]|//div[@class="c-span9 c-span-last op-bk-polysemy-piccontent circle-noise"]|//div[@class="blog-summary-break-all__3Lxe3"]|//div[@class="c-tabs-item"]|//div[@class="c-span18 c-span-last"]'},

                      "Google": {"url": "{}search?q={}&start={}", "headers": {
                          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36 Edg/90.0.818.39"},
    "result_num_regular": '//div[@id="result-stats"]/text()', "all_results_regular": '//div[@class="g"]', "result_title_regular": '//div[@class="g"]//div[@class="yuRUbf"]/a', "result_description_regular": '//div[@class="g"]//div[contains(@class,"IsZvec")]/span[@class="aCOpRe"]'},
    "360": {"url": "https://www.so.com/s?q={}&pn={}", "headers": {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip,deflate,br",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": "QiHooGUID=1F70C677421988EDE8F6004394759429.1620726370328; __guid=15484592.3503426491973282000.1620726372286.1104; webp=1; so_huid=11PK%2BnYU9H5bwJIjZOkvDHp%2FX3Ogsnas%2FaZCVYjTJXW04%3D; __huid=11PK%2BnYU9H5bwJIjZOkvDHp%2FX3Ogsnas%2FaZCVYjTJXW04%3D; dpr=1.25; WSADFK=4e855d5d41907ea67bee22b5d54eded0.1620781311.1548; 3c576e1a2ff046f832b1cc8db8011ec3=1620781311; _uc_silent=1; _S=5bbesb9q2jnaqpev4ou3sjo735; gtHuid=1; showFollowTipCount=1; count=63; erules=p4-4%7Cp2-3%7Cp3-1%7Ckd-1%7Cp1-1",
        "Host": "www.so.com",
        "Pragma": "no-cache",
        "Referer": "https://www.so.com/?src=so.com",
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="90", "Microsoft Edge";v="90"',
        "sec-ch-ua-mobile": "?0",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.56"
    }, "result_num_regular": '//span[@class="nums"]/text()', "all_results_regular": '//ul[@class="result"]/li[@class="res-list"]', "result_title_regular": '//h3[contains(@class, "c-title")or contains(@class, "t")]|//div[@class="c-font-medium c-color-t"]', "result_description_regular": '//div[@class="res-comm-con"]|//div[@class="mh-content-desc"]|//div[@class="mh-float-left"]|//div[@class="summary"]|//p[@class="res-desc"]|//div[@class="mh-wrap"]|//p[@class="mh-more"]|//div[@class="mh-translation"]'},
    "Sogou": {"url": "https://www.sogou.com/web?query={}&page={}", "headers": {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', 'Accept-Encoding': 'gzip, deflate, br', 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Cookie':
                                                                               'ABTEST=3|1620715120|v17; SUID=57C17F7C8930A40A00000000609A2670; SUV=1620715121833384; browerV=3; osV=1; ssuid=1557456913; SMYUV=1620730191622704; ad=wS04lZllll2kuuKXlllllpjb3j1lllllTsuRGZllllUlllllRa8Of@@@@@@@@@@@; IPLOC=CN1100; SNUID=C0166C4B969054B86EA62D3596160AE3; sst0=530; ld=clllllllll2kuABMlllllpjtEc6lllllK4@xqZllllklllllRylll5@@@@@@@@@@; LSTMV=616%2C552; LCLKINT=10542', 'Host': 'www.sogou.com', 'Pragma': 'no-cache', 'Referer': 'https://www.sogou.com/', 'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Microsoft Edge";v="90"', 'sec-ch-ua-mobile': '?0', 'Sec-Fetch-Dest': 'document', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Site': 'same-origin', 'Sec-Fetch-User': '?1', 'Upgrade-Insecure-Requests': '1', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.56'}, "result_num_regular": '//p[@class="num-tips"]/text()', "all_results_regular": '//div[@class="results"]/div[@class="vrwrap"]', "result_title_regular": '//h3|//div[@class="vrTitle"]', "result_description_regular": '//div[@class="fz-special"]|//div[@class="table-container border-bottom js_music_list"]|//div[@class="text-layout"]|//div[@class="hint-mid"]|//div[@class="text-layout"]|//div[@class="str_info_div"]|//div[@class="more-link clamp01"]|//div[@class="fz-mid space-txt"]|//div[@class="fz-mid space-txt"]|//div[@class="slide-down"]|//p[@class="star-wiki "]'}
}

# proxies = [{"http": "http://127.0.0.1:1080/",
#             "https": "http://127.0.0.1:1080/"}]

proxies = [{"http": "",
            "https": ""}]

google_mirrors = ["http://so.baqkft.top/",
                  "https://v.icmy.cc/", "https://txt.guoqiangti.ga/", "https://www.google-fix.com/", "https://g3.luciaz.me/"]

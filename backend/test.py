import requests
from bs4 import BeautifulSoup
from urllib.request import urlopen

def downloadVideo(link, id):
    cookies = {
        '_ga': 'GA1.1.794411293.1749696088',
        '__gads': 'ID=bdd91e43bf5f715e:T=1749696087:RT=1749696087:S=ALNI_MbA1ZBbK9U5S8Nw6ZqU6403-4-4nQ',
        '__gpi': 'UID=00001026db108bfc:T=1749696087:RT=1749696087:S=ALNI_MYHuqydyvLgrv1taZYv1eTEAu8Lmw',
        '__eoi': 'ID=3f922b8f184b5da7:T=1749696087:RT=1749696087:S=AA-AfjYsBpmw7ExDiwpg4WOq4WFV',
        'FCCDCF': '%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B13%2C%22%5B%5C%22DBABL~BVQqAAAAAg%5C%22%2C%5B%5B7%2C%5B1749696135%2C220373000%5D%5D%5D%5D%22%5D%5D%5D',
        'FCNEC': '%5B%5B%22AKsRol-uba78aRnZi32pCBxOOmho_whoDYO6G89LZlqstaFh4A9VD2nrNKu8drHl6CsoQU5F8kbIs1jXqadCgBEb2sNHp6Yd8gqKKTndUNXXsQwfCaAYgCOqsoPWV479flLeRDA5xFdnIMG5AswFPtNnPZBDtScaFA%3D%3D%22%5D%5D',
        '_ga_ZSF3D6YSLC': 'GS2.1.s1749696087$o1$g1$t1749696140$j7$l0$h0',
    }

    headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'hx-current-url': 'https://ssstik.io/',
        'hx-request': 'true',
        'hx-target': 'target',
        'hx-trigger': '_gcaptcha_pt',
        'origin': 'https://ssstik.io',
        'priority': 'u=1, i',
        'referer': 'https://ssstik.io/',
        'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        # 'cookie': '_ga=GA1.1.794411293.1749696088; __gads=ID=bdd91e43bf5f715e:T=1749696087:RT=1749696087:S=ALNI_MbA1ZBbK9U5S8Nw6ZqU6403-4-4nQ; __gpi=UID=00001026db108bfc:T=1749696087:RT=1749696087:S=ALNI_MYHuqydyvLgrv1taZYv1eTEAu8Lmw; __eoi=ID=3f922b8f184b5da7:T=1749696087:RT=1749696087:S=AA-AfjYsBpmw7ExDiwpg4WOq4WFV; FCCDCF=%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B13%2C%22%5B%5C%22DBABL~BVQqAAAAAg%5C%22%2C%5B%5B7%2C%5B1749696135%2C220373000%5D%5D%5D%5D%22%5D%5D%5D; FCNEC=%5B%5B%22AKsRol-uba78aRnZi32pCBxOOmho_whoDYO6G89LZlqstaFh4A9VD2nrNKu8drHl6CsoQU5F8kbIs1jXqadCgBEb2sNHp6Yd8gqKKTndUNXXsQwfCaAYgCOqsoPWV479flLeRDA5xFdnIMG5AswFPtNnPZBDtScaFA%3D%3D%22%5D%5D; _ga_ZSF3D6YSLC=GS2.1.s1749696087$o1$g1$t1749696140$j7$l0$h0',
    }

    params = {
        'url': 'dl',
    }

    data = {
        'id': link,
        'locale': 'en',
        'tt': 'azM1ODQ3',
    }

    response = requests.post('https://ssstik.io/abc', params=params, cookies=cookies, headers=headers, data=data)

    downloadSoup = BeautifulSoup(response.text, "html.parser")
    downloadLink = downloadSoup.a["href"]
    
    mp4File = urlopen(downloadLink)
    with open(f"videos/{id}.mp4", "wb") as output:
        while True:
            data = mp4File.read(4096)
            if data:
                output.write(data)
            else:
                break
    print(downloadLink)
    
    # mp4File = urlopen(downloadLink)
downloadVideo('https://www.tiktok.com/@yoorrzx/video/7511889428223151382?is_from_webapp=1&sender_device=pc', 1)
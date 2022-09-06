const request = require("request"); //載入request
const cheerio = require("cheerio"); //載入cheerio

const pttCrawler = () => {
  request({
    url: "https://www.ptt.cc/bbs/Gossiping/index.html",
    method: "GET",
    headers: {
      Cookie: 'over18=1' //設置 Cookie
    }
  }, (error, res, body) => {
    // 如果有錯誤訊息，或沒有 body(內容)，就 return
    if (error || !body) {
      return;
    }

    const data = []; // 設置空的陣列放入資料
    const $ = cheerio.load(body); // 載入 body
    const list = $(".r-list-container .r-ent");

    for (let i = 0; i < 10; i++) {  // 使用JQuery操作拿取所需資料
      const title = list.eq(i).find('.title a').text();
      const author = list.eq(i).find('.meta .author').text();
      const date = list.eq(i).find('.meta .date').text();
      const link = list.eq(i).find('.title a').attr('href');

      data.push({ title, author, date, link }); // 將爬到的資料放入先前設置的變數裡
    }

    console.log(data);
  });
};

pttCrawler();
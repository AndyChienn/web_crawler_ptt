const request = require("request");
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');

const pttUrl = 'https://www.ptt.cc/bbs/Beauty/index.html';
const searchPages = 2
const keyWord = '帥哥'

const pttCrawler = async () => {

  request({
    url: pttUrl,
    method: "GET"
  }, async (error, res, body) => {
    if (error || !body) {
      return;
    }

    const cookies = {
      url: pttUrl,
      name: 'over18',
      value: '1'
    };


    // const browser = await puppeteer.launch({ headless: false });  // 啟動瀏覽器，headless 設定為 false 可以看到瀏覽器運作的情況，true 為無頭瀏覽器
    const browser = await puppeteer.launch({
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: false
    });
    const page = await browser.newPage();
    await page.setCookie(cookies);
    await page.goto(pttUrl);

    const result = []; // 建立一個儲存結果的容器

    await page.type('input[class="query"]', `${keyWord}`)
    await (await page.$('input[class="query"]')).press('Enter');

    let $ = cheerio.load(body);



    for (let j = 0; j < searchPages; j++) {
      await page.waitForSelector('.r-ent'); // 確定網頁的元素出現

      const content = await page.content();  // 取得新頁面的內容

      $ = cheerio.load(content);

      const list = $(".r-list-container .r-ent");

      for (let i = 0; i < list.length; i++) {
        const title = list.eq(i).find('.title a').text();
        const author = list.eq(i).find('.meta .author').text();
        const date = list.eq(i).find('.meta .date').text();
        const link = list.eq(i).find('.title a').attr('href');

        result.push({ title, author, date, link });
      }
      await page.click('#action-bar-container > div > div.btn-group.btn-group-paging > a:nth-child(2)')


    }
    console.log(result);

    await browser.close();  // 關閉瀏覽器
  });
};

pttCrawler();
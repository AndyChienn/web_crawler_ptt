const puppeteer = require('puppeteer'); //載入puppeteer
const pttUrl = 'https://www.ptt.cc/bbs/Beauty/index.html'; // 將表特版設為目標網址
const searchPages = 2 // 設定搜尋後要拉出資料的頁數
const keyWord = '帥哥' // 設定搜尋關鍵字

const pttCrawlerSearch = async () => {
  // const browser = await puppeteer.launch({ headless: false });  // 啟動瀏覽器，headless 設定為 false 可以看到瀏覽器運作的情況，true 為無頭瀏覽器
  const browser = await puppeteer.launch({
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // 設定直接操作的微Chrone而不用使用Chromium，如不設定會直接使用Chromium但沒安裝的話會無法執行
    headless: false
  });
  const cookies = { // 設置cookies稍後載入
    url: pttUrl,
    name: 'over18',
    value: '1'
  };
  const page = await browser.newPage(); // 開啟新的網頁
  await page.setCookie(cookies); // 設置先前設立的cookie條件
  await page.goto(pttUrl); // 將開啟的網頁前往目標網頁
  const result = []; // 建立一個儲存結果的容器

  await page.type('input[class="query"]', `${keyWord}`) // 選取搜尋欄並輸入關鍵字 
  await (await page.$('input[class="query"]')).press('Enter'); // 選取搜尋欄並按下Enter進行搜尋

  for (let i = 0; i < searchPages; i++) {
    await page.waitForSelector('.r-ent') // 等待頁面的".r-ent"元素確實載入

    const Data = await page.evaluate((selectors) => { // 解析HTML並將.r-ent的資料從NodeList整理為Array

      const list = Array.from($(selectors))
      return list.map((selector) => ({
        title: $(selector).find('.title a').text(),
        author: $(selector).find('.meta .author').text(),
        date: $(selector).find('.meta .date').text(),
        link: $(selector).find('.title a').attr('href')
      }))
    }, '.r-ent')
    Data.forEach((d) => {  // 將Data推進結果的陣列
      return result.push(d)
    })
    await page.click('#action-bar-container > div > div.btn-group.btn-group-paging > a:nth-child(2)') // 按下前一頁的按鈕
  }
  console.log(result)
  await browser.close();  // 關閉瀏覽器
}

pttCrawlerSearch();
const puppeteer = require('puppeteer');
const fs = require("fs");
const url = 'https://www.ptt.cc/bbs/Beauty/M.1535461992.A.F00.html';
const request = require('request')

const pttCrawlerDownloadImgs = async () => {
  const browser = await puppeteer.launch({
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false
  });
  const cookies = {
    url: url,
    name: 'over18',
    value: '1'
  };
  const page = await browser.newPage();
  await page.setCookie(cookies);
  await page.goto(url, {
    waitUntil: 'domcontentloaded'
  });

  await page.waitForSelector('img')

  const Data = await page.evaluate((selectors) => {
    const images = Array.from(document.querySelectorAll('img'))
    return images.map(img => img.src)
  })

  fs.mkdir('./images', function (err) { // 創建存放圖片的資料夾
    if (err) {
      console.log('Directory already exists.');
    } else {
      console.log('Directory creation success.');
    }
  });

  Data.forEach(async (img) => {

    const splitName = img.split('=')
    const filename = splitName[splitName.length - 1] + '.jpg'
    console.log(filename);

    const readStream = await request(img);   //對連結要求存取
    const writeStream = await fs.createWriteStream('./images/' + filename);  //寫入電腦
    await readStream.pipe(writeStream) // 使用pipe語法將檔案下載至本地端


    readStream.on('end', function () {
      console.log(filename + '下载成功');
    });
    readStream.on('error', function () {
      console.log("錯誤訊息:" + err)
    })
    writeStream.on("finish", function () {
      console.log(filename + "寫入成功");
      writeStream.end();
    });
  })
  await browser.close();  // 關閉瀏覽器
};

pttCrawlerDownloadImgs();
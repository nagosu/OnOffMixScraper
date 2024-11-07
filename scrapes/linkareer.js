const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

async function linkareerScrape(lastPostTitles) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage(); // 새 페이지 생성

  await page.goto(
    'https://linkareer.com/list/contest?filterBy_categoryIDs=35&filterType=CATEGORY&orderBy_direction=DESC&orderBy_field=CREATED_AT&page=1'
  ); // 페이지 URL

  // 1초 대기
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 포스트 로딩 대기
  await page.waitForSelector(
    'div.list-body div.activity-list-card-item-wrapper'
  );

  // 포스트 타이틀 가져오기
  const titles = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        'div.list-body div.activity-list-card-item-wrapper div.card-content h5.activity-title'
      )
    ).map(
      (titleElement) =>
        `${titleElement.innerText.trim()}\nhttps://linkareer.com/${titleElement
          .closest('a')
          ?.getAttribute('href')}`
    );
  });

  // 새로운 포스트 타이틀 필터링
  const newPostTitles = titles.filter(
    (title) => !lastPostTitles.includes(title.split('\n')[0])
  );

  // 기존 타이틀 중 새로운 데이터에 없는 항목 삭제
  const titlesToDelete = lastPostTitles.filter(
    (title) => !titles.map((t) => t.split('\n')[0]).includes(title)
  );

  return { browser, newPostTitles, titlesToDelete };
}

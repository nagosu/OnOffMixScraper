const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

async function onOffMixScrape(lastPostTitles) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage(); // 새 페이지 생성

  await page.goto('https://onoffmix.com/event/main/?c=105'); // 페이지 URL

  // 로딩 대기
  await page.waitForSelector('fieldset.filter_category_area');

  // 주제 드롭다운 열기
  await page.click('fieldset.filter_category_area');

  // 과학/IT/AI 분야 선택
  await page.evaluate(() => {
    document
      .querySelector('fieldset.filter_category_area li:nth-of-type(3) input')
      .click();
  });

  // 적용 버튼 클릭
  await page.evaluate(() => {
    document
      .querySelector('fieldset.filter_category_area div.button_area button')
      .click();
  });

  // 최신순 정렬
  await page.click('a.latest');

  // 1초 대기
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 포스트 로딩 대기
  await page.waitForSelector('ul.event_lists.thumbnail_mode li');

  // 포스트 타이틀 가져오기, ::before 요소가 없는 타이틀만 가져옴
  const titles = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('ul.event_lists.thumbnail_mode li h5.title')
    )
      .filter((titleElement) => {
        // ::before 스타일이 있는지 확인
        const beforeContent = window.getComputedStyle(
          titleElement,
          '::before'
        ).content;
        return (
          !beforeContent || beforeContent === 'none' || beforeContent === '""'
        );
      })
      .map(
        (titleElement) =>
          `${titleElement.innerText.trim()}\nhttps://onoffmix.com/${titleElement
            .closest('a')
            ?.getAttribute('href')}\n`
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

module.exports = onOffMixScrape;

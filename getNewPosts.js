const Post = require('./models/Post');

const isLocal = process.env.IS_LOCAL; // 환경 변수로 로컬 여부를 설정
let puppeteer;
let chromium;

if (isLocal) {
  puppeteer = require('puppeteer'); // 로컬에서 일반 puppeteer 사용
} else {
  puppeteer = require('puppeteer-core');
  chromium = require('chrome-aws-lambda'); // 서버리스 환경용 chrome-aws-lambda 사용
}

let lastPostTitles = []; // 마지막으로 확인한 포스트의 제목

let newPostTitles = []; // 새로운 포스트의 제목

// DB에서 latest 컬렉션의 모든 타이틀을 배열로 가져오는 함수
async function loadLastPostTitles() {
  const posts = await Post.find({}, 'title'); // 모든 포스트의 title 필드를 가져옴
  lastPostTitles = posts.map((post) => post.title); // title 필드만 추출
}

async function getNewPosts() {
  // DB에서 마지막 포스트들을 불러옴
  await loadLastPostTitles();

  let browser;

  if (isLocal) {
    browser = await puppeteer.launch({ headless: false });
  } else {
    browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless,
    });
  }

  const page = await browser.newPage(); // 새 페이지 생성

  await page.goto('https://onoffmix.com/event/main/?c=105'); // 페이지 URL

  // 로딩 대기
  await page.waitForSelector('fieldset.filter_category_area');

  // 주제 드롭다운 열기
  await page.click('fieldset.filter_category_area');

  // 3초 대기
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 과학/IT/AI 분야 선택
  await page.evaluate(() => {
    document
      .querySelector('fieldset.filter_category_area li:nth-of-type(3) input')
      .click();
  });
  // 3초 대기
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 적용 버튼 클릭
  await page.evaluate(() => {
    document
      .querySelector('fieldset.filter_category_area div.button_area button')
      .click();
  });

  // 3초 대기
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 최신순 정렬
  await page.click('a.latest');

  // 3초 대기
  await new Promise((resolve) => setTimeout(resolve, 3000));

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
            ?.getAttribute('href')}\n\n`
      );
  });

  // 새로운 포스트 타이틀 필터링
  newPostTitles = titles.filter((title) => !lastPostTitles.includes(title));

  await browser.close();

  // 새로운 타이틀만 DB에 저장
  if (newPostTitles.length > 0) {
    for (const title of newPostTitles) {
      await Post.create({ title });
    }
    console.log('DB에 새로 저장된 포스트 타이틀:', newPostTitles);

    return newPostTitles; // 새로 올라온 포스트가 있으면 제목을 반환
  } else {
    console.log('새로운 포스트가 없습니다.');
  }
}

module.exports = getNewPosts;

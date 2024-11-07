const OnOffMixPost = require('../../models/OnOffMixPost');

const onOffMixScrape = require('../../scrapes/onOffMix');

let lastPostTitles = []; // 마지막으로 확인한 포스트의 제목

// DB에서 onoffmix 컬렉션의 모든 타이틀을 배열로 가져오는 함수
async function loadLastPostTitles() {
  const posts = await OnOffMixPost.find({}, 'title'); // 모든 포스트의 title 필드를 가져옴
  lastPostTitles = posts.map((post) => post.title); // title 필드만 추출
}

async function getOnOffMixPosts() {
  // DB에서 마지막 포스트들을 불러옴
  await loadLastPostTitles();

  console.log('lastPostTitles:', lastPostTitles);

  const { browser, newPostTitles, titlesToDelete } = await onOffMixScrape(
    lastPostTitles
  ); // OnOffMix 스크래핑 후 새로운 포스트와 삭제할 포스트의 제목을 가져옴

  // 삭제할 포스트가 있으면 DB에서 삭제
  if (titlesToDelete.length > 0) {
    await OnOffMixPost.deleteMany({ title: { $in: titlesToDelete } });
    console.log('삭제된 포스트 타이틀:', titlesToDelete);
  }

  await browser.close(); // 브라우저 닫기

  // 새로운 포스트만 DB에 저장
  if (newPostTitles.length > 0) {
    for (const title of newPostTitles) {
      const joinedTitle = title.split('\n')[0];
      const joinedLink = title.split('\n')[1];
      const newPost = new OnOffMixPost({
        title: joinedTitle,
        link: joinedLink,
      });
      await newPost.save();
    }
    console.log('DB에 새로 저장된 포스트 타이틀:', newPostTitles);

    return newPostTitles.join('\n'); // 새로 올라온 포스트가 있으면 제목을 반환
  } else {
    return '새로운 포스트가 없습니다.'; // 새로운 포스트가 없으면 메시지를 반환
  }
}

module.exports = getOnOffMixPosts;

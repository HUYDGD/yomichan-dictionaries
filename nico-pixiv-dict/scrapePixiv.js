const fs = require('fs').promises;

const { getURL, getJSON, wait } = require('../util/scrape');
const saveDict = require('../util/saveDict');
const writeJson = require('../util/writeJson');

const folderPath = './nico-pixiv-dict/';
const saveSummariesJsonPath = folderPath + 'pixivSummaries.json';
const saveArticlesJsonPath = folderPath + 'pixivArticles.json';

const WAIT_MS = 000;

const domain = 'https://dic.pixiv.net/';
const categryPath = 'category/';
const articlePath = 'a/';
const pageJsonPath = (page) => `?json=1&page=${page}`;

const COUNT_PER_PAGE = 12;

let articlesListSummaries = {};
let articleData = {};
(async function () {
  // const testJson = await getJSON(
  //   'https://dic.pixiv.net/category/アニメ?json=1&page=9068'
  // );
  const categoryURLs = await getListOfCategoryURLs();
  const articlesList = await getListOfArticles(categoryURLs);
  const articlesSummaries = await getArticlesSummaries(articlesList);
})();

/**
 * Gets article summaries from the list of articles using the json api
 * @returns {Promise<Object>} list of article summaries
 */
async function getArticlesSummaries() {
  console.log('Getting article summaries');
  const startTime = Date.now();
  const remainingArticlesKeys = Object.keys(articlesListSummaries).filter(
    (key) => !articlesListSummaries[key]
  );
  for (let i = 0; i < remainingArticlesKeys.length; i++) {
    const listURL = remainingArticlesKeys[i];
    if (articlesListSummaries[listURL]) {
      continue;
    }
    const { articles } = await getJSON(listURL);
    articlesListSummaries[listURL] = articles;

    const remaining = remainingArticlesKeys.length - i;
    const timeElapsed = Date.now() - startTime;
    const timePerArticle = timeElapsed / (i + 1);
    const timeRemaining = remaining * timePerArticle;
    const expectedEndTime = new Date(Date.now() + timeRemaining).toLocaleString();

    console.log(
      `Got ${listURL}, ${remaining} remaining, expected ${expectedEndTime}`
    );
    await wait(WAIT_MS);
  }
  await writeJson(articlesListSummaries, saveSummariesJsonPath);
}

/**
 * Gets a list of all articles on pixiv
 * @param {string} categoryURLs - list of category urls to get articles from
 */
async function getListOfArticles(categoryURLs) {
  console.log('Getting list of articles');
  // check saved json, if not populate json with all json paths
  try {
    const categoriesFile = await fs.readFile(saveSummariesJsonPath);
    articlesListSummaries = JSON.parse(categoriesFile);
    console.log(
      `Loaded ${Object.keys(articlesListSummaries).length} categories from ${saveSummariesJsonPath}`
    );
  } catch (error) {
    console.log(`No saved ${saveSummariesJsonPath}, starting from scratch`);

    let totalCount = 0;
    for (const categoryURL of categoryURLs) {
      const { meta } = await getJSON(categoryURL + pageJsonPath(1));
      const { all_count } = meta;
      totalCount += all_count;
      const categoryPageCount = Math.ceil(all_count / COUNT_PER_PAGE);
      for (let i = 1; i <= categoryPageCount; i++) {
        articlesListSummaries[categoryURL + pageJsonPath(i)] = false;
      }
      console.log(`Added ${categoryPageCount} pages from ${categoryURL}`);
    }
    console.log(
      `Saving ${
        Object.keys(articlesListSummaries).length
      } categories to ${saveSummariesJsonPath}, total of ${totalCount} articles`
    );
    await writeJson(articlesListSummaries, saveSummariesJsonPath);
  }
}

/**
 * Gets a list of all header categories on pixiv
 * @returns {Promise<string[]>} list of article category URLs
 */
async function getListOfCategoryURLs() {
  const doc = await getURL(domain);
  const categories = doc.querySelectorAll('#categories a');
  const hrefs = [...categories].map((a) => domain + categryPath + a.title);
  return hrefs;
}

// save on ctrl c
process.on('SIGINT', async () => {
  console.log('Saving...');
  if (articlesListSummaries) {
    console.log('Saving data...');
    await writeJson(articlesListSummaries, saveSummariesJsonPath);
  }
  process.exit(0);
});

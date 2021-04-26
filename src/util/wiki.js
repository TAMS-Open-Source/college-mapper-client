// this file contains functions to interact with the wikipedia api
// primarily for the "college description" view

import wiki from 'wikijs';

// ensures you know which wiki you're drawing information from
const Wiki = wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php'});

// NOTE: The following is for jsdoc support of the following function
/**
 * A helper object to facilitate college summary api access.
 * @typedef {Object} SummaryAndUrl
 * @property {string} summary the basic summary of a college
 * @property {string} url the URL from which this data was obtained
 */

/**
 * A helper function to get wikipedia summary for a college, and a link so "more" can be read about this college.
 * @param {string} name Name of college for which a summary is desired.
 * @return {SummaryAndUrl} The summary of the college and the url from which this was obtained.
 */
export async function getSummary(name) {
  try {
    const summary = await Wiki.page(name).then(page => page.summary()).then(summary => {
      const splitSummary = summary.split('\n')[0];
      const furtherSplit = splitSummary.split(". ");
      if (furtherSplit.length > 5) {
        return `${furtherSplit.slice(0,5).join(". ")}...`;
      }
      return splitSummary;
    });
    const url = await Wiki.page(name).then(page => page.url());
    return {
      summary: summary,
      url: url
    }
  } catch(err) {
    return null;
  }
}

/**
 * Function to provide wikipedia sources of relevant images for a specific college.
 * @param {String} name Name of college for which images is desired.
 * @returns {String[]} Links to relevant images of that college from wikipedia
 */
export async function getImages(name) {
  try {
    const links = await Wiki.page(name).then(page => page.images());
    return links.filter(link => !link.includes('svg')).slice(0, 4);
  } catch(err) {
    return null;
  }
}
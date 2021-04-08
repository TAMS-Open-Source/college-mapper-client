import wiki from 'wikijs';

const Wiki = wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php'});

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

const BAD_LINKS = [
  'https://upload.wikimedia.org/wikipedia/en/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg',
  'https://upload.wikimedia.org/wikipedia/en/5/5f/Disambig_gray.svg',
  'https://upload.wikimedia.org/wikipedia/en/4/4a/Commons-logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/65/Black_sphere.svg'
]

export async function getImages(name) {
  try {
    const links = await Wiki.page(name).then(page => page.images());
    return links.filter(link => !BAD_LINKS.includes(link) && !link.includes('svg')).slice(0, 4).reverse();
  } catch(err) {
    return null;
  }
}
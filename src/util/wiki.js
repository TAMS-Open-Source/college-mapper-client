import wiki from 'wikijs';

export async function getSummary(name) {
  const summary = await wiki().page(name).then(page => page.summary()).then(summary => {
    const splitSummary = summary.split('\n')[0];
    const furtherSplit = splitSummary.split(". ");
    if (furtherSplit.length > 5) {
      return `${furtherSplit.slice(0,5).join(". ")}...`;
    }
    return splitSummary;
  });
  const url = await wiki().page(name).then(page => page.url());
  return {
    summary: summary,
    url: url
  }
}
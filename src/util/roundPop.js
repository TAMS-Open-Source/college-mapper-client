/**
 * Rounds the college population to 2 significant digits.
 * @param {number} collegePop Population of the college in question. 
 * @returns {number} The population of the college with just 2 significant digits.
 */
export default function roundPop(collegePop) {
  return parseFloat(Number(collegePop).toPrecision(2));
}
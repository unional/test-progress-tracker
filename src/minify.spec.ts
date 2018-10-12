import t from 'assert';
import { minify, unminify } from './minify';
import { noCoverage, noCoverageMinified, coverageNoPercentage, coverageNoPercentageMinified, coverageWithPercentage, coverageWithPercentageMinified, filtered, filteredMinified } from './testResultsExamples';

test('no coverage', () => {
  const minified = minify(noCoverage)
  t.deepStrictEqual(minified, noCoverageMinified)

  const unminified = unminify(minified)
  t.deepStrictEqual(unminified, noCoverage)
})

test('filtered', () => {
  const minified = minify(filtered)
  t.deepStrictEqual(minified, filteredMinified)

  const unminified = unminify(minified)
  t.deepStrictEqual(unminified, filtered)
})

test('with coverage no percentage', () => {
  const minified = minify(coverageNoPercentage)
  t.deepStrictEqual(minified, coverageNoPercentageMinified)

  const unminified = unminify(minified)
  t.deepStrictEqual(unminified, coverageNoPercentage)
})

test('with coverage with percentage', () => {
  const minified = minify(coverageWithPercentage)
  t.deepStrictEqual(minified, coverageWithPercentageMinified)

  const unminified = unminify(minified)
  t.deepStrictEqual(unminified, coverageWithPercentage)
})

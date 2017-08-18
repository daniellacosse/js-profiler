import {
  sample,
  mean,
  medianSorted,
  sampleStandardDeviation,
  sampleSkewness,
  interquartileRange,
  minSorted,
  maxSorted,
  zScore,
} from 'simple-statistics';

export default (results, sampleSize = 30) => {
  const resultSample = sample(results, sampleSize).sort();

  const average = mean(resultSample);
  const standardDeviation = sampleStandardDeviation(resultSample);
  const median = medianSorted(resultSample);
  const iqr = interquartileRange(resultSample);

  return {
    mean: average,
    standardDeviation,
    median,
    medianStandardDeviation: sampleStandardDeviation(resultSample),
    skew: sampleSkewness(resultSample),
    interquartileRange: iqr,
    min: minSorted(resultSample),
    max: maxSorted(resultSample),
    zScores: resultSample.map(num => zScore(num, average, standardDeviation)),
    samples: resultSample,
    innerFence: {
      min: median - (iqr * 1.5),
      max: median + (iqr * 1.5),
    },
    outerFence: {
      min: median - (iqr * 3),
      max: median + (iqr * 3),
    }
  }
}
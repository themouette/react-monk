export const buildStatOptions = ({ verbose, colors }) => {
  const normalOptions = {
    chunks: false,
    modules: false,
    colors,
  };
  const verboseOptions = {
    colors,
  };

  return verbose ? verboseOptions : normalOptions;
}

/**
 * Show webpack compilation result
 */
const logBuildStat = ({ verbose, colors }) => (err, stats) => {
  if (err) return console.log(err);
  console.log(stats.toString(buildStatOptions({ verbose, colors })));
};

export default logBuildStat;

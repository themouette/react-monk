import path from 'path';

const prepend = (prev, element) => {
  return [].concat(element || []).concat(prev || []);
}

/**
 * Force webpack entry into an object.
 */
export const webpackEntryToObject = (config) => {
  if (!config.entry) return {};

  if (typeof (config.entry) === 'string') config.entry = [config.entry];

  if (Array.isArray(config.entry)) {
    return config.entry.reduce((acc, entry) => {
      const canonicalName = path.basename(entry, '.js');
      return {
        ...acc,
        [canonicalName]: entry,
      };
    }, {});
  }

  return config.entry;
};

/**
 * Add a new file to all entries to the end of existing plugins
 *
 * @param Object  config  webpack config
 * @param {Array|Object}  plugin  new plugin(s) to append
 * @return Object
 */
export const prependToAllWebpackEntries = (config, newEntry) => {
  let entry = webpackEntryToObject(config);
  return Object
    .keys(entry)
    .reduce((acc, key) => ({
      ...acc,
      [key]: prepend(entry[key], newEntry),
    }), {});
};

export const addEntry = (config, newEntry) => {
  let entry = webpackEntryToObject(config);
  return {
    ...entry,
    ...webpackEntryToObject({entry: newEntry}),
  }
}

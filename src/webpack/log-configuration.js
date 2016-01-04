export default ({ colors }) => (configuration) => {
  console.log('Webpack Configuration');
  console.log('=====================');
  console.log('');
  console.log(JSON.stringify(configuration, null, 2));
}

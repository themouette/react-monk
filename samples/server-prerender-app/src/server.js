import 'source-map-support/register';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import prerender from './server/routes/prerender';


const app = express();
const port = process.env.PORT || 1338;

// Include static assets. Not advised for production
app.use('/public', express.static(path.join(__dirname, '..', 'dist', 'public')));
// Set view path
app.set('views', path.join(__dirname, 'server', 'views'));
// set up ejs for templating. You can use whatever
app.set('view engine', 'ejs');

// Set up Routes for the application
prerender(app);

// Route not found -- Set 404
app.get('*', function(req, res) {
  res
    .status(404)
    .json({
      'route': 'Sorry this page does not exist!'
    });
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);

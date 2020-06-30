const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const exphbs = require('express-handlebars');
const db = require('./models');

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

require('./routes')(app);

app.listen(PORT, () => {
  //db.sequelize.sync();
  console.log(`server running on ${PORT}`);
});

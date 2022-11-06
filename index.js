const app = require('./app');
require('./db').connectToMongoDB();
require('dotenv').config();

const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
  console.log(`server is listening at port:${PORT}`);
});

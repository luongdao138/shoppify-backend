const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('open', () => console.log('connected to db successfully!'));
db.on('error', (error) => console.log(error));

const userRouter = require('./routers/user');
const productRouter = require('./routers/product');
const shoppingRouter = require('./routers/shopping');
const categoryRouter = require('./routers/category');

app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/shopping', shoppingRouter);
app.use('/api/v1/categories', categoryRouter);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

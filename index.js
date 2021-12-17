const express = require('express');
const { connectDB } = require('./db');

const portfolioRoutes = require('./routes/portfolios');
const blogRoutes = require('./routes/blogs');

const server = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;

//mw
server.use(express.json());

//register routes
server.use('/api/v1/portfolios', portfolioRoutes);
server.use('/api/v1/blogs', blogRoutes);

//mongo
connectDB();
server.listen(PORT, err => {
  if (err) console.log(err);
  console.log(`App is running on port ${PORT}`);
});

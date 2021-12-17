const Portfolio = require('../db/models/portfolio');

exports.getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({});

    res.json(portfolios);
  } catch (err) {
    res.status(422).json(err.message);
  }
};

exports.getPortfolioById = async (req, res) => {
  const { id } = req.params;
  try {
    const portfolio = await Portfolio.findById(id);
    res.json(portfolio);
  } catch (err) {
    res.status(422).send(err.message);
  }
};

exports.createPortfolio = async (req, res) => {
  const { body } = req;
  body.userId = req.user.sub;
  console.log(body);
  try {
    const portfolio = new Portfolio(body);
    const newPortfolio = await portfolio.save();
    res.json(newPortfolio);
  } catch (err) {
    console.log(err);
    res.status(422).send(err);
  }
};

exports.updatePortfolio = async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  console.log(id);
  try {
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { _id: id },
      body,
      { new: true, runValidators: true }
    );
    res.json(updatedPortfolio);
  } catch (err) {
    console.log(err);
    res.status(422).send(err);
  }
};

exports.deletePortfolio = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPortfolio = await Portfolio.findOneAndRemove({ _id: id });
    res.json(deletedPortfolio);
  } catch {
    console.log(err);
    res.status(422).send(err);
  }
};

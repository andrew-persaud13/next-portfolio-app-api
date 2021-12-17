const express = require('express');
const {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require('../controllers/portfolios');
const { checkJwt, checkRole } = require('../controllers/auth');

const router = express.Router();

router.get('/', getPortfolios);
router.get('/:id', getPortfolioById);
router.post('/', checkJwt, createPortfolio);
router.patch('/:id', checkJwt, checkRole('admin'), updatePortfolio);
router.delete('/:id', checkJwt, checkRole('admin'), deletePortfolio);

module.exports = router;

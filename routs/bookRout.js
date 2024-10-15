const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth');
const bookController = require('../controllers/bookController');

router.get('/',ensureAuthenticated, bookController.getBooks);

router.post('/add', ensureAuthenticated, bookController.addBook);

router.get('/:id/edit', ensureAuthenticated, bookController.getBookForEdit);

router.post('/:id/edit', ensureAuthenticated, bookController.editBook);

router.post('/:id/delete', ensureAuthenticated, bookController.deleteBook);

module.exports=router;
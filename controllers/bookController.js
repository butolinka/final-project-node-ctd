const Book = require('../models/Book');


exports.getBooks = async (req,res)=>{
    try{
        const books = await Book.find({user: req.user.id});
        res.render('books', {books, success_msg:req.flash('success_msg')});
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Server error'});
    }
};

exports.addBook = async (req, res)=>{
    const {title, author, description} = req.body;
    try{
        const newBook = new Book ({title, author, description, user: req.user.id});
        await newBook.save();
        res.redirect('/books');
    } catch(err){
        console.log(err);
        res.status(400).json({message: 'Cannot add a book', err});
    }
};

exports.getBookForEdit = async(req, res)=>{
    try{
        const book = await Book.findById(req.params.id);
        if(!book || book.user.toString()!==req.user.id){
            return res.status(404).json({error:'Book is not found or unautorized'});
        }
        res.render('edit', { book });
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Server error'});
    }
};

exports.editBook = async(req, res)=>{
    const {title, author, description} = req.body;
    try{
        const book = await Book.findById(req.params.id);
        if(!book || book.user.toString()!==req.user.id){
            return res.status(404).json({error:'Book is not found or unautorized'});
        }
        book.title= title;
        book.author=author;
        book.description=description;
        await book.save();
        req.flash('success_msg', 'Book was successfully updated');
        res.redirect('/books');
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Server error'});
    }
};

exports.deleteBook = async(req, res)=>{
    try{
        const book = await Book.findById(req.params.id);
        if(!book || book.user.toString()!==req.user.id){
            return res.status(404).json({error:'Book is not found or unautorized'});
        }
        await Book.deleteOne({_id: req.params.id});
        req.flash('success_msg', 'Book was succesfully deleted');
        res.redirect('/books');
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Server error'});
    }
};

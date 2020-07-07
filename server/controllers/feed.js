const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator/check');

const io = require('../sockets');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .populate('creator')
        .sort({createdAt: -1})
    })
    .then(posts => {
        res.status(200).json({
            message: 'Fetched posts successfully',
            posts: posts,
            totalItems: totalItems
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.postPosts = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation Failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }
    if(!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path.replace("\\", "/");
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    })
    post.save()
    .then(result => {
        return User.findById(req.userId)
    })
    .then(user => {
        creator = user;
        user.posts.push(post);
        return user.save();
    })
    .then(result => {
        io.getIO().emit('posts', {
            action: 'create',
            post: {
                ...post._doc,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            }
        })
        res.status(201).json({
            message: 'Post created successfully',
            post: {
                ...post._doc,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            }
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .populate('creator')
    .then(post => {
        if(!post) {
            const error = new Error('Could not find a post');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Post Fetched',
            post: post
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation Failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file) {
        imageUrl = req.file.path.replace("\\", "/");
    }
    if(!imageUrl) {
        const error = new Error('No file picked');
        res.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
    .populate('creator')
    .then(post => {
        if(!post) {
            const error = new Error('Could not find a post');
            error.statusCode = 404;
            throw error;
        }
        console.log(post.creator);
        console.log(req.userId);
        if(post.creator._id.toString() !== req.userId) {
            const error = new Error('Not Authorised');
            error.statusCode = 403;
            throw error;
        }
        if(imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Post updated',
            post: result,
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find a post');
            error.statusCode = 404;
            throw error;
        }
        if(post.creator._id.toString() !== req.userId) {
            const error = new Error('Not Authorised');
            error.statusCode = 403;
            throw error;
        }
        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(postId);
    })
    .then(result => {
        return User.findById(req.userId);
    })
    .then(user => {
        user.posts.pull(postId);
        return user.save();
    })
    .then(result => {
        io.getIO().emit('posts', {
            action: 'delete',
            post: postId
        })
        res.status(200).json({
            message: 'Deleted post.'
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        
    })
}
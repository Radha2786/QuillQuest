// folder created for server side validation

const {blogschema,reviewschema} = require('./schema');

const validateblog = (req,res,next)=>{
    const{title,img,author,desc} = req.body;
    const {error} = blogschema.validate({title,img,author,desc})
    if(error){
        // return res.render('error');
        console.log(error);
        return res.status(500).render('error',{err:error})
    }
    next();
}

const validatereview = (req,res,next)=>{
    const{rating,comment} = req.body;
    const {error} = reviewschema.validate({rating,comment});
    if(error){
        return res.render('error',{err:error});
    }
    next();
}

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'please login first')
        return res.redirect('/login');
    }
    next();
}

module.exports = { validateblog , validatereview ,isLoggedIn}
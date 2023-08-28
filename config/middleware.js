modeule.exports.setFlash = function(req,res,next){
    req.locals.flash = {
        'success' : req.flash('success'),
        'error' : req.flash('error')
    }
    next();
}
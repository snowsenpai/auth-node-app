module.exports ={
    isUser:(req, res, next) =>{
        // no access to user route 
        // if true => isUser proceed, if fasle isAdmin redirect
        if(req.userRole.toString() === 'USER'){
            return next();
        }
        res.redirect('/all_users');
    },
    isAdmin:(req, res, next) =>{
        // no access to admin route
        // if true => isAdmin proceed, if fasle isUser redirect
        if(req.userRole.toString() === 'ADMIN'){
            return next();
        }
        res.redirect('/');
    }
}
module.exports ={
    isUser:(req, res, next) =>{ 
        // if true => isUser proceed, if fasle isAdmin
        if(req.userRole.toString() === 'USER'){
            return next();
        }
        res.status(403).json({
            message:'Endpoint is only available to users with role USER'
        });
    },
    isAdmin:(req, res, next) =>{
        // if true => isAdmin proceed, if fasle isUser
        if(req.userRole.toString() === 'ADMIN'){
            return next();
        }
        res.status(403).json({
            message:'Endpoint is only available to ADMIN'
        });
    }
}
const JWT = require('jsonwebtoken');
const createError = require('http-errors');


module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '24h',
                issuer: 'rawsolutions.com',
                audience: userId
            };

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);

                    reject(createError.InternalServerError() );
                }
                resolve(token);
            });

        });
    },


    verifyAccessToken: (req, res, next) => {
        // console.log('verifyAccessToken');
        if(!req.headers['authorization']){
            // console.log(req.headers['authorization'])
            return next(createError.Unauthorized());            
        }
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        // console.log(token);

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload)=>{
            if(err) return next(createError.Unauthorized(err.message));
            
            // console.log('payload:' + aud);
            req.payload = payload;
            next();
        });

    },


    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'rawsolutions.com',
                audience: userId
            };

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);

                    reject(createError.InternalServerError() );
                }
                resolve(token);
            });

        });
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,payload)=>{
                if(err) return reject(createError.Unauthorized());
                const userId = payload.aud

                resolve(userId);
            })
        })
    }
}
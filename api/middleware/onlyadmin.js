import jwt from 'jsonwebtoken';
import { handleError } from '../helpers/handleError.js';

const onlyadmin = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No Token Provided. Unauthorized.'
        });
    }

    try {
        // Decode the JWT token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure the decoded token exists and contains the admin role
        if (tokenDecode && tokenDecode.role === 'admin') {
            req.user = tokenDecode; // Attach the decoded properties to req.user
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Access Denied. Admins Only.'
            });
        }
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export default onlyadmin;

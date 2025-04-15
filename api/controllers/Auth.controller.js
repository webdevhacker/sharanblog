import { handleError } from "../helpers/handleError.js"
import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from '../config/nodemailer.js'
import { EMAIL_VERIFY_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_TEMPLATE, PASSWORD_CHANGED_TEMPLATE, 
    NEW_SIGNIN_EMAIL, ACCOUNT_LOCKED_EMAIL } from "../config/emailTemplates.js"
// const [ipDetails, setIpDetails] = useState([]);
//     useEffect(() => { 
//         axios.get('https://ipapi.co/json/').then((res) => { 
//             setIpDetails(res.data); 
//             // setLat(res.data.latitude); 
//             // setLon(res.data.longitude); 
//         }); 
//     }, [])

export const Register = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        const checkuser = await User.findOne({ email })
        if (checkuser) {
            // user already registered 
            next(handleError(409, `User with ` + email + ` already registered.`))
        }
        
        const hashedPassword = await bcryptjs.hash(password, 10)
        // register user  
        const user = new User({
            name, email, password: hashedPassword
        })

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn:'7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production' ?
            'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

            //mail sending
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to SHARAN KUMAR BLOG",
            // text: `Dear ${name} Welcome to SHARAN KUMAR BLOG`
            html: WELCOME_EMAIL_TEMPLATE.replace("{{name}}", user.name)

        }
        await transporter.sendMail(mailOptions)

        return res.status(200).json({
            success: true,
            message: 'Registration successful'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const Login = async (req, res, next) => {
    try {
        const maxLoginAttempts = 3;          // Maximum incorrect attempts allowed

        const lockTime = 10 * 60 * 1000;      //10 minutes

        //User Agent
        const userAgent = req.headers['user-agent']

        // Get the IP Address from headers or socket
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            next(handleError(404, `No user found with those credentials`))
        }
        // Check if the account is locked
        if (user.isLocked()) {
            return res
            .status(403)
            .json({ message: 'Account is locked. Please try again in 10 minutes.' });
        }

        // Compare provided password with the hashed password in the database
        const passwordMatch = await bcryptjs.compare(password, user.password);

        if (!passwordMatch) {
        // Increase failed login attempts
        user.failedLoginAttempts += 1;

        // If threshold exceeded, lock the account
        if (user.failedLoginAttempts >= maxLoginAttempts) {
            user.lockUntil = Date.now() + lockTime;
            //send account lock mail to the user
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Account locked due to multiple failed login attempts",
                html: ACCOUNT_LOCKED_EMAIL.replace("{{name}}", user.name).replace("{{email}}", user.email).replace("{{ipAddress}}", ipAddress).replace("{{useragent}}", userAgent)

            }
            await transporter.sendMail(mailOptions)
        }

        await user.save();
        return res.status(400).json({ message: `Oh no! couldn't recognize those credentials. Only 3 attempts for retry` });
        }

        // Successful login: reset the count and lock timestamp
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        await user.save();


        // const hashedPassword = user.password

        // const comparePassword = await bcryptjs.compare(password, hashedPassword)
        // if (!comparePassword) {
        //     next(handleError(404, `Oh no! couldn't recognize those credentials🥺`))
        // }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn:'7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production' ?
            'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //mail sending
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Successful sign-in to your account from new device",
            html: NEW_SIGNIN_EMAIL.replace("{{name}}", user.name).replace("{{email}}", user.email).replace("{{ipAddress}}", ipAddress).replace("{{useragent}}", userAgent)

        }
        await transporter.sendMail(mailOptions)

        const newUser = user.toObject({ getters: true })
        delete newUser.password
        res.status(200).json({
            success: true,
            user: newUser,
            message: `Ah, there you are! It's always a delight to see you, ` + newUser.name
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const GoogleLogin = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body
        let user
        user = await User.findOne({ email })
        if (!user) {
            //  create new user 
            const password = Math.random().toString()
            const hashedPassword = bcryptjs.hashSync(password)
            const newUser = new User({
                name, email, password: hashedPassword, avatar
            })

            user = await newUser.save()
            user.isAccountVerified = true
            user.verifyOtp = ''
            user.verifyOtpExpireAt = 0

        }


        const token = jwt.sign({
            _id: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }, process.env.JWT_SECRET)


        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/'
        })

        const newUser = user.toObject({ getters: true })
        delete newUser.password
        res.status(200).json({
            success: true,
            user: newUser,
            message: `You are now login as ` + newUser.email
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}



export const Logout = async (req, res, next) => {
    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/'
        })

        res.status(200).json({
            success: true,
            message: `Goodbye for now, you've logged out flawlessly`
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

//Send OTP
export const sendVerifyOtp = async (req,res,next) =>{
    try{
        const {userId} = req.body
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required.'
            });
        }
        
        const user = await User.findById(userId)
        if(user.isAccountVerified){
            res.status(200).json({
                success: false,
                message: 'Account Already Verified.'
            })
        }
        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        // Extract the User Agent from request headers
        const userAgent = req.headers['user-agent']

        // Get the IP Address from headers or socket
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress

        // Fetch location data using the geolocation API
        // const geoResponse = await axios.get(`${process.env.GEO_API_URL}/${ipAddress}`)
        // const locationData = geoResponse.data

        // Format the response
        // const userInfo = {
        //     userAgent,
        //     ipAddress,
        //     //location: locationData,
        // }

    //    res.json(userInfo)

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Account verification OTP`,
            // text: `Dear ${user.name}, Your account verification otp: ${otp}`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{name}}", user.name).replace("{{email}}", user.email).replace("{{otp}}", otp).replace("{{ipAddress}}", ipAddress)
        }
        await transporter.sendMail(mailOptions)
        return res.status(200).json({
            success: true,
            message: 'An account verification email with OTP sent successfully'
        })


    }catch(error){
        next(handleError(500, error.message))
    }
}

export const veryEmail = async (req, res, next) =>{
    const {userId, otp} = req.body
    if(!userId || !otp){
        return res.status(500).json({
            success: false,
            message: 'Missing Details.'
        })
    }
    try{
        const user = await User.findById(userId)
        if(!user){
            return res.status(500).json({
                success: false,
                message: 'No user found.'
            })
        }
        if(user.verifyOtp === '' || user.verifyOtp!==otp){
            return res.status(200).json({
                success: false,
                message: 'Invalid OTP.'
            })
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.status(200).json({
                success: false,
                message: 'OTP Expired.'
            })
        }
        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Account verified successfully. Now login to your account',
            
        })

    }catch(error){
        next(handleError(500, error.message))
    }
}

//check if user is authenticated

export const isAuthenticated = async (req, res, next)=>{
    try{
        return res.status(200).json({
            success: true,
            message: 'You are already loggedIn to your account.'
        })
    }catch(error){
        next(handleError(500, error.message))
    }
}

//send password otp

export const sendResetOtp = async (req, res, next)=>{
    const {email} = req.body
    if(!email){
        return res.status(200).json({
            success: true,
            message: 'Email is required'
        })
    }
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(200).json({
                success: false,
                message: 'No user found'
            }) 
        }
        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        // Extract the User Agent from request headers
        const userAgent = req.headers['user-agent']

        // Get the IP Address from headers or socket
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Password reset OTP`,
            // text: `Dear ${user.name}, Your password reset otp: ${otp}`
            html: PASSWORD_RESET_TEMPLATE.replace("{{name}}", user.name).replace("{{email}}", user.email).replace("{{otp}}", otp).replace("{{ipAddress}}", ipAddress)
        }
        await transporter.sendMail(mailOptions)
        return res.status(200).json({
            success: true,
            message: 'Email with password reset OTP sent successfully'
        })


    }catch(error){
        next(handleError(500, error.message))
    }
}

//Reset user password after otp verification 

export const resetPassword = async (req, res, next)=>{
    const {email, otp, newPassword} = req.body

    if(!email || !otp || !newPassword){
        return res.status(200).json({
            success: false,
            message: 'All fields are required.'
        })
    }
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(200).json({
                success: false,
                message: 'No user found with provided email.'
            })
        }

        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.status(200).json({
                success: false,
                message: 'Invalid otp.'
            })
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.status(200).json({
                success: false,
                message: 'OTP is expired.'
            })
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpireAt = 0

        await user.save()
        // Extract the User Agent from request headers
        const userAgent = req.headers['user-agent']

        // Get the IP Address from headers or socket
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress

        //mail sending
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Your account password has successfully changed",
            //text: `Dear ${user.name} Your account password has successfully changed.`
            html: PASSWORD_CHANGED_TEMPLATE.replace("{{name}}", user.name).replace("{{email}}", user.email).replace("{{ipAddress}}", ipAddress).replace("{{useragent}}", userAgent)

        }
        await transporter.sendMail(mailOptions)

        return res.status(200).json({
            success: true,
            message: 'Your account password has successfully changed'
        })

    }catch(error){
        next(handleError(500, error.message))
    }
}
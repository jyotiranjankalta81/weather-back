import bcrypt from 'bcrypt';
import { userModel } from "../Model/UserModel.js";
import dotenv from 'dotenv';
dotenv.config();
const accessToken = process.env.ACCESS_TOKEN;
const refreshToken = process.env.REFRESH_TOKEN;
import jwt from 'jsonwebtoken';
import TokenModel from '../Model/userToken.js';
import { blogModel } from '../Model/BlogModel.js';






export const getUser = async (req, res) => {

    try {
        const getUser = await userModel.find({});
        return res.status(200).json({ res: getUser });
    } catch (err) {
        return res.status(400).json({ res: 'Error while fetching the data from server' });
    }


};

export const addSignupUser = async (req, res) => {


    try {

        if (req.body.password === '') {
            return res.status(400).json({ "res": 'Password is empty' });
        } else {

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const add = new userModel({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                userrole: 0
            });

            await add.save();
            return res.status(200).json({ res: 'User has been registered successfully' });
        }
    } catch (err) {
        console.log("error", err)
        return res.status(400).json({ res: 'Error while signing up user', err });
    }

};


export const loginUser = async (req, res) => {

    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ "res": 'User not found' })
        }

        const match = await bcrypt.compare(req.body.password, user.password);

        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN, { expiresIn: '10m' });
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN);

            const token = new TokenModel({ token: refreshToken });
            await token.save();

            return res.status(200).json({ myAccessToken: accessToken, myRefreshToken: refreshToken, username: user.username, email: user.email, userrole: user.userrole })

        } else {
            return res.status(400).json({ 'res': 'Password does not match' });
        }
    } catch (error) {
        return res.status(500).json({ 'res': 'Error occurred occurred while login' });
    };

}

// export const blog = async (req, res) => {

//     const data = req.body;
//     console.log('Data', data);


//     if (req.body) {
//         data.forEach(element => {

//             try {

//                 const blog = new blogModel({
//                     mainHeading: element.mainHeading,
//                     heading: element.heading,
//                     description: element.description,
//                     image: element.image
//                 });

//                 blog.save();
//                 res.status(200).json({ res: 'Blog has been posted' });

//             } catch (err) {
//                 console.log("error", err)
//                 res.status(400).json({ res: 'Error occurred while posting blog' });
//             }
//         });
//     }
// };


// export const blog = async (req, res) => {
//     const data = req.body;
//     console.log('Data', data);

//     if (req.body) {
//         try {
//             // Map the data array to an array of promises that save the blogs
//             const promises = data.map(async (element) => {
//                 const blog = new blogModel({
//                     mainHeading: element.mainHeading,
//                     heading: element.heading,
//                     description: element.description,
//                     image: element.image,
//                 });

//                 await blog.save();
//             });

//             // Wait for all the promises to be resolved
//             await Promise.all(promises);

//             // Once all blogs are saved, send the response to the client
//             res.status(200).json({ res: 'Blogs have been posted' });
//         } catch (err) {
//             console.log('error', err);
//             res.status(400).json({ res: 'Error occurred while posting blogs' });
//         }
//     } else {
//         res.status(400).json({ res: 'No data received' });
//     }
// };

export const blog = async (req, res) => {

    const blogData = req.body
    console.log('Hello ', blogData);



    try {


        // for (const element of blogData) {

        const addBlog = new blogModel({
            
            mainHeading: blogData.mainHeading,
            heading: blogData.heading,
            description: blogData.description,
            image: req.file ? req.file.path.replace(/\\/g, "/").split("public/").pop() : '',
            category: blogData.category
        });

        const data = await addBlog.save();

        // };
        return res.status(200).json({ 'res': 'Blog has been posted successfully',data });

    } catch (error) {
        return res.status(500).json({ 'res': 'Error occurred while posting blog ', error });
    };

};


export const getAllBlogs = async (req, res) => {

    try {
        const getBlogs = await blogModel.find();
        console.log(getBlogs);
        res.json(getBlogs);

    } catch (error) {
        return res.status(500).json({ "res": 'Error occurred while fetching the blogs' });
    }
}

export const getParticularBlog = async (req, res) => {

    try {
        const paramsId = req.params.id;
        const findBlog = await blogModel.findById({ _id: paramsId });
        return res.status(200).json({ 'res': findBlog });
        console.log(findBlog);

    } catch (error) {
        return res.status(500).json({ 'res': 'could not fetch the blog from server' });
    }

}



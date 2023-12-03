import express from 'express';
import { Router } from 'express';
import { body } from 'express-validator'; // Separate import for 'body'
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../DBConnecton.mjs'; // Assuming pool is the default export in connection.js
// import { OAuth2Client } from 'google-auth-library';

const router = Router();
const JWT_SECRET = 'YourSecretKey'; // Change this to your secret key

const LOGIN = {

login : async (req, res) => {
    // Implementation for login route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const [vendors] = await pool.query('SELECT VendorID, email, password FROM vendors WHERE email = ?', [email]);

      if (vendors.length === 0) {
        return res.status(400).json({ error: 'Please login with correct credentials' });
      }

      const passwordCompare = await bcrypt.compare(password, vendors[0].password);

      if (!passwordCompare) {
        return res.status(400).json({ error: 'Please login with correct credentials' });
      }
      const data = {
        vendors: {
          VendorID: vendors[0].VendorID,
          email: vendors[0].email,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '12h' });

      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error');
    }
  },


  signup : async (req, res) => {
    // Implementation for signup route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email,ContactNo,ShopName, password} = req.body;

      // Check if the user with the same email already exists
      const [existingUser] = await pool.query('SELECT * FROM vendors WHERE email = ?', [email]);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Sorry, user already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the new user into the users table
      await pool.query('INSERT INTO vendors (name, email,ContactNo,ShopName, password) VALUES (?, ?, ?,?,?)', [
        name,
        email,
        ContactNo,
        ShopName,
        hashedPassword,
      ]);

      // Create a JWT token
      const data = {
        user: {
          email,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '12h' });

       res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Some error occurred');
    }
  }





// const CLIENT_ID = '862605739224-kk9isaqbnds5tkbq0s8va79sv4ir7c7a.apps.googleusercontent.com'; // Your Google Client ID


// Route: Sign up or Authenticate with Google: POST "/api/auth/google"
// router.post('/google', async (req, res) => {
//   try {
//     const { idtoken } = req.body;
//     const ticket = await client.verifyIdToken({
//       idToken: idtoken,
//       audience: CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const email = payload.email;

//     // Check if the user with the provided email exists
//     const [user] = await pool.query('SELECT * FROM vendors WHERE email = ?', [email]);

//     if (user.length === 0) {
//       // If the user doesn't exist, you can create a new user with the provided emailb
//       // This is where you should insert the new user into your database
//       const hashedPassword = ''; // You should hash the password, or use a different authentication method

//       // For example:
//       await pool.query('INSERT INTO vendors (email, password) VALUES (?, ?)', [email, hashedPassword]);

//       // Then, create a JWT token for the new user
//     }

//     // Create a JWT token
//     const data = {
//       user: {
//         email: email,
//       },
//     };
//     const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '12h' });

//     res.json({ authtoken });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Internal server error');
//   }
// })

};


export default LOGIN;
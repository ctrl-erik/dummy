import express from 'express'
import cors from 'cors'
const app = express();
app.use(cors());
app.use(express.json());

/* IMPORT MODELS */
import userModel from './models/userModel.js'
import menuModel from './models/menuModel.js'
import cartModel from './models/cartModel.js'
import favModel from './models/favModel.js'

import authService from './middleware/authService.js'

/* USER DB INTERACTIONS */
app.get('/users', async function (req, res) {

    try{
        const response = await userModel.getUsers();
        res.json(response); 

    } catch (error){
        console.error('Error fetching users:', error);
    }
});

app.post('/checkEmail', async function (req, res) {
    const email = req.body;
    try {
        const existingUser = await userModel.checkEmaildb(email);
        res.json({ exists: existingUser.rowCount > 0 });
      } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

/* USER CART INTERACTIONS */
app.post('/getCart', async function (req, res) {
    // acknowledge request received on the console for debugging
    // set values from request
    const id = req.body.user_id
    try {
        // sanitized parameters
        const cartResult = await cartModel.getCartdb(id);
        res.json({ cart_items: cartResult.rows });
    } catch (error){
        console.error('Error fetching cart items:', error);
    }
});

app.post('/addCart', async function (req, res) {
    // acknowledge request received on the console for debugging
    // set values from request
    const { menu_item, cart_id } = req.body;
    
    try {
        // sanitized parameters
        const addItemResult = await cartModel.addCartItemdb(cart_id, menu_item);
        res.json(addItemResult);
    } catch (error){
        console.error('Error adding menu item to cart:', error);
    }
});

app.post('/removeCartItem', async function (req, res) {
    // acknowledge request received on the console for debugging
    // set values from request
    const { menu_item, cart_id } = req.body;
    try {
        // sanitized parameters
        const removeItemResult = await cartModel.removeCartItemdb(cart_id, menu_item);
        res.json(removeItemResult);
    } catch (error){
        console.error('Error removing menu item from cart:', error);
    }
});


/* MENU DB INTERACTIONS */

app.get('/getMenu', async function (req, res) {

    const category_id = req.query.category_id; // set values from request
    try {
        const menuResult = await menuModel.getMenudb(category_id); // sanitize
        
        if (menuResult.rowCount === 0)
            return res.status(404).json({ message: 'No menu items found for this category.'});
        res.json({ items: menuResult });
    } catch (error){
        console.error('Error fetching menu items:', error);
    }
});

app.get('/getAdminMenu', async function (req, res) {

    const category_id = req.query.category_id; // set values from request

    try {
        const menuResult = await menuModel.getMenudb(category_id, true); // sanitize
        
        if (menuResult.rowCount === 0)
            return res.status(404).json({ message: 'No menu items found for this category.'});
        res.json({ items: menuResult });
    } catch (error){
        console.error('Error fetching menu items:', error);
    }
});

/* AUTH SERVICES */

app.post('/signup', async function (req, res) {
    // acknowledge request received on the console for debugging
    // set values from request
    const { username, email, phone, pwd } = req.body;

    try {
        const result = await authService.signUp(username, email, phone, pwd); // will handle email check and password hashing
        if (result.success) {
            res.status(201).json({ message: result.message });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (err) {
        console.error('Error in /signup route:', err);
        res.status(500).json({ error: 'Failed to create user account'});
    }
});

app.post('/login', async function (req, res) {
    // acknowledge request received on the console for debugging
    const { email, pwd } = req.body;

    try {
        const result = await authService.login(email, pwd); // will handle email check and password hashing
        if (result.success && result.user) {
            res.status(201).json({ message: result.message, user: result.user });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (err) {
        console.error('Error in /login route:', err);
        res.status(500).json({ error: 'Failed to login user'});
    }
});

/* FAVOURITES DB INTERACTIONS */

app.get('/getFav', async function (req, res) {
    // acknowledge request received on the console for debugging
    // set values from request
    const user_id = req.query.user_id; // Access query parameter
    try {
        const favResult = await favModel.getUserFav(user_id); 

        res.json(favResult);
        
    } catch (error){
        console.error('Error fetching cart items:', error);
    }
});

app.get('/deleteFav', async function (req, res) {
    // acknowledge request received on the console for debugging
    // set values from request
    const user_id = req.query.user_id; // Access query parameter
    try {
        const favResult = await favModel.getUserFav(user_id); 

        res.json(favResult);
        
    } catch (error){
        console.error('Error fetching cart items:', error);
    }
});


// start the server
async function startup()
{
  app.listen(3001, async function(){
  });
}

startup();
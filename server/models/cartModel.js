// models/cartModel.js
import db from '../config/db.js';

const cartModel = {
    async getCartdb(user_id) {
        try {
            const userCartRes = await db.query('SELECT * FROM carts WHERE user_id = $1', [user_id])

            if (userCartRes.data === 0)
                return res.status(404).json({ message: 'No cart found for this user.' });
            
            const cartId = userCartRes.rows[0].cart_id;
            const cartItemsResult = await db.query("SELECT mi.name, mi.desc, mi.price, ci.quantity " +
                                                    "FROM cart_item ci " +
                                                    "JOIN menu_items mi ON ci.item_id = mi.menu_item_id " +
                                                    "WHERE ci.cart_id = $1", [cartId]);
            
            return cartItemsResult;
        } catch (error){
            console.error('Error fetching cart items:', error);
        }
    },
    async getCartIddb(user_id) {
        try {
            const result = await db.query('SELECT cart_id FROM carts WHERE user_id = $1', [user_id])
            return result;
        } catch (error){
            console.error('Error fetching user cart id:', error);
        }
    },
    
    async createUserCartdb(userId) {
        try {
            const response = await db.query('INSERT INTO carts(user_id) VALUES ($1);', [userId])
            return response;
        } catch (error){
            console.error('Error creating user cart:', error);
        }
    },
    async addCartItemdb(cart_id, menu_item) {
        try {    
            // Use UPSERT to handle both cases: update quantity if exists, insert otherwise
            const query = `
                INSERT INTO cart_item (cart_id, item_id, quantity) 
                VALUES ($1, $2, 1)
                ON CONFLICT (cart_id, item_id) 
                DO UPDATE SET quantity = cart_item.quantity + 1
                RETURNING *;
            `;
    
            const result = await db.query(query, [cart_id, menu_item]);
    
    
            // return result.rows[0]; // Return the updated or inserted row
            return { success: true, message: "Menu item added to cart." };
        } catch (error) {
            console.error("Error adding item to cart:", error);
            throw error; // Propagate the error for handling by the caller
        }
    },
    async removeCartItemdb(cart_id, menu_item) {
        try {    
            // Use UPSERT to handle both cases: update quantity if exists, insert otherwise
            const query = `
                WITH updated_cart AS (
                    UPDATE cart_item
                    SET quantity = quantity - 1
                    WHERE cart_id = $1 AND item_id = $2 AND quantity > 1
                    RETURNING *
                )
                DELETE FROM cart_item
                WHERE cart_id = $1 AND item_id = $2 AND NOT EXISTS (
                    SELECT 1 FROM updated_cart
                )
                RETURNING *;
            `;
            
            const result = await db.query(query, [cart_id, menu_item]);            
    
            // return result.rows[0]; // Return the updated or inserted row
            return { rows: result, success: true, message: "Menu item removed from cart." };
        } catch (error) {
            console.error("Error adding item to cart:", error);
            throw error; // Propagate the error for handling by the caller
        }
    }

}

export default cartModel;
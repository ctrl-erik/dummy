// models/favModel.js
import db from '../config/db.js';

const favModel = {
    async getUserFav(id) {
        const favResult = await db.query('SELECT menu_item_id FROM user_favourites WHERE user_id = $1', [id])

        if (favResult.data === 0) {
            return res.status(404).json({ message: 'No favourites found for this user.' });
        }

        const menuItemIds = favResult.rows.map(row => row.menu_item_id);
        // Query to fetch menu item details
        const itemsQuery = {
            text: 'SELECT * FROM menu_items WHERE menu_item_id = ANY ($1)',
            values: [menuItemIds],
        };

        const itemsResult = await db.query(itemsQuery);
        return itemsResult;
    },
    async deleteUserFav(user_id, item_id) {
        const deleteFavResult = await db.query(`DELETE FROM user_favourites
                                                WHERE user_id = $2 
                                                AND menu_item_id = $1`, [user_id, item_id]);
        return deleteFavResult;
    },
    async addUserFav(user_id, item_id) {
        const getUserRes = await db.query(`INSERT INTO user_favourites
                                           VALUES ($1, $2)`, [user_id, item_id]);
        return getUserRes;
    }
};

export default favModel;
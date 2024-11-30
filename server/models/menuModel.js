// models/menuModel.js
import db from '../config/db.js';

const menuModel = {
    async getMenudb(category_id) {
            if (category_id == 0){
                const adminMenuRes = await db.query('SELECT * FROM menu_items');
                return adminMenuRes;
            }
            const menuQueryRes = await db.query('SELECT * FROM menu_items WHERE category = $1', [category_id]);
            return menuQueryRes;
    },
    async createMenuItem(name, description, price, category_id) {
        const createQueryRes = await db.query('INSERT INTO menu_items (name, description, price, category)' +
                                              'VALUES ($1, $2, $3, $4) RETURNING *;', [name, description, price, category_id]);
        return createQueryRes;
    },
    async editMenuItem(item_id, name, description, price, category_id) {
        const editQuery = `
            UPDATE menu_items
            SET name = $2, description = $3, price = $4, category = $5
            WHERE id = $1
            RETURNING *;
        `;
        const editQueryRes = await db.query(editQuery, [item_id, name, description, price, category_id]);
        return editQueryRes;
    },
    async deleteMenuItem(item_id) {
        const deleteQueryRes = await db.query('DELETE FROM menu_items WHERE menu_item_id = $1 RETURNING *;', [item_id]);
        return deleteQueryRes;
    }
}

export default menuModel;
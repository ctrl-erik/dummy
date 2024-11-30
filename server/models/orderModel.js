// models/orderModel.js
import db from '../config/db.js';

const orderModel = {
    async getOrders() {
        const ordersResult = await db.query('SELECT * FROM user_orders')

        return ordersResult;
    },
    async getUserOrders(user_id) {
        const userOrdersResult = await db.query('SELECT * FROM user_orders WHERE user_id = $1', [user_id])
        return userOrdersResult;
    },
};

export default orderModel;
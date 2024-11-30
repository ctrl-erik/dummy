// models/userModel.js
import db from '../config/db.js';

const userModel = {
    async getUsers() {
        const getUserRes = await db.query('SELECT * FROM users');
        return getUserRes;
    },
    async checkEmaildb(email) {
        const checkEmailRes = await db.query('SELECT email FROM users WHERE email = $1', [email]);
        return checkEmailRes;
    },
    async userEmailsdb() {
        const emailQueryRes = await db.query('SELECT email FROM users');
        return emailQueryRes;   
    },
    async createUserdb(username, email, phone, pwd) {
        const createUserRes = await db.query('INSERT INTO users(type_id, username, email, phone, pwd)' +
                                             'VALUES($1, $2, $3, $4, $5) RETURNING user_id;', [1, username, email, phone, pwd]);
        // we return the id to the create the users cart 
        return createUserRes;
    },
    async checkUserdb(email, pwd) {
        const createUserRes = await db.query('SELECT * FROM users WHERE email=$1 AND pwd=$2', [email, pwd]);
        return createUserRes;
    }
};

export default userModel;
import userModel from '../models/userModel.js'
import cartModel from '../models/cartModel.js'

const authService = {
    async signUp(username, email, phone, pwd) { 
        try {
            const createUsrResp = await userModel.createUserdb(username, email, phone, pwd);
            console.log(createUsrResp.rows);
            
            const user_id = createUsrResp.rows[0].user_id;
            await cartModel.createUserCartdb(user_id)
            return { success: true, message: "User created successfully." };
        } catch (error) {
            console.error("Error in authService.signUp:", error);
            return { success: false, message: "An error occurred during signup." };
        }
    },
    async login(email, pwd) {
        try {
            const result = await userModel.checkUserdb(email, pwd);
            // query for cart id and store in state
            // console.log(result);
            if (result.rows.length > 0) {
                // user found, return user data
                // console.log(result.rows[0]);
                const user = result.rows[0];

                let authUser = null;
                if (user.type_id == 1){
                    const cartResult = await cartModel.getCartIddb(user.user_id);
                    const cartId = cartResult.rows[0].cart_id;
                    // console.log("Login Cart Id Result:")
                    // console.log(cartResult)
    
                    authUser = {
                        user_id: user.user_id,
                        type_id: user.type_id,
                        email: user.email,
                        phone: user.phone,
                        username: user.username,
                        cart_id: cartId // add cart id to the user object stored in session
                    }
                } else {
                    authUser = {
                        user_id: user.user_id,
                        type_id: user.type_id,
                        email: user.email,
                        phone: user.phone,
                        username: user.username,
                    }
                }
               
                return { success: true, message: "User found in db.", user: authUser };

            } else {
                // user not found, return unauthorized status
                return { success: false, message: "User not found in db." };
            }

        } catch (error) {
            console.error("Error in authService.login:", error);
            return { success: false, message: "An error occurred during login." };
        }
    }
};

export default authService;

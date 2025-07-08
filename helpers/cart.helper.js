async function mergeSessionCartToUser(cart, user) {
    if (cart.length > 0) {
        cart.map((item) => {
            if (
                !user.cart.find(
                    (cartItem) => cartItem.productId == item.productId
                )
            ) {
                user.cart.push({
                    productId: item.productId,
                    quantity: item.quantity,
                });
            }
        });
        await user.save();
    }
}

module.exports = { mergeSessionCartToUser };

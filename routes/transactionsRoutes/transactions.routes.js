const router = require('express').Router()
const Product = require('../../models/Product.model')
const User = require('../../models/User.model')
const Transaction = require('../../models/Transaction.model')

router.post('/start/:product_id/:buyer_id/:seller_id', (req, res, next) => {

    const { product_id, buyer_id, seller_id } = req.params

    Transaction
        .create(product_id, buyer_id, seller_id)
        .then(() => Product.findByIdAndUpdate(product_id, { $addToSet: { buyRequest: buyer_id } }, { new: true }))
        .catch(err => next(err))
})

router.put('/reject/:transaction_id', (req, res, next) => {

    const { transaction_id } = req.params

    Transaction
        .findByIdAndUpdate(transaction_id, { activeTransaction: false }, { new: true })
        .then(() => res.status(200).json('Transaccion rechazada'))
        .catch(err => next(err))
})

router.put('/accept/:transaction_id/:product_id/:buyer_id/:seller_id', (req, res, next) => {

    const { transaction_id, product_id, buyer_id, seller_id } = req.params

    Transaction
        .findByIdAndUpdate(transaction_id, { activeTransaction: false }, { new: true })
        .then(() => {

            const itsBought = User.findByIdAndUpdate(buyer_id, { $addToSet: { purchasedProducts: product_id } }, { new: true })
            const itsSoled = User.findByIdAndUpdate(seller_id, [
                { $addToSet: { soldProducts: product_id } },
                { $pull: { sellingProducts: product_id } }
            ], { new: true })
            const outStock = Product.findByIdAndUpdate(product_id, { inSale: false }, { new: true })

            const promises = [itsBought, itsSoled, outStock]

            return Promise.all(promises)
        })
        .then(() => res.status(200).json('Product sold'))
        .catch(err => next(err))
})


module.exports = router
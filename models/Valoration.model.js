const { Schema, model } = require("mongoose");

const valorationSchema = new Schema({
    stars: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
        // required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    description: {
        type: String,
        max: [200, 'Maximo 200 caracteres'],
        trim: true,
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    }
)

const Valoration = model("Valoration", valorationSchema)

module.exports = Valoration
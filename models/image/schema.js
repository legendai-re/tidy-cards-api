module.exports = function getImageSchema(Schema) {

    return new Schema({
        createdAt: { type: Date },
        updatedAt: { type: Date },
        mime: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        _user : { type: String, ref: 'User' }
    },{
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

}

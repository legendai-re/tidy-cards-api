module.exports = function getItemImageSchema(Schema) {

    return new Schema({
        createdAt: { type: Date },
        updatedAt: { type: Date },
        url: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return (v.length <= 10000);
                },
                message: '{VALUE} is not an url'
            }
        },
        _user: { type: String, ref: 'User' }
    });

}

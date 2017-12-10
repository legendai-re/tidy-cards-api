module.exports = function getItemUrlSchema(Schema) {

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
        host: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        },
        title: {
            type: String,
            required: false,
            validate: {
                validator: function(v) {
                    return (v.length <= 500);
                },
                message: '{VALUE} is not a title'
            }
        },
        description: {
            type: String,
            required: false
        },
        author: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: false
        },
        site_name: {
            type: String,
            required: false
        },
        _user: { type: String, ref: 'User' }
    });

}

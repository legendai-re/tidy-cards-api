module.exports = function getItemYoutubeSchema(Schema) {

    return new Schema({
        createdAt: { type: Date },
        updatedAt: { type: Date },
        url: {
            type: String,
            required: true
        },
        embedUrl: {
            type: String,
            required: true
        },
        videoId: {
            type: String,
            required: true
        },
        snippet: {
            type: Object,
            return: true
        },
        _user: { type: String, ref: 'User' }
    });

}

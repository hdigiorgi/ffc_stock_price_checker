const mongoose = require('mongoose');
const model = mongoose.model;
var Schema = mongoose.Schema;

require('dotenv').config()
mongoose.connect(process.env.DB, {useNewUrlParser: true});

const LikeSchema = new Schema({
    _id: {type: String, required: true},
    likeCount: {type: Number, required: false, default: 0},
    likedBy: [String] 
})

const Like = model('stock_likes', LikeSchema);

function isLikedBy(_id, who) {
    return Like.find({_id, likedBy: {$all: who}})
        .exec().then(found => {
            return found != null && found.length > 0;
        })
}

function unconditionallyAddLike(_id, who) {
    return Like.findByIdAndUpdate(_id, {
        $push: {likedBy: who},
        $inc: {likeCount: 1}
    }, {upsert: true, new: true, setDefaultsOnInsert: true}).exec()
    .then(x => x.likeCount)
}

function addLike(_id, who) {
    return isLikedBy(_id, who).then( isLiked => {
        if(!isLiked) return unconditionallyAddLike(_id, who)
        else return false
    })
}

function getLikeCount(_id) {
    return Like.findById(_id).exec().then(x => {
        if(x != null) return x.likeCount;
        else return 0;
    })
}

function deleteLikes(_id) {
    return Like.deleteOne({_id}).exec()
}

module.exports = {isLikedBy, addLike, getLikeCount, deleteLikes};

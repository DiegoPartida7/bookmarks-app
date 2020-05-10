const mongoose = require("mongoose");
const uuid = require("uuid");


const bookmarksCollectionSchema = mongoose.Schema({
    id: {
        type: uuid,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});

const bookmarksCollection = mongoose.model("bookmarks", bookmarksCollectionSchema);

const Bookmarks = {

    getAllBookmarks : function(){
        return bookmarksCollection
                .find()
                .then( allBookmarks => {
                    return allBookmarks;
                })
                .catch( err => {
                    return err;
                });
    },
    createBookmark : function( newBookmark ){
        return bookmarksCollection
                .create( newBookmark )
                .then( createdBookmark => {
                    return createdBookmark;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getBookmarksByTitle : function (bookmark){
        return bookmarksCollection
            .find({title:bookmark})
            .then(result => {

                if(result.length>=1){
                    return result;
                }
                else{
                    throw new Error();
                }
            })
            .catch( err => {
                throw new Error( err );
            });
    },
    deleteBookmark : function(idDelete){
        return bookmarksCollection
            .findOneAndDelete({id:idDelete})
            .then(result =>{
                console.log("result", result);
                if(result==null){
                    throw new Error();
                }
            })
            .catch( err => {
                throw new Error( err );
            });
    },
    patchBookmark : function(idPatch,title,description,url,rating){
        return bookmarksCollection
        .findOne({id:idPatch})
        .then( result =>{
            console.log("result", result);
            if(title){
                result.title = title;
            }
            if (description) {
                result.description = description;
            }
        
            if (url) {
                result.url = url;
            }
        
            if (rating) {
                result.rating = Number(rating);
            }
            result.save();
            return result;
        })
        .catch( err => {
            throw new Error( err );
        });

    }
}

module.exports = { Bookmarks };


VotesCollection.allow({
    insert: function (userId, vote) {
        return userId && vote.checkOwnership();
    },
    remove: function (userId, vote) {
        return userId && vote.checkOwnership();
    }
});

VotesCollection.before.insert(function(userId, vote){
    var currentVote = VotesCollection.findOne({userId:userId, linkedObjectId:vote.linkedObjectId});
    if(currentVote){
        if(vote.direction !== currentVote.direction){
            currentVote.update({$set:{direction:vote.direction}});
            return false;
        }else{
            return false;
        }
    }
});

VotesCollection.after.update(function (userId, vote) {
    var collection = LinkableModel.getCollectionForRegisteredType(vote.objectType);

    userId && collection && collection.update(vote.linkedObjectId, {$inc:{_voteScore:vote.direction*2}});
}, {fetchPrevious:false});

VotesCollection.after.insert(function (userId, vote) {
    var collection = LinkableModel.getCollectionForRegisteredType(vote.objectType);

    userId && collection && collection.update(vote.linkedObjectId, {$inc:{_voteScore:vote.direction}});
});

VotesCollection.after.remove(function (userId, vote) {
    var collection = LinkableModel.getCollectionForRegisteredType(vote.objectType);
    userId && collection && collection.update(vote.linkedObjectId, {$inc:{_voteScore:-vote.direction}});
});

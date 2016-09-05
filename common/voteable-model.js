
VoteableModel = {};

VoteableModel.makeVoteable = function(model, type) {
    if(model.appendSchema && type){
        model.appendSchema(VoteableSchema);
        LinkableModel.registerLinkableType(model, type);
        _.extend(model.prototype, voteableMethods);
    }else {
        throw new Meteor.Error("makeVoteableFailed", "Could not make model voteable. Please make sure you passed in a model and type");
    }
};

var voteableMethods = {
    /**
     * up vote on the model
     */
    upVote: function () {
        var type = this._objectType;
        new Vote({direction:1, linkedObjectId:this._id, userId:Meteor.userId(), objectType:type}).save();
    },

    /**
     * Down vote on the model
     */
    downVote: function () {
        var type = this._objectType;
        new Vote({direction:-1, linkedObjectId:this._id, userId:Meteor.userId(), objectType:type}).save();
    },

    /**
     * Get all the votes for the model
     * @returns {Mongo.Cursor} A mongo cursor which returns Like instances
     */
    votes: function () {
        return VotesCollection.find({linkedObjectId:this._id});
    },

    /**
     * Get the score total for all the votes
     * @returns {Number} The vote score
     */
    voteScore: function() {
        return this._voteScore || 0;
    }
};

//a schema which can be attached to other voteable types
//if you extend a model with VoteableModel you will need to
//attach this schema to it's collection as well.
var VoteableSchema = new SimpleSchema({
    _voteScore: {
        type:Number,
        defaultValue:0,
        custom: SimpleSchema.denyUntrusted
    }
});

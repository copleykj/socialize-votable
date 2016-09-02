/**
 * A model of a vote which is connected to another database object
 * @class Vote
 */
Vote = BaseModel.extendAndSetupCollection("votes");

LinkableModel.makeLinkable(Vote);

/**
 * Get the User instance of the account which created the vote
 * @returns {User} The user who created the vote
 */
Vote.prototype.user = function () {
    return Meteor.users.findOne(this.userId);
};

/**
 * Check if the user has already voted on the linked object
 * @returns {[[Type]]} [[Description]]
 */
Vote.prototype.isDuplicate = function () {
    return !!VotesCollection.findOne({userId:this.userId, linkedObjectId:this.linkedObjectId});
};

VotesCollection = Vote.collection;

//create the schema for a vote
Vote.appendSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert){
                return Meteor.userId();
            }
        },
        denyUpdate:true
    },
    "date":{
        type:Date,
        autoValue:function() {
            return new Date();
        }
    },
    "direction": {
        type: Number,
        allowedValues:[1, -1]
    }
});

Vote.appendSchema(LinkableModel.LinkableSchema);

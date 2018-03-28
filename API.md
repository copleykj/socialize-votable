# VoteableModel #

VoteableModel is used to add upvote/downvote behaviors to a model that is built on Socialize's `BaseModel` class. To make a model voteable you just need to extend VoteableModel and pass in the LinkParent class in a mixin pattern.

```javascript
class Thing extends VoteableModel(LinkParent){
    //instance methods here
}
```

This pattern is useful when you want to implement several behaviors such as both Voteable and Commentable

```javascript
class Thing extends VoteableModel(CommentableModel(LinkParent)){
    //instance methods here
}
```

## Instance Methods ##

**upVote()** - Add an upvote from the current user to the model.

**downVote()** - Add a downvote from the current user to the model.

**unVote()** - Remove the vote from the current user on the model.

**votes(options = {})** - Get the votes connected to the model.

**isVotedOnBy(userId = Meteor.userId())** - Check if a user has voted on the model by passing a userId; otherwise the currently logged in user is used.

**isUpVotedBy(userId = Meteor.userId())** - Check if a user has upvoted the model by passing a userId; otherwise the currently logged in user is used.

**isDownVotedBy(userId = Meteor.userId())** - Check if a user has upvoted the model by passing a userId; otherwise the currently logged in user is used.

# Vote Extends [LinkableModel](https://github.com/copleykj/socialize-linkable-model)#

A vote is a record of a user voting on an instance of a model with a reference to that instance. Extending `LinkableModel` allows for the retrieval of the model for which the vote was cast.

```javascript
//We can get the model that was voted on by the linkedParent() method inherited from LinkableModel
VotesCollection.findOne().linkedParent();
```

## Instance Methods ##

**user()** - Returns the user instance for the user that placed the vote.

**isDuplicate()** - Checks to see if there is already a vote on the linkedParent by the current user.

## Publications ##

**socialize.votesFor(linkedObjectId, options = { limit: 10, sort: { createdAt: -1 } })** - Publishes the votes and their related user data for a certain object.

```javascript
Meteor.subscribe('socialize.votesFor', post._id, { limit: 5, skip: 2 });
```

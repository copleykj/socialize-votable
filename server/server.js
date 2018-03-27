/* eslint-disable import/no-unresolved */
import { LinkableModel } from 'meteor/socialize:linkable-model';
/* eslint-enable import/no-unresolved */

import { VotesCollection } from '../common/vote-model';

VotesCollection.allow({
    insert(userId, vote) {
        return userId && vote.checkOwnership();
    },
    remove(userId, vote) {
        return userId && vote.checkOwnership();
    },
});

VotesCollection.before.insert(function beforeInsert(userId, vote) {
    const currentVote = VotesCollection.findOne({ userId, linkedObjectId: vote.linkedObjectId });
    if (currentVote) {
        if (vote.direction !== currentVote.direction) {
            currentVote.update({ $set: { direction: vote.direction } });
            return false;
        }
        return false;
    }
    return undefined;
});

VotesCollection.after.update(function afterUpdate(userId, vote) {
    const collection = LinkableModel.getCollectionForRegisteredType(vote.objectType);

    userId && collection && collection.update(vote.linkedObjectId, { $inc: { _voteScore: vote.direction * 2 } });
}, { fetchPrevious: false });

VotesCollection.after.insert(function afterInsert(userId, vote) {
    const collection = LinkableModel.getCollectionForRegisteredType(vote.objectType);

    userId && collection && collection.update(vote.linkedObjectId, { $inc: { _voteScore: vote.direction } });
});

VotesCollection.after.remove(function afterRemove(userId, vote) {
    const collection = LinkableModel.getCollectionForRegisteredType(vote.objectType);
    userId && collection && collection.update(vote.linkedObjectId, { $inc: { _voteScore: -vote.direction } });
});

import { Vote, VotableModel, VotesCollection } from '../common/common';
import './publications.js';

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
    const collection = this.transform().getCollectionForParentLink(vote.objectType);

    userId && collection && collection.update(vote.linkedObjectId, { $inc: { voteScore: vote.direction * 2 } });
}, { fetchPrevious: false });

VotesCollection.after.insert(function afterInsert(userId, vote) {
    const collection = this.transform().getCollectionForParentLink(vote.objectType);

    userId && collection && collection.update(vote.linkedObjectId, { $inc: { voteScore: vote.direction } });
});

VotesCollection.after.remove(function afterRemove(userId, vote) {
    const collection = this.transform().getCollectionForParentLink(vote.objectType);
    userId && collection && collection.update(vote.linkedObjectId, { $inc: { voteScore: -vote.direction } });
});

export { Vote, VotableModel, VotesCollection };

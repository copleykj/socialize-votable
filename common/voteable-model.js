/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { LinkParent } from 'meteor/socialize:linkable-model';
import SimpleSchema from 'simpl-schema';

import { Vote, VotesCollection } from './vote-model.js';

/**
 * An Abstract class to implement votable behavior in a model
 * @param {class} Base The class to recieve the votable behavior
 */
export const VoteableModel = Base => class extends Base { // eslint-disable-line
    constructor(document) {
        super(document);
        if (!(this instanceof LinkParent)) {
            throw new Meteor.Error('MustExtendParentLink', 'LikeableModel must extend LinkParent from socialize:linkable-model');
        }
    }
    /**
     * up vote on the model
     * @method VotableModel.upVote
     * @return {undefined}
     */
    upVote() {
        const linkObject = this.getLinkObject();
        new Vote({ direction: 1, ...linkObject }).save();
    }

    /**
     * Down vote on the model
     * @method VotableModel.downVote
     * @return {undefined}
     */
    downVote() {
        const linkObject = this.getLinkObject();
        new Vote({ direction: -1, ...linkObject }).save();
    }

    /**
     * Remove a vote from the model
     * @method VotableModel.unVote
     * @return {undefined}
     */
    unVote() {
        const linkObject = this.getLinkObject();
        VotesCollection.remove({ userId: Meteor.userId(), ...linkObject });
    }

    /**
     * Get the votes for an instance of VoteableModel
     * @method VoteableModel.votes
     * @param  {Object} [options={}] Options to pass to the Cursor
     * @return {Vote}              [
     */
    votes(options = {}) {
        return VotesCollection.find(this.getLinkObject(), options);
    }

    /**
     * Check if a user has voted on an instance of VotableModel
     * @method VoteableModel.isVotedOnBy
     * @param  {[type]}  user [description]
     * @return {Boolean}      [description]
     */
    isVotedOnBy(userId = Meteor.userId()) {
        return VotesCollection.findOne({ userId, ...this.getLinkObject() });
    }

    /**
     * Check if a user has up voted an instance of VotableModel
     * @method VoteableModel.isUpVotedBy
     * @param  {User}  user [description]
     * @return {Boolean}      [description]
     */
    isUpVotedBy(userId = Meteor.userId()) {
        return VotesCollection.findOne({ userId, direction: 1, ...this.getLinkObject() });
    }

    /**
     * Check if a user has down voted an instance of VotableModel
     * @param  {[type]}  user [description]
     * @return {Boolean}      [description]
     */
    isDownVotedBy(userId = Meteor.userId()) {
        return VotesCollection.findOne({ userId, direction: -1, ...this.getLinkObject() });
    }
};


// a schema which can be attached to other voteable types
// if you extend a model with VoteableModel you will need to
// attach this schema to it's collection as well.
VoteableModel.VoteableSchema = new SimpleSchema({
    voteScore: {
        type: Number,
        defaultValue: 0,
        custom: SimpleSchema.denyUntrusted,
    },
});

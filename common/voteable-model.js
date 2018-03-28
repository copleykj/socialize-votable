/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { LinkParent } from 'meteor/socialize:linkable-model';
import SimpleSchema from 'simpl-schema';

import { Vote, VotesCollection } from './vote-model.js';

export const VoteableModel = Base => class extends Base { // eslint-disable-line
    constructor(document) {
        super(document);
        if (!(this instanceof LinkParent)) {
            throw new Meteor.Error('MustExtendParentLink', 'LikeableModel must extend LinkParent from socialize:linkable-model');
        }
    }
    /**
     * up vote on the model
     */
    upVote() {
        const linkObject = this.getLinkObject();
        new Vote({ direction: 1, ...linkObject }).save();
    }

    /**
     * Down vote on the model
     */
    downVote() {
        const linkObject = this.getLinkObject();
        new Vote({ direction: -1, ...linkObject }).save();
    }

    /**
     * Remove a vote from the model
     */
    unVote() {
        const linkObject = this.getLinkObject();
        VotesCollection.remove({ userId: Meteor.userId(), ...linkObject });
    }

    /**
     * Get the votes for an instance of VoteableModel
     * @param  {Object} [options={}] Options to pass to the Cursor
     * @return {Vote}              [
     */
    votes(options = {}) {
        return VotesCollection.find(this.getLinkObject(), options);
    }

    /**
     * Check if a user has voted on an instance of VotableModel
     * @param  {[type]}  user [description]
     * @return {Boolean}      [description]
     */
    isVotedOnBy(user) {
        return VotesCollection.findOne({ userId: user._id, ...this.getLinkObject() });
    }

    /**
     * Check if a user has up voted an instance of VotableModel
     * @param  {[type]}  user [description]
     * @return {Boolean}      [description]
     */
    isUpVotedBy(user) {
        return VotesCollection.findOne({ userId: user._id, direction: 1, ...this.getLinkObject() });
    }

    /**
     * Check if a user has down voted an instance of VotableModel
     * @param  {[type]}  user [description]
     * @return {Boolean}      [description]
     */
    isDownVotedBy(user) {
        return VotesCollection.findOne({ userId: user._id, direction: 1, ...this.getLinkObject() });
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

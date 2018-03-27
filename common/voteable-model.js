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
     * Get all the votes for the model
     * @returns {Mongo.Cursor} A mongo cursor which returns Like instances
     */
    votes() {
        return VotesCollection.find(this.getLinkObject());
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

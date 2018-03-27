/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { BaseModel } from 'meteor/socialize:base-model';
import { LinkableModel } from 'meteor/socialize:linkable-model';
import SimpleSchema from 'simpl-schema';
/* eslint-enable import/no-unresolved */

export const VotesCollection = new Mongo.Collection('socialize:votes');

if (VotesCollection.configureRedisOplog) {
    VotesCollection.configureRedisOplog({
        mutation(options, { selector, doc }) {
            let linkedObjectId = (selector && selector.linkedObjectId) || (doc && doc.linkedObjectId);

            if (!linkedObjectId && selector._id) {
                const vote = VotesCollection.findOne({ _id: selector._id }, { fields: { linkedObjectId: 1 } });
                linkedObjectId = vote && vote.linkedObjectId;
            }

            if (linkedObjectId) {
                Object.assign(options, {
                    namespace: linkedObjectId,
                });
            }
        },
        cursor(options, selector) {
            if (selector.linkedObjectId) {
                Object.assign(options, {
                    namespace: selector.linkedObjectId,
                });
            }
        },
    });
}

/**
 * A representation of a vote record
 * @extends LinkableModel
 */
export class Vote extends LinkableModel(BaseModel) {
    /**
     * Get the user who voted on the linked objectType
     * @return {user} The user instance that voted
     */
    user() {
        return Meteor.users.findOne(this.userId);
    }
    /**
     * Check if the user has already voted on the linked object
     * @return {Boolean} [description]
     */
    isDuplicate() {
        return !!VotesCollection.findOne({ userId: this.userId, linkedObjectId: this.linkedObjectId });
    }
}

// attach the votes collection
Vote.attachCollection(VotesCollection);

// create the schema for a vote
export const VoteSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue() {
            if (this.isInsert) {
                return this.userId;
            }
            return undefined;
        },
        denyUpdate: true,
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) {
                return new Date();
            }
            return undefined;
        },
        denyUpdate: true,
    },
    direction: {
        type: Number,
        allowedValues: [1, -1],
    },
});

Vote.attachSchema(VoteSchema);

Vote.attachSchema(LinkableModel.LinkableSchema);

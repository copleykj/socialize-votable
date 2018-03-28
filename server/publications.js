/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { User } from 'meteor/socialize:user-model';

import { VotesCollection } from '../common/vote-model.js';


const optionsArgumentCheck = {
    limit: Match.Optional(Number),
    skip: Match.Optional(Number),
    sort: Match.Optional(Object),
};


publishComposite('socialize.votesFor', function publishCommentsFor(linkedObjectId, options = { limit: 10, sort: { createdAt: -1 } }) {
    check(linkedObjectId, String);
    check(options, optionsArgumentCheck);
    if (this.userId) {
        const currentUser = User.createEmpty(this.userId);
        const blockedUserIds = currentUser.blockedUserIds();
        const blockedByUserIds = currentUser.blockedByUserIds();
        const blockIds = [...blockedUserIds, ...blockedByUserIds];

        return {
            find() {
                return VotesCollection.find({ linkedObjectId, userId: { $nin: blockIds } }, options);
            },
            children: [
                {
                    find(vote) {
                        return Meteor.users.find({ _id: vote.userId });
                    },
                },
            ],
        };
    }
    return this.ready();
});

# Voteable

This package enables the creation of models that can be up/down voted. For example you may want users to be able to vote on photos, posts, or any number of other things that you wish to model. Rather than maintaining a collection for votes on photos and a collection for votes on posts, we can implement VoteableModel on our `Post` and `Photo` models and then use it's new methods to store and retrieve votes and information about them, linked to these models.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->
- [Supporting The Project](#supporting-the-project)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Scalability - Redis Oplog](#scalability---redis-oplog)
<!-- /TOC -->

## Supporting The Project

Finding the time to maintain FOSS projects can be quite difficult. I am myself responsible for over 30 personal projects across 2 platforms, as well as Multiple others maintained by the [Meteor Community Packages](https://github.com/meteor-community-packages) organization. Therfore, if you appreciate my work, I ask that you either sponsor my work through GitHub, or donate via Paypal or Patreon. Every dollar helps give cause for spending my free time fielding issues, feature requests, pull requests and releasing updates. Info can be found in the "Sponsor this project" section of the [GitHub Repo](https://github.com/copleykj/socialize-voteable)

## Installation

This package relies on the npm package `simpl-schema` so you will need to make sure it is installed as well.

```shell
meteor npm install --save simpl-schema
meteor add socialize:voteable
```

## Basic Usage

```javascript
import { Mongo } from 'meteor/mongo';
import { VoteableModel } from 'meteor/socialize:voteable';
import { LinkParent, LinkableModel } from 'meteor/socialize:linkable';
import SimpleSchema from 'simpl-schema';

//define the collection to hold photos
const PhotosCollection = new Mongo.Collection("photos");

//define the schema for a photo
const PhotosSchema = new SimpleSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert){
                return this.userId;
            }
        },
        denyUpdate:true
    },
    "createdAt":{
        type:Date,
        autoValue:function() {
            if(this.isInsert){
                return new Date();
            }
        },
        denyUpdate:true
    }
    //actual schema truncated for brevity
});

//Create a product class extending VoteableModel and LinkParent
class Photo extends VoteableModel(LinkParent) {
    //methods here
}

//Attach the collection to the model so we can use BaseModel's CRUD methods
Photo.attachCollection(PhotosCollection);

Photo.attachSchema(PhotosSchema);
Photo.attachSchema(VoteableModel.VoteableSchema);

//Register the Model as a potential Parent of a VoteableModel
LinkableModel.registerParentModel(Photo);


//Create a new photo and save it to the database using BaseModel's save method.
const newPhoto = new Photo({caption:"Meteor Camp 2016!", cloudinaryId:"sL0Jbf3gBaoeubs3G822WQqwp"}).save();

//get the data for the newly created photo since it won't be available on the client other wise
Meteor.subscribe("photoInfo", newPhoto._id);

//up vote the photo by the current user. The photos voteScore property will be incremented to reflect this.
newPhoto.upVote();

//down vote the photo by the current user, The photo's voteScore property will be decremented to reflect this.
newPhoto.downVote();

//remove the vote by the current user. The photos voteScore property will be incremented or decremented accordingly
newPhoto.unVote();

```

For a more in depth explanation of how to use this package see [API.md](API.md)

## Scalability - Redis Oplog

This package contains a preliminary implementation of [cultofcoders:redis-oplog][1]'s namespaces to provide reactive scalability as an alternative to Meteor's `livedata`. Use of redis-oplog is not required and will not engage until you install the [cultofcoders:redis-oplog][1] package and configure it.

Due to the preliminary nature of this implementation, you may run into minor issues. Please report any issues you find to GitHub so that they can be fixed.

[1]:https://github.com/cultofcoders/redis-oplog

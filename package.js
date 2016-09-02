Package.describe({
    name: "socialize:voteable",
    summary: "A package for implementing social up/down style voting",
    version: "0.1.0",
    git: "https://github.com/copleykj/socialize-voteable.git"
});

Package.onUse(function(api) {
    api.versionsFrom("1.0.2.1");

    api.use("socialize:linkable-model@0.3.0");

    api.imply("socialize:linkable-model");

    api.addFiles("common/voteable-model.js");
    api.addFiles("common/vote-model.js");
    api.addFiles("server/server.js", "server");


    api.export(["VoteableModel", "Vote"]);
});

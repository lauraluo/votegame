// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })

'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// exports.countGamersVotes = gameStatisticsRef.onWrite(event => {
//     var key = event.data.ref.parent().key;
//     console.log(event.data.ref.parent());
//     console.log(event.data.ref.parent().key);
//     return gameOrderlistRef.child(key + '/totalVotesCount').set(event.data.numChildren());
// });

// exports.thumbnailProfile = functions.database.ref('/profiles/{userID}')
//     .onWrite(event => {
//         var data = event.data;
//         if (!data.changed('profilePicture')) {
//             return;
//         }
//         return createThumbnail(data.child('profilePicture').val()).then(function (url) {
//             return data.ref.update({
//                 profileThumbnail: url
//             });
//         });
//     });

exports.countGamersVotes = functions.database.ref('/statistics/{voteID}')
    .onWrite(event => {
        var voteID = event.params.voteID;

        console.log('count total vote of ID:' + event.params.voteID);

        return event.data.ref.parent.parent.child('orderlist/' + voteID + '/totalVotesCount').set(event.data.numChildren());
    });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase);

exports.AddComment = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const threadId = req.body.threadId;
        const comment = req.body.comment;
        const username = req.body.username;
        const dateTime = Date.now();
        admin.firestore().collection('comments').doc(threadId).collection('comments')
        .add({
            comment: comment,
            username: username,
            updateTime: dateTime,
        }).catch((e) => {
            console.error(e)
        });
        const threadRef = admin.firestore().collection('threads').doc(threadId);
        threadRef.get().then((t) => {
            return threadRef.update({
                updateTime: dateTime,
                count: t.data().count + 1,
            }).catch((e) => {
                console.error(e)
            });
        }).catch((e) => {
            console.error(e)
        });
        res.send({result: 'Success!'});
    });
  });

exports.CreateThread = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const name = req.body.name;
        const comment = req.body.comment;
        const username = req.body.username;
        admin.firestore().collection('threads')
        .add({
            name: name,
            comment: comment,
            username: username,
            updateTime: Date.now(),
            count: 0,
        }).catch((e) => {
            console.error(e)
        });
        res.send({result: 'Success!'});
    });
  });

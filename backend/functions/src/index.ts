import * as admin from "firebase-admin";
import {onRequest} from "firebase-functions/v2/https";
import {joinGroup} from "./webapp/joinGroup";
import {leaveGroup} from "./webapp/leaveGroup";

admin.initializeApp();

const db = admin.firestore();

exports.joinGroup = onRequest((req, res) => joinGroup(db, req, res));
exports.leaveGroup = onRequest((req, res) => leaveGroup(db, req, res));

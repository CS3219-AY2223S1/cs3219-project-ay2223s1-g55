import {
  ormCreateMessage as _createMessage,
  ormFetchAllMessages as _fetchAllMessages,
  ormCheckSessionExists as _checkSessionExists,
} from "../model/message-orm.js";

export async function createMessage(req, res) {
  try {
    const {sessionId, senderName, senderId, message} = req.body;
    if ((sessionId, senderName, senderId, message)) {
      const resp = await _createMessage(
        sessionId,
        senderName,
        senderId,
        message
      );
      console.log(resp);
      if (resp.err) {
        return res.status(400).json({
          message: "Could not create a new message!",
        });
      } else {
        console.log(
          `Created new message from user ${senderName} successfully!`
        );
        return res.status(201).json({
          message: `Created new message for user ${senderName} successfully!`,
          data: resp,
        });
      }
    } else {
      return res.status(400).json({
        message: "sessionId or senderName, senderId, message are missing!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Database failure when creating new message from user!",
    });
  }
}

export async function fetchAllMessages(req, res) {
  try {
    // const sessionId = req.query.sessionId;
    const sessionId = req.params.sessionId;
    console.log("session id is", sessionId);
    if (sessionId) {
      const resp = await _fetchAllMessages(sessionId);
      const firstMessage = resp[0];
      // var firstMessageTime = localDateTime(firstMessage.createdAt.);
      var currentTime = new Date(Date.now() + 480 * 60000);
      console.log("current time is", currentTime);
      // console.log("first message time is ", firstMessageTime);
      // console.log(resp);
      if (resp.err) {
        return res.status(400).json({message: "Could not fetch all messages!"});
      } else {
        console.log(`Fetched all messages successfully!`);
        return res.status(200).json({
          message: `Fetched all messages successfully!`,
          messages: resp,
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Database failure when fetching all messages!",
    });
  }
}

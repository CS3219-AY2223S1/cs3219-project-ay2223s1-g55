import {
  createMessage,
  fetchAllMessages,
  checkSessionExists,
} from "./repository.js";

export async function ormCreateMessage(
  sessionId,
  senderName,
  senderId,
  message
) {
  try {
    const newMessage = await createMessage({
      sessionId: sessionId,
      senderName: senderName,
      senderId: senderId,
      message: message,
    });
    newMessage.save();
    console.log("ormCreateMessage: ", newMessage);
    return newMessage;
  } catch (err) {
    console.log("ERROR: Could not create new message");
    return {err};
  }
}

export async function ormCheckSessionExists(sessionId) {
  try {
    const sessionFound = await checkSessionExists({
      sessionId: sessionId,
    });
    console.log("sessionFound:", sessionFound);
    return sessionFound;
  } catch (err) {
    console.log("ERROR: Error occured when finding session");
    return {err};
  }
}

export async function ormFetchAllMessages(sessionId) {
  try {
    const foundMessages = await fetchAllMessages({
      sessionId: sessionId,
    });
    return foundMessages;
  } catch (err) {
    console.log("ERROR: Could not fetch all messages");
    return {err};
  }
}

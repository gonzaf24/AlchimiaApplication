const firebaseApp = require("firebase/app");

import { format } from "date-fns";
import { es } from "date-fns/locale";

export async function obtenerChats(email) {
  const emailEdited = email.replace(".", ",");
  firebaseApp
    .database()
    .ref("/chats/" + emailEdited)
    .on("value", (snapshot) => {
      return snapshot.val();
    });
}

export async function newChat(email, userUID, seen) {
  try {
    const emailEdited = email.replace(".", ",");
    const timestampDate = new Date().getTime();
    await firebaseApp
      .database()
      .ref("/chats/" + emailEdited)
      .child(userUID)
      .set({
        uid: userUID,
        timestamp: timestampDate,
        seen: seen,
      });
  } catch (error) {
    console.log("error newChat" + error);
    return error;
  }
}

export async function seen(email, userUID, timestamp, seen) {
  try {
    const emailEdited = email.replace(".", ",");
    await firebaseApp
      .database()
      .ref("/chats/" + emailEdited)
      .child(userUID)
      .set({
        uid: userUID,
        timestamp: timestamp,
        seen: seen,
      });
  } catch (error) {
    console.log("error seen" + error);
    return error;
  }
}

export function obtenerConversationsOnLine(conversationKey) {
  try {
    firebaseApp
      .database()
      .ref("/conversations/" + conversationKey)
      .on("child_added", function (snapshot) {
        return snapshot.val();
      });
  } catch (error) {
    console.log("error obtenerConversationsOnLine" + error);
    return error;
  }
}

export async function obtenerConversationsOnce(conversationKey) {
  try {
    let listaChat = [];
    await firebaseApp
      .database()
      .ref("/conversations/" + conversationKey)
      .once("value", (snapshot) => {
        snapshot.forEach((child) => {
          listaChat.push(child.val());
        });
      });
    return listaChat;
  } catch (error) {
    console.log("error obtenerConversationsOnce" + error);
    return error;
  }
}

export async function obtenerUltimaConversationsOnce(conversationKey) {
  try {
    return await firebaseApp
      .database()
      .ref("/conversations/" + conversationKey)
      .orderByKey()
      .limitToLast(1)
      .once("value", (child) => {
        child.forEach((childSnapshot) => {
          return childSnapshot.val();
        });
      });
  } catch (error) {
    console.log("error obtenerUltimaConversationsOnce" + error);
    return error;
  }
}

export async function obtenerChatsOnce(email, uid) {
  try {
    const emailEdited = email.replace(".", ",");
    let salida = [];
    let listaChat = [];
    await firebaseApp
      .database()
      .ref("/chats/" + emailEdited)
      .once("value", function (snapshot) {
        snapshot.forEach((childSnapshot) => {
          var chat = {
            timestamp: childSnapshot.val().timestamp,
            uid: childSnapshot.val().uid,
            seen: childSnapshot.val().seen,
          };
          listaChat.push(chat);
        });
      });
    await listaChat.reduce(async (promise, elemento) => {
      await promise;
      var user = await findById(elemento.uid);
      const conversationKey = [elemento.uid, uid].sort().join("|");
      var lastMessage = await obtenerUltimaConversationsOnce(conversationKey);
      const dateObject = new Date(elemento.timestamp);
      const fecha = format(dateObject, "dd/MM/yyyy", { locale: es });
      const timeString = `${fecha}-${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;
      lastMessage.forEach((msg) => {
        var chat = {
          timestamp: elemento.timestamp,
          nombre: user.nombre,
          apellido: user.apellido,
          uid: user.uid,
          avatar: user.avatar,
          message: msg.val().message,
          horaPrev: timeString,
          seen: elemento.seen,
          email: user.email,
        };
        salida.push(chat);
      });
    }, Promise.resolve());

    await salida.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    return salida;
  } catch (error) {
    console.log("error obtenerChatsOnce : " + error);
    return error;
  }
}

export async function obtenerCountNotSeen(email) {
  try {
    const emailEdited = email.replace(".", ",");
    let count = 0;
    await firebaseApp
      .database()
      .ref("/chats/" + emailEdited)
      .once("value", function (snapshot) {
        snapshot.forEach((childSnapshot) => {
          if (!childSnapshot.val().seen) {
            count++;
          }
        });
      });
    return count;
  } catch (error) {
    console.log("error obtenerCountNotSeen : " + error);
    return error;
  }
}

async function findById(uid) {
  try {
    return await firebaseApp
      .database()
      .ref("/usuarios/" + uid)
      .once("value")
      .then((snapshot) => {
        return snapshot.val();
      });
  } catch (error) {
    return error;
  }
}

export function obtenerConversations(conversationKey) {
  try {
    let listaChat = [];
    firebaseApp
      .database()
      .ref("/conversations/" + conversationKey)
      .on("value", (snapshot) => {
        snapshot.forEach((child) => {
          listaChat.push(child.val());
        });
      });
    return listaChat;
  } catch (error) {
    console.log("error obtenerConversations" + error);
    return error;
  }
}

export async function newConversation(conversationKey, conversation) {
  try {
    const timestampDate = new Date().getTime();
    var conversationA = {
      ...conversation,
      timestamp: timestampDate,
    };
    firebaseApp
      .database()
      .ref("conversations/" + conversationKey + "/" + timestampDate)
      .set(conversationA);
  } catch (error) {
    console.log("error newConversation" + error);
    return error;
  }
}

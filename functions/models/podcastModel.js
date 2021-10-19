/* eslint-disable promise/no-nesting */
const firebaseApp = require("firebase/app");
const userModel = require("./userModel");

async function findPodcastsByEmail(email) {
  try {
    var salida = [];
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("/podcasts/" + emailEdited)
      .orderByChild("fechaCreacion")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          salida.push(child.val());
        });
        return salida;
      });
  } catch (error) {
    console.log("findPodcastsByEmail" + error);
    return error;
  }
}

async function findPodcastByUID(email, uid) {
  try {
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("/podcasts/" + emailEdited + "/" + uid + "/")
      .once("value")
      .then((snapshot) => {
        return snapshot.val();
      });
  } catch (error) {
    console.log("findPodcastByUID" + error);
    return error;
  }
}

async function findPodcastByKEY(email, key) {
  const emailEdited = email.replace(".", ",");
  await firebaseApp
    .database()
    .ref("/podcasts/" + emailEdited)
    .key(key)
    .then((snapshot) => {
      return snapshot.val();
    });
}

async function newPodcast(podcast, email) {
  try {
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("podcasts/" + emailEdited)
      .child(podcast.uid)
      .set(podcast);
  } catch (error) {
    console.log("newPodcast" + error);
    return error;
  }
}

async function editPodcast(email, podcast) {
  try {
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("podcasts/" + emailEdited)
      .child(podcasts.uid)
      .set(podcasts);
  } catch (error) {
    console.log("editPodcast" + error);
    return error;
  }
}

async function deletePodcast(email, uid) {
  try {
    const emailEdited = email.replace(".", ",");
    await firebaseApp
      .database()
      .ref("podcasts/" + emailEdited)
      .child(uid)
      .remove();
  } catch (error) {
    console.log("deletePodcast" + error);
    return error;
  }
  return "ok";
}

async function allWall(userId) {
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);
  const rootRef = firebaseApp.database().ref();
  const post = rootRef.child("podcasts").orderByChild("fechaCreacion");
  let salida = [];
  let podcasts = [];
  await post.once("value", (snap) => {
    snap.forEach((childSnapshot) => {
      childSnapshot.forEach((child) => {
        var fechaC = child.val().fechaCreacion;
        const fechaCra = new Date(fechaC);
        const uidUser = child.key.substring(0, child.key.lastIndexOf("|"));
        if (fechaCra >= startDate) {
          podcast = {
            uid: child.val().uid,
            fechaCreacion: child.val().fechaCreacion,
            autor: child.val().autor,
            titulo: child.val().titulo,
            audio: child.val().audio,
            contenido: child.val().contenido,
            fotoPortada: child.val().fotoPortada,
            type: "podcast",
            likes: child.val().likes,
            email: childSnapshot.key,
          };
          podcast.likes.splice(podcast.likes.indexOf(uidUser), 1);
          podcasts.push(podcast);
        }
      });
    });
  });

  await podcasts.reduce(async (promise, podcast) => {
    await promise;
    const uidUser = podcast.uid.substring(0, podcast.uid.lastIndexOf("|"));
    var usuarioOwner = await userModel.findById(uidUser);
    var meGusta = await podcast.likes.includes(userId);
    var largoLikes = await podcast.likes.length;
    podcast = {
      ...podcast,
      avatar: usuarioOwner.avatar,
      nombre: usuarioOwner.nombre,
      apellido: usuarioOwner.apellido,
      likes: largoLikes,
      like: meGusta,
    };
    salida.push(podcast);
  }, Promise.resolve());

  return salida;
}

async function searchWall(userId, pais, estadoCiudad, profesion) {
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);
  const rootRef = firebaseApp.database().ref();
  const post = rootRef.child("podcasts").orderByChild("fechaCreacion");
  let salida = [];
  let podcasts = [];
  await post.once("value", (snap) => {
    snap.forEach((childSnapshot) => {
      childSnapshot.forEach((child) => {
        var fechaC = child.val().fechaCreacion;
        const fechaCra = new Date(fechaC);
        const uidUser = child.key.substring(0, child.key.lastIndexOf("|"));
        if (fechaCra >= startDate) {
          podcast = {
            uid: child.val().uid,
            fechaCreacion: child.val().fechaCreacion,
            autor: child.val().autor,
            titulo: child.val().titulo,
            audio: child.val().audio,
            contenido: child.val().contenido,
            fotoPortada: child.val().fotoPortada,
            type: "podcast",
            likes: child.val().likes,
            email: childSnapshot.key,
          };
          podcast.likes.splice(podcast.likes.indexOf(uidUser), 1);
          podcasts.push(podcast);
        }
      });
    });
  });

  await podcasts.reduce(async (promise, podcast) => {
    await promise;
    const uidUser = podcast.uid.substring(0, podcast.uid.lastIndexOf("|"));
    var usuarioOwner = await userModel.findById(uidUser);
    var meGusta = await podcast.likes.includes(userId);
    var largoLikes = await podcast.likes.length;
    podcast = {
      ...podcast,
      avatar: usuarioOwner.avatar,
      nombre: usuarioOwner.nombre,
      apellido: usuarioOwner.apellido,
      likes: largoLikes,
      like: meGusta,
    };
    if (estadoCiudad && profesion) {
      if (
        usuarioOwner.estadoCiudad === estadoCiudad &&
        usuarioOwner.profesiones &&
        usuarioOwner.profesiones.includes(profesion)
      ) {
        salida.push(podcast);
      }
    } else if (estadoCiudad && !profesion) {
      if (usuarioOwner.estadoCiudad === estadoCiudad) {
        salida.push(podcast);
      }
    } else if (profesion && !estadoCiudad) {
      if (
        usuarioOwner.profesiones &&
        usuarioOwner.profesiones.includes(profesion)
      ) {
        salida.push(podcast);
      }
    } else if (pais && !estadoCiudad && !profesion) {
      if (usuarioOwner.pais === pais) {
        salida.push(podcast);
      }
    }
  }, Promise.resolve());

  return salida;
}

module.exports = {
  findPodcastsByEmail,
  findPodcastByUID,
  findPodcastByKEY,
  newPodcast,
  editPodcast,
  deletePodcast,
  allWall,
  searchWall,
};

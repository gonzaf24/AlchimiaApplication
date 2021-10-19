const firebaseApp = require("firebase/app");
const userModel = require("./userModel");
const { user } = require("firebase-functions/lib/providers/auth");

async function findAlbumByEmail(email) {
  try {
    var salida = [];
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("/albums/" + emailEdited)
      .orderByChild("fechaCreacion")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          salida.push(child.val());
        });
        return salida;
      });
  } catch (error) {
    console.log("findAlbumByEmail" + error);
    return error;
  }
}

async function findAlbumByUID(email, uid) {
  try {
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("/albums/" + emailEdited + "/" + uid + "/")
      .once("value")
      .then((snapshot) => {
        return snapshot.val();
      });
  } catch (error) {
    console.log("findAlbumByUID" + error);
    return error;
  }
}

async function findAlbumByKEY(email, key) {
  const emailEdited = email.replace(".", ",");
  await firebaseApp
    .database()
    .ref("/albums/" + emailEdited)
    .key(key)
    .then((snapshot) => {
      return snapshot.val();
    });
}

async function newAlbum(album, email) {
  try {
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("albums/" + emailEdited)
      .child(album.uid)
      .set(album);
  } catch (error) {
    console.log("newAlbum" + error);
    return error;
  }
}

async function editAlbum(email, album) {
  try {
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("albums/" + emailEdited)
      .child(album.uid)
      .set(album);
  } catch (error) {
    console.log("editAlbum" + error);
    return error;
  }
}

async function deleteAlbum(email, uid) {
  try {
    const emailEdited = email.replace(".", ",");
    await firebaseApp
      .database()
      .ref("albums/" + emailEdited)
      .child(uid)
      .remove();
  } catch (error) {
    console.log("deleteAlbum" + error);
    return error;
  }
  return "ok";
}

async function allWall(userId) {
  try {
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    const rootRef = firebaseApp.database().ref();
    const post = rootRef.child("albums").orderByChild("fechaCreacion");
    const userQuery = rootRef.child("usuarios");
    let salida = [];
    let albums = [];
    await post.once("value", (snap) => {
      snap.forEach((childSnapshot) => {
        childSnapshot.forEach((child) => {
          var fechaC = child.val().fechaCreacion;
          const fechaCra = new Date(fechaC);
          const uidUser = child.key.substring(0, child.key.lastIndexOf("|"));
          if (fechaCra >= startDate) {
            album = {
              uid: child.key,
              fechaCreacion: child.val().fechaCreacion,
              titulo: child.val().titulo,
              subtitulo: child.val().subtitulo,
              contenido: child.val().contenido,
              autor: child.val().autor,
              fotoPortada: child.val().fotoPortada,
              fotos: child.val().fotos,
              likes: child.val().likes,
              type: "album",
              email: childSnapshot.key,
            };
            album.likes.splice(album.likes.indexOf(uidUser), 1);
            albums.push(album);
          }
        });
      });
    });
    await albums.reduce(async (promise, album) => {
      await promise;
      const uidUser = album.uid.substring(0, album.uid.lastIndexOf("|"));
      var usuarioOwner = await userModel.findById(uidUser);
      var meGusta = await album.likes.includes(userId);
      var largoLikes = await album.likes.length;
      album = {
        ...album,
        avatar: usuarioOwner.avatar,
        nombre: usuarioOwner.nombre,
        apellido: usuarioOwner.apellido,
        likes: largoLikes,
        like: meGusta,
      };
      salida.push(album);
    }, Promise.resolve());
    return salida;
  } catch (error) {
    throw error;
  }
}

async function searchWall(userId, pais, estadoCiudad, profesion) {
  try {
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    const rootRef = firebaseApp.database().ref();
    const post = rootRef.child("albums").orderByChild("fechaCreacion");
    const userQuery = rootRef.child("usuarios");
    let salida = [];
    let albums = [];
    await post.once("value", (snap) => {
      snap.forEach((childSnapshot) => {
        childSnapshot.forEach((child) => {
          var fechaC = child.val().fechaCreacion;
          const fechaCra = new Date(fechaC);
          if (fechaCra >= startDate) {
            album = {
              uid: child.key,
              fechaCreacion: child.val().fechaCreacion,
              titulo: child.val().titulo,
              subtitulo: child.val().subtitulo,
              contenido: child.val().contenido,
              autor: child.val().autor,
              fotoPortada: child.val().fotoPortada,
              fotos: child.val().fotos,
              likes: child.val().likes,
              type: "album",
              email: childSnapshot.key,
            };

            albums.push(album);
          }
        });
      });
    });
    await albums.reduce(async (promise, album) => {
      await promise;
      const uidUser = album.uid.substring(0, album.uid.lastIndexOf("|"));
      var usuarioOwner = await userModel.findById(uidUser);
      var meGusta = await album.likes.includes(userId);
      var largoLikes = await album.likes.length;
      album = {
        ...album,
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
          salida.push(album);
        }
      } else if (estadoCiudad && !profesion) {
        if (usuarioOwner.estadoCiudad === estadoCiudad) {
          salida.push(album);
        }
      } else if (profesion && !estadoCiudad) {
        if (
          usuarioOwner.profesiones &&
          usuarioOwner.estadoCiudad.profesiones.includes(profesion)
        ) {
          salida.push(album);
        }
      } else if (pais && !estadoCiudad && !profesion) {
        if (usuarioOwner.pais === pais) {
          salida.push(album);
        }
      }
    }, Promise.resolve());
    return salida;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  findAlbumByEmail,
  findAlbumByUID,
  findAlbumByKEY,
  newAlbum,
  editAlbum,
  deleteAlbum,
  allWall,
  searchWall,
};

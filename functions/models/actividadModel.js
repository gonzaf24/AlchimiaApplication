const firebaseApp = require("firebase/app");
const userModel = require("./userModel");

async function findActividadesByEmail(email) {
  try {
    var salida = [];
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("/actividades/" + emailEdited)
      .orderByChild("fechaCreacion")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          salida.push(child.val());
        });
        return salida;
      });
  } catch (error) {
    console.log("findActividadesByEmail" + error);
    return error;
  }
}

async function findActividadByUID(email, uid) {
  try {
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("/actividades/" + emailEdited + "/" + uid + "/")
      .once("value")
      .then((snapshot) => {
        return snapshot.val();
      });
  } catch (error) {
    console.log("findActividadByUID" + error);
    return error;
  }
}

async function findActividadByKEY(email, key) {
  const emailEdited = email.replace(".", ",");
  await firebaseApp
    .database()
    .ref("/actividades/" + emailEdited)
    .key(key)
    .then((snapshot) => {
      return snapshot.val();
    });
}

async function newActividad(actividad, email) {
  try {
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("actividades/" + emailEdited)
      .child(actividad.uid)
      .set(actividad);
  } catch (error) {
    console.log("newActividad" + error);
    return error;
  }
}

async function editActividad(email, actividad) {
  try {
    const emailEdited = email.replace(".", ",");
    return await firebaseApp
      .database()
      .ref("actividades/" + emailEdited + "/" + actividad.uid)
      .set(actividad)
      .then();
  } catch (error) {
    console.log("editActividad" + error);
    return error;
  }
}

async function deleteActividad(email, uid) {
  try {
    const emailEdited = email.replace(".", ",");
    await firebaseApp
      .database()
      .ref("actividades/" + emailEdited)
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
    const post = rootRef.child("actividades").orderByChild("fechaCreacion");
    let salida = [];
    let actividades = [];
    await post.once("value", (snap) => {
      snap.forEach((childSnapshot) => {
        childSnapshot.forEach((child) => {
          var fechaC = child.val().fechaCreacion;
          const fechaCra = new Date(fechaC);
          const uidUser = child.key.substring(0, child.key.lastIndexOf("|"));

          if (fechaCra >= startDate) {
            actividad = {
              uid: child.key,
              fechaCreacion: child.val().fechaCreacion,
              contenido: child.val().contenido,
              titulo: child.val().titulo,
              fechaFin: child.val().fechaFin,
              fechaInicio: child.val().fechaInicio,
              fotoPortada: child.val().fotoPortada,
              horaFin: child.val().horaFin,
              horaInicio: child.val().horaInicio,
              pais: child.val().pais,
              estadoCiudad: child.val().estadoCiudad,
              tags: child.val().tags,
              apuntados: child.val().apuntados,
              likes: child.val().likes,
              type: "actividad",
              email: childSnapshot.key,
            };
            actividad.likes.splice(actividad.likes.indexOf(uidUser), 1);
            actividades.push(actividad);
          }
        });
      });
    });
    await actividades.reduce(async (promise, actividad) => {
      await promise;
      const uidUser = actividad.uid.substring(
        0,
        actividad.uid.lastIndexOf("|")
      );
      var usuarioOwner = await userModel.findById(uidUser);
      var meGusta = await actividad.likes.includes(userId);
      var largoLikes = await actividad.likes.length;
      actividad = {
        ...actividad,
        avatar: usuarioOwner.avatar,
        nombre: usuarioOwner.nombre,
        apellido: usuarioOwner.apellido,
        likes: largoLikes,
        like: meGusta,
      };
      salida.push(actividad);
    }, Promise.resolve());
    return salida;
  } catch (error) {
    throw error;
  }
}

async function searchWall(userId, pais, estadoCiudad) {
  try {
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    const rootRef = firebaseApp.database().ref();
    const post = rootRef.child("actividades").orderByChild("fechaCreacion");
    let salida = [];
    let actividades = [];
    await post.once("value", (snap) => {
      snap.forEach((childSnapshot) => {
        childSnapshot.forEach((child) => {
          var fechaC = child.val().fechaCreacion;
          const fechaCra = new Date(fechaC);
          const uidUser = child.key.substring(0, child.key.lastIndexOf("|"));
          if (fechaCra >= startDate) {
            actividad = {
              uid: child.key,
              fechaCreacion: child.val().fechaCreacion,
              contenido: child.val().contenido,
              titulo: child.val().titulo,
              fechaFin: child.val().fechaFin,
              fechaInicio: child.val().fechaInicio,
              fotoPortada: child.val().fotoPortada,
              horaFin: child.val().horaFin,
              horaInicio: child.val().horaInicio,
              pais: child.val().pais,
              estadoCiudad: child.val().estadoCiudad,
              tags: child.val().tags,
              apuntados: child.val().apuntados,
              likes: child.val().likes,
              type: "actividad",
              email: childSnapshot.key,
            };
            actividad.likes.splice(actividad.likes.indexOf(uidUser), 1);
            actividades.push(actividad);
          }
        });
      });
    });
    await actividades.reduce(async (promise, actividad) => {
      await promise;
      const uidUser = actividad.uid.substring(
        0,
        actividad.uid.lastIndexOf("|")
      );
      var usuarioOwner = await userModel.findById(uidUser);
      var meGusta = await actividad.likes.includes(userId);
      var largoLikes = await actividad.likes.length;
      actividad = {
        ...actividad,
        avatar: usuarioOwner.avatar,
        nombre: usuarioOwner.nombre,
        apellido: usuarioOwner.apellido,
        likes: largoLikes,
        like: meGusta,
      };

      if (estadoCiudad) {
        if (actividad.estadoCiudad === estadoCiudad) {
          salida.push(actividad);
        }
      } else if (pais && !estadoCiudad) {
        if (actividad.pais === pais) {
          salida.push(actividad);
        }
      }
    }, Promise.resolve());
    return salida;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  findActividadesByEmail,
  findActividadByUID,
  findActividadByKEY,
  newActividad,
  editActividad,
  deleteActividad,
  allWall,
  searchWall,
};

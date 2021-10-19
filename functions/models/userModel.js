const firebaseApp = require("firebase/app");

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

async function editar(usuario) {
  try {
    return await firebaseApp
      .database()
      .ref("usuarios/" + usuario.uid)
      .set(usuario)
      .then();
  } catch (error) {
    return error;
  }
}

async function allWall() {
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);
  const rootRef = firebaseApp.database().ref();
  const post = rootRef.child("usuarios").orderByChild("fechaCreacion");
  let salida = [];
  await post.once("value", (snap) => {
    snap.forEach((child) => {
      var fechaC = child.val().fechaCreacion;
      const fechaCra = new Date(fechaC);
      if (fechaCra >= startDate) {
        usuario = {
          uid: child.key,
          fechaCreacion: child.val().fechaCreacion,
          nombre: child.val().nombre,
          apellido: child.val().apellido,
          avatar: child.val().avatar,
          pais: child.val().pais,
          estadoCiudad: child.val().estadoCiudad,
          type: "usuario",
          email: child.val().email,
          profesiones: child.val().profesiones,
          intereses: child.val().intereses,
        };
        if (!child.val().notificar) {
          salida.push(usuario);
        }
      }
    });
  });
  return salida;
}

async function searchWall(pais, estadoCiudad, profesion) {
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);
  const rootRef = firebaseApp.database().ref();
  const post = rootRef.child("usuarios").orderByChild("pais").equalTo(pais);
  let salida = [];
  await post.once("value", (snap) => {
    snap.forEach((child) => {
      var city = child.val().estadoCiudad;

      usuario = {
        uid: child.key,
        fechaCreacion: child.val().fechaCreacion,
        nombre: child.val().nombre,
        apellido: child.val().apellido,
        avatar: child.val().avatar,
        pais: child.val().pais,
        estadoCiudad: child.val().estadoCiudad,
        type: "usuario",
        email: child.val().email,
        profesiones: child.val().profesiones,
        intereses: child.val().intereses,
      };

      if (!child.val().notificar) {
        if (estadoCiudad && profesion) {
          if (
            city === estadoCiudad &&
            usuario.profesiones &&
            usuario.profesiones.includes(profesion)
          ) {
            salida.push(usuario);
          }
        } else if (estadoCiudad && !profesion) {
          if (city === estadoCiudad) {
            salida.push(usuario);
          }
        } else if (profesion && !estadoCiudad) {
          if (usuario.profesiones && usuario.profesiones.includes(profesion)) {
            salida.push(usuario);
          }
        } else if (pais && !estadoCiudad && !profesion) {
          salida.push(usuario);
        }
      }
    });
  });
  return salida;
}

module.exports = {
  findById,
  editar,
  allWall,
  searchWall,
};

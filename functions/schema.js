const userModel = require("./models/userModel");
const albumModel = require("./models/albumModel");
const podcastModel = require("./models/podcastModel");
const actividadModel = require("./models/actividadModel");
const jsonwebtoken = require("jsonwebtoken");
const firebaseAuth = require("firebase");
const firebase = require("firebase/app");
const { gql } = require("apollo-server-express");
var uniqid = require("uniqid");
require("firebase/database");
require("firebase/storage");
require("firebase/firestore");
require("firebase/auth");

firebase.initializeApp(firebaseConfig);

const typeDefs = gql`
  type User {
    id: ID
    avatar: String
    name: String
    email: String
    isPremium: Boolean
  }

  type Category {
    id: ID
    cover: String
    name: String
    emoji: String
    path: String
  }

  type AlbumOut {
    autor: String
    contenido: String
    fechaCreacion: String
    fotoPortada: String
    fotos: [String]
    subtitulo: String
    titulo: String
    uid: ID
    email: String
    nombre: String
    apellido: String
    pais: String
    estadoCiudad: String
    avatar: String
    likes: [String]
  }

  type PodcastOut {
    titulo: String
    fotoPortada: String
    contenido: String
    fechaCreacion: String
    autor: String
    audio: String
    uid: ID
    likes: [String]
    email: String
    nombre: String
    apellido: String
    pais: String
    estadoCiudad: String
    avatar: String
  }

  type ActividadOut {
    titulo: String
    fechaInicio: String
    fechaFin: String
    fotoPortada: String
    horaInicio: String
    horaFin: String
    fechaCreacion: String
    pais: String
    direccion: String
    estadoCiudad: String
    tags: [String]
    contenido: String
    uid: ID
    email: String
    nombre: String
    apellido: String
    avatar: String
    apuntados: [String]
    likes: [String]
  }

  type LoginResponse {
    token: String
    user: Usuario
  }

  type Perfil {
    email: String
    nombre: String
    apellido: String
    avatar: String
    uid: String
  }

  type WallOut {
    uid: String
    fechaCreacion: String
    contenido: String
    titulo: String
    fechaFin: String
    fechaInicio: String
    fotoPortada: String
    horaFin: String
    horaInicio: String
    pais: String
    estadoCiudad: String
    tags: [String]
    apuntados: [String]
    likes: String
    like: String
    type: String
    email: String
    autor: String
    audio: String
    nombre: String
    apellido: String
    avatar: String
    subtitulo: String
    fotos: [String]
    profesiones: [String]
    intereses: [String]
  }

  type Usuario {
    uid: ID!
    token: String
    email: String
    fechaCreacion: String
    notificar: Boolean
    status: String
    sexo: String
    nombre: String
    apellido: String
    fechaNacimiento: String
    telefono: String
    pais: String
    estadoCiudad: String
    profesiones: [String]
    intereses: [String]
    avatar: String
    seguidores: [String]
    seguidos: [String]
    nomRef1: String
    linkRef1: String
  }

  type UsuarioLogued {
    uid: ID!
    token: String
    email: String
    fechaCreacion: String
    notificar: Boolean
    status: String
  }

  type FollowOut {
    seguido: Usuario
    seguidor: Usuario
  }

  input LikePhoto {
    id: ID!
  }

  input FileUpload {
    file: String!
  }

  input UserCredentials {
    email: String!
    password: String!
  }

  input Album {
    titulo: String
    subtitulo: String
    fotoPortada: String
    contenido: String
    autor: String
    fotos: [String]
    uid: ID
    fechaCreacion: String
    likes: [String]
  }

  input Actividad {
    titulo: String
    fechaInicio: String
    fechaFin: String
    fotoPortada: String
    horaInicio: String
    horaFin: String
    pais: String
    direccion: String
    estadoCiudad: String
    tags: [String]
    contenido: String
    uid: ID
    fechaCreacion: String
    apuntados: [String]
    likes: [String]
  }

  input ParamActividad {
    actividadID: String
    userId: String
  }

  input ParamAlbum {
    albumID: String
    userId: String
  }

  input ParamPodcast {
    podcastID: String
    userId: String
  }

  input ParamFollow {
    userIdSeguidor: String
    userIdSeguido: String
  }

  input Podcast {
    titulo: String
    fotoPortada: String
    contenido: String
    autor: String
    audio: String
    uid: ID
    fechaCreacion: String
    likes: [String]
  }

  input Search {
    checkPerfiles: Boolean
    checkArtAlbums: Boolean
    checkPodcasts: Boolean
    checkActividades: Boolean
    pais: String
    estadoCiudad: String
    profesiones: String
  }

  input IdsInput {
    ids: [String]
  }

  input UsuarioInput {
    uid: ID!
    token: String
    email: String
    fechaCreacion: String
    notificar: Boolean
    status: String
    sexo: String
    nombre: String
    apellido: String
    fechaNacimiento: String
    telefono: String
    pais: String
    estadoCiudad: String
    profesiones: [String]
    intereses: [String]
    avatar: String
    seguidores: [String]
    seguidos: [String]
    nomRef1: String
    linkRef1: String
  }

  type Query {
    usuarioQuery(userId: ID): Usuario
    album(albumId: ID!): AlbumOut
    actividad(actividadId: ID!): ActividadOut
    podcast(podcastId: ID!): PodcastOut
  }

  type Mutation {
    recoverPassword(input: UserCredentials!): String
    signup(input: UserCredentials!): String
    login(input: UserCredentials!): UsuarioLogued

    editarUsuario(input: UsuarioInput!): Usuario
    uploadImage(input: FileUpload!): String

    perfiles(input: IdsInput!): [Perfil]

    newPodcast(input: Podcast!): String
    newAlbum(input: Album!): String
    newActividad(input: Actividad!): String

    follow(input: ParamFollow!): FollowOut

    usuario(userId: ID): Usuario

    albums(userId: ID!): [AlbumOut]
    podcasts(userId: ID!): [PodcastOut]
    actividades(userId: ID!): [ActividadOut]

    actividad(actividadId: ID!): ActividadOut
    album(albumId: ID!): AlbumOut
    podcast(podcastId: ID!): PodcastOut

    wall(userId: ID!): [WallOut]
    searchWall(input: Search!): [WallOut]

    editarPodcast(input: Podcast!): String
    editarAlbum(input: Album!): String
    editarActividad(input: Actividad!): String
    apuntarseActividad(input: ParamActividad!): ActividadOut
    likeActividad(input: ParamActividad!): ActividadOut
    likeAlbum(input: ParamAlbum!): AlbumOut
    likePodcast(input: ParamPodcast!): PodcastOut

    eliminarPodcast(podcastId: ID!): String
    eliminarAlbum(albumId: ID!): String
    eliminarActividad(actividadId: ID!): String
  }
`;

async function checkIsUserLogged(context) {
  try {
    const { email, uid } = context;
    // chquequeo si el usuario esta en contexto
    if (!uid) throw new Error("404-Usuario contexto");
    // voy a buscar al usario si es que existe registrado en la BD
    const user = await userModel.findById(uid);
    // si el usuario no existe, entonces envio un error
    if (!user || !user.uid) throw new Error("404-Usuario contexto");
    if (user.email !== email) throw new Error("404-Usuario contexto");
    return user;
  } catch (e) {
    return e;
  }
}

const resolvers = {
  Mutation: {
    async recoverPassword(_, { input }) {
      console.log("#####---###### ---> entre al metodo API : recoverPassword");
      const { email } = input;
      return "un stringgggg";
    },
    async login(_, { input }) {
      try {
        const { email, password } = input;
        return await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(async (data) => {
            var BDref = firebase.database();
            var REFref = BDref.ref("/usuarios/" + data.user.uid).once("value");

            // eslint-disable-next-line promise/no-nesting
            return await REFref.then((snapshot) => {
              return (respuesta = {
                uid: snapshot.child("uid"),
                email: snapshot.child("email"),
                fechaCreacion: snapshot.child("fechaCreacion"),
                notificar: snapshot.child("notificar"),
                status: snapshot.child("status"),
                token: jsonwebtoken.sign(
                  {
                    uid: snapshot.child("uid"),
                    email: snapshot.child("email"),
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: "1d" }
                ),
              });
            });
          });
      } catch (error) {
        return error;
      }
    },
    async signup(_, { input }) {
      console.log("#####---###### ---> entre al metodo API : : signup");
      const { email, password } = input;
      try {
        const user = await firebaseAuth
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(async (data) => {
            var hoy = new Date();
            var fechaHoy = new Date(hoy.toISOString().replace("Z", "-02:00"))
              .toISOString()
              .replace(".000", "");
            const usuario = {
              uid: data.user.uid,
              email: email,
              fechaCreacion: fechaHoy,
              notificar: true,
              status: "offline",
            };
            await firebase
              .database()
              .ref("usuarios/" + data.user.uid)
              .set(usuario);
            return data.user;
          });
        //de momento no hago nada con el {user} generado, pero podria ...
        return "se ha creado con éxito el usuario";
      } catch (error) {
        return error;
      }
    },
    async newAlbum(_, { input }, context) {
      console.log("#####---###### ---> entre al metodo API: newAlbum---> ");
      try {
        const {
          titulo,
          subtitulo,
          fotoPortada,
          contenido,
          autor,
          fotos,
          likes,
        } = input;

        var hoy = new Date();
        var fechaHoy = new Date(hoy.toISOString().replace("Z", "-02:00"))
          .toISOString()
          .replace(".000", "");
        const user = await checkIsUserLogged(context);
        const uidStore = user.uid + "|" + uniqid();
        const album = {
          uid: uidStore,
          fechaCreacion: fechaHoy,
          titulo: titulo,
          subtitulo: subtitulo,
          fotoPortada: fotoPortada,
          contenido: contenido,
          autor: autor,
          fotos: fotos,
          likes: likes,
        };
        await albumModel.newAlbum(album, user.email);
        return "ok";
      } catch (error) {
        return error;
      }
    },
    async newActividad(_, { input }, context) {
      console.log("#####---######--> entre al metodo API : newActividad --> ");
      try {
        const {
          titulo,
          fechaInicio,
          fechaFin,
          fotoPortada,
          horaInicio,
          horaFin,
          pais,
          estadoCiudad,
          direccion,
          tags,
          contenido,
          apuntados,
          likes,
        } = input;
        var hoy = new Date();
        var fechaHoy = new Date(hoy.toISOString().replace("Z", "-02:00"))
          .toISOString()
          .replace(".000", "");
        const user = await checkIsUserLogged(context);
        const uidStore = user.uid + "|" + uniqid();
        const actividad = {
          uid: uidStore,
          fechaCreacion: fechaHoy,
          titulo: titulo,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          fotoPortada: fotoPortada,
          horaInicio: horaInicio,
          horaFin: horaFin,
          pais: pais,
          estadoCiudad: estadoCiudad,
          direccion: direccion,
          tags: tags,
          contenido: contenido,
          apuntados: apuntados,
          likes: likes,
        };
        await actividadModel.newActividad(actividad, user.email);
        var respuesta = await actividadModel.findActividadesByEmail(user.email);
        return "ok";
      } catch (error) {
        return error;
      }
    },
    async newPodcast(_, { input }, context) {
      console.log("#####---######---> entre al metodo API :: newPodcast -> ");
      try {
        const { titulo, fotoPortada, contenido, autor, audio, likes } = input;
        var hoy = new Date();
        var fechaHoy = new Date(hoy.toISOString().replace("Z", "-02:00"))
          .toISOString()
          .replace(".000", "");
        const user = await checkIsUserLogged(context);
        const uidStore = user.uid + "|" + uniqid();
        const podcast = {
          uid: uidStore,
          fechaCreacion: fechaHoy,
          titulo: titulo,
          fotoPortada: fotoPortada,
          autor: autor,
          contenido: contenido,
          audio: audio,
          likes: likes,
        };
        await podcastModel.newPodcast(podcast, user.email);
        var respuesta = await podcastModel.findPodcastsByEmail(user.email);
        return "ok";
      } catch (error) {
        console.log("ERROR al newPodcast!!! " + error);
        return error;
      }
    },
    async eliminarPodcast(_, { podcastId }, context) {
      try {
        console.log("#####---######---> entre al metodo API: eliminarPodcast");
        const user = await checkIsUserLogged(context);
        const salida = await podcastModel.deletePodcast(user.email, podcastId);
        return salida;
      } catch (error) {
        console.log("ERROR al eliminarPodcast!!! " + error);
        return error;
      }
    },
    async eliminarAlbum(_, { albumId }, context) {
      try {
        console.log("#####---###### ---> entre al metodo API: eliminarAlbum>");
        const user = await checkIsUserLogged(context);
        const salida = await albumModel.deleteAlbum(user.email, albumId);
        return salida;
      } catch (error) {
        console.log("ERROR al eliminarAlbum!!! " + error);
        return error;
      }
    },
    async eliminarActividad(_, { actividadId }, context) {
      try {
        console.log("#####---######--->entre al metodo API: eliminarActividad");
        const user = await checkIsUserLogged(context);
        const salida = await actividadModel.deleteActividad(
          user.email,
          actividadId
        );
        return salida;
      } catch (error) {
        console.log("ERROR al eliminarActividad!!! " + error);
        return error;
      }
    },
    async albums(_, { userId }, context) {
      try {
        console.log("#####---###### ---> entre al metodo API :: albums! -- > ");
        const user = await userModel.findById(userId);
        if (user && user.email) {
          var albums = await albumModel.findAlbumByEmail(user.email);
          //console.log(",mmmmmmm : " + JSON.stringify(albums));

          albums.map((element) => {
            return element.likes.splice(element.likes.indexOf(userId), 1);
          });

          const salida = await albums.reverse();
          return salida;
        } else {
          throw new Error("404-Usuario");
        }
      } catch (error) {
        console.log("ERROR al !!! " + error);
        return error;
      }
    },
    async podcasts(_, { userId }, context) {
      try {
        console.log("#####---###### ---> entre al metodo API :podcasts! >");
        const user = await userModel.findById(userId);
        if (user && user.email) {
          const podcasts = await podcastModel.findPodcastsByEmail(user.email);

          podcasts.map((element) => {
            return element.likes.splice(element.likes.indexOf(userId), 1);
          });

          const salida = await podcasts.reverse();
          return salida;
        } else {
          throw new Error("404-Usuario");
        }
      } catch (error) {
        console.log("ERROR al !!! " + error);
        return error;
      }
    },
    async actividades(_, { userId }, context) {
      try {
        console.log("#####---###### ---> entre al metodo API : actividades->");
        const user = await userModel.findById(userId);
        if (user && user.uid) {
          const actividades = await actividadModel.findActividadesByEmail(
            user.email
          );

          actividades.map((element) => {
            element.likes.splice(element.likes.indexOf(userId), 1);
            return element.apuntados.splice(
              element.apuntados.indexOf(userId),
              1
            );
          });

          const salida = await actividades.reverse();
          return salida;
        } else {
          throw new Error("404-Usuario");
        }
      } catch (error) {
        console.log("ERROR al !!! " + error);
        return error;
      }
    },
    async actividad(_, { actividadId }, context) {
      try {
        console.log("#####---###### ---> entre al metodo API : actividad!->");
        var uid = actividadId.substring(0, actividadId.lastIndexOf("|"));
        const user = await userModel.findById(uid);
        if (user && user.email) {
          var actividad = await actividadModel.findActividadByUID(
            user.email,
            actividadId
          );

          actividad.likes.splice(actividad.likes.indexOf(user.uid), 1);
          actividad.apuntados.splice(actividad.apuntados.indexOf(user.uid), 1);

          if (actividad) {
            actividad = {
              ...actividad,
              email: user.email,
              nombre: user.nombre,
              apellido: user.apellido,
              avatar: user.avatar,
            };
            return actividad;
          } else {
            throw new Error("404-Actividad");
          }
        } else {
          throw new Error("404-Actividad");
        }
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
    async album(_, { albumId }, context) {
      try {
        console.log("#####---###### ---> entre al metodo API :: album! -->");
        var uid = albumId.substring(0, albumId.lastIndexOf("|"));
        const user = await userModel.findById(uid);
        if (user && user.email) {
          var album = await albumModel.findAlbumByUID(user.email, albumId);
          if (album) {
            album = {
              ...album,
              email: user.email,
              nombre: user.nombre,
              apellido: user.apellido,
              pais: user.pais,
              estadoCiudad: user.estadoCiudad,
              avatar: user.avatar,
            };

            album.likes.splice(album.likes.indexOf(user.uid), 1);
          } else {
            throw new Error("404-Album");
          }
        } else {
          throw new Error("404-Album");
        }
        return album;
      } catch (error) {
        return error;
      }
    },
    async podcast(_, { podcastId }, context) {
      try {
        console.log("#####---###### ---> entre al metodo API :: podcast! -->");
        var uid = podcastId.substring(0, podcastId.lastIndexOf("|"));

        const user = await userModel.findById(uid);

        if (user && user.email) {
          var podcast = await podcastModel.findPodcastByUID(
            user.email,
            podcastId
          );
          if (podcast) {
            podcast = {
              ...podcast,
              email: user.email,
              nombre: user.nombre,
              apellido: user.apellido,
              pais: user.pais,
              estadoCiudad: user.estadoCiudad,
              avatar: user.avatar,
            };

            podcast.likes.splice(podcast.likes.indexOf(user.uid), 1);

            return podcast;
          } else {
            throw new Error("404-Podcast");
          }
        } else {
          throw new Error("404-Podcast");
        }
      } catch (error) {
        return error;
      }
    },
    async editarUsuario(_, { input }, context) {
      console.log("#####---###### ---> entre al metodo API : : editarUsuario");
      try {
        const user = await checkIsUserLogged(context);
        Object.keys(input).forEach(
          (key) => input[key] === null && delete input[key]
        );
        var userMerged = { ...user, ...input };
        await userModel.editar(userMerged);
        const uid = await userMerged.uid;
        const userOut = await userModel.findById(uid);
        return userOut;
      } catch (error) {
        return error;
      }
    },
    async perfiles(_, { input }, context) {
      console.log("#####---###### ---> entre al metodo API : : perfiles");
      try {
        const userContext = await checkIsUserLogged(context);
        Object.keys(input).forEach(
          (key) => input[key] === null && delete input[key]
        );
        var salida = [];
        await Promise.all(
          input.ids.map(async (id) => {
            const user = await userModel.findById(id);
            perfil = {
              nombre: user.nombre,
              apellido: user.apellido,
              email: user.email,
              uid: user.uid,
              avatar: user.avatar,
            };
            salida.push(perfil);
          })
        );
        return salida;
      } catch (error) {
        return error;
      }
    },
    async usuario(_, { userId }, context) {
      try {
        console.log("#####---###### ---> entre al metodo API : : usuario");
        const uid = userId;
        const user = await userModel.findById(uid);
        return user;
      } catch (error) {
        return error;
      }
    },
    async editarActividad(_, { input }, context) {
      console.log("#####---###### ---> entre al metodo API: editarActividad");
      try {
        const user = await checkIsUserLogged(context);
        Object.keys(input).forEach(
          (key) => input[key] === null && delete input[key]
        );
        await actividadModel.newActividad(input, user.email);
        return "ok";
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
    async apuntarseActividad(_, { input }, context) {
      console.log("#####---###### --->entre al metodo API: apuntarseActividad");
      try {
        const userValidado = await checkIsUserLogged(context);
        var uidUser = input.actividadID.substring(
          0,
          input.actividadID.lastIndexOf("|")
        );
        const userActividad = await userModel.findById(uidUser);
        Object.keys(input).forEach(
          (key) => input[key] === null && delete input[key]
        );
        var actividad = await actividadModel.findActividadByUID(
          userActividad.email,
          input.actividadID
        );
        if (actividad.apuntados.includes(userValidado.uid)) {
          actividad.apuntados.splice(
            actividad.apuntados.indexOf(userValidado.uid),
            1
          );
          await actividadModel.newActividad(actividad, userActividad.email);
        } else {
          actividad.apuntados.push(input.userId);
          await actividadModel.newActividad(actividad, userActividad.email);
        }
        actividad.apuntados.splice(actividad.apuntados.indexOf(uidUser), 1);
        return actividad;
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
    async likeActividad(_, { input }, context) {
      console.log("#####---###### ---> entre al metodo API : : likeActividad");
      try {
        const userValidado = await checkIsUserLogged(context);
        var uidUser = input.actividadID.substring(
          0,
          input.actividadID.lastIndexOf("|")
        );
        const userActividad = await userModel.findById(uidUser);
        Object.keys(input).forEach(
          (key) => input[key] === null && delete input[key]
        );
        var actividad = await actividadModel.findActividadByUID(
          userActividad.email,
          input.actividadID
        );
        if (actividad.likes.includes(userValidado.uid)) {
          actividad.likes.splice(actividad.likes.indexOf(userValidado.uid), 1);
          await actividadModel.newActividad(actividad, userActividad.email);
        } else {
          actividad.likes.push(input.userId);
          await actividadModel.newActividad(actividad, userActividad.email);
        }
        actividad.likes.splice(actividad.likes.indexOf(userActividad.uid), 1);
        return actividad;
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
    async likeAlbum(_, { input }, context) {
      console.log("#####---###### ---> entre al metodo API : : likeAlbum");
      try {
        const userValidado = await checkIsUserLogged(context);
        var uidUser = input.albumID.substring(
          0,
          input.albumID.lastIndexOf("|")
        );
        const userAlbum = await userModel.findById(uidUser);
        Object.keys(input).forEach(
          (key) => input[key] === null && delete input[key]
        );
        var album = await albumModel.findAlbumByUID(
          userAlbum.email,
          input.albumID
        );
        if (album.likes.includes(userValidado.uid)) {
          album.likes.splice(album.likes.indexOf(userValidado.uid), 1);
          await albumModel.newAlbum(album, userAlbum.email);
        } else {
          album.likes.push(input.userId);
          await albumModel.newAlbum(album, userAlbum.email);
        }
        album.likes.splice(album.likes.indexOf(userAlbum.uid), 1);
        return album;
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
    async likePodcast(_, { input }, context) {
      console.log("#####---###### ---> entre al metodo API : : likePodcast");
      try {
        const userValidado = await checkIsUserLogged(context);
        var uidUser = input.podcastID.substring(
          0,
          input.podcastID.lastIndexOf("|")
        );
        const userPodcast = await userModel.findById(uidUser);
        Object.keys(input).forEach(
          (key) => input[key] === null && delete input[key]
        );
        var podcast = await podcastModel.findPodcastByUID(
          userPodcast.email,
          input.podcastID
        );
        if (podcast.likes.includes(userValidado.uid)) {
          podcast.likes.splice(podcast.likes.indexOf(userValidado.uid), 1);
          await podcastModel.newPodcast(podcast, userPodcast.email);
        } else {
          podcast.likes.push(input.userId);
          await podcastModel.newPodcast(podcast, userPodcast.email);
        }

        podcast.likes.splice(podcast.likes.indexOf(userPodcast.uid), 1);
        return podcast;
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
    async follow(_, { input }, context) {
      console.log("#####---###### ---> entre al metodo API : follow ");
      try {
        const userValidado = await checkIsUserLogged(context);
        const userIdSeguidor = input.userIdSeguidor;
        const userIdSeguido = input.userIdSeguido;
        if (userValidado.uid === userIdSeguidor) {
          let userSeguidor = await userModel.findById(userIdSeguidor);
          let userSeguido = await userModel.findById(userIdSeguido);

          var esSeguido = userSeguido.seguidores
            ? userSeguido.seguidores.includes(userIdSeguidor)
            : false;

          if (esSeguido) {
            if (userSeguido.seguidores) {
              userSeguido.seguidores.splice(
                userSeguido.seguidores.indexOf(userIdSeguidor),
                1
              );
              await userModel.editar(userSeguido);
            }
            if (userSeguidor.seguidos) {
              userSeguidor.seguidos.splice(
                userSeguidor.seguidos.indexOf(userIdSeguido),
                1
              );
              await userModel.editar(userSeguidor);
            }
          } else {
            if (userSeguido.seguidores) {
              userSeguido.seguidores.push(userIdSeguidor);
              await userModel.editar(userSeguido);
            } else {
              userSeguido = { ...userSeguido, seguidores: [userIdSeguidor] };
              await userModel.editar(userSeguido);
            }

            if (userSeguidor.seguidos) {
              userSeguidor.seguidos.push(userIdSeguido);
              await userModel.editar(userSeguidor);
            }
          }

          const userSeguidoOut = await userModel.findById(userIdSeguido);
          const userSeguidorOut = await userModel.findById(userIdSeguidor);
          out = {
            seguido: userSeguidoOut,
            seguidor: userSeguidorOut,
          };
          console.log("Salida  : " + JSON.stringify(out));
          return out;
        }
        return "";
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
    async editarAlbum(_, { input }, context) {
      console.log("#####---###### ---> entre al metodo API : editarAlbum");
      try {
        const user = await checkIsUserLogged(context);
        Object.keys(input).forEach(
          (key) => input[key] === null && delete input[key]
        );
        await albumModel.newAlbum(input, user.email);
        return "ok";
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
    async editarPodcast(_, { input }, context) {
      console.log("#####---###### ---> entre al metodo API :: editarPodcast");
      try {
        const user = await checkIsUserLogged(context);
        Object.keys(input).forEach(
          (key) => input[key] === null && delete input[key]
        );
        await podcastModel.newPodcast(input, user.email);
        return "ok";
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
    async uploadImage(_, { input }, context) {
      console.log(" #####---###### ---> entre al metodo API : : uploadImage");
      try {
        const { file } = input;
        const user = await checkIsUserLogged(context);
        if (!user) {
          return "no existe el usuario";
        } else {
          return "";
        }
      } catch (error) {
        return error;
      }
    },
    async wall(_, { userId }, context) {
      try {
        console.log("#####---###### ---> entre al metodo API : : wall  ");
        const userContext = await checkIsUserLogged(context);
        const user = await userModel.findById(userId);
        if (!user || !user.uid) {
          throw new Error("404-Usuario");
        } else {
          const usuarios = await userModel.allWall();
          const podcasts = await podcastModel.allWall(userId);
          const actividades = await actividadModel.allWall(userId);
          const albums = await albumModel.allWall(userId);
          const preSalida = [
            ...usuarios,
            ...podcasts,
            ...actividades,
            ...albums,
          ];

          await preSalida.sort((a, b) => {
            return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
          });

          return preSalida;
        }
      } catch (error) {
        return error;
      }
    },
    async searchWall(_, { input }, context) {
      try {
        console.log("#####---###### ---> entre al metodo API : : wall  ");
        const {
          checkPerfiles,
          checkArtAlbums,
          checkPodcasts,
          checkActividades,
          pais,
          estadoCiudad,
          profesiones,
        } = input;
        const userContext = await checkIsUserLogged(context);

        if (!userContext || !userContext.uid) {
          throw new Error("404-Usuario");
        } else {
          let preSalida = [];
          if (checkPerfiles) {
            if (!pais && !estadoCiudad && !profesiones) {
              const usuarios = await userModel.allWall();
              preSalida = [...preSalida, ...usuarios];
            } else {
              const usuarios = await userModel.searchWall(
                pais,
                estadoCiudad,
                profesiones
              );
              preSalida = [...preSalida, ...usuarios];
            }
          }
          if (checkArtAlbums) {
            if (!pais && !estadoCiudad && !profesiones) {
              const albums = await albumModel.allWall(userContext.uid);
              preSalida = [...preSalida, ...albums];
            } else {
              const albums = await albumModel.searchWall(
                userContext.uid,
                pais,
                estadoCiudad,
                profesiones
              );
              preSalida = [...preSalida, ...albums];
            }
          }
          if (checkPodcasts) {
            if (!pais && !estadoCiudad && !profesiones) {
              const podcasts = await podcastModel.allWall(userContext.uid);
              preSalida = [...preSalida, ...podcasts];
            } else {
              const podcasts = await podcastModel.searchWall(
                userContext.uid,
                pais,
                estadoCiudad,
                profesiones
              );
              preSalida = [...preSalida, ...podcasts];
            }
          }
          if (checkActividades) {
            if (!pais && !estadoCiudad) {
              const actividades = await actividadModel.allWall(userContext.uid);
              preSalida = [...preSalida, ...actividades];
            } else {
              const actividades = await actividadModel.searchWall(
                userContext.uid,
                pais,
                estadoCiudad
              );
              preSalida = [...preSalida, ...actividades];
            }
          }

          await preSalida.sort((a, b) => {
            return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
          });
          //console.log("#####---###### ---> user " + JSON.stringify(preSalida));
          return preSalida;
        }
      } catch (error) {
        return error;
      }
    },
  },

  Query: {
    async usuarioQuery(_, { userId }, context) {
      try {
        const user = await userModel.findById(userId);
        return user;
      } catch (error) {
        return error;
      }
    },
    async album(_, { albumId }) {
      try {
        var uid = albumId.substring(0, albumId.lastIndexOf("|"));
        const user = await userModel.findById(uid);
        var album = await albumModel.findAlbumByUID(user.email, albumId);
        album = {
          ...album,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          pais: user.pais,
          estadoCiudad: user.estadoCiudad,
          avatar: user.avatar,
        };
        return album;
      } catch (error) {
        return error;
      }
    },
    async actividad(_, { actividadId }) {
      try {
        var uid = actividadId.substring(0, actividadId.lastIndexOf("|"));
        const user = await userModel.findById(uid);
        var actividad = await actividadModel.findActividadByUID(
          user.email,
          actividadId
        );
        actividad = {
          ...actividad,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          avatar: user.avatar,
        };
        return actividad;
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
    async podcast(_, { podcastId }) {
      try {
        var uid = podcastId.substring(0, podcastId.lastIndexOf("|"));
        const user = await userModel.findById(uid);
        var podcast = await podcastModel.findPodcastByUID(
          user.email,
          podcastId
        );
        podcast = {
          ...podcast,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          avatar: user.avatar,
        };
        return podcast;
      } catch (error) {
        console.log("Error API es : " + error);
        return error;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };

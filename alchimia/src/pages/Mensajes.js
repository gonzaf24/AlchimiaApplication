import React, { Fragment, useState, useContext, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import GridList from "@material-ui/core/GridList";
import Chat from "../components/3d/Chat";
import CloseIcon from "@material-ui/icons/Close";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Layout } from "../components/Layout";
import { Context } from "../Context";
import { useInputValue } from "../hooks/useInputValue";
import { makeStyles } from "@material-ui/core/styles";

const firebaseApp = require("firebase/app");
var chatModel = require("../service/chatModel");
var uniqid = require("uniqid");

const useStyles = makeStyles((theme) => ({
  clicked: {
    width: "100%",
    cursor: "pointer",
  },
  "@keyframes myEffect": {
    "0%": {
      filter: "blur(5px)",
      opacity: 0,
    },
    "100%": {
      filter: "blur(0)",
      opacity: 1,
    },
  },
  areadySeen: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    cursor: "pointer",
    animation: `$myEffect 1250ms ${theme.transitions.easing.easeInOut}`,
  },
  inline: {
    display: "inline",
  },
  sizeFont: {
    fontSize: "0.8rem",
  },
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "300px",
  },
  colorNotSeen: {
    backgroundColor: "#e91e637a",
    cursor: "pointer",
    animation: `$myEffect 1250ms ${theme.transitions.easing.easeInOut}`,
  },
  mensaje: {
    color: "#d89090",
    top: "80px",
    right: "6%",
    position: "absolute",
    behavior: "smooth",
  },
  mensajesVacios: {
    textAlign: "center",
    paddingTop: "80px",
    fontSize: "20px",
  },
  tamanos: {
    minHeight: "80%",
    margin: 10,
    display: "contents",
    behavior: "smooth",
    width: "400px !important",
  },
  form: {
    height: "65vh !important",
    width: "400px !important",
    maxHeight: "80% !important",
    behavior: "smooth",
  },
  izquierda: {
    marginRight: "30%",
    border: "0.7px solid #8080807d",
    borderRadius: 10,
    padding: 12,
    color: "white",
    behavior: "smooth",
  },
  derecha: {
    marginLeft: "30%",
    borderRadius: 10,
    padding: 12,
    color: "white",
    backgroundColor: "#65656575",
    behavior: "smooth",
  },
  ul: {
    padding: 12,
    backgroundColor: "#1c1c1c",
    behavior: "smooth",
    overflowY: "auto",
    minHeight: "100%",
  },
  li: {
    marginBottom: 8,
    fontSize: "0.8em",
    behavior: "smooth",
  },
  ejemplo: {
    backgroundColor: "#eee",
    border: "1px solid #333",
    borderRadius: "10px",
    color: "#333",
    padding: "12px",
    position: "relative",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    behavior: "smooth",
  },
  gridList: {
    transform: "translateZ(0)",
    behavior: "smooth",
  },
  follow: {
    display: "inline-flex",
    webkitBoxShadow: "inset -1px 14px 15px -9px rgba(0,0,0,0.52)",
    mozBoxShadow: "inset -1px 14px 15px -9px rgba(0,0,0,0.52)",
    boxShadow: "inset -1px 14px 15px -9px rgba(0,0,0,0.52)",
    margin: "0 !important",
    paddingLeft: 10,
    behavior: "smooth",
  },
  fechaDer: {
    position: "relative",
    top: "35px",
    color: "#e2c1c1",
    fontSize: "7px",
    behavior: "smooth",
  },
  header: {
    webkitBoxShadow: "inset -1px -15px 15px -9px rgba(0,0,0,0.52)",
    mozBoxShadow: "inset -1px -15px 15px -9px rgba(0,0,0,0.52)",
    boxShadow: "inset -1px -15px 15px -9px rgba(0,0,0,0.52)",
    behavior: "smooth",
    maxWidth: "400px !important",
    paddingTop: "5px",
  },
  large: {
    boxShadow: "0px 0px 30px 10px rgba(255, 253, 255, 0.14)",
  },
  nombre: {
    color: "#e91e63",
    fontSize: "1rem !important",
    letterSpacing: "0.1em",
    marginLeft: "10px",
  },
  dis: {
    display: "flex",
  },
  pro: {
    display: "flex",
    padding: "20px",
    alignItems: "center",
    width: "100%",
  },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "white",
    borderRadius: "50%",
  },
}));

export const Mensajes = ({ id }) => {
  const classes = useStyles();
  const { user } = useContext(Context);
  const [listaChat, setListaChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [msgNotSeen, setMsgNotSeen] = useState(0);
  const [open, setOpen] = useState(false);
  var mensaje = useInputValue("");
  const [listaChatModal, setListaChatModal] = useState([]);
  const [userChatData, setUserChatData] = useState({});

  useEffect(() => {
    async function fetchData() {
      const emailEdited = user.email.replace(".", ",");
      setLoading(true);
      firebaseApp
        .database()
        .ref("/chats/" + emailEdited)
        .on("value", async function (snapshot) {
          setListaChat(await chatModel.obtenerChatsOnce(user.email, id));
          setLoading(false);
        });
    }
    fetchData();
  }, [id]);

  const handleClickOpen = async (element) => {
    setUserChatData(element);

    setLoadingChat(true);
    const chatID = [user.uid, element.uid].sort().join("|");
    firebaseApp
      .database()
      .ref("/conversations/" + chatID)
      .on("child_added", async function (snapshot, prevChildKey) {
        setListaChatModal(await chatModel.obtenerConversationsOnce(chatID));
      });
    await chatModel.seen(
      user.email,
      userChatData.uid,
      userChatData.timestamp,
      true
    );
    setOpen(true);
    setLoadingChat(false);
  };

  const cerrar = () => {
    mensaje.reset();
    setOpen(false);
    setListaChatModal([]);
  };

  const reset = () => {
    mensaje.reset();
  };

  const enviarMensaje = async (messageSent) => {
    const chatID = [user.uid, userChatData.uid].sort().join("|");
    await chatModel.newChat(userChatData.email, user.uid, false);
    await chatModel.newChat(user.email, userChatData.uid, true);
    var conversation = {
      sender: user.uid,
      receiver: userChatData.uid,
      seen: false,
      uid: chatID,
      message: messageSent.value,
    };
    chatModel.newConversation(chatID, conversation);
  };

  const obtenerHoraChats = (timestamp) => {
    const dateObject = new Date(timestamp);
    const fecha = format(dateObject, "dd/MM/yyyy", { locale: es });
    const timeString = `${fecha}-${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;
    return timeString;
  };

  return (
    <>
      <Layout id={id}>
        {loading ? (
          <div className={classes.spinner}>
            <CircularProgress size={150} />
          </div>
        ) : (
          <>
            {listaChat && listaChat.length == 0 && (
              <div className={classes.mensajesVacios}> no messages </div>
            )}
            <List>
              {listaChat &&
                listaChat.map((element) => {
                  return (
                    <Fragment key={uniqid()}>
                      <ListItem
                        alignItems="flex-start"
                        className={
                          element.seen
                            ? classes.areadySeen
                            : classes.colorNotSeen
                        }
                        onClick={() => {
                          handleClickOpen(element);
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar alt="Remy Sharp" src={element.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={element.nombre + " " + element.apellido}
                          secondary={
                            <Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                                className={classes.sizeFont}
                              >
                                {element.horaPrev}
                              </Typography>
                              <Typography className={classes.sizeFont}>
                                {element.message}
                              </Typography>
                            </Fragment>
                          }
                        />
                      </ListItem>
                    </Fragment>
                  );
                })}
            </List>
          </>
        )}

        <Dialog open={open} onClose={cerrar} width={"400px"}>
          <CloseIcon
            className={classes.close}
            fontSize="large"
            onClick={cerrar}
          />

          <DialogTitle className={classes.header}>
            <div className={classes.dis}>
              <div className={classes.chat}>
                {userChatData.avatar && <Chat imagen={userChatData.avatar} />}
                {/*  <Register /> */}
              </div>
              <div className={classes.pro}>
                <Avatar
                  className={classes.large}
                  alt={userChatData.nombre + " " + userChatData.apellido}
                  src={userChatData.avatar}
                />
                <Typography
                  gutterBottom
                  variant="h5"
                  className={classes.nombre}
                >
                  {userChatData.nombre + " " + userChatData.apellido}
                </Typography>
              </div>
            </div>
          </DialogTitle>
          <DialogActions className={classes.tamanos}>
            <GridList className={classes.gridList}>
              <div className={classes.form}>
                {loadingChat ? (
                  <div className={classes.spinner}>
                    <CircularProgress size={150} />
                  </div>
                ) : (
                  <Fragment>
                    <div className={classes.ul}>
                      {listaChatModal &&
                        listaChatModal.map((element) => {
                          if (element.receiver === userChatData.uid) {
                            return (
                              <Fragment key={uniqid()}>
                                <div className={classes.li}>
                                  <div>
                                    <div className={classes.fechaDer}>
                                      {obtenerHoraChats(element.timestamp)}
                                    </div>
                                    <div>
                                      <div className={classes.derecha}>
                                        {element.message}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Fragment>
                            );
                          } else {
                            return (
                              <Fragment key={uniqid()}>
                                <div className={classes.li}>
                                  <div className={classes.izquierda}>
                                    {element.message}
                                  </div>
                                </div>
                              </Fragment>
                            );
                          }
                        })}
                    </div>
                  </Fragment>
                )}
              </div>
            </GridList>
            <form className={classes.follow}>
              <TextField
                margin="normal"
                type="text"
                fullWidth
                id="mensaje"
                label="message"
                name="mensaje"
                value={mensaje}
                autoFocus
                multiline
                rows={1}
                rowsMax={4}
                {...mensaje}
              />
              {mensaje.value != "" && (
                <Button
                  color="primary"
                  onClick={() => {
                    reset();
                    enviarMensaje(mensaje);
                  }}
                >
                  send
                </Button>
              )}
            </form>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
};

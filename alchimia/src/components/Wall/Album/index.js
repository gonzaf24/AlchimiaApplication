import React, { useContext, useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Context } from "../../../Context";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import { reverseString, DEFAULT_IMAGE } from "../../Utils/utils";
import AvatarImg from "../../../assets/avatar.png";
import { useMutation } from "@apollo/react-hooks";
import { navigate } from "@reach/router";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { LIKE_ALBUM } from "../../../container/AlbumMutation";
import CircularProgress from "@material-ui/core/CircularProgress";
import { aboutTime } from "../../Utils/utils";
import Typography from "@material-ui/core/Typography";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import ShareIcon from "@material-ui/icons/Share";
import DialogContent from "@material-ui/core/DialogContent";
import { useNearScreen } from "../../../hooks/useNearScreen";
var uniqid = require("uniqid");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: "black",
    height: 300,
    flexGrow: 1,
    borderRadius: "0px",
    animation: `$myEffect 10ms ${theme.transitions.easing.easeInOut}`,
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
  media: {
    height: 250,
    opacity: 0.5,
    background: "rgba(black, 0.5)",
  },
  fecha: {
    cursor: "pointer",
    position: "absolute",
    bottom: 220,
    left: "5%",
    color: " white !important",
    zIndex: "2",
    fontSize: "1em",
  },
  owner: {
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    bottom: -50,
    left: "0%",
    zIndex: "2",
    color: "#e91e63",
  },
  like: {
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    bottom: -40,
    right: "5%",
    zIndex: "2",
  },
  titulo: {
    width: "100%",
    textAlign: "center",
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    zIndex: "2",
    top: "50%",
    left: "50%",
    width: "80%",
    fontSize: "1.8em",
    transform: "translate(-50%, -50%)",
    textShadow: "0 3px 0 rgba(0,0,0,0.6)!important",
    fontFamily: "sans-serif, Roboto, Arial, sans-serif !important",
    fontWeight: "900 !important",
    fontStyle: "normal !important",
    letterSpacing: "0.2em !important",
    textTransform: "uppercase !important",
    letterSpacing: "4px",
    "&:hover": {
      fontSize: "2.2em",
      textShadow: "0 3px 0 rgba(252, 185, 0, 0.6)!important",
    },
  },
  spinnerSize: {
    cursor: "pointer",
    position: "absolute",
    width: "20px !important",
    height: "20px !important",
    marginBottom: 7,
    marginRight: 10,
    bottom: -40,
    right: "5%",
    zIndex: "2",
  },
  aboutTime: {
    right: "0px",
    paddingLeft: "10px",
    position: "absolute",
    color: "white",
    backgroundColor: "#e6ad00b8",
    borderBottomLeftRadius: "3px",
    fontSize: "smaller",
    top: "0px",
  },
  color: {
    color: "#e91e63",
  },
  copy: {
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    bottom: -40,
    right: "15%",
    zIndex: "2",
  },
  min: {
    minHeight: 120,
  },
}));

export const Album = ({
  uid,
  fechaCreacion,
  titulo,
  subtitulo,
  contenido,
  autor,
  fotoPortada,
  fotos,
  likes,
  like,
  type,
  email,
  avatar,
  nombre,
  apellido,
}) => {
  var fotoPortadaCard = "";
  if (!fotoPortada || fotoPortada === "") {
    fotoPortadaCard = DEFAULT_IMAGE;
  } else {
    fotoPortadaCard = fotoPortada;
  }

  const classes = useStyles();
  const { user } = useContext(Context);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [open, setOpen] = useState(false);
  const labelId = `checkbox-list-label-${uid}`;
  const [meGusta, setMeGusta] = useState(like);
  const [loadingLike, setLoadingLike] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [likeAlbum, {}] = useMutation(LIKE_ALBUM);
  const uidUser = uid.substring(0, uid.lastIndexOf("|"));
  const url = window.location.href;
  const [about, setAbout] = useState("");
  var urlCopy = url.substring(0, url.lastIndexOf("home/")) + "album/" + uid;
  const handleListItemClick = async (value) => {
    navigate(`/user/${value}`);
  };
  const [show, element] = useNearScreen();
  const [uniqueKey, setUniqueKey] = useState(uniqid());
  const confirmLike = async () => {
    if (user.uid != uidUser) {
      setLoadingLike(true);
      const input = { albumID: uid, userId: user.uid };
      const result = await likeAlbum({
        variables: { input },
      });
      if (result) {
        setLikesCount(result.data.likeAlbum.likes.length);
        setMeGusta(
          result.data.likeAlbum.likes.includes(user.uid) ? "true" : "false"
        );
        setLoadingLike(false);
      } else {
        setLoadingLike(false);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      var prue = await aboutTime(fechaCreacion);
      setAbout(prue);
    }
    fetchData();
  }, [fechaCreacion]);

  const handleClickOpenCopy = () => {
    setLoadingCopy(true);
    setOpen(true);
    setTimeout(function () {
      setOpen(false);
      setLoadingCopy(false);
    }, 500);
  };

  return (
    <article className={classes.min} ref={element} key={uid}>
      {show && (
        <Fragment>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={fotoPortadaCard}
                title={titulo}
              />

              <div
                className={classes.titulo}
                onClick={() => {
                  navigate(`/album/${uid}`);
                }}
              >
                <h3> {titulo}</h3>
              </div>
              <div className={classes.fecha}>
                {" "}
                {reverseString(fechaCreacion.substring(0, 10))}
              </div>

              {!loadingLike ? (
                <>
                  {meGusta === "true" ? (
                    <div className={classes.like}>
                      <ThumbUpAltIcon
                        color="primary"
                        fontSize="small"
                        onClick={() => {
                          confirmLike();
                        }}
                      />
                      {likesCount}
                    </div>
                  ) : (
                    <div className={classes.like}>
                      <ThumbUpAltIcon
                        fontSize="small"
                        onClick={() => {
                          confirmLike();
                        }}
                      />
                      {likesCount}
                    </div>
                  )}
                </>
              ) : (
                <CircularProgress className={classes.spinnerSize} />
              )}

              <div className={classes.copy}>
                {!loadingCopy ? (
                  <CopyToClipboard text={urlCopy}>
                    <ShareIcon
                      fontSize="small"
                      onClick={() => {
                        handleClickOpenCopy();
                      }}
                    />
                  </CopyToClipboard>
                ) : (
                  <CopyToClipboard text={urlCopy}>
                    <ShareIcon
                      className={classes.color}
                      onClick={() => {
                        handleClickOpenCopy();
                      }}
                    />
                  </CopyToClipboard>
                )}
              </div>
              <div className={classes.owner}>
                <ListItem key={uid} role={undefined} dense button>
                  <ListItemAvatar>
                    <Avatar
                      alt={nombre + " " + apellido}
                      src={avatar ? avatar : AvatarImg}
                      onClick={() => handleListItemClick(uidUser)}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    primary={nombre + " " + apellido}
                    onClick={() => handleListItemClick(uidUser)}
                  />
                </ListItem>
              </div>

              <Typography className={classes.aboutTime}>{about}</Typography>
            </CardActionArea>
          </Card>
          <Dialog open={open}>
            <DialogContent>copied</DialogContent>
          </Dialog>
        </Fragment>
      )}
    </article>
  );
};

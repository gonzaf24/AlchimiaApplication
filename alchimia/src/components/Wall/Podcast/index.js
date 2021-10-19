import React, { useContext, useState, useEffect, Fragment } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Context } from "../../../Context";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import CardActionArea from "@material-ui/core/CardActionArea";
import { shortNameCustom, DEFAULT_IMAGE } from "../../Utils/utils";
import AvatarImg from "../../../assets/avatar.png";
import { useMutation } from "@apollo/react-hooks";
import { navigate } from "@reach/router";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { LIKE_PODCAST } from "../../../container/PodcastMutation";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import { aboutTime } from "../../Utils/utils";
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
    height: 250,
    flexGrow: 1,
    borderRadius: "0px",
    animation: `$myEffect 1250ms ${theme.transitions.easing.easeInOut}`,
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
  root1: {
    float: "left",
    width: "50%",
    borderRadius: "0px",
    backgroundColor: "#d47430fa",
    height: "200px",
    animation: `$myEffect 1250ms ${theme.transitions.easing.easeInOut}`,
  },
  root2: {
    float: "right",
    width: "50%",
    borderRadius: "0px",
    backgroundColor: "#bd741880",
    height: "200px",
    animation: `$myEffect 1250ms ${theme.transitions.easing.easeInOut}`,
  },
  details: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: "100%",
    right: 0,
    float: "right",
    height: "200px",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    borderRadius: 100,
    padding: 8,
    marginLeft: 30,
    backgroundColor: "#1b12065e",
    color: "rgba(0, 0, 0, 0.54)",
    height: 50,
    width: 50,
  },
  size09: {
    fontSize: "0.9em",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    lineHeight: 1.3,
    letterSpacing: "0.00938em",
    textTransform: "uppercase",
  },
  size07: {
    fontSize: "0.7em",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "0.00938em",
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
    right: "8%",
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
    right: "27%",
    zIndex: "2",
    animation: "pulse 5s infinite",
  },
  min: {
    minHeight: 120,
  },
}));

export const Podcast = ({
  uid,
  fechaCreacion,
  autor,
  titulo,
  audio,
  contenido,
  fotoPortada,
  type,
  email,
  nombre,
  apellido,
  avatar,
  likes,
  like,
}) => {
  const classes = useStyles();
  const { user } = useContext(Context);
  const labelId = `checkbox-list-label-${uid}`;
  const uidUser = uid.substring(0, uid.lastIndexOf("|"));
  const [meGusta, setMeGusta] = useState(like);
  const [loadingLike, setLoadingLike] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [likePodcast, {}] = useMutation(LIKE_PODCAST);
  const [open, setOpen] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  var fotoPortadaCard = "";
  if (!fotoPortada || fotoPortada === "") {
    fotoPortadaCard = DEFAULT_IMAGE;
  } else {
    fotoPortadaCard = fotoPortada;
  }
  const { setAbrirReproductor, setAudio } = useContext(Context);
  const [about, setAbout] = useState("");
  const url = window.location.href;
  var urlCopy = url.substring(0, url.lastIndexOf("home/")) + "podcast/" + uid;
  const [show, element] = useNearScreen();

  const [uniqueKey, setUniqueKey] = useState(uniqid());

  const enviarAbrirAudio = (audioSource, titulo, autor) => {
    const audio = {
      audio: audioSource,
      titulo: titulo,
      autor: autor,
    };
    setAbrirReproductor(true);
    setAudio(audio);
  };

  const confirmLike = async () => {
    if (user.uid != uidUser) {
      setLoadingLike(true);
      const input = { podcastID: uid, userId: user.uid };
      const result = await likePodcast({
        variables: { input },
      });
      if (result) {
        setLikesCount(result.data.likePodcast.likes.length);
        setMeGusta(
          result.data.likePodcast.likes.includes(user.uid) ? "true" : "false"
        );
        setLoadingLike(false);
      } else {
        setLoadingLike(false);
      }
    }
  };

  const handleListItemClick = async (value) => {
    navigate(`/user/${value}`);
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
            <CardActionArea className={classes.root1}>
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography
                    className={classes.size09}
                    onClick={() => {
                      navigate(`/podcast/${uid}`);
                    }}
                  >
                    {shortNameCustom(40, titulo)}
                  </Typography>
                  <Typography
                    className={classes.size07}
                    color="textSecondary"
                    onClick={() => {
                      navigate(`/podcast/${uid}`);
                    }}
                  >
                    {shortNameCustom(140, contenido)}
                  </Typography>
                </CardContent>
                <div className={classes.controls}>
                  <IconButton aria-label="play/pause">
                    <PlayArrowIcon
                      className={classes.playIcon}
                      onClick={() => {
                        enviarAbrirAudio(audio, titulo, autor);
                      }}
                    />
                  </IconButton>
                </div>
                <div className={classes.controls}>
                  <Typography className={classes.size09}>
                    {shortNameCustom(15, autor)}
                  </Typography>
                </div>
              </div>

              <div className={classes.owner}>
                <ListItem key={uid} role={undefined} dense button>
                  <ListItemAvatar>
                    <Avatar
                      alt="Remy Sharp"
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
            </CardActionArea>
            <CardActionArea className={classes.root2}>
              <CardMedia
                className={classes.cover}
                image={fotoPortada}
                onClick={() => {
                  navigate(`/podcast/${uid}`);
                }}
              ></CardMedia>
              <Typography className={classes.aboutTime}>{about}</Typography>
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

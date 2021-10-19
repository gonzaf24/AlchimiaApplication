import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ShareIcon from "@material-ui/icons/Share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import { Context } from "../../Context";
import { useMutation } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";
import { LIKE_PODCAST } from "../../container/PodcastMutation";
import { navigate } from "@reach/router";
import AudioPlayer from "material-ui-audio-player";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import { reverseString } from "../Utils/utils";

const muiTheme = createMuiTheme({});

const styleAudioPlayer = makeStyles((theme) => {
  return {
    root: {
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: 0,
        paddingTop: 10,
      },
    },

    playIcon: {
      color: "#f50057",
      "&:hover": {
        color: "#ff4081",
      },
    },
    pauseIcon: {
      color: "#0099ff",
    },
    volumeIcon: {
      color: "rgba(0, 0, 0, 0.54)",
    },
    volumeSlider: {
      color: "black",
    },
    progressTime: {
      color: "rgba(0, 0, 0, 0.54)",
    },
    mainSlider: {
      color: "#3f51b5",
      "& .MuiSlider-rail": {
        color: "#7986cb",
      },
      "& .MuiSlider-track": {
        color: "#3f51b5",
      },
      "& .MuiSlider-thumb": {
        color: "#303f9f",
      },
    },
  };
});

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  root5: {
    height: "5px",
  },
  root10: {
    height: "10px",
  },
  root20: {
    height: "20px",
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
  avatar: {
    cursor: "pointer",
    marginTop: "-40px",
    marginLeft: "15px",
    width: theme.spacing(4),
    height: theme.spacing(4),
    boxShadow: "0px 0px 20px 20px rgba(255, 253, 255, 0.14)",
  },
  nameUser: {
    cursor: "pointer",
    marginTop: "-26px",
    marginLeft: "65px",
    width: "100%",
    height: theme.spacing(4),
    boxShadow: "0px 0px 20px 20px rgba(255, 253, 255, 0.14)",
    color: "#fff7f791",
  },
  cardFondoAvatar: {
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
  },
  autor: {
    textAlign: "right",
    color: "#e91e63",
  },
  fechaShow: {
    textAlign: "right",
    marginRight: 10,
    color: "#e91e63",
  },
  margin: {
    margin: "10px",
  },
  textRight: {
    textAlign: "right",
    paddingBottom: "180px",
    marginRight: "15px",
  },
  spinnerSize: {
    width: "20px !important",
    height: "20px !important",
    marginBottom: 7,
    marginRight: 10,
  },
  color: {
    color: "#e91e63",
  },
  media: {
    height: 250,
    opacity: 0.5,
    background: "rgba(black, 0.5)",
  },
  audioP: {
    margin: "0px !important",
    width: "500px",
  },
  copy: {
    marginLeft: "15px",
    marginBottom: "-10px",
  },
}));

export const Podcast = ({ loading, podcast }) => {
  const classes = useStyles();
  const { user } = useContext(Context);
  const uidUserPodcast = podcast.uid.substring(0, podcast.uid.lastIndexOf("|"));
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [podcastLikes, setPodcastLikes] = useState(podcast.likes);
  const [like, setLike] = useState(() => {
    if (podcastLikes && user && user.uid) {
      return podcastLikes.includes(user.uid);
    } else {
      return false;
    }
  });
  const [likePodcast, {}] = useMutation(LIKE_PODCAST);
  var uid = podcast.uid.substring(0, podcast.uid.lastIndexOf("|"));
  var i = 0;
  const url = window.location.href;
  const [open, setOpen] = useState(false);

  const handleClickOpenCopy = () => {
    setLoadingCopy(true);
    setOpen(true);
    setTimeout(function () {
      setOpen(false);
      setLoadingCopy(false);
    }, 500);
  };

  const confirmLike = async () => {
    if (user && user.uid != uidUserPodcast) {
      setLoadingLike(true);
      const input = { podcastID: podcast.uid, userId: user.uid };
      const result = await likePodcast({
        variables: { input },
      });
      if (result) {
        setPodcastLikes(result.data.likePodcast.likes);
        setLike(result.data.likePodcast.likes.includes(user.uid));
        setLoadingLike(false);
      } else {
        setLoadingLike(false);
      }
    }
  };

  return (
    <>
      <CardMedia
        className={classes.cardFondoAvatar}
        component="img"
        alt="imagen fondo"
        height="50"
        image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
        title="profile background"
      />
      <Avatar
        className={classes.avatar}
        alt={podcast.nombre}
        src={podcast.avatar}
        onClick={() => {
          navigate(`/user/${uid}`);
        }}
      />
      <div
        className={classes.nameUser}
        onClick={() => {
          navigate(`/user/${uid}`);
        }}
      >
        {podcast.nombre} {podcast.apellido}
      </div>

      <div className={classes.root5}></div>
      <CardMedia
        component="img"
        alt="imagen fondo"
        height="3"
        image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
        title="profile background"
      />
      <div className={classes.root}>
        <h2>{podcast.titulo}</h2>
      </div>
      <CardMedia
        component="img"
        alt="imagen fondo"
        height="3"
        image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
        title="profile background"
      />
      <div className={classes.root5}></div>

      <CardMedia
        component="img"
        alt="imagen fondo"
        height="3"
        image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
        title="profile background"
      />

      <CardMedia className={classes.media} image={podcast.fotoPortada} />
      <ThemeProvider theme={muiTheme}>
        <AudioPlayer
          useStyles={styleAudioPlayer}
          src={podcast.audio}
          controls={true}
          elevation={5}
          width="100%"
          variation="primary"
          spacing={1}
          autoplay={false}
          order="standart"
        />
      </ThemeProvider>

      <div className={classes.margin}>
        <div className={classes.root10}></div>
        <div>
          <h3> {podcast.subtitulo}</h3>
        </div>

        <div className={classes.root10}></div>

        {podcast.contenido}

        <div className={classes.root20}></div>
        <div className={classes.autor}>{podcast.autor}</div>
        <div className={classes.root10}></div>
        <div className={classes.fechaShow}>
          {reverseString(podcast.fechaCreacion.substring(0, 10))}
        </div>

        <div className={classes.root20}></div>

        <div className={classes.textRight}>
          {!loadingLike ? (
            <>
              {like && (
                <>
                  <Badge color="primary" badgeContent={podcastLikes.length}>
                    <ThumbUpAltIcon
                      className={classes.color}
                      fontSize="large"
                      onClick={() => {
                        confirmLike();
                      }}
                    />
                  </Badge>
                </>
              )}
              {!like && (
                <>
                  <Badge color="primary" badgeContent={podcastLikes.length}>
                    <ThumbUpAltIcon
                      fontSize="large"
                      onClick={() => {
                        confirmLike();
                      }}
                    />
                  </Badge>
                </>
              )}
            </>
          ) : (
            <CircularProgress className={classes.spinnerSize} />
          )}
          {!loadingCopy ? (
            <CopyToClipboard text={url} className={classes.copy}>
              <ShareIcon
                fontSize="large"
                onClick={() => {
                  handleClickOpenCopy();
                }}
              />
            </CopyToClipboard>
          ) : (
            <CopyToClipboard text={url} className={classes.copy}>
              <ShareIcon
                className={classes.color}
                fontSize="large"
                onClick={() => {
                  handleClickOpenCopy();
                }}
              />
            </CopyToClipboard>
          )}
        </div>

        <Dialog open={open}>
          <DialogContent>copiado</DialogContent>
        </Dialog>
      </div>
    </>
  );
};

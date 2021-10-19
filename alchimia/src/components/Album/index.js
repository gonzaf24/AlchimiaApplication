import React, { useState, useContext } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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
import { LIKE_ALBUM } from "../../container/AlbumMutation";
import { navigate } from "@reach/router";
import Badge from "@material-ui/core/Badge";

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
    marginRight: "100px",
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
  copy: {
    marginLeft: "15px",
    marginBottom: "-10px",
  },
}));

export const Album = ({ loading, album }) => {
  const classes = useStyles();
  const { user } = useContext(Context);
  const uidUserAlbum = album.uid.substring(0, album.uid.lastIndexOf("|"));
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [albumLikes, setAlbumLikes] = useState(album.likes);
  const [like, setLike] = useState(() => {
    if (albumLikes && user && user.uid) {
      return albumLikes.includes(user.uid);
    } else {
      return false;
    }
  });
  const [likeAlbum, {}] = useMutation(LIKE_ALBUM);
  var uid = album.uid.substring(0, album.uid.lastIndexOf("|"));
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
    if (user && user.uid != uidUserAlbum) {
      setLoadingLike(true);
      const input = { albumID: album.uid, userId: user.uid };
      const result = await likeAlbum({
        variables: { input },
      });
      if (result) {
        setAlbumLikes(result.data.likeAlbum.likes);
        setLike(result.data.likeAlbum.likes.includes(user.uid));
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
        alt={album.nombre}
        src={album.avatar}
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
        {album.nombre} {album.apellido}
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
        <h2>{album.titulo}</h2>
      </div>
      <CardMedia
        component="img"
        alt="imagen fondo"
        height="3"
        image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
        title="profile background"
      />
      <div className={classes.root5}></div>
      <Carousel
        showArrows={true}
        showArrows={true}
        showIndicators={true}
        showStatus={true}
        showThumbs={true}
        stopOnHover={true}
        swipeable={true}
      >
        {album.fotos &&
          album.fotos.map((foto) => (
            <div key={i++}>
              <img src={foto} />
              {/* <p className="legend">Legend 1</p> */}
            </div>
          ))}
      </Carousel>
      <CardMedia
        component="img"
        alt="imagen fondo"
        height="3"
        image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
        title="profile background"
      />
      <div className={classes.margin}>
        <div className={classes.root10}></div>
        <div>
          <h3> {album.subtitulo}</h3>
        </div>

        <div className={classes.root10}></div>
        {album.contenido}
        {album.autor && (
          <>
            <div className={classes.root20}></div>
            <div className={classes.autor}>{album.autor}</div>
          </>
        )}
        <div className={classes.root20}></div>

        <div className={classes.textRight}>
          {!loadingLike ? (
            <>
              {like && (
                <>
                  <Badge color="primary" badgeContent={albumLikes.length}>
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
                  <Badge color="primary" badgeContent={albumLikes.length}>
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

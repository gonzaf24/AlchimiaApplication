import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import AvatarImg from "../../assets/avatar.png";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { navigate } from "@reach/router";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import PostAddIcon from "@material-ui/icons/PostAdd";
import Avatar from "@material-ui/core/Avatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import { Link } from "@reach/router";
import Typography from "@material-ui/core/Typography";
import { ChatDirect } from "../Modales/Chat/ChatDirect";
import { Context } from "../../Context";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "20px",
  },
  imagen: {
    borderRadius: "50%",
    height: "25px",
    width: "25px",
  },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },

  mensaje: {
    cursor: "pointer",
    position: "absolute",
    color: "#d89090",
    zIndex: "2",
    top: "-80px !important",
  },
}));

export const DialogPerfiles = ({
  openDialog,
  onCloseDialog,
  perfiles,
  titulo,
  loading,
}) => {
  const classes = useStyles();

  const { user } = useContext(Context);

  const handleListItemClick = async (value) => {
    loading = true;
    navigate(`/user/${value}`);
    onCloseDialog();
    loading = false;
  };

  return (
    <>
      <Dialog open={openDialog} onClose={onCloseDialog}>
        <DialogTitle id="simple-dialog-title">
          {titulo === "Likes" && (
            <ThumbUpAltIcon color="primary" fontSize="small" />
          )}
          {titulo === "Apuntados" && (
            <PostAddIcon color="primary" fontSize="small" />
          )}
          {titulo}
        </DialogTitle>

        {loading ? (
          <div className={classes.spinner}>
            <CircularProgress />
          </div>
        ) : (
          <List className={classes.root}>
            {perfiles &&
              perfiles.map((perfil) => {
                const labelId = `checkbox-list-label-${perfil.uid}`;

                return (
                  <ListItem
                    key={perfil.uid}
                    role={undefined}
                    dense
                    button
                    /* onClick={handleToggle(value)} */
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src={perfil.avatar ? perfil.avatar : AvatarImg}
                        onClick={() => handleListItemClick(perfil.uid)}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      id={labelId}
                      primary={perfil.nombre + " " + perfil.apellido}
                      onClick={() => handleListItemClick(perfil.uid)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments">
                        <Typography className={classes.mensaje}>
                          <ChatDirect
                            uidSender={user.uid}
                            uidReceiver={perfil.uid}
                            emailSender={user.email}
                            emailReceiver={perfil.email}
                            avatar={perfil.avatar}
                            nombre={perfil.nombre + " " + perfil.apellido}
                          />
                        </Typography>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
          </List>
        )}
      </Dialog>
    </>
  );
};

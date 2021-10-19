import React, { useContext, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Context } from "../../Context";
import { Actividad } from "./Actividad/index";
import { Album } from "./Album/index";
import { Usuario } from "./Usuario/index";
import { Podcast } from "./Podcast/index";
import Divider from "@material-ui/core/Divider";
import { useNearScreen } from "../../hooks/useNearScreen";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "150vh",
    backgroundColor: "white",
    flexGrow: 1,
    paddingBottom: "250px",
    borderRadius: 0,
  },
  divider: {
    height: "15px",
    background: "white",
  },
}));

export const Wall = ({ loading, wall }) => {
  const classes = useStyles();
  const { user } = useContext(Context);
  const [follow, setFollow] = useState(false);

  return (
    <Fragment>
      {wall && (
        <Fragment>
          <ul className={classes.root}>
            {wall.map((item) => {
              if (item.type === "usuario") {
                return (
                  <Fragment key={item.uid}>
                    <Usuario {...item} />
                    <Divider className={classes.divider} variant="fullWidth" />
                  </Fragment>
                );
              }
              if (item.type === "album") {
                return (
                  <Fragment key={item.uid}>
                    <Album {...item} />
                    <Divider className={classes.divider} variant="fullWidth" />
                  </Fragment>
                );
              }
              if (item.type === "actividad") {
                return (
                  <Fragment key={item.uid}>
                    <Actividad {...item} />
                    <Divider className={classes.divider} variant="fullWidth" />
                  </Fragment>
                );
              }
              if (item.type === "podcast") {
                return (
                  <Fragment key={item.uid}>
                    <Podcast {...item} />
                    <Divider className={classes.divider} variant="fullWidth" />
                  </Fragment>
                );
              }
            })}
          </ul>
        </Fragment>
      )}
    </Fragment>
  );
  return "";
};

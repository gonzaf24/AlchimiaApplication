import React, { useState, useContext, useEffect } from "react";
import { Link, Nav } from "./styles";
import {
  MdHome,
  MdPersonOutline,
  MdMessage,
  MdAddToPhotos,
  MdHighlightOff,
  MdThumbUp,
  MdSearch,
} from "react-icons/md";
import Button from "@material-ui/core/Button";
import { Context } from "../../Context";
import { navigate } from "@reach/router";
import Badge from "@material-ui/core/Badge";

var chatModel = require("../../service/chatModel");

const firebaseApp = require("firebase/app");

const SIZE = "32px";

export const NavBar = () => {
  var currentState = window.location.pathname;
  const { user, removeAuth } = useContext(Context);
  const [msgNotSeen, setMsgNotSeen] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const emailEdited = user.email.replace(".", ",");
      firebaseApp
        .database()
        .ref("/chats/" + emailEdited)
        .on("value", async function (snapshot) {
          setMsgNotSeen(await chatModel.obtenerCountNotSeen(user.email));
        });
    }
    fetchData();
  }, []);

  return (
    <>
      {user && user.uid && (
        <Nav>
          <Link to={`/home/${user.uid}`}>
            <MdHome size={SIZE} />
          </Link>
          <Link to={`/search/${user.uid}`}>
            <MdSearch size={SIZE} />
          </Link>
          <Link to={`/adm/${user.uid}`}>
            <MdAddToPhotos size={SIZE} />
          </Link>
          <Link to={`/user/${user.uid}`}>
            <MdPersonOutline size={SIZE} />
          </Link>
          <Link to={`/mensajes/${user.uid}`}>
            <Badge color="primary" badgeContent={msgNotSeen}>
              <MdMessage size={SIZE} />
            </Badge>
          </Link>
          {/*  <Button
            onClick={() => {
              removeAuth();
            }}
          >
            <MdHighlightOff size={SIZE} />
          </Button> */}
        </Nav>
      )}
      {(!user || !user.uid) && (
        <Nav>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign in
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate("/registro");
            }}
          >
            Sign up
          </Button>
        </Nav>
      )}
    </>
  );
};

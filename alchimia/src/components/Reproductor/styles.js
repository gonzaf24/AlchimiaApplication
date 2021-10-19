import styled from "styled-components";
import { Link as LinkRouter } from "@reach/router";
import { fadeIn } from "../../styles/animations";

export const Nav = styled.nav`
  ${fadeIn({ time: "0.5s" })};
  align-items: center;
  background: #e91e63;
  border-top: 2px solid #e91e63;
  bottom: 110px;
  display: block;
  height: 55px;
  justify-content: space-around;
  left: 0;
  margin: 0 auto;
  max-width: 500px;
  position: fixed;
  right: 0;
  width: 100%;
  z-index: 1000;
`;

export const TextoMove = styled.div`
  position: relative;
  animation: myfirst infinite;
  animation-duration: 10s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  width: fit-content;
  margin-top: 5px;
  z-index: 1000;

  @keyframes myfirst {
    from {
      left: -150px;
    }
    to {
      left: 400px;
    }
  }
`;

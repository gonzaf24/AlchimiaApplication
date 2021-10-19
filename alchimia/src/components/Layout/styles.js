import styled from "styled-components";
import { Link as LinkRouter } from "@reach/router";

export const DivBody = styled.div`
  height: 100%;
  min-height: 100vh;
  background: white;
`;

export const Link = styled(LinkRouter)``;

export const DivHeader = styled.div`
  background-color: #e91e63;
  padding-top: 13px;
  padding-bottom: 5px;
  height: 40px;
`;

export const DivHeader1 = styled.div`
  background-color: #001121;
  padding: 0px;
  height: 2px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #222;
  padding-bottom: 8px;
`;

export const Subtitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: #333;
  padding-bottom: 4px;
`;

export const Image = styled.img`
  text-align: center;
`;

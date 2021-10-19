import styled from "styled-components";
import { Button as ButtomRouter } from "@material-ui/core";

export const Button = styled(ButtomRouter)`
  text-transform: none !important;
  width: -webkit-fill-available;
  margin-top: 20px;
  &[disabled] {
    opacity: 0.3;
  }
`;

import { keyframes, css } from "styled-components";

const fadeInKeyframes = keyframes`
  from {
    filter: blur(5px);
    opacity: 0;
  }

  to {
    filter: blur(0);
    opacity: 1;
  }
`;

export const fadeIn = ({ time = "1s", type = "ease" } = {}) =>
  css`
    animation: ${time} ${fadeInKeyframes} ${type};
  `;

const fadeInKeyframesSize = keyframes`
  from {
    font-size: 14px;
    opacity: 0;
  }

  to {
    font-size: 10px;
    opacity: 1;
  }
`;

export const efectoSize = ({ time = "3s", type = "ease" } = {}) =>
  css`
    animation: ${time} ${fadeInKeyframesSize} ${type};
  `;

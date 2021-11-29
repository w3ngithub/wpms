import React from "react";
import Wrapper from "../Wrapper";
import { grey } from "@material-ui/core/colors";

function Icon({ Icon, onClick, style, ...rest }) {
  return (
    <Wrapper onClick={onClick} {...rest}>
      <Icon style={{ color: grey[50], ...style }} />
    </Wrapper>
  );
}

export default Icon;

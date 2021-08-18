import React from "react";
import Wrapper from "../Wrapper";
import { grey } from "@material-ui/core/colors";

function Icon({ Icon }) {
  return (
    <Wrapper>
      <Icon style={{ color: grey[50] }} />
    </Wrapper>
  );
}

export default Icon;

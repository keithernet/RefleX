import React from "react";
import {useObservable} from "reflex";

export const SimpleProp = (props) => {
  return (
    <h1>Component count: {props.value}</h1>
  );
};

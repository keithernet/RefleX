import React from "react";
import {useObservable} from "reflex";

export const TextDisplay = (props) => {
  const state = useObservable(props.text, null);

  return (
    <div>{state}</div>
  );
};

import React from "react";
import {useObservable} from "reflex";

export const NumberDisplay = (props) => {
  const state = useObservable(props.count, 0);

  return (
    <div>{state}</div>
  );
};

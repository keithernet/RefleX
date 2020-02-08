import React from "react";
import {useObservable} from "reflex";

export const Combined = props => {
  const [even, odd] = useObservable(props.streams, []);

  return (
    <div>{even}: {odd}</div>
  );
};

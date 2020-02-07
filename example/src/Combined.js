import React from "react";
import {useObservables} from "reflex";

export const Combined = props => {
  const [even, odd] = useObservables(props.streams, []);

  return (
    <div>{even}: {odd}</div>
  );
};

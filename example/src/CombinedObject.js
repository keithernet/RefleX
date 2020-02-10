import React from "react";
import {useObservable} from "reflex";

export const CombinedObject = ({streams}) => {
  const {even, odd} = useObservable(streams, []);

  return (
    <div>{even}: {odd}</div>
  );
};

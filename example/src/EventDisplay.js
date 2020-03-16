import React from "react";
import {applicationEvents$, useObservable} from "reflex";
import {tap, map, scan} from "rxjs/operators";

export const EventDisplay = () => {
  const event = useObservable(applicationEvents$.pipe(
    scan((acc, curr) => [curr].concat(acc), [])));

  const toString = (obj) => JSON.stringify(obj, null, '\n\t');

  return (
    <div>{toString(event)}</div>
  );
};

import React, {useState} from "react";
import {useObservable} from "reflex";
import {Subject} from "rxjs";

export const WithInternalState = ({streams}) => {
    const [clicks, setClicks] = useState(0);
    const [clicks$] = useState(new Subject());

    const localObservableState = useObservable(clicks$, 0);
    const {even, odd} = useObservable(streams, {});

    const click = () => {
      clicks$.next(Math.random());
      setClicks(clicks + 1);
    };

    return (
      <div>
        <h3>Local state too!</h3>
        <div>{even}: {odd}</div>
        <div>Local state: <b>{clicks}</b></div>
        <div>Local observable values: <b>{localObservableState}</b></div>
        <button onClick={click}>Change value</button>
      </div>
    );
  }
;

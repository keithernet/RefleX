import {combineLatest} from "rxjs";
import {useEffect, useState} from "react";

export function useObservable(stream, initial){
  const [state, setState] = useState(initial);
  useEffect(() => {
    const unsub = stream.subscribe(value => setState(value));
    return () => {
      console.log('unsubscribing');
      unsub.unsubscribe();
    }
  }, []);

  return state;
}

export function useObservables(observables, initial){
  const [state, setState] = useState(initial);
  const all$ = combineLatest(...observables);

  useEffect(() => {
    const unsub = all$.subscribe(all => setState(all));
    return () => {
      console.log('unsubscribing');
      unsub.unsubscribe();
    }
  }, []);

  return state;
}

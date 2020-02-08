import {combineLatest, isObservable} from "rxjs";
import {useEffect, useState} from "react";

export function useObservable(sources, initial){
  const sourceList = toList(sources);
  verify(sourceList);

  return attachStream(sourceList, initial);
}

function attachStream(sources, initial){
  const [state, setState] = useState(initial);

  useEffect(() => {
    const source$ = combineLatest(...sources);
    const unsub = source$.subscribe(setState);

    return () => {
      unsub.unsubscribe();
    }
  }, []);

  return state;
}

function verify(hopefuls){
  const nonObservables = hopefuls.reduce((acc, curr, idx) => !isObservable(curr) ? acc.concat({obj: curr, idx}) : acc, []);

  if(nonObservables.length > 0){
    const message = nonObservables.reduce((acc, curr) => `${acc} Item ${curr.idx} is ${typeof curr.obj}.`, '');
    throw new Error(`useObservable can only attach to observables. ${message}`);
  }
}

function toList(items){
  return Array.isArray(items) ? items : [items];
}

import {combineLatest, isObservable} from "rxjs";
import {useEffect, useState} from "react";
import {compose, fromPairs, keys, values, zip} from "ramda";

export function useObservable(sources, initial){
  if(Array.isArray(sources) || isObservable(sources)){
    return attachArray(asList(sources), initial);
  } else{
    return attachObject(sources, initial);
  }
}

function attachArray(sources, initial){
  verify(sources);
  const [state, setState] = useState(initial);

  useStreamEffect(sources, setState);

  return state;
}

function attachObject(source, initial){
  const [sourceKeys, streams] = [keys(source), values(source)];
  verify(streams);
  const [state, setState] = useState(initial);

  const toStateObject = compose(setState, fromPairs, zip(sourceKeys));

  useStreamEffect(streams, toStateObject);

  return state;
}

function useStreamEffect(sources, setState){
  useEffect(() => {
    const source$ = combineLatest(sources);
    const unsub = source$.subscribe(setState);

    return () => {
      unsub.unsubscribe();
    }
  }, []);
}

function verify(hopefuls){
  const nonObservables = hopefuls.reduce((acc, curr, idx) => !isObservable(curr) ? acc.concat({
    obj: curr,
    idx
  }) : acc, []);

  if(nonObservables.length > 0){
    const message = nonObservables.reduce((acc, curr) => `${acc} Item ${curr.idx} is ${typeof curr.obj}.`, '');
    throw new Error(`useObservable can only attach to observables. ${message}`);
  }
}

function asList(items){
  return Array.isArray(items) ? items : [items];
}

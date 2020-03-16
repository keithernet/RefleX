import {BehaviorSubject, merge, Observable, pipe} from "rxjs";
import {filter, scan, startWith} from "rxjs/operators";

let eventStreams$ = new Observable();
const allEvents$ = new BehaviorSubject(null);
let unsub = () => {};

export function addEventStream(stream$){
  eventStreams$ = merge(eventStreams$, stream$);

  unsub();
  unsub = eventStreams$.subscribe(allEvents$);
  console.log(unsub);
}

export function dispatch(event){
  allEvents$.next(event);
}

export const applicationEvents$ = allEvents$.pipe(filter(a => a)).asObservable();

export function addReducer(reducer, initialValue = null){
  return pipe(
    scan(reducer, initialValue),
    startWith(initialValue));
}


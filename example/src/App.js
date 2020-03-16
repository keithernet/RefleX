import React from 'react';
import './App.css';
import {interval, merge, of, ReplaySubject} from "rxjs";
import {delay, filter, map, pluck, startWith, withLatestFrom} from "rxjs/operators";
import {NumberDisplay} from "./NumberDisplay";
import {EventDisplay} from "./EventDisplay";
import {Combined} from "./Combined";
import {TextDisplay} from "./TextDisplay";
import {times} from "ramda";
import {CombinedObject} from "./CombinedObject";
import {WithInternalState} from "./WithInternalState";
import {addReducer, applicationEvents$, dispatch, useObservable} from 'reflex';
import {SimpleProp} from "./SimpleProp";

const timer$ = interval(500); // .pipe(tap(i => console.log(i)));
const other$ = merge(of({type: 'text', value: 'first value'}),
  of({type: 'text', value: 'second value'}).pipe(delay(3000)));

const aggregate$ = timer$.pipe(
  withLatestFrom(other$),
  map(([time, text]) => ({time, text})),
  startWith({time: 0, text: 'empty'})
);

const state$ = new ReplaySubject();
aggregate$.subscribe(state$);

const time$ = state$.pipe(pluck('time'));
const evens$ = time$.pipe(filter(c => c % 2 === 0));
const odds$ = time$.pipe(filter(c => c % 2 !== 0));

const clickCounts$ = applicationEvents$.pipe(filter(a => a.type === 'global'), addReducer((state, event) => state + event.value, 1));
const text$ = applicationEvents$.pipe(filter(a => a.type === 'text'), addReducer((state, event) => event.value, ''));

other$.subscribe(a => dispatcha));

const App = () => {
  const componentCount = useObservable(clickCounts$, 1);

  const setComponentCount = count => {
    dispatch({type: 'global', value: count});
  };

  const getCounter = i => (i % 2 === 0)
    ? (<div key={i}>Even events: <NumberDisplay count={evens$}/></div>)
    : (<div key={i}>Odd events: <NumberDisplay count={odds$}/></div>);

  return (
    <div className="App">
      <h1><TextDisplay text={text$}/></h1>
      <button onClick={() => setComponentCount(+1)}>Add</button>
      <button onClick={() => setComponentCount(-1)}>Remove</button>
      <div>
        <SimpleProp value={componentCount}/>
        {times((idx) => getCounter(idx), componentCount)}

      </div>
      <div>
        <h3>Both</h3>
        <Combined streams={[evens$, odds$]}/>
        <CombinedObject streams={({even: evens$, odd: odds$})}/>
        <WithInternalState streams={({even: evens$, odd: odds$})}/>
        <EventDisplay/>
      </div>
    </div>
  );
};

export default App;

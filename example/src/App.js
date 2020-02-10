import React, {useState} from 'react';
import './App.css';
import {interval, merge, of, ReplaySubject} from "rxjs";
import {delay, filter, map, pluck, startWith, withLatestFrom} from "rxjs/operators";
import {NumberDisplay} from "./NumberDisplay";
import {Combined} from "./Combined";
import {TextDisplay} from "./TextDisplay";
import {times} from "ramda";
import {CombinedObject} from "./CombinedObject";

const timer$ = interval(500); // .pipe(tap(i => console.log(i)));
const other$ = merge(of('first value'), of('second value').pipe(delay(10000)));

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

const App = () => {
  const [componentCount, setComponentCount] = useState(2);

  const getCounter = i => (i % 2 === 0)
    ? (<div key={i}>Even events: <NumberDisplay count={evens$}/></div>)
    : (<div key={i}>Odd events: <NumberDisplay count={odds$}/></div>);

  return (
    <div className="App">
      <h1><TextDisplay text={state$.pipe(pluck('text'))}/></h1>
      <button onClick={() => setComponentCount(componentCount + 1)}>Add</button>
      <button onClick={() => setComponentCount(componentCount - 1)}>Remove</button>
      <div>
        {times((idx) => getCounter(idx), componentCount)}
      </div>
      <div>
        <h3>Both</h3>
        <Combined streams={[evens$, odds$]}/>
        <CombinedObject streams={({even: evens$, odd: odds$})}/>
      </div>
    </div>
  );
};

export default App;

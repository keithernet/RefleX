import React, {useState} from 'react';
import './App.css';
import {interval, merge, of, ReplaySubject} from "rxjs";
import {delay, filter, map, pluck, share, startWith, withLatestFrom} from "rxjs/operators";
import {NumberDisplay} from "./NumberDisplay";
import {Combined} from "./Combined";
import {TextDisplay} from "./TextDisplay";

const timer$ = interval(1000).pipe(share());

const other$ = merge(of('first value'), of('second value').pipe(delay(10000)));

const aggregate$ = timer$.pipe(
  withLatestFrom(other$),
  map(([time, text]) => ({time, text})),
  startWith({time: 0, text: 'empty'})
);

const state$ = new ReplaySubject();
aggregate$.subscribe(state$);

const App = () => {
  const [componentCount, setComponentCount] = useState([1, 1]);

  const time$ = state$.pipe(pluck('time'));
  const evens$ = time$.pipe(filter(c => c % 2 === 0));
  const odds$ = time$.pipe(filter(c => c % 2 !== 0));

  const getCounter = i => (i % 2 === 0)
    ? (<div key={i}>Even events: <NumberDisplay count={evens$}/></div>)
    : (<div key={i}>Odd events: <NumberDisplay count={odds$}/></div>);

  return (
    <div className="App">
      <h1><TextDisplay text={state$.pipe(pluck('text'))}/></h1>
      <button onClick={() => setComponentCount(componentCount.concat([1]))}>Add</button>
      <button onClick={() => setComponentCount(componentCount.slice(0, componentCount.length - 1))}>Remove</button>
      <div>
        {componentCount.map((c, i) => getCounter(i))}
      </div>
      <div>
        <h3>Both</h3>
        <Combined streams={[evens$, odds$]}/>
      </div>
    </div>
  );
};

export default App;

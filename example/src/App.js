import React, {useState} from 'react';
import './App.css';
import {interval, ReplaySubject} from "rxjs";
import {filter, share} from "rxjs/operators";
import {NumberDisplay} from "./NumberDisplay";
import {Combined} from "./Combined";

const timer = interval(1000).pipe(share());
const remember$ = new ReplaySubject();
timer.subscribe(remember$);

const App = () => {
  const [counts, setCount] = useState([1, 1]);
  const evens$ = remember$.pipe(filter(c => c % 2 === 0));
  const odds$ = remember$.pipe(filter(c => c % 2 !== 0));

  const getCounter = i => (i % 2 === 0)
    ? (<div>Even events: <NumberDisplay count={evens$}/></div>)
    : (<div>Odd events: <NumberDisplay count={odds$}/></div>);

  return (
    <div className="App">
      <button onClick={() => setCount(counts.concat([1]))}>Add</button>
      <button onClick={() => setCount(counts.slice(0, counts.length - 1))}>Remove</button>
      <div>
        {counts.map((c, i) => getCounter(i))}
      </div>
      <div>
        <h3>Both</h3>
        <Combined streams={[evens$, odds$]}/>
      </div>
    </div>
  );
};

export default App;

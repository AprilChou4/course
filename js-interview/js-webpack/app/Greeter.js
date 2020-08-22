//Greeter,js
import React, { useState, useEffect, useRef } from 'react';
import config from './config.json';
import styles from './Greeter.css'; //导入
import { setCookie, getCookie, removeCookie } from './cookie';
const Counter = () => {
  const [start, setStart] = useState(false);
  let [time, setTime] = useState(60);
  const currentTime = useRef(time);
  setCookie('lover', 'king love me');
  console.log(getCookie('lover'));
  removeCookie('lover');
  useEffect(() => {
    let timer;
    if (start) {
      timer = setInterval(() => {
        setTime(currentTime.current--);
        console.log(currentTime, '------currentTime-----');
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [start]);
  console.log(time, '-----time');
  return <div onClick={() => setStart(!start)}>{time}</div>;
};

// const Counter = () => {
//   const [start, setStart] = useState(false);
//   const [time, setTime] = useState(60);
//   useEffect(() => {
//     let timer;
//     if (start) {
//       timer = setInterval(() => {
//         setTime((t) => t - 1);
//         console.log(time, '----setInterval-----');
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [start]);
//   console.log(time, '-----time');
//   return <div onClick={() => setStart(!start)}>{time}</div>;
// };

export default Counter;

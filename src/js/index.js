import '@babel/polyfill';
import style from "../sass/index.scss";
import './pages/intro';
import Intro from './pages/intro';
import FlipCounter from './module/flipCounter'

const intro = new Intro();

//let currentDate = new Date();
let futureDate  = new Date(2019, 0, 23, 5);

//let diff = futureDate.getTime() - currentDate.getTime();
const flipCounter = new FlipCounter({
    ele:'#counter',
    parts:'dd-hh-mm-ss',
    type:'countdown'
});
intro.addEventListener('flipStart', ()=>{
    flipCounter.play(futureDate)
})
//
//document.querySelector('#counter').style('');  

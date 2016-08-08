import { createStore } from '../src';
import { linear } from '../src/interpolators';

import * as d3 from 'd3-selection';
import raf from 'raf';

const width = window.innerWidth;
const height = window.innerHeight;
const size = 100;
let time = 0;

const store = createStore({
  x: linear('x'),
  y: linear('y')
});

store.set(time, {
  x: (width - size) / 2,
  y: (height - size) / 2
});

const rect = d3.select('body')
               .append('svg')
               .attr('width', width)
               .attr('height', height)
               .on('mousemove', () => {
                 const e = d3.event;
                 store.set(time, store.sample(time));
                 store.set(time + 1000, { x: e.clientX - size / 2, y: e.clientY - size / 2 });
               })
               .append('rect')
               .attr('width', size)
               .attr('height', size)
               .style('fill', 'red');

raf(function tick (t) {
  // Animation logic
  time = t;
  const { x, y } = store.sample(time);
  rect.attr('x', x).attr('y', y);
  raf(tick);
});

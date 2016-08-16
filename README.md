# curve-store

A store for dealing with continuous values. Useful for complex animations.
Continue reading for background and example usage. [Click here for a demo](https://mathisonian.github.io/curve-store/).

## Motivation

*The idea for this module came from discussions with [@mikolalysenko](https://github.com/mikolalysenko/).
Credit largely goes to him. See [filtered-vector](https://github.com/mikolalysenko/filtered-vector) for
prior art.*

Curve store is a state container that intelligently deals with mapping discrete
values to a continuous curve. Its primary intended use case is for dealing with
complex animations over time, though there may be other applications.

The idea is that animation can be defined as a series of positions over time:
given an object at position `x, y` at time `t`, we should be able to define an
animation by promising that the object will be at some other position `x', y'` at
some future time `t'`, and infer the points along the path.

This is what `curve-store` gives you, a way to define state at a given time:

```js
store.set(currentTime, { x: x, y: y});
store.set(currentTime + 1000, { x: xprime, y: yprime});
```

and a way to sample points in between:

```js
store.sample(currentTime + 500);
// give { x: xval, y: yval } interpolated based on the points set above
```

Users can define how they want the interpolation to be handled. There are a few
built in helpers, for example:

```js
import { createStore } from 'curve-store';
import { linear } from 'curve-store/samplers';

const store = createStore({
   x: linear('x'),
   y: linear('y')
})
```

defines basic linear interpolation. There are also calculus functions to help
build out more complicated curves:

```js
import { createStore } from 'curve-store';
import { linear, derivative, integral } from 'curve-store/samplers';

const store = createStore({
  position: {
    x: linear('x'),
    y: linear('y')
  },
  velocity: {
    x: derivative('x'),
    y: derivative('y')
  },
  distance: {
    x: integral('x'),
    y: integral('y')
  }
});
```

You can also provide custom sampling functions, to get e.g. different easing curves
 (see below for more details).

## Installation

```
$ npm install --save curve-store
```

## Simple Example

```js
import { createStore } from 'curve-store';
import { linear, derivative } from 'curve-store/samplers';

const store = createStore({
  x: linear('x'),
  dx: derivative('x')
});

store.set(0, { x: 0 });
store.set(1, { x: 1 });

store.sample(0.25);
// --> { x: 0.25, dx: 1.0 }

```


## API

### `createStore(samplers)`

Creates a new `curve-store` that maps discrete input values onto a set
of continuous output values. The samplers object defines this mapping and defines
how to interpolate between points.

Basic usage:

```js
const store = createStore({
  outputX: linear('inputX')
});
```

### `store.set(time, values)`

Set values at a particular point in time.

Example:

```js
store.set(0, { inputX: 0 });
store.set(1, { inputX: 0 });
```

### store.sample(time)

Sample points at a particular time.

Example:

```js
store.sample(0.5);
// -> outputs { outputX: 0.5 }
```

The way that sampling occurs is defined based on the samplers object passed
to `createStore`.


### Custom sampling

```js

import { createStore } from 'create-store';
import { getPointBefore, getPointAfter } from 'create-store/utils';

const store = createStore({
  myKey: (t, state) => {
    const before = getPointBefore(state.myKey, t);
    // { time: 0, value: 0 }
    const after = getPointAfter(state.myKey, t);
    // { time: 1, value: 1}

    // Insert custom sampling code here
    return customVal;
  }
});

store.set(0, { myKey: 0 });
store.set(1, { myKey: 1 });

store.sample(0.25);
// { myKey: customVal }
```

## LICENSE

MIT

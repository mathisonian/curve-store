# curve-store

## Examples

### Simple Usage

```js
import { createStore } from 'curve-store';
import { linear, derivative } from 'curve-store/samplers';

const store = createStore({
  x: linear('x'),
  dx: derivative('dx')
});

store.set(0, { x: 0 });
store.set(1, { x: 1 });

store.sample(0.25);
// --> { x: 0.25, dx: 1.0 }

```

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

## Installation

```
$ npm install --save curve-store
```


## LICENSE

MIT

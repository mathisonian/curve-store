# curve-store

## Example

```js
import { createStore } from 'curve-store';
import { linear } from 'curve-store/interpolators';

const store = createStore({
  myKey: linear('myKey')
});

store.set(0, { myKey: 0 });
store.set(1, { myKey: 1 });

store.sample(0.25);
// --> { myKey: 0.25 }

```


## Installation

```
$ npm install --save curve-store
```


## LICENSE

MIT

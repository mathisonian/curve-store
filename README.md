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

let sample = store.sample(0.25);
expect(sample).toEqual({ myKey: 0.25 });

sample = store.sample(0.5);
expect(sample).toEqual({ myKey: 0.5 });

sample = store.sample(0.75);
expect(sample).toEqual({ myKey: 0.75 });
```


## Installation

```
$ npm install --save curve-store
```


## LICENSE

MIT

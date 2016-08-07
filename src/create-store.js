import { setAsLastPoint } from './utils';

class Store {
  constructor (samplerObj) {
    this.samplers = samplerObj;
  }

  state = {}

  set (setObj) {
    const { time, values } = setObj;
    Object.keys(values).forEach((key) => {
      const val = values[key];
      if (!this.state.hasOwnProperty(key)) {
        this.state[key] = [];
      }
      setAsLastPoint(this.state[key], t, val);
    });
  }

  sample (t) {
    const sample = {};
    Object.keys(this.samplers).forEach((samplerName) => {
      sample[samplerName] = this.samplers[samplerName](t, this.state);
    });
    return sample;
  }
}

export default = (samplerObj) => {
  return new Store(samplerObj);
}

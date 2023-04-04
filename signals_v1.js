class Signal {
  constructor(initialValue) {
    this._value = initialValue;
    this._dependents = new Set();
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notifyDependents();
    }
  }

  _notifyDependents() {
    for (const dependent of this._dependents) {
      dependent._update();
    }
  }

  _addDependent(dependent) {
    this._dependents.add(dependent);
  }

}


class Computed {
    constructor(computeFn, dependencies) {
      this._computeFn = computeFn;
      this._dependencies = dependencies;
      this._value = undefined;
      this._isStale = true;
  
      for (const dependency of this._dependencies) {
        dependency._addDependent(this);
      }
    }
  
    get value() {
      if (this._isStale) {
        this._recomputeValue();
      }
      return this._value;
    }
  
    _recomputeValue() {
      this._value = this._computeFn();
      this._isStale = false;
    }
  
    _update() {
      this._isStale = true;
    }
  
  }
  

  // Creating signals
const count = new Signal(0);
const multiplier = new Signal(2);

// Creating a computed value
const multipliedCount = new Computed(() => count.value * multiplier.value, [count, multiplier]);

console.log(multipliedCount.value); // 0

count.value = 4;
console.log(multipliedCount.value); // 2

multiplier.value = 5;
console.log(multipliedCount.value); // 3

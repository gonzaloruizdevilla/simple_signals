// Global variable to keep track of the currently accessed computed value
let currentComputed = null;

class Signal {
  constructor(initialValue) {
    this._value = initialValue;
    this._dependents = [];
  }

  get value() {
    if (currentComputed) {
      this._addDependent(currentComputed);
    }
    return this._value;
  }

  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notifyDependents();
    }
  }

  _addDependent(computed) {
    if (!this._dependents.includes(computed)) {
      this._dependents.push(computed);
    }
  }

  _removeDependent(computed) {
    this._dependents = this._dependents.filter((dep) => dep !== computed);
  }

  _notifyDependents() {
    for (const dependent of this._dependents) {
      dependent._update();
    }
  }
}

class Computed {
  constructor(computeFn) {
    this._computeFn = computeFn;
    this._value = undefined;
    this._isStale = true;
  }

  get value() {
    if (this._isStale) {
      currentComputed = this;
      this._recomputeValue();
      currentComputed = null;
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


function createSignal(initialValue) {
    return new Signal(initialValue);
  }
  
  function createComputed(computeFn) {
    return new Computed(computeFn);
  }
  
  // Creating signals
  const count = createSignal(0);
  const multiplier = createSignal(2);
  
  // Creating a computed value
  const multipliedCount = createComputed(() => count.value * multiplier.value);
  
  console.log(multipliedCount.value); // 0
  
  count.value = 2;
  console.log(multipliedCount.value); // 4
  
  multiplier.value = 3;
  console.log(multipliedCount.value); // 6
  

// Global variable to keep track of the currently accessed computed or effect
let currentAccessed = null;

class Signal {
  constructor(initialValue) {
    this._value = initialValue;
    this._dependents = [];
  }

  get value() {
    if (currentAccessed) {
      this._addDependent(currentAccessed);
    }
    return this._value;
  }

  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notifyDependents();
    }
  }

  _addDependent(dependent) {
    if (!this._dependents.includes(dependent)) {
      this._dependents.push(dependent);
    }
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
      currentAccessed = this;
      this._recomputeValue();
      currentAccessed = null;
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

class Effect {
  constructor(effectFn) {
    this._effectFn = effectFn;
    this._isStale = true;
    this._execute();
  }

  _execute() {
    if (this._isStale) {
      currentAccessed = this;
      this._effectFn();
      currentAccessed = null;
    }
  }

  _update() {
    this._isStale = true;
    this._execute();
  }
}

function createSignal(initialValue) {
  return new Signal(initialValue);
}

function createComputed(computeFn) {
  return new Computed(computeFn);
}

function createEffect(effectFn) {
  return new Effect(effectFn);
}

// Creating signals
const count = createSignal(0);
const multiplier = createSignal(2);

// Creating an effect
createEffect(() => {
  console.log("Effect called: Count is", count.value, "and multiplier is", multiplier.value);
});

// Changing signal values
count.value = 1;
multiplier.value = 3;

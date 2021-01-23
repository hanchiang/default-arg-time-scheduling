const fnArgRegex = /function\s+\w+\((\s*\w+\s*(,\s*\w+\s*)*)\s*\)/;

/**
 * Parse fn's arguments
 * Create a function that substitutes opt's default value in fn
 */
function defaultArguments(fn, opt) {
  const fnArgString = extractFnArgString(fn);
  const fnArgArray = getFnArgsAsArray(fnArgString);
  return applyDefaultArguments(fn, fnArgArray, opt);
}

/**
 * Returns the function arguments as a string according to its definition
 * e.g. "a, b"
 * @param {*} fn 
 */
function extractFnArgString(fn) {
  const fnString = fn.toString();
  const match = fnString.match(fnArgRegex);
  return match ? match[1] : undefined;
}

/**
 * Parse function argument string into an array by removing spaces and splitting by ','
 * @param {*} argString 
 */
function getFnArgsAsArray(argString) {
  return argString ? argString.replace(/\s+/g, '').split(',') : [];
}

/**
 * Apply default arguments in opt object to fn
 * @param {*} fn 
 * @param {*} origArgArray original arguments of fn
 * @param {*} opt Object with default values for fn's argument
 */
function applyDefaultArguments(fn, origArgArray, opt) {
  // Save original arguments
  if (!this.origArgArray || !this.origArgArray.length) {
    this.origArgArray = origArgArray;
  }

  const defaultArgs = [];
  // Apply default arguments
  for (let i = 0 ; i < this.origArgArray.length; i++) {
    const argName = this.origArgArray[i];
    defaultArgs[i] = opt[argName];
  }

  return function(...args) {
    const modifiedArgs = defaultArgs.slice();
    // Override with input arguments
    console.log('default args', defaultArgs)
    for (let j = 0; j < args.length; j++) {
      modifiedArgs[j] = args[j];
    }
    console.log({fn, origArgArray: this.origArgArray, args, opt, modifiedArgs})
    return fn.apply(null, modifiedArgs);
  }
}


module.exports = {
  defaultArguments, applyDefaultArguments, extractFnArgString, getFnArgsAsArray
}

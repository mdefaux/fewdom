/**Smallest assertion facility ever.
 * Activate it with _de = true;
 * Debugger will break at assertion failure before throwing an exception
 * @usage _de&&assert( myTestCondition, "optional failure message" );
 */
let _de = true;
function assert(condition, message, noException ) {
    if (condition === false || condition === null || condition === undefined) {
      debugger;
      if( !noException )
        throw Error( message || "Assertion failed" );
    }
}

module.exports = { _de: _de, assert: assert}

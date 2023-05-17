
/**
 * 
 */
 const SetHelper = {
    _MAX_DEEP_EQAULITY_DEPTH: 16,
    /**Deep equal facility 
     * 
     * @param {*} a 
     * @param {*} b 
     * @param {*} maxDepth used to avoid infinite loop in circular references
     * @returns 
     */
    deepDifference( a, b, maxDepth )
    {
        if( maxDepth === undefined ) maxDepth = this._MAX_DEEP_EQAULITY_DEPTH;
        if( maxDepth === 0 ) return b;

        // one of the two is not an object
        if( typeof a !== "object" || typeof b !== "object" )
        {
            // type and value equality
            if( a === b )
                return {};   // tells that there are no difference
            // returns the new object
            return b;
        }

        let entries = Object.entries( a ).reduce( (p,[key, val])=> {
            // property does not exists in new object
            if( !b[key] )
                return {...p, [key]: undefined }; // property cancellation
            // checks recursiverly: if false, there are no deep differences
            let recursive = SetHelper.deepDifference( val, b[key], maxDepth-1 );
            return typeof recursive === "object" && 
                Object.keys(recursive).length === 0 ? 
                    p : {...p, [key]: recursive};
        }, {} );

        // adds those properties of b that were not present in a
        return {...entries, 
            ...Object.fromEntries(
                Object.entries( b )
                    .filter( ([bKey,])=> (!a[bKey])   // takes only b keys that are not present in a
                )
            )};
    }
}

module.exports = SetHelper;

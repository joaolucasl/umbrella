/**
 * .serialize()
 *
 * Convert al html form elements into an object
 * The <input> and <button> without type will be parsed as default
 * NOTE: select-multiple for <select> is disabled on purpose
 * Source: http://stackoverflow.com/q/11661187
 * @return string from the form's data
 */
var actionRegex = /^(submit|button|image|reset|file)/i;
var fieldRegex = /^(input|select|textarea|keygen)/i;
var checkRegex = /^(checkbox|radio)/i;

u.prototype.oldSerialize = function() {

  // Store the class in a variable for manipulation
  return this.param(this.slice(this.first().elements).reduce(function(obj, el) {

    // We only want to match elements with names, but not files
    if (el.name && el.type !== 'file' &&

    // Ignore the checkboxes that are not checked
    (!/(checkbox|radio)/.test(el.type) || el.checked)) {

      // Add the element to the object
      obj[el.name] = el.value;
    }

    return obj;
  }, {}));
};

u.prototype.serialize = function(){
  var res = [];
   this.serializeArray().forEach(function(el){
    res.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value));
  });
  return res.join("&");
};

/**
 * This function converts all the form elements into
 * an Array. Inspired by Zepto's serialize() function.
 *
 * @returns {Array} Serialized array for the input form
 */
u.prototype.serializeArray = function(){

  var elements = this.slice(this.first().elements); // The form elements
  var result = []; // This will hold the object to be returned

  /**
   * Helper function to help withthe creation of the return object
   */
  var addElement = function(el){
    // If the element is Array-like, recursively add those elements
    if(el.forEach) return el.forEach(add);
    result.push({name:el.name, value: el.value});
  };

  elements.forEach(function(el,index,array){
    /* Filtering the form fields :
     * - must be named,
     * - must be an acceptable type
     * - must not be an actionable type,
     * - must not be a Checkbox or Radio,
     * - or must be checked.
     */
    if(el.name && fieldRegex.test(el.nodeName) && !actionRegex.test(el.type) && (!checkRegex.test(el.type) || el.checked)){
      addElement(el); // Then adding it to array
    }
  });

  return result;

};

(function () {
  String.prototype.implode = function (delimeter = " ") {
    let indValue = "";
    let newArray = [];
    let indChar = "";
    for (let i = 0; i < this.length; i++) {
      indChar = this[i];
      if (indChar != delimeter) {
        indValue += indChar;
      } else {
        newArray.push(indValue);
        indValue = "";
        continue;
      }
      i === this.length - 1 && newArray.push(indValue);
    }
    return newArray;
  };
  Array.prototype.explode = function (delimeter = ",") {
    return this.join(delimeter).toString();
  };
  Array.prototype.unique = function () {
    let newArray = [...new Set(this)];
    return newArray;
  };
})();
randomKey = function () {
  let key = Date.now() + parseInt(Math.random().toString().slice(2));
  return key.toString(30).repeat(2);
};

module.exports = function log(error, pathtoError="", lineNum=""){
    console.log(error, "in", pathtoError, "on line", lineNum)
}
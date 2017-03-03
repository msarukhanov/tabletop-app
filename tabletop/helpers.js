/**
 * Created by Hrach on 24.06.2015.
 */

module.exports = {
    clearVariable : function(variable){
        var parsedVariable = variable.substring(0, variable.length - 3);
        return parsedVariable;
    }
}
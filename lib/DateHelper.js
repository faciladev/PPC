exports.today = function () {
    var myDate = new Date();
    return myDate.getFullYear() + "-" + (((myDate.getMonth()+1) < 10)?"0":"") + (myDate.getMonth()+1) + "-" + ((myDate.getDate() < 10)?"0":"") + myDate.getDate();
}

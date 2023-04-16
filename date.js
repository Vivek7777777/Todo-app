
// module.exports = getDate();

// function getDate(){
//     let today = new Date();

//     let options = {
//         weekday: "long",
//         day: "numeric",
//         month: "long"
//     };

//     let day = today.toLocaleDateString("en-US", options);

//     return day;
// }




//if we have to export multiple methods

module.exports.getDate = getDate();

function getDate(){
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    return day;
}

module.exports.getDay = function(){
    let today = new Date();

    let options = {
        weekday: "long",
    };

    let day = today.toLocaleDateString("en-US", options);

    return day;
}
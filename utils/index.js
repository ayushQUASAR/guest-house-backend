module.exports =  function formatDate(date) {
    // Extracting day, month, and year from the date object
    var day = date.getDate();
    var month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
    var year = date.getFullYear();

    // Padding day and month with leading zeros if needed
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    // Constructing the formatted date string
    var formattedDate = day + '-' + month + '-' + year;
    return formattedDate;
}



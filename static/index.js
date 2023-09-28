var date = new Date()
let display_date= "Date:" + date.toLocaleDateString()

//Load HTML DOM
$(document).ready(function () {
    $("#display_date").html(display_date)
})

let predicted_emotion;
//HTML-->JavaScript--->Flask
//Flask--->JavaScript--->HTML

$(function () {
    $("#predict_button").click(function () {

        let input_data = {
            "text": $("#text").val()
        }
        console.log(input_data)

        
    });
})

// const weekDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
// const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


// display_date = `${weekDay[date.getDay() - 1]}, ${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`
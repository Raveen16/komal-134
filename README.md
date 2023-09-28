python -m venv ModelDeployment

venv\Scripts\activate.bat

pip install tensorflow (enable long path in registory editor if facing any issues)

pip install flask

pip install pandas

*remove assets from the text sentiment file*

python app.py

Check output on http://127.0.0.1:5000

What is AJAX?
AJAX stands for Asynchronous JavaScript And XML.
AJAX is not a programming language but it uses JavaScript.
AJAX is used to send and receive data from HTML to Python files. 
We’ll be using jQuery to create the AJAX call.

JQuery is a JavaScript Library. 
It uses CSS style selectors to select elements of an HTML page such as buttons, text inputs, etc, and uses AJAX to change the state of these elements.


How is jQuery used?
jQuery is a JavaScript library. 
The purpose of jQuery is to make it much easier to use JavaScript on websites.
jQuery is used to shorten the JavaScript code to accomplish and wrap them into methods that you can call with a single line of code.
Selectors are used to select one or more HTML elements using jQuery. 
Once an element is selected then we can perform various operations on that selected element using AJAX.


Now to use jQuery, it is embedded into the <script> tag of HTML file between the <head> tag and the <title> tag. 
The source is specified as Content Delivery Network given by 
"https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" .
Since we’ll be using AJAX, we have to create a JavaScript file by the name index.js in the static folder. 
Also indicate the same in the HTML file using the <script> tag.
To use jquery we have to include the jQuery library in the HTML file. 
Also, index.js(js file with AJAX call) must be included to send and receive data



The index.html page has elements in the following manner:
1. A heading type for displaying the date.
2. A text area for entering text.
3. A submit button for sending the request.
4. A paragraph for displaying the emotion as a result.
5. An image (emoji) will be shown according to the emotion.



Create a Python file to render this HTML page.
Also, to predict the result we will use the model that we had used for sentiment analysis



Predict function in the text_sentiment_prediction.py file takes the text from Flask API and returns the predicted emotion and emoji associated with the emotion.


def predict(text):

    predicted_emotion=""
    predicted_emotion_img_url=""
    
    if  text!="":
        sentence = []
        sentence.append(text)

        sequences = tokenizer.texts_to_sequences(sentence)

        padded = pad_sequences(
            sequences, maxlen=max_length, padding=padding_type, truncating=trunc_type
        )
        testing_padded = np.array(padded)

        predicted_class_label = np.argmax(model.predict(testing_padded), axis=1)        
        print(predicted_class_label)   
        for key, value in emo_code_url.items():
            if value[0]==predicted_class_label:
                predicted_emotion_img_url=value[1]
                predicted_emotion=key
        return predicted_emotion, predicted_emotion_img_url


To get the request from the user (index.html), we have to send it to the flask through AJAX. 
Let’s create a JavaScript file by name index.js in the static folder.
Assign the Date() function to variable date. 
The display_date variable is used to display the current date on the HTML page using this function.


var date = new Date()
let display_date= "Date:" + date.toLocaleDateString()


Next, we’ll be using the jQuery selector for displaying the  date in place of the heading of the HTML page.
“$” denotes that we are using a jQuery selector. 
It is followed by the action to be performed on the HTML element.
Inside selector, we give:
1. The element to be selected. For e.g., p stands for paragraph. e.g. $(p)
2. Class selector by giving class name followed by ‘.’ .e.g. $(“.demo”)
3. Id selector by writing id of the HTML element followed by #. e.g. $(“#demo”)


The $(document).ready() function is used to initialize the document.
It is used to make sure that HTML page is rendered first.


The $(#display_date).html() function is used to select the display_date heading element of an HTML page and display the date.

//Load HTML DOM
$(document).ready(function () {
    $("#display_date").html(display_date)
})



To accept the data from the HTML page and send a response, the following steps are followed:
1. Define a variable predicted_emotion to store the result of predict() function.
2. Let’s create a function for sending request through AJAX call and receiving the response.
3. When the ‘Predict Emotion’ button is clicked, the text should be passed to the API through AJAX. 
    So we’ll use a selector action which is ‘click()’.
4. As soon as the button is clicked, the text is stored in a variable called input_data.
5. Selector is used to select the text input and the value of the text input is given to the variable input_data by creating a ‘text’ object.


let predicted_emotion;
//HTML-->JavaScript--->Flask
//Flask--->JavaScript--->HTML

$(function () {
    $("#predict_button").click(function () {

        let input_data = {
            "text": $("#text").val()
        }
        console.log(input_data)




6. In this function, we’ll create the AJAX function. 
This method requires parameters in the form of key-value pairs. Some common key-value pairs that need to be passed are:
i. url: URL of the page where we want to send the request.
ii. type: type of the request, GET or POST.
iii. data: actual data that needs to be sent to the server.
iv. dataType: datatype of the response.
v. contentType: type of content used while sending a request to the server.
vi. success: a function after the request is successful.
vii. error: a function after the request fails.


Therefore, when a request is sent using the ‘POST’ method and response is received in the variable result.
The request is sent in JSON format. JSON stands for JavaScript Object Notation. 
It is used to store human-readable text and transmit data.
On success, the function is called with the result received from Flask.


        $.ajax({
            type: 'POST',
            url: "/predict-emotion",
            data: JSON.stringify(input_data),
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {


The responses we get from Flask are the emotion and the emoticon related to the emotion.
After getting the response the results are displayed on the HTML page using jQuery selectors.
Also, errors such are also displayed. 
These errors occurs when AJAX call is no able to find the required data. 
Such as the Python file for sentiment processing, emoticons are missing.




                // Result Received From Flask ----->JavaScript
                predicted_emotion = result.data.predicted_emotion
                emo_url = result.data.predicted_emotion_img_url

                
                // Display Result Using JavaScript----->HTML
                $("#prediction").html(predicted_emotion)
                $('#prediction').css("display", "block");

                $("#emo_img_url").attr('src', emo_url);
                $('#emo_img_url').css("display", "block");
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });
    });
})

*app.py*

Let’s write the code for Flask to receive the request and process it. 
The steps are:
1. Create an API to receive the request in POST format.
2. When the request is received, the function predict_emotion () is called.
3. This function will receive the data in JASON format from the ‘text’ object created in AJAX.
4. Now, there are two possibilities. 
a. The user clicks the Predict Emotion button without entering text. In this case, the error must be generated and sent back to AJAX.
b. The user enters text for prediction.
5. When no text is entered the response is sent with two parameters:

a. status: ‘error’
This shows that the request is not successful.
b. Message: If an error occurs, then the message is to be sent to the HTML page
6. Input_text is given to the predict function which returns the results in predicted_emotion and predicted_emotion_img_url.
7. Now, for the successful response, these two variables are defined again in the data.
8. Now the data is sent in JSON format using the jsonify() function.



def predict_emotion():
    
    # Get Input Text from POST Request
    input_text = request.json.get("text")  
    
    if not input_text:
        # Response to send if the input_text is undefined
        response = {
                    "status": "error",
                    "message": "Please enter some text to predict emotion!"
                  }
        return jsonify(response)
    else:  
        predicted_emotion,predicted_emotion_img_url = predict(input_text)
        
        # Response to send if the input_text is not undefined
        response = {
                    "status": "success",
                    "data": {
                            "predicted_emotion": predicted_emotion,
                            "predicted_emotion_img_url": predicted_emotion_img_url
                            }  
                   }

        # Send Response         
        return jsonify(response)
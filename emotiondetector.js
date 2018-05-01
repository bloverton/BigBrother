var accumulatedEmotions = {
    'anger': 0,
    'contempt': 0,
    'disgust': 0,
    'fear': 0,
    'happiness': 0,
    'neutral': 0,
    'sadness': 0,
    'surprise': 0
}

function processImage() {
    // **********************************************
    // *** Update or verify the following values. ***
    // **********************************************

    // Replace the subscriptionKey string value with your valid subscription key.
    var subscriptionKey = config.SUBSCRIPTION_KEY;

    // Replace or verify the region.
    //
    // You must use the same region in your REST API call as you used to obtain your subscription keys.
    // For example, if you obtained your subscription keys from the westus region, replace
    // "westcentralus" in the URI below with "westus".
    //
    // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
    // a free trial subscription key, you should not need to change this region.
    var uriBase = config.URI_BASE;

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "emotion",
    };

    // Perform the REST API call.
    $.ajax({
            url: uriBase + "?" + $.param(params),
            // Request headers.
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
            type: "POST",
            processData: false,
            contentType: 'application/octet-stream',
            data: makeblob(canvas.toDataURL('image/webp'))
        })

        .done((data) => {
            console.log(JSON.stringify(data, null, 2))
            //Don't process data if API can't detect faces
            if(Object.keys(data).length === 0)
                return
            //API returns the emotions from each person and returns a javascript object
            var emotionData = detectEmotion(data);
            //Calculates the new average emotions based on previous iteration
            displayEmotions(emotionData)
        })

        .fail((jqXHR, textStatus, errorThrown) => {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): "
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message
            alert(errorString)
        });
};

function makeblob(dataURL) {
    var BASE64_MARKER = ';base64,'
    if(dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',')
        var contentType = parts[0].split(':')[1]
        var raw = decodeURIComponent(parts[1])
        return new Blob([raw], {type: contentType})
    }
    var parts = dataURL.split(BASE64_MARKER)
    var contentType = parts[0].split(':')[1]
    var raw = window.atob(parts[1])
    var rawLength = raw.length

    var uInt8Array = new Uint8Array(rawLength)

    for(let i = 0; i < raw.length; ++i)
        uInt8Array[i] = raw.charCodeAt(i)

    return new Blob([uInt8Array], {type: contentType})
}

//Displays all emotion data to page
function displayEmotions(emotionData) {
    if(emotionData === [] || emotionData == [])
        return
    //Calculates the new average of emotions from previous iteration
    for(let currentEmotion in emotionData) 
        accumulatedEmotions[currentEmotion] = (accumulatedEmotions[currentEmotion] + emotionData[currentEmotion]) / 2

    document.getElementById('angerEmotion').innerHTML = 'anger' + ': ' + parseFloat(Math.round(accumulatedEmotions['anger'] * 100)/ 100).toFixed(2)
    document.getElementById('contemptEmotion').innerHTML = 'contempt: ' + parseFloat(Math.round(accumulatedEmotions['contempt'] * 100)/ 100).toFixed(2)
    document.getElementById('disgustEmotion').innerHTML = 'disgust: ' + parseFloat(Math.round(accumulatedEmotions['disgust'] * 100)/ 100).toFixed(2)
    document.getElementById('fearEmotion').innerHTML = 'fear: ' + parseFloat(Math.round(accumulatedEmotions['fear'] * 100)/ 100).toFixed(2)
    document.getElementById('happinessEmotion').innerHTML = 'happiness: ' + parseFloat(Math.round(accumulatedEmotions['happiness'] * 100)/ 100).toFixed(2)
    document.getElementById('neutralEmotion').innerHTML = 'neutral: ' + parseFloat(Math.round(accumulatedEmotions['neutral'] * 100)/ 100).toFixed(2)
    document.getElementById('sadnessEmotion').innerHTML = 'sadness: ' + parseFloat(Math.round(accumulatedEmotions['sadness'] * 100)/ 100).toFixed(2)
    document.getElementById('surpriseEmotion').innerHTML = 'surprise: ' + parseFloat(Math.round(accumulatedEmotions['surprise'] * 100)/ 100).toFixed(2)
}

function detectEmotion(json) {
    //Total detected faces
    var totalDetectedFaces = jsonLength(json)
    //All recognized emotions
    let angerAverage = 0
    let contemptAverage = 0
    let disgustAverage = 0
    let fearAverage = 0
    let happinessAverage = 0
    let neutralAverage = 0
    let sadnessAverage = 0
    let surpriseAverage = 0

    //Iterate through each emotion for the current detected face and accumulate
    for(let i = 0; i < totalDetectedFaces; i++) {
        var currentFaceEmotion = json[i].faceAttributes.emotion
        angerAverage += currentFaceEmotion['anger']
        contemptAverage += currentFaceEmotion['contempt']
        disgustAverage += currentFaceEmotion['disgust']
        fearAverage += currentFaceEmotion['fear']
        happinessAverage += currentFaceEmotion['happiness']
        neutralAverage += currentFaceEmotion['neutral']
        sadnessAverage += currentFaceEmotion['sadness']
        surpriseAverage += currentFaceEmotion['surprise']
    }

    //Calculates the average emotion values with the total faces detected
    angerAverage /= totalDetectedFaces
    contemptAverage /= totalDetectedFaces
    disgustAverage /= totalDetectedFaces
    fearAverage /= totalDetectedFaces
    happinessAverage /= totalDetectedFaces
    neutralAverage /= totalDetectedFaces
    sadnessAverage /= totalDetectedFaces
    surpriseAverage /= totalDetectedFaces

    //return all emotion averages
    var emotionAverages = {
        'anger': angerAverage,
        'contempt': contemptAverage,
        'disgust': disgustAverage,
        'fear': fearAverage,
        'happiness': happinessAverage,
        'neutral': neutralAverage,
        'sadness': sadnessAverage,
        'surprise': surpriseAverage
    }
    return emotionAverages
}

//Algorithm that returns a number if the class is interested or not
//Implement soon
function isClassInterested() {
    let emotionScore = 0;
    
}

/*Resets all accumulated emotions to 0
    Note: Only used in stop button
*/
function resetEmotions() {
    for(let currentEmotion in accumulatedEmotions)
        accumulatedEmotions[currentEmotion] = 0
}

//Find the total number of objects in json
function jsonLength(json) {
    return Object.keys(json).length
}
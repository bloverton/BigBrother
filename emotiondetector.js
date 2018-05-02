
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
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
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

            // Request body.
            data: makeblob(canvas.toDataURL('image/jpeg'))
        })

        .done((data) => {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            var emotionData = detectEmotion(data);
            document.getElementById("likelyEmotion").innerHTML = JSON.stringify(detectEmotion(data), null, 4);
        })

        .fail((jqXHR, textStatus, errorThrown) => {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
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

function detectEmotion(json) {
    var allEmotions = json[0].faceAttributes.emotion;
    //Return emotion with greatest value
    var likelyEmotion = "";
    var highestEmotionValue = 0;
    //Iterate through all available emotions until you find the emotion with the greatest value
    for (var currentEmotion in allEmotions) {
        var emotionValue = allEmotions[currentEmotion];
        if (emotionValue > highestEmotionValue) {
            highestEmotionValue = emotionValue;
            likelyEmotion = currentEmotion;
        }
    }
    var emotionKV = {
        likelyEmotion,
        highestEmotionValue
    };
    return emotionKV;
}
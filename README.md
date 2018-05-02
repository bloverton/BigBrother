# BigBrother
## Overview
BigBrother is a facial recognition web application that determines the emotional atmosphere in a room setting based on a person's facial expression. By using Microsoft Cognitive Services and tracking.js, we are able to track a person's face and obtain multiple human emotions which are used to determine whether people in a setting are interested or not interested. 

## Prerequisites
In order to use the BigBrother application, you must have an
1. External Camera/Webcam
2. Up-to-date Web Browser

## Setup
In order to setup BigBrother, you must 
1. Acquire a [Microsoft Cognitive Service Face API subscription key](https://azure.microsoft.com/en-us/try/cognitive-services/)
2. Create a config.js file to store your subscription key as well as the uri_base 
   
   **NOTE: URI_BASE is given to you when you get your subscription key**
  * Your config.js file should look like this:
    ```
    var config = {
        SUBSCRIPTION_KEY: <Your subscription key>
        URI_BASE: <Your uri base>
    }
    ```
3.) Open detectFaces.html in a browser

## APIs
1. [Microsoft Cognitive Services - Face API](https://azure.microsoft.com/en-us/services/cognitive-services/): Used to determine person's emotion based on facial expressions
2. [tracking.js](https://trackingjs.com/): Used for facial tracking
3. face.js: Support file for face detection. Used together with tracking.js

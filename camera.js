const videoElement = document.querySelector('video')
const videoSelect = document.querySelector('select#videoSource')
const startbutton = document.querySelector('#screenshot-button')
const stopbutton = document.querySelector('#stop-button')
const img = document.querySelector('#screenshot-img')
const video = document.querySelector('#screenshot-video')

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

var trackingCanvas = document.getElementById('trackingCanvas')
var trackingContext = trackingCanvas.getContext('2d')

var screenshot = img.src
var isSessionOn = false

//Slider for screenshot capture interval
var slider = document.getElementById('range')
var output = document.getElementById('seconds')

var screenshotTimer = slider.value * 1000
output.innerHTML = slider.value

slider.oninput = () => {
    output.innerHTML = slider.value
    screenshotTimer = slider.value * 1000
}

var sessionStatus = document.getElementById('sessionStatus')
sessionStatus.innerHTML = 'Stopped'

//Finds all video devices/webcams
navigator.mediaDevices.enumerateDevices()
    .then(gotDevices)
    .then(getStream)
    .catch(handleError)

videoSelect.onchange = getStream

//Finds all available video devices
function gotDevices(deviceInfos) {
    for(let i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i]
        var option = document.createElement('option')
        option.value = deviceInfo.deviceId
        if(deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || 'camera' + (videoSelect.length + 1)
            videoSelect.appendChild(option)
        } else
            console.log('Found one other kind of sources/devices: ', deviceInfo)
    }
}

//Gets a stream from the video source
function getStream() {
    if(window.stream) {
        window.stream.getTracks().foreach((track) => {
            track.stop()
        })
    }

    var constraints = {
        video: {
            deviceId: {exact: videoSelect.value}
        }
    }

    //Displays stream onto browser
    navigator.mediaDevices.getUserMedia(constraints)
        .then(gotStream)
        .catch(handleError)
}

function gotStream(stream) {
    window.stream = stream
    videoElement.srcObject = stream
}

//Displays an error if anything goes wrong
function handleError(error) {
    console.error('Error: ', error)
}

//Run when user clicks on start session button
function startSession() {
    sessionStatus.innerHTML = 'Running'
    isSessionOn = true
    startbutton.disabled = true;
    startTimer()
    var interval = window.setInterval(() => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        processImage()    //emotiondetector.js
        window.clearInterval(interval)
        if(isSessionOn) {
            startSession()
        }
    }, screenshotTimer)
}

function stopSession() {
    isSessionOn = false;
    sessionStatus.innerHTML = 'Stopped'
    resetEmotions()
    window.clearInterval(() => startSession(), 1000)
    window.clearInterval(() => startTimer(), 1000)
    img.src = ''
    startbutton.disabled = false;
}

function detectFaces() {
    //Facial tracking
    const tracker = new tracking.ObjectTracker('face')
    tracker.setInitialScale(4)
    tracker.setStepSize(2)
    tracker.setEdgesDensity(0.1)

    tracking.track('#screenshot-video', tracker)
    tracker.on('track', event => {
        console.log(event)
        trackingContext.clearRect(0, 0, trackingCanvas.width, trackingCanvas.height)
        trackingCanvas.width = videoElement.offsetWidth
        trackingCanvas.height = videoElement.offsetHeight
        event.data.forEach(rect => {
            trackingContext.strokeStyle = '#ff0000'
            trackingContext.lineWidth = 10
            trackingContext.strokeRect(rect.x, rect.y, rect.width, rect.height)
            trackingContext.font = '11px Helvetica';
            trackingContext.fillStyle = "#fff";
            trackingContext.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            trackingContext.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        })
    })
}

async function startTimer() {
    return await new Promise(resolve => {
        let seconds = 0;
        timer = setInterval(() => {
            seconds++
            if(sessionStatus.innerHTML === 'Stopped'){
                seconds = 0;
            } else {
                if(seconds % 60 < 10)
                document.getElementById('second').innerText = '0' + seconds % 60 
            else{
            if(seconds % 60 < 10)
                 document.getElementById('second').innerText = '0' + seconds % 60 
            else 
                document.getElementById('second').innerText = seconds % 60 
            if(seconds < 600) //Minute less than 10
                document.getElementById('minute').innerText = '0' + parseInt(seconds/ 60)
            else 
            document.getElementById('minute').innerText = parseInt(seconds/ 60)
            }
	    }
        }, 1000)
    
    })
}

startbutton.onclick = startSession
stopbutton.onclick = stopSession
window.onload = detectFaces()

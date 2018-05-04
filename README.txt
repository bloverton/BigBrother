For more information: https://github.com/bloverton/BigBrother

SETUP

In order to setup BigBrother, you must

    Acquire a Microsoft Cognitive Service Face API subscription key

    Create a config.js file to store your subscription key as well as the uri_base

    NOTE:

    ○ URI_BASE is given to you when you get your subscription key. URI_BASE and endpoint are the same thing

    ○ You may also be given two keys, just use one of them

    Your config.js file should look like this:

    var config = {
        SUBSCRIPTION_KEY: '<Your subscription key>',
        URI_BASE: '<Your uri base>'
    }

3.) Open detectFaces.html in a browser

import QtQuick 2.0

Timer {
    interval: 1000 / 60
    running: false
    repeat: false

    function request(callback) {
        _requests.push({
            callback: callback,
            scope: this
        })

        if (!running) {
            start()
        }

        return -1
    }

    /**
        \internal
     */
    property var _requests: []

    onTriggered: {
        var requests = _requests
        var ilen = requests.length
        var request = null
        var i = 0

        _requests = []
        for (; i < ilen; ++i) {
            request = requests[i]
            request.callback.call(request.scope)
        }

        if (_requests.length === 0) {
            stop()
        }
    }
}

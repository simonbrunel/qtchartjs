.pragma library

(function(global){
    var _animator = Qt.createComponent("Animator.qml").createObject()

    // Chart.js 2.7.2: still need to fake window because of the way moment is imported!
    global.window = global

    // Chart.js 2.7.2: still called in helpers
    // [TODO] move to platforms/platform.js
    global.requestAnimationFrame = function(callback) {
        return _animator.request(callback)
    }

})(this)

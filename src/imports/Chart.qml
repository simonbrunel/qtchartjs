import QtQuick 2.0

import "Private/Library.js" as Lib

Canvas {
    id: canvas

    property string type: "line"
    property var options: ({})
    property var plugins: []
    property var labels: []
    property var datasets: []

    signal resized()

    function refresh() {
        if (_instance) {
            Qt.callLater(_refresh)
        }
    }

    function rebuild() {
        if (available) {
            Qt.callLater(_rebuild)
        }
    }

    // [WORKAROUND] context.lineWidth > 1 makes the scene graph polish step very slow
    // in case of "Image" render target, so by default let's draw with OpenGL when
    // possible (which seems only possible with "Cooperative" strategy).
    renderTarget: Canvas.FramebufferObject
    renderStrategy: Canvas.Cooperative

    // https://www.w3.org/TR/2012/WD-html5-author-20120329/the-canvas-element.html#the-canvas-element
    implicitHeight: 150
    implicitWidth: 300

    // [polyfill] Element
    readonly property alias clientHeight: canvas.height
    readonly property alias clientWidth: canvas.width

    // [polyfill] canvas.style
    readonly property var style: ({
        height: canvas.height,
        width: canvas.width
    })

    // [polyfill] element.getBoundingClientRect
    // https://developer.mozilla.org/docs/Web/API/Element/getBoundingClientRect
    function getBoundingClientRect() {
        return {top: 0, right: canvas.width, bottom: canvas.height, left: 0}
    }

    /**
        \internal
     */
    property var _instance: null
    property alias _mouse: mouse

    MouseArea {
        id: mouse
        anchors.fill: parent
        hoverEnabled: enabled
        enabled: false
    }

    onTypeChanged: rebuild()
    onOptionsChanged: refresh()
    onPluginsChanged: refresh()
    onLabelsChanged: refresh()
    onDatasetsChanged: rebuild()
    onHeightChanged: resized()
    onWidthChanged: resized()
    onAvailableChanged: {
        if (!_instance) {
            rebuild()
        }
    }

    /**
        \internal
     */
    function _refresh() {
        _instance.config.options = canvas.options
        _instance.config.plugins = canvas.plugins
        _instance.data.labels = canvas.labels
        _instance.update()
    }

    /**
        \internal
     */
    function _rebuild() {
        if (_instance) {
            _instance.destroy()
            _instance = null
        }

        _instance = new Lib.Chart(canvas, {
            type: canvas.type,
            options: canvas.options,
            plugins: canvas.plugins,
            data: {
                labels: canvas.labels,
                datasets: canvas.datasets
            }
        })
    }
}

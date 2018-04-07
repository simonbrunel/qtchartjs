.pragma library

.import "Polyfills.js" as Polyfills
.import "../Library/Chart.bundle.min.js" as Chart

(function(global){
    var color = global.Color

    Chart.helpers.merge(Chart.defaults.global, {
        events: [
            "mousemove",
            "mouseout",
            "click"
        ]
    })

    // QML rendering plugin
    Chart.plugins.register({
        afterDraw: function(chart) {
            chart.canvas.requestPaint()
        }
    })

    var MOUSE_EVENTS = {
        click: "clicked",
        mousemove: "positionChanged",
        mouseenter: "entered",
        mouseout: "exited",
        mousedown: "pressed",
        mouseup: "released"
    }

    function createEvent(type, chart, x, y, native) {
        return {
            type: type,
            chart: chart,
            native: native || null,
            x: x !== undefined ? x : null,
            y: y !== undefined ? y : null
        }
    }

    // Chart.js 2.7.2 overrides

    // QML platform implementation
    Chart.helpers.merge(Chart.platform, {
        addEventListener: function(chart, type, listener) {
            var canvas = chart.canvas
            if (type === "resize") {
                canvas.resized.connect(function() {
                    listener(createEvent(type, chart))
                })
                return
            }

            var mapped = MOUSE_EVENTS[type]
            if (!mapped) {
                console.warn("Unsupported event:", type)
                return
            }

            canvas._mouse.enabled = true
            canvas._mouse[mapped].connect(function(event) {
                listener(createEvent(
                    type,
                    chart,
                    event && event.x,
                    event && event.y,
                    event))
            })
        },

        removeEventListener: function(chart, type, listener) {
            // [TODO]
        }
    })

    Chart.helpers.merge(Chart.helpers, {
        color: function(c) {
            // [TODO] pattern & gradient
            return color(c)
        },
        getHoverColor: function(c) {
            // [TODO] pattern & gradient
            return Chart.helpers.color(c).saturate(0.5).darken(0.1).rgbString()
        }
    })

    Chart.helpers.merge(Chart.prototype, {
        // Resync chart internals with current canvas size, then update
        // [TODO] move the resize logic in platforms/platform.js!
        resize: function(silent) {
            var me = this
            var opts = me.options
            var h = Math.max(0, me.canvas.height)
            var w = Math.max(0, me.canvas.width)

            if (h === me.height && w === me.width) {
                return
            }

            me.height = h
            me.width = w

            if (silent) {
                return
            }

            // Notify any plugins about the resize
            var size = {width: w, height: h}
            Chart.plugins.notify(me, "resize", [size])

            // Notify of resize
            if (opts.onResize) {
                opts.onResize(me, newSize)
            }

            me.stop()
            me.update(opts.responsiveAnimationDuration)
        }
    })

})(this)

# QtChartJs

More details at https://github.com/chartjs/Chart.js/issues/4964

EXPERIMENTAL / UNSTABLE / SLOW / NOT TESTED / NO SUPPORT

**DON'T USE IN PRODUCTION**

----

### Installation

```
qmake qtchartjs.pro
make
make install
```

### Usage

```
import QtQuick 2.10
import QtQuick.Window 2.3

import QtChartJs 1.0

Window {

    visible: true
    height: 420
    width: 768

    Chart {
        anchors.fill: parent
        anchors.margins: 32

        type: 'bar'

        labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July"
        ]

        datasets: [{
            label: "My First Dataset",
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(201, 203, 207, 0.2)"
            ],
            borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)"
            ],
            borderWidth: 1
        }]

        options: ({
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        })
    }
}
```

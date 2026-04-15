//Chart Traffic Jam - Pie
Highcharts.chart('chartTrafficJam', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0)',
        spacing: [0, 0, 0, 0]
    },
    title: {
        text: ''
    },
    tooltip: {
        enabled: false,
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            size: '100%',
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: false,
            slicedOffset: 0,
            borderColor: '#000000',
            innerSize: 60,
            states: {
                hover: {
                    enabled: false
                }
            }

        }
    },
    series: [{
        name: 'Tỉ lệ tắc đường',
        colorByPoint: true,
        dataLabels: {
            enabled: true,
            color: '#fff',
            distance: -19,
            shadow: true,
            style: {
                fontSize: '11px',
            },
            useHTML: true,
            format: '{point.y: .0f}%'
        },
        data: [{
            name: 'Thoáng',
            y: 63,
            sliced: true,
            selected: true,
            color: "#27AE60"
        }, {
            name: 'Đông',
            y: 12,
            color: "#F2C94C"
        }, {
            name: 'Tắc đường',
            y: 26,
            color: "#ED1313"
        }]
    }],
    credits: {
        enabled: false
    }
});

//Chart Traffic
Highcharts.chart('chartTrafficFlow', {
    chart: {
        type: 'area',
        backgroundColor: 'rgba(255,255,255,0)',
        height: 190
    },
    accessibility: {
        description: ''
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    legend: {
        itemStyle: {
            "color": "rgba(255,255,255,0.5)",
            "font-size": "1rem",
            "font-weight": "normal"
        },
        itemHiddenStyle: {
            "color": "rgba(255,255,255,0.2)"
        },
        itemHoverStyle: {
            "color": "#fff"
        },
    },
    xAxis: {
        allowDecimals: false,
        minPadding: 0,
        gridLineWidth: 0.5,
        gridLineColor: 'rgba(255,255,255,0.2)',
        minorGridLineWidth: 0,
        labels: {
            formatter: function () {
                return this.value;
            },
            style: {
                color: 'rgba(255,255,255,0.5)'
            }

        },
        categories: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00']
    },
    yAxis: {
        title: {
            text: ''
        },
        min: 0,
        max: 200,
        minPadding: 0,
        gridLineColor: 'rgba(255,255,255,0.1)',
        labels: {
            formatter: function () {
                return this.value;
            },
            style: {
                color: 'rgba(255,255,255,0.5)'
            }
        }
    },
    tooltip: {
        pointFormat: '{series.name}<br>Lưu lượng <b>{point.y}</b>'
    },
    plotOptions: {
        area: {
            pointStart: 1,
            lineWidth: 1,
            height: "100%",
            width: "100%",
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 3,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: [{
        showInLegend: false,
        name: 'Điểm 1',
        data: [50, 85, 66, 135, 96, 85, 130, 79, 96, 145, 120, 136, 156, 124, 110],
        color: '#00B4D8',
        fillColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0, 'rgba(0,180,216,0.2)'],
                [1, 'rgba(0,180,216,0.05)']
            ]
        }
    }, {
        showInLegend: false,
        name: 'Điểm 2',
        data: [6, 140, 103, 136, 182, 69, 105, 168, 83, 115, 137, 192, 91, 142, 67],
        color: '#FFC979',
        fillColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0, 'rgba(255,201,121,0.2)'],
                [1, 'rgba(255,201,121,0.05)']
            ]
        }
    }, {
        showInLegend: false,
        name: 'Điểm 3',
        data: [85, 143, 64, 113, 86, 192, 174, 168, 109, 60, 66, 57, 100, 103, 96],
        color: '#27AE60',
        fillColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0, 'rgba(39,174,96,0.2)'],
                [1, 'rgba(39,174,96,0.05)']
            ]
        }
    }],
    credits: {
        enabled: false
    }
});

//Chart Live Violation - Pie
// Highcharts.chart('chartLiveViolation', {
//     chart: {
//         plotBackgroundColor: null,
//         plotBorderWidth: null,
//         plotShadow: false,
//         type: 'pie',
//         height: '100%',
//         backgroundColor: 'rgba(255,255,255,0)',
//         spacing: [0, 0, 0, 0]
//     },
//     title: {
//         text: ''
//     },
//     tooltip: {
//         enabled: false,
//         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//     },
//     accessibility: {
//         point: {
//             valueSuffix: '%'
//         }
//     },
//     plotOptions: {
//         pie: {
//             allowPointSelect: true,
//             size: '100%',
//             cursor: 'pointer',
//             dataLabels: {
//                 enabled: false
//             },
//             showInLegend: false,
//             slicedOffset: 0,
//             borderColor: '#000000',
//             innerSize: 60,
//             states: {
//                 hover: {
//                     enabled: false
//                 }
//             }

//         }
//     },
//     series: [{
//         name: 'Tỉ lệ vi phạm',
//         colorByPoint: true,
//         dataLabels: {
//             enabled: true,
//             color: '#fff',
//             distance: -19,
//             shadow: true,
//             style: {
//                 fontSize: '11px',
//             },
//             useHTML: true,
//             format: '{point.y: .0f}%'
//         },
//         data: [{
//             name: 'Không đội mũ',
//             y: 70,
//             sliced: true,
//             selected: true,
//             color: "#27AE60"
//         }, {
//             name: 'Vượt đèn đỏ',
//             y: 11,
//             color: "#F2C94C"
//         }, {
//             name: 'Đè vạch',
//             y: 14,
//             color: "#ED1313"
//         }]
//     }],
//     credits: {
//         enabled: false
//     }
// });
//Access Token
mapboxgl.accessToken = MAPBOX_TOKEN;
//Init Map
var map = undefined;
const map_style = 'mapbox-style/dark/style.json';

document.addEventListener("DOMContentLoaded", (event) => {

    //Innit Map
    map = new mapboxgl.Map({
        container: 'map',
        style: map_style,
        center: [106.059, 20.653], // starting position [lng, lat]
        zoom: 14, // starting zoom,
        maxZoom: 16,
        minZoom: 12,
        pitch: 60,
        bearing: -60
    });


    map.on("style.load", function () {

        /*--------------------
            Add Makers
        --------------------*/
        mk_dataCenter();
        mk_groupCameras();
        mk_securityCameras();
        mk_hospital();
        mk_fireStation();
        mk_environmentStation();
        //mk_ambulance();
        //mk_fireTruck();
        mk_loudSpeakers();
        // mk_stolen();
        // mk_wanted();

        /*--------------------
            Component: Mini Map
        --------------------*/

        // Possible position values are 'bottom-left', 'bottom-right', 'top-left', 'top-right'
        map.addControl(new mapboxgl.Minimap({
            style: map_style,
            width: "10rem", //14rem
            height: "10rem"
        }), 'bottom-left');
        //Move Mini map to Place

        setTimeout(function () {
            const minimap_placeholder = document.querySelector('.mini-map-block .mini-map .media-placeholder');
            const mapboxgl_minimap = document.getElementById('mapboxgl-minimap');

            if (minimap_placeholder && mapboxgl_minimap) {
                minimap_placeholder.append(mapboxgl_minimap);
            }

        }, 100);

        window.map_init_controls();

        /*--------------------
           Component: Bản đồ - Thống kê bản đồ
       --------------------*/

        map_stats();

        map.on('moveend', () => {
            map_stats();
        });

        /*--------------------
           Component: Bản đồ - Đối tượng
       --------------------*/
        showHideMapObject();


        /* Add Zoom Level */

        map.on('zoomend', (e) => {
            fn_checkZoomLevelOfMap();
        });

    });

    //Add zoom
    function fn_checkZoomLevelOfMap() {
        let zLevel = map.getZoom();
        let mapEl = document.getElementById('map');
        let zSize = 'md';
        removeClassByPrefix(mapEl, 'zoom-');

        if (zLevel <= 13) {
            zSize = 'sm';
        } else if (zLevel >= 15) {
            zSize = 'lg';
        }
        mapEl.classList.add('zoom-' + zSize);
    }

    function removeClassByPrefix(node, prefix) {
        var regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
        node.className = node.className.replace(regx, '');
        return node;
    }

    //Data Center Points
    function mk_dataCenter() {
        //Data Center Points
        var dataCenterPoints = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.048, 20.662]
                },
                properties: {
                    title: 'DataCenter'
                }
            }]
        };

        dataCenterPoints.features.forEach(function (marker) {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'data-center-marker';

            var el_text_1 = document.createElement('div');
            el_text_1.className = "text text_1";
            el_text_1.append('1100101');

            var el_text_2 = document.createElement('div');
            el_text_2.className = "text";
            el_text_2.append('01010101010');


            var el_text_3 = document.createElement('div');
            el_text_3.className = "text text_3";
            el_text_3.append('010101101');


            var el_spinner = document.createElement('div');
            el_spinner.className = "spinner";

            el.append(el_text_1, el_text_2, el_text_3, el_spinner);

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

        });
    }
    //Broadcast Points
    function mk_Broadcast() {
        var broadcastPoints = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.049, 20.671]
                },
                properties: {
                    title: 'Trạm phát sóng số 1 ',
                    description: 'Địa chỉ trạm số 1',
                    status: 1
                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.038, 20.660]
                },
                properties: {
                    title: 'Trạm phát sóng số 2 ',
                    description: 'Địa chỉ trạm số 2',
                    status: 1
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.050, 20.648]
                },
                properties: {
                    title: 'Trạm phát sóng số 3 ',
                    description: 'Địa chỉ trạm số 3',
                    status: 1
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.062, 20.656]
                },
                properties: {
                    title: 'Trạm phát sóng số 4 ',
                    description: 'Địa chỉ trạm số 4',
                    status: 0
                }
            }, {
                //Item out of view
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [105.819, 20.863]
                },
                properties: {
                    title: 'Trạm phát sóng số 5 ',
                    description: 'Địa chỉ trạm số 5',
                    status: 1
                }
            }

            ]
        };

        broadcastPoints.features.forEach(function (marker) {
            // create a HTML element for each feature
            var el = document.createElement('div');

            if (marker.properties.status == 0) {
                el.className = "broadcast-deactive-marker";
                var el_text = document.createElement('div');
                el_text.append('');
                el.append(el_text);
            } else {
                el.className = "broadcast-marker";
                var el_text = document.createElement('div');
                el_text.append('110011');
                el.append(el_text);
            }

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

        });

        return broadcastPoints;
    }

    //Group Camera Points
    function mk_groupCameras() {
        var groupCameraPoints = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.05806588550684, 20.654714418082648]
                },
                properties: {
                    title: 'Cụm camera số 1',
                    description: 'Ngã tư đường A',
                    countCamera: "2",
                    status: 1
                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.05854300578739, 20.661251972475583]
                },
                properties: {
                    title: 'Cụm camera số 2',
                    description: 'Ngã tư đường B',
                    countCamera: "3",
                    status: 1
                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.05867082745999, 20.664935180318608]
                },
                properties: {
                    title: 'Cụm camera số 3',
                    description: 'Ngã tư đường C',
                    countCamera: "4",
                    status: 1
                }
            }]
        };

        groupCameraPoints.features.forEach(function (marker) {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = "group-camera-marker";

            var el_c = document.createElement('div');
            el_c.className = "count";

            el_c.append(marker.properties.countCamera);
            el.append(el_c);

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

            el.addEventListener('click', () => {
                if (el.classList.contains('active')) {
                    el.classList.remove('active');
                    close_groupCameraDetail();

                } else {
                    open_groupCameraDetail();
                    map.flyTo({
                        center: marker.geometry.coordinates,
                        essential: true
                    });
                    el.classList.add('active');
                }

            });
        });
        return groupCameraPoints;
    }

    //Loudspeaker Points
    function mk_loudSpeakers() {
        var loudSpeakerPoints = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.05798455308201, 20.65831938140144]
                },
                properties: {
                    title: 'Loa phóng thanh số 1',
                    description: 'Đang phát: Vi phạm giao thông qua điểm ..',
                    schedule: 'Lặp lại: 10:20 - 12:00',
                    status: 1
                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.05854471203651, 20.66291215798732]
                },
                properties: {
                    title: 'Loa phóng thanh số 2',
                    description: 'Đang phát: không phát',
                    schedule: 'Không có lịch',
                    status: 0
                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.05861216932345, 20.667278377134167]
                },
                properties: {
                    title: 'Loa phóng thanh số 2',
                    description: 'Đang phát: File tuyên truyền giao thông',
                    schedule: 'Lặp lại: 10:20 - 12:00',
                    status: 1
                }
            }]
        };

        loudSpeakerPoints.features.forEach(function (marker) {
            // create a HTML element for each feature
            var el = document.createElement('div');

            if (marker.properties.status == 0) {
                el.className = "loudspeaker-deactive-marker";
            } else {
                el.className = "loudspeaker-marker";
            }

            // var el_c = document.createElement('div');
            // el_c.className = "count";

            // el_c.append(marker.properties.countCamera);
            // el.append(el_c);

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

            var popup_content = '<div class="event-popup"><div class=popup-inner><div class=popup-header><span class=count-down>Đóng sau <span class=number data-time=60>60</span>s</span></div><div class=popup-body><div class=event-info><h6 class="text-primary mb-0">' + marker.properties.title + '</h6><div class="d-flex"><i class="fa-solid fa-bullhorn mt-1 me-2"></i>' + marker.properties.description + '</div><div class="opacity-50 d-flex"><i class="fa-solid fa-calendar mt-1 me-2"></i>' + marker.properties.schedule + '</div></div></div></div></div>';

            var popup = new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 72, anchor: 'right', closeOnClick: true, className: 'marker-event-popup' })
                    .setHTML(popup_content))
                .addTo(map);


        });
        return loudSpeakerPoints;
    }

    function mk_police() {
        //Police Points
        var policePoints = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.0437419593315, 20.658570813799074]

                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.0573525294825, 20.648934280715466]
                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.06439429575784, 20.671407250361398]
                }
            }]
        };

        policePoints.features.forEach(function (marker) {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = "police-marker";

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

        });
        return policePoints;
    }

    //Securiy Camera Points
    function mk_securityCameras() {
        var securityCameraPoints = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.06764565347112, 20.665259934828]

                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.05357807174482, 20.662943773341198]
                }
            }]
        };

        securityCameraPoints.features.forEach(function (marker) {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = "security-camera-marker";

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

        });
        return securityCameraPoints;
    }

    //Hospital Points
    function mk_hospital() {
        var hospitalPoints = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.05507685813319, 20.64804559014776]

                }
            }]
        };

        hospitalPoints.features.forEach(function (marker) {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = "hospital-marker";

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

        });
        return hospitalPoints;
    }

    //Fire Station Points
    function mk_fireStation() {
        var fireStationlPoints = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.05949004105025, 20.674013819046138]

                }
            }]
        };

        fireStationlPoints.features.forEach(function (marker) {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = "fire-station-marker";

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

        });
        return fireStationlPoints;
    }
    // Environment Station
    function mk_environmentStation() {
        var environmentlPoints = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.04356893175748, 20.668332164690156]
                },
                properties: {
                    title: 'PM 2.5',
                    content: '46'
                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.0702285871838, 20.652710212480983]
                },
                properties: {
                    title: 'PM 2.5',
                    content: '78'
                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.03969748696153, 20.65391362173034]
                },
                properties: {
                    title: 'PM 2.5',
                    content: '120'
                }
            }, {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [106.07282120263858, 20.668127305287513]
                },
                properties: {
                    title: 'PM 2.5',
                    content: '158'
                }
            }]
        };

        environmentlPoints.features.forEach(function (marker) {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = "environment-station-marker";

            if (marker.properties.content <= 50) {
                el.classList.add("good");
            }
            if ((marker.properties.content > 50) && (marker.properties.content < 100)) {
                el.classList.add("normal");
            }
            if ((marker.properties.content >= 100) && (marker.properties.content < 150)) {
                el.classList.add("warning");
            }
            if (marker.properties.content >= 150) {
                el.classList.add("alert");
            }
            var el_c = document.createElement('div');

            var el_text_title = document.createElement('div');
            el_text_title.className = "title";
            el_text_title.append(marker.properties.title);

            var el_text_content = document.createElement('div');
            el_text_content.className = "content";
            el_text_content.append(marker.properties.content);

            el_c.append(el_text_title, el_text_content);
            el.append(el_c);

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
        });
        return environmentlPoints;
    }

    //Map Stats
    function map_stats() {
        //Count Broadcast Maker
        let broadcastPoints = mk_Broadcast();

        if (broadcastPoints) {
            var broadcastPoints_number = 0;
            broadcastPoints.features.forEach(function (marker) {
                if (map.getBounds().contains(marker.geometry.coordinates)) {
                    broadcastPoints_number = broadcastPoints_number + 1;
                }
            });
            document.getElementById('broadcast_in_view').innerHTML = broadcastPoints_number;
        }

        let groupCameraPoints = mk_groupCameras();
        if (groupCameraPoints) {
            //Count Group Camera Maker
            var groupCameraPoints_number = 0;
            groupCameraPoints.features.forEach(function (marker) {
                if (map.getBounds().contains(marker.geometry.coordinates)) {
                    groupCameraPoints_number = groupCameraPoints_number + 1;
                }
            });
            document.getElementById('groupcamera_in_view').innerHTML = groupCameraPoints_number;
        }
        let policePoints = mk_police();
        if (policePoints) {
            //Count Police Maker
            var poicePoints_number = 0;
            policePoints.features.forEach(function (marker) {
                if (map.getBounds().contains(marker.geometry.coordinates)) {
                    poicePoints_number = poicePoints_number + 1;
                }
            });

            document.getElementById('police_in_view').innerHTML = poicePoints_number;
        }

        let securityCameraPoints = mk_securityCameras();
        if (securityCameraPoints) {
            //Count Security Camera 
            var securityCameraPoints_number = 0;
            securityCameraPoints.features.forEach(function (marker) {
                if (map.getBounds().contains(marker.geometry.coordinates)) {
                    securityCameraPoints_number = securityCameraPoints_number + 1;
                }
            });

            document.getElementById('security_camera_in_view').innerHTML = securityCameraPoints_number;
        }
        let loudSpeakerPoints = mk_loudSpeakers();
        if (loudSpeakerPoints) {
            //Count Loudspeaker 
            var loudSpeakerPoints_number = 0;
            loudSpeakerPoints.features.forEach(function (marker) {
                if (map.getBounds().contains(marker.geometry.coordinates)) {
                    loudSpeakerPoints_number = loudSpeakerPoints_number + 1;
                }
            });

            document.getElementById('loudspeaker_in_view').innerHTML = loudSpeakerPoints_number;
        }
    }


    //Show hide Maker 
    function showHideMapObject() {
        var mapObjects = document.querySelectorAll('.list-map-object li');
        mapObjects.forEach((mapObjectEl) => {
            mapObjectEl.addEventListener('click', (e) => {
                e.preventDefault();
                let type = mapObjectEl.getAttribute('data-type');
                toggleClass(mapObjectEl, 'opacity-50');
                console.log(type);
                switch (type) {
                    case 'groupcameras':
                        document.querySelectorAll('.group-camera-marker').forEach((el) => {
                            toggleClass(el, 'deactive');
                        });

                        break;
                    case 'securitycamera':

                        document.querySelectorAll('.security-camera-marker').forEach((el) => {
                            toggleClass(el, 'deactive');
                        });
                        break;
                    case 'police':
                        document.querySelectorAll('.police-marker').forEach((el) => {
                            toggleClass(el, 'deactive');
                        });
                        break;
                    case 'hospital':
                        document.querySelectorAll('.hospital-marker').forEach((el) => {
                            toggleClass(el, 'deactive');
                        });
                        break;
                    case 'firestation':
                        document.querySelectorAll('.fire-station-marker').forEach((el) => {
                            toggleClass(el, 'deactive');
                        });
                        break;
                    case 'environmentstation':
                        document.querySelectorAll('.environment-station-marker').forEach((el) => {
                            toggleClass(el, 'deactive');
                        });
                        break;
                    case 'broadcast':
                        document.querySelectorAll('.broadcast-marker').forEach((el) => {
                            toggleClass(el, 'deactive');
                        });

                        document.querySelectorAll('.roadcast-deactive-marker').forEach((el) => {
                            toggleClass(el, 'deactive');
                        });
                        break;
                    case '':
                }
            })
        })
    }

});

window.map_init_controls = function () {

    //Fly to Default Center
    document.getElementById('back_to_center').addEventListener('click', () => {

        map.flyTo({
            center: [106.059, 20.653],
            essential: true
        });
    });
    //Zoom IN
    document.getElementById('zoom_in').addEventListener('click', () => {
        map.zoomIn({ duration: 1000 });
    });
    //Zoom Out
    document.getElementById('zoom_out').addEventListener('click', () => {
        map.zoomOut({ duration: 1000 });
    });

    //Init Traffic
    const traffic_map = new MapboxTraffic({
        showTraffic: false,
        showTrafficButton: false
    });

    //Traffic Map
    map.addControl(traffic_map);

    const traffic_map_el = document.querySelector('input#traffic_map');
    traffic_map_el.addEventListener('change', (event) => {
        if (traffic_map_el.checked) {
            console.log('show');
            traffic_map._showTraffic();
        } else {
            traffic_map._hideTraffic();
            console.log('hide');
        }
    });



    // map.on('click', function (e) {
    //     var coordinates = e.lngLat;
    //     new mapboxgl.Popup()
    //         .setLngLat(coordinates)
    //         .setHTML(coordinates)
    //         .addTo(map);
    // });



    setTimeout(() => {
        mk_fireTruck();
    }, 5000);

    setTimeout(() => {
        mk_ambulance();
    }, 8000);

};

//stolen Points
function mk_stolen() {

    var stolenlPoints = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.05875393711256, 20.669135725500155]
            },
            properties: {
                title: 'Xe mất cắp',
                type: 'bike',
                address: 'Nam Kỳ Khởi Nghĩa',
                time: '12:13:00'
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.05344929495942, 20.672479165944722]
            },
            properties: {
                title: 'Xe mất cắp',
                type: 'car',
                address: 'Nam Kỳ Khởi Nghĩa',
                time: '12:13:00'
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.05475417936935, 20.665723128157154]
            },
            properties: {
                title: 'Xe mất cắp',
                type: 'bike',
                address: 'Nam Kỳ Khởi Nghĩa',
                time: '12:13:00'
            }
        }]
    };

    stolenlPoints.features.forEach(function (marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');
        if (marker.properties.type == 'bike') {
            el.className = "stolen-point stolen-bike-point x2";
        }
        if (marker.properties.type == 'car') {
            el.className = "stolen-point stolen-car-point x2";
        }
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

        var popup_content = '<div class="event-popup"><div class=popup-inner><div class=popup-header><span class=count-down>Đóng sau <span class=number data-time=60>60</span>s</span></div><div class=popup-body><div class="media-placeholder ratio-16-9"><div class=bg style=background-color:#323e50></div><div class="align-items-center d-flex justify-content-center media-inner"><a href=#><i class="bi bi-play fs-5"></i></a></div></div><div class=event-info><div>' + marker.properties.title + '</div><div class=opacity-50>' + marker.properties.address + '</div></div></div></div></div>';

        var popup = new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 72, anchor: 'right', closeOnClick: false, className: 'marker-event-popup' })
                .setHTML(popup_content))
            .addTo(map);
    });

    return stolenlPoints;
}

//Wanted Points
function mk_wanted() {

    var wantedlPoints = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.05592571111953, 20.642423257805333]
            },
            properties: {
                name: 'Trần Văn A',
                image_url: 'img/temp/face.png',
                address: 'Đường Trần Huy Liệu',
                time: '12:13:00'
            }
        }]
    };

    wantedlPoints.features.forEach(function (marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = "wanted-point";

        var el_c = document.createElement('div');

        var oImg = document.createElement("img");
        oImg.setAttribute('src', marker.properties.image_url);

        el_c.append(oImg);
        el.append(el_c);

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

    });
    return wantedlPoints;
}

//ambulance Points
function mk_ambulance() {
    var ambulancelPoints = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.06437013115902, 20.658032073897616]
            }
        }]
    };

    ambulancelPoints.features.forEach(function (marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');

        el.className = "car-ambulance-point x1-5";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    });
    return ambulancelPoints;
}


//fireTruck Points
function mk_fireTruck() {
    var fireTrucklPoints = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.05058783764525, 20.6544250071983]
            }
        }]
    };

    fireTrucklPoints.features.forEach(function (marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');

        el.className = "fire-truck-point x1-5";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    });
    return fireTrucklPoints;
}

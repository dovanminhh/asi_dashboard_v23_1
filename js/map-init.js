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
        //center: [106.7831117, 20.8277361], // starting position [lng, lat]
        center: [106.059, 20.653],
        zoom: 14, // starting zoom,
        maxZoom: 16,
        minZoom: 12,
        pitch: 60,
        bearing: -60
    });

    https://www.google.com/maps/place/C%C3%B4ng+Ty+C%E1%BA%A3ng+Nam+H%E1%BA%A3i+%C4%90%C3%ACnh+V%C5%A9/@20.8277361,106.7831117,17z/data=!3m1!4b1!4m6!3m5!1s0x314a65884615f00d:0x184a447c8bce5fd4!8m2!3d20.8277361!4d106.785692!16s%2Fg%2F11b67yhvfy?entry=ttu&g_ep=EgoyMDI1MDUxMi4wIKXMDSoASAFQAw%3D%3D

    map.on("style.load", function () {

        /*--------------------
            Add Makers
        --------------------*/

        //ASI Traffic 

        // mk_dataCenter();
        // mk_groupCameras(); 
        // mk_securityCameras();
        // mk_hospital();
        // mk_fireStation();
        // mk_broadcast();
        // mk_environmentStation();
        // mk_loudSpeakers();
        // mk_police();

        // mk_ambulance();
        // mk_fireTruck();
        // mk_stolen();
        // mk_wanted();


        //ASI ENAV

        // mk_seaviewCameras();
        // mk_insideViewCameras();
        // mk_floats();
        // mk_shipBoats();


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
           Component: Bản đồ - Đối tượng
       --------------------*/
        showHideMapObject();


        /* Add Zoom Level */

        map.on('zoomend', (e) => {
            fn_checkZoomLevelOfMap();
        });

    });

    // map.on('click', function (e) {
    //     var coordinates = e.lngLat;
    //     new mapboxgl.Popup()
    //         .setLngLat(coordinates)
    //         .setHTML(coordinates)
    //         .addTo(map);
    // });

});

window.map_init_controls = function () {

    //Fly to Default Center
    document.getElementById('back_to_center').addEventListener('click', () => {

        map.flyTo({
            center: [106.059, 20.653],
            //center: [106.7831117, 20.8277361],
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
};

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
//Helper Function - Random Int
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Helper Function - Remove Class by Prefix
function removeClassByPrefix(node, prefix) {
    var regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
    node.className = node.className.replace(regx, '');
    return node;
}
//Function Count Marker on map
function viewinMap(points, el) {
    var points_number = 0;
    points.features.forEach(function (marker) {
        if (map.getBounds().contains(marker.geometry.coordinates)) {
            points_number = points_number + 1;
        }
    });
    el.innerHTML = points_number;
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
                    break;
                case 'float':
                    document.querySelectorAll('.float-marker').forEach((el) => {
                        toggleClass(el, 'deactive');
                    });
                    break;
                case 'shipboat':
                    document.querySelectorAll('.ship-boat-marker').forEach((el) => {
                        toggleClass(el, 'deactive');
                    });
                    break;
                case '':
                case 'seaviewcamera':
                    document.querySelectorAll('.group-camera-marker.seaview').forEach((el) => {
                        toggleClass(el, 'deactive');
                    });
                    break;
                case 'insideviewcamera':
                    document.querySelectorAll('.group-camera-marker.insideview').forEach((el) => {
                        toggleClass(el, 'deactive');
                    });
                    break;
                case '':
            }
        })
    })
}
/* ------------------------- 
Setup Makers
--------------------------*/

//Data Center
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

    var el_viewinmap = document.getElementById('datacenter_in_view');

    if (el_viewinmap) {
        viewinMap(dataCenterPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(dataCenterPoints, el_viewinmap);
        });
    }
}

//Broadcast
function mk_broadcast() {
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

    var el_viewinmap = document.getElementById('broadcast_in_view');

    if (el_viewinmap) {
        viewinMap(broadcastPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(broadcastPoints, el_viewinmap);
        });
    }

    return broadcastPoints;
}

//Group Camera
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
    var el_viewinmap = document.getElementById('groupcamera_in_view');

    if (el_viewinmap) {
        viewinMap(groupCameraPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(groupCameraPoints, el_viewinmap);
        });
    }

    return groupCameraPoints;
}

//Securiy Camera
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

    var el_viewinmap = document.getElementById('security_camera_in_view');

    if (el_viewinmap) {
        viewinMap(securityCameraPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(securityCameraPoints, el_viewinmap);
        });
    }

    return securityCameraPoints;
}
//Loudspeaker
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

    var el_viewinmap = document.getElementById('loudspeaker_in_view');

    if (el_viewinmap) {
        viewinMap(loudSpeakerPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(loudSpeakerPoints, el_viewinmap);
        });
    }

    return loudSpeakerPoints;
}
//Police
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

    var el_viewinmap = document.getElementById('police_in_view');

    if (el_viewinmap) {
        viewinMap(policePoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(policePoints, el_viewinmap);
        });
    }

    return policePoints;
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

    var el_viewinmap = document.getElementById('hospital_in_view');

    if (el_viewinmap) {
        viewinMap(hospitalPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(hospitalPoints, el_viewinmap);
        });
    }

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

    var el_viewinmap = document.getElementById('firestation_in_view');

    if (el_viewinmap) {
        viewinMap(fireStationlPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(fireStationlPoints, el_viewinmap);
        });
    }

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

    var el_viewinmap = document.getElementById('environment_in_view');

    if (el_viewinmap) {
        viewinMap(environmentlPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(environmentlPoints, el_viewinmap);
        });
    }

    return environmentlPoints;
}

//Group SeaView Camera
function mk_seaviewCameras() {
    var groupSeaViewCameraPoints = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.78499823166442, 20.831659061054808]
            },
            properties: {
                title: 'Cụm view biển - 01',
                description: 'Địa điểm: ',
                status: 1
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.76565186818021, 20.84455025859566]
            },
            properties: {
                title: 'Cụm view biển - 02',
                description: 'Địa điểm: ',
                status: 1
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.80683095123834, 20.827351723872084]
            },
            properties: {
                title: 'Cụm view biển - 03',
                description: 'Địa điểm: ',
                status: 1
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.82482432237464, 20.820697786720558]
            },
            properties: {
                title: 'Cụm view biển - 04',
                description: 'Địa điểm: ',
                status: 1
            }
        }]
    };

    groupSeaViewCameraPoints.features.forEach(function (marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = "group-camera-marker seaview";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

        var popup_content = '<div class="enav-camera-popup"><div class="popup-inner"><div class="popup-header"><i class="icon fa-solid fa-camera-cctv"></i><div class="title mb-0">' + marker.properties.title + '</div><div class="opacity-50 small">' + marker.properties.description + '</div></div><div class="popup-body"><table class="table table-borderless mb-2"><tbody><tr><td class="opacity-50 text-center"><i class="icon fa-solid fa-ship"></i></td><td class="opacity-50">Lượt theo dõi</td><td class="text-end">1234</td></tr><tr><td class="opacity-50 text-center"><i class="icon fa-solid fa-bell"></i></td><td class="opacity-50">Cảnh báo</td><td class="text-end">2</td></tr></tbody></table><div class="row gx-2"><div class="col-6"><button class="btn btn-sm btn-outline-light w-100">Xem Live</button></div><div class="col-6"><button class="btn btn-sm btn-primary w-100">Chi tiết</button></div></div></div></div></div>';

        var popup = new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ anchor: 'bottom', closeOnClick: false, className: 'marker-enav-camera-popup' })
                .setHTML(popup_content))
            .addTo(map);

        el.addEventListener('click', () => {
            if (el.classList.contains('active')) {
                el.classList.remove('active');

            } else {
                map.flyTo({
                    center: marker.geometry.coordinates,
                    essential: true
                });
                el.classList.add('active');
            }

        });
    });
    var el_viewinmap = document.getElementById('seaviewcamera_in_view');

    if (el_viewinmap) {
        viewinMap(groupSeaViewCameraPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(groupSeaViewCameraPoints, el_viewinmap);
        });
    }

    return groupSeaViewCameraPoints;
}
//Group SeaView Camera
function mk_insideViewCameras() {
    var groupInsideViewCameraPoints = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.79492646946767, 20.816240936048032]
            },
            properties: {
                title: 'Cụm view cửa - 01',
                description: 'Địa điểm: ',
                status: 1
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.81175261956707, 20.815952607286604]
            },
            properties: {
                title: 'Cụm view cửa - 02',
                description: 'Địa điểm: ',
                status: 1
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.81467170023302, 20.81587972938607]
            },
            properties: {
                title: 'Cụm view của - 03',
                description: 'Địa điểm: ',
                status: 1
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.8216059150036, 20.81582908480219]
            },
            properties: {
                title: 'Cụm view cửa - 04',
                description: 'Địa điểm: ',
                status: 1
            }
        }]
    };

    groupInsideViewCameraPoints.features.forEach(function (marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = "group-camera-marker insideview";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

        el.addEventListener('click', () => {
            if (el.classList.contains('active')) {
                el.classList.remove('active');

            } else {
                map.flyTo({
                    center: marker.geometry.coordinates,
                    essential: true
                });
                el.classList.add('active');
            }

        });
    });

    var el_viewinmap = document.getElementById('insideviewcamera_in_view');

    if (el_viewinmap) {
        viewinMap(groupInsideViewCameraPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(groupInsideViewCameraPoints, el_viewinmap);
        });
    }

    return groupInsideViewCameraPoints;
}

//Float
function mk_floats() {

    var floatlPoints = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.81800060931295, 20.836780302880072]
            },
            properties: {
                title: 'Phao hàng hải - 02',
                type: 'float'
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.83913436014569, 20.816406363882578]
            },
            properties: {
                title: 'Phao hàng hải - 02',
                type: 'float'
            }
        }]
    };

    floatlPoints.features.forEach(function (marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = "float-marker";
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

    });

    var el_viewinmap = document.getElementById('float_in_view');

    if (el_viewinmap) {
        viewinMap(floatlPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(floatlPoints, el_viewinmap);
        });

    }

    return floatlPoints;
}

//Ship Boat
function mk_shipBoats() {

    var shipBoatlPoints = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.79666588799728, 20.831374997303115]
            },
            properties: {
                title: 'Tàu 01',
                licenseplate: 'BKS-1',
                type: 'ship',
                direction: randomIntFromInterval(0, 360)
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.81044563461091, 20.831645984909045]
            },
            properties: {
                title: 'Tàu 02',
                licenseplate: 'BKS-2',
                type: 'ship',
                direction: randomIntFromInterval(0, 360)
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.82377532544535, 20.82910117067378]
            },
            properties: {
                title: 'Tàu 03',
                licenseplate: 'BKS-3',
                type: 'ship',
                direction: randomIntFromInterval(0, 360)
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.82750701484684, 20.827748601163265]
            },
            properties: {
                title: 'Tàu 04',
                licenseplate: 'BKS-4',
                type: 'boat',
                direction: randomIntFromInterval(0, 360)
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.83618642529393, 20.811338414144828]
            },
            properties: {
                title: 'Tàu 04',
                licenseplate: 'BKS-5',
                type: 'boat',
                direction: randomIntFromInterval(0, 360)
            }
        }]
    };

    shipBoatlPoints.features.forEach(function (marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = "ship-boat-marker";
        //el.style.transform = 'rotate(' + marker.properties.direction + 'deg)';
        var el_inner = document.createElement('div');
        el_inner.className = "inner";
        el_inner.style.transform = 'rotate( ' + marker.properties.direction + 'deg)';

        el.append(el_inner);

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);


    });
    var el_viewinmap = document.getElementById('shipboat_in_view');

    if (el_viewinmap) {
        viewinMap(shipBoatlPoints, el_viewinmap);
        map.on('moveend', () => {
            viewinMap(shipBoatlPoints, el_viewinmap);
        });

    }

    return shipBoatlPoints;

}
//stolen
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

//Wanted
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

//ambulance
function mk_ambulance() {
    var ambulancePoints = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.06437013115902, 20.658032073897616]
            }
        }]
    };

    ambulancePoints.features.forEach(function (marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');

        el.className = "car-ambulance-point x1-5";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    });


    return ambulancePoints;
}

//fireTruck
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






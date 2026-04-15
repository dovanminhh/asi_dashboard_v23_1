
//Thứ tự xắp xếp Mặc định
const defaut_listSortOrder = { "header_center": ["1"], "header_end": ["2", "3"], "map_top_left": ["6"], "map_top_right": ["7"], "map_bottom_left": ["8"], "map_bottom_right": ["9"], "content_footer": ["14"], "main_sidebar": ["4", "5"], "app_footer": ["10", "11", "12", "13"], "inactive_components": ["15", "24", "25", "26", "27", "28", "29", "30", "31", "32"] };

var listSortOrder = {};

//Render Component vào Container theo listSortOrderData
function renderHTML() {
    //Thứ tự sắp xếp hiện tại
    var listSortOrder = JSON.parse(localStorage.getItem("listSortOrderData"));
    //console.log('Thứ tự hiện tại ->');
    //console.log(listSortOrder);

    if (!listSortOrder) {
        //Nếu không có giá trị thì theo mặc định
        listSortOrder = defaut_listSortOrder;
    }

    //Lấy Component Container Name
    const sortOrderKeys = Object.keys(listSortOrder);

    sortOrderKeys.forEach((key) => {
        let parent = document.querySelector(`.component-container[data-name="${key}"]`);

        if (parent) {
            //console.log(listSortOrder[`${key}`]);
            var children = listSortOrder[`${key}`];

            //Chuyển Comonents vào đúng vị trí
            children.forEach((childEl) => {
                let child = document.querySelector(`.component-item[data-id="${childEl}"]`);
                if (child) {
                    parent.append(child);
                }
            });
        }

    });
}
renderHTML();

//Function ToggleFullscreen

function toggleFullscreen(event) {
    var element = document.body;

    if (event instanceof HTMLElement) {
        element = event;
    }

    var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

    element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
    document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };

    isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
}

//Function Toggle Class
function toggleClass(element, className) {
    if (!element || !className) {
        return;
    }

    var classString = element.className,
        nameIndex = classString.indexOf(className);
    if (nameIndex == -1) {
        classString += ' ' + className;
    } else {
        classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
    }
    element.className = classString;
}
//Btn Full Screen Toggle
const btn_fullscreen = document.getElementById('btn-fullscreen');
btn_fullscreen.addEventListener('click', function () {
    toggleFullscreen();
    toggleClass(btn_fullscreen, 'active');

});

// Enabale overlayscrollbars
var {
    OverlayScrollbars,
    ScrollbarsHidingPlugin,
    SizeObserverPlugin,
    ClickScrollPlugin
} = OverlayScrollbarsGlobal;

// const osInstance = OverlayScrollbars(document.body, {
//     scrollbars: {
//         theme: 'os-theme-light'
//     }
// });

// OS Theme Light
const customScrollsLight = document.querySelectorAll(".custom-scroll-light");
customScrollsLight.forEach((customScrollItem) => {
    OverlayScrollbars(customScrollItem, {
        scrollbars: {
            theme: 'os-theme-light'
        }
    });

});

// OS Theme Dark 
const customScrolls = document.querySelectorAll(".custom-scroll");
customScrolls.forEach((customScrollItem) => {
    OverlayScrollbars(customScrollItem, {});
});

/*--------------------
    Component Events monitoring
--------------------*/
var item_event_stats = document.querySelectorAll('.item_event_stats');

item_event_stats.forEach((item_event_stats_el) => {
    //
});

//Animation 

//Low
// var event_stats_animation_bg_1 = gsap.timeline({ repeat: -1 });
// event_stats_animation_bg_1.fromTo('.item-event-stats.low .icon .animation-bg-1', 2, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 });
// event_stats_animation_bg_1.to('.item-event-stats.low .icon .animation-bg-1', 1, { opacity: 0, scale: 1.2 });

// var event_stats_animation_bg_2 = gsap.timeline({ repeat: -1 });
// event_stats_animation_bg_2.fromTo('.item-event-stats.low .icon .animation-bg-2', 2, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 });
// event_stats_animation_bg_2.to('.item-event-stats.low .icon .animation-bg-2', 1, { opacity: 0, scale: 1.2 });

//Normal
gsap.config({ nullTargetWarn: false });
var event_stats_animation_bg_1 = gsap.timeline({ repeat: -1 });
event_stats_animation_bg_1.fromTo('.item-event-stats.normal .icon .animation-bg-1', 1.4, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 });
event_stats_animation_bg_1.to('.item-event-stats.normal .icon .animation-bg-1', 0.8, { opacity: 0, scale: 1.2 });

var event_stats_animation_bg_2 = gsap.timeline({ repeat: -1 });
event_stats_animation_bg_2.fromTo('.item-event-stats.normal .icon .animation-bg-2', 1.4, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 });
event_stats_animation_bg_2.to('.item-event-stats.normal .icon .animation-bg-2', 0.8, { opacity: 0, scale: 1.2 });

//High
var event_stats_animation_bg_1 = gsap.timeline({ repeat: -1 });
event_stats_animation_bg_1.fromTo('.item-event-stats.high .icon .animation-bg-1', 0.7, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 });
event_stats_animation_bg_1.to('.item-event-stats.high .icon .animation-bg-1', 0.4, { opacity: 0, scale: 1.2 });

var event_stats_animation_bg_2 = gsap.timeline({ repeat: -1 });
event_stats_animation_bg_2.fromTo('.item-event-stats.high .icon .animation-bg-2', 0.7, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 });
event_stats_animation_bg_2.to('.item-event-stats.high .icon .animation-bg-2', 0.4, { opacity: 0, scale: 1.2 });

//Radar Animation
if (document.querySelector('.radar')) {
    gsap.to('.radar .inner .beam', 2, { rotation: "360", transformOrigin: 'bottom right', ease: Linear.easeNone, repeat: -1 });
}

//List Events
var list_recent_event = document.querySelector('.list-recent-event');
if (list_recent_event) {
    new Flickity(list_recent_event, {
        cellAlign: 'left',
        contain: true,
        prevNextButtons: false,
        pageDots: false
    });
}

/*--------------------
    Component: Clock
--------------------*/
function clock() {
    const time = document.getElementById('time');
    if (time) {
        time.innerHTML = moment().format('H:mm:ss');
        setInterval(function () {
            time.innerHTML = moment().format('H:mm:ss');
        }, 1000);
    }

    const day = document.getElementById('day');
    if (day) {
        day.innerHTML = moment().format('dddd', 'vi');
    }
    const date = document.getElementById('date');
    if (date) {
        date.innerHTML = moment().format('DD-MM-YYYY');
    }

}
clock();


/*--------------------
    Component: Weather
--------------------*/

let apiKey = '4d64ee966ea03fd197abf2ec155bb799',
    //Traffic 
    corLat = '10.78433466277609',
    corLong = '106.69166849546065';

//ENAV Map
// corLat = '20.8277361',
// corLong = '106.7831117';

function getWeather() {
    const weather_image = document.getElementById('weather_image');
    const weather_description = document.getElementById('weather_description');
    const weather_temp = document.getElementById('weather_temp');
    const weather_wind = document.getElementById('weather_wind');
    const weather_humidity = document.getElementById('weather_humidity');

    fetch('https://api.openweathermap.org/data/2.5/weather?units=metric&lang=vi&lat=' + corLat + '&lon=' + corLong + '&appid=' + apiKey + '', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
        .then(response => response.json())
        .then(response => {
            //console.log(JSON.stringify(response));
            //console.log(Math.round(response["main"]["temp"]));
            if (weather_temp) {
                weather_temp.innerHTML = Math.round(response["main"]["temp"]);
            }
            if (weather_humidity) {
                weather_humidity.innerHTML = Math.round(response["main"]["humidity"]);
            }
            if (weather_image) {
                weather_image.setAttribute('src', "http://openweathermap.org/img/wn/" + response["weather"][0]["icon"] + ".png");
                weather_image.setAttribute('alt', response["weather"][0]["description"]);
            }
            if (weather_description) {
                weather_description.innerHTML = response["weather"][0]["description"];
            }
            if (weather_wind) {
                weather_wind.innerHTML = Math.round(response["wind"]["speed"]);
            }
        })

}
getWeather();

/*--------------------
    Component: Light Counter
--------------------*/
function light_counter(element) {
    var el = element;
    var counter = el.text();
    var counter_0 = counter;

    var counter_function = setInterval(function () {

        counter--
        el.text(counter);
        if (counter === 0) {
            clearInterval(counter_function);
            el.text(counter_0);
            el.parent().removeClass('active');

            if (el.parent().next().length == 0) {
                let next_el = el.parents('.traffic-light').find('.light-item:first-child');

                light_counter(next_el.find('.count-down'));
                next_el.addClass('active');
            } else {
                let next_el = el.parent().next();
                light_counter(next_el.find('.count-down'));
                next_el.addClass('active');
            }

        }
    }, 1000);
}


/*--------------------
    Component: DEMO Script
--------------------*/
function demo_script() {
    //Show Panel Script 
    document.querySelector('.item-script .nav-link').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('panelScript').classList.remove('d-none');
    });

    //Hide Panel Script 
    document.querySelector('.panel-script .btn-close').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('panelScript').classList.add('d-none');
    });

    //Panel Script Default Position
    const panel_position = { x: 0, y: 0 }

    interact('.panel-script').draggable({
        listeners: {
            start(event) {
                console.log(event.type, event.target)
            },
            move(event) {
                panel_position.x += event.dx
                panel_position.y += event.dy

                event.target.style.transform =
                    `translate(${panel_position.x}px, ${panel_position.y}px)`
            }
        }
    });
    //Hiện xe mất cấp
    document.querySelector('#panelScript .nav-item.item-stolen .nav-link').addEventListener('click', (event) => {
        event.preventDefault();
        if (map.loaded()) {
            mk_stolen();

        }
    });
    //Hiện đám cháy
    document.querySelector('#panelScript .nav-item.item-fire .nav-link').addEventListener('click', (event) => {
        event.preventDefault();
        if (map.loaded()) {
            mk_fireTruck();

            //Xong hiện xe cứu thương
            setTimeout(() => {
                mk_ambulance();
            }, 2000);
        }
    });
}

demo_script();


/*--------------------
    Component: GroupCameraDetail
--------------------*/
function groupCamerasDetail() {

    gsap.set(".group-cameras-detail", { opacity: 0, marginTop: "-300px" });

    //Hide groupCameraDetail
    document.querySelector('.group-cameras-detail .btn-close').addEventListener('click', (event) => {
        event.preventDefault();
        close_groupCameraDetail();
    });

    //Setup Drag & Drop
    const groupCamerasDetail_position = { x: 0, y: 0 }

    interact('.group-cameras-detail').draggable({
        listeners: {
            start(event) {
                console.log(event.type, event.target)
            },
            move(event) {
                groupCamerasDetail_position.x += event.dx
                groupCamerasDetail_position.y += event.dy

                event.target.style.transform =
                    `translate(${groupCamerasDetail_position.x}px, ${groupCamerasDetail_position.y}px)`
            }
        }
    });
}

function removeAllGroupCameraMaker() {
    var groupCameraMakers = document.querySelectorAll('.group-camera-marker');
    groupCameraMakers.forEach(function (groupCameraMaker) {
        groupCameraMaker.classList.remove('active');
    });
}

function close_groupCameraDetail() {
    gsap.to(".group-cameras-detail", {
        opacity: 0, marginTop: "-300px", duration: 0.5, onComplete: function () {
            document.getElementById('groupCameraDetail').classList.add('d-none');
        }
    });

    removeAllGroupCameraMaker();
}
function open_groupCameraDetail() {
    removeAllGroupCameraMaker();
    document.getElementById('groupCameraDetail').classList.remove('d-none');
    //Load data -> Animation
    gsap.fromTo(".group-cameras-detail", { opacity: 0, marginTop: "-300px", duration: 0.5 }, { opacity: 1, marginTop: "-320px" });
}

groupCamerasDetail();

/*--------------------
    Component: Notications
--------------------*/

function noticationAnimations() {
    gsap.from('.notication-item', {
        x: -100,
        opacity: 0,
        stagger: 0.1
    });

}
noticationAnimations();
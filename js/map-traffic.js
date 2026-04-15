const traffic_listSortOrder = { "header_center": ["1"], "header_end": ["2", "3"], "map_top_left": ["6"], "map_top_right": ["7"], "map_bottom_left": ["8"], "map_bottom_right": ["9"], "content_footer": ["14"], "main_sidebar": ["4", "5"], "app_footer": ["10", "11", "12", "13"], "inactive_components": ["15","24","25","26","27","28","29","30","31","32"] };

localStorage.setItem("listSortOrderData", JSON.stringify(traffic_listSortOrder));

document.addEventListener("DOMContentLoaded", (event) => {


    map.on("style.load", function () {

        map.setCenter([106.059, 20.653]);

         document.getElementById('back_to_center').addEventListener('click', () => {

            map.flyTo({
                center: [106.059, 20.653],
                essential: true
            });
        });

        //ASI Traffic 
        mk_dataCenter();
        mk_groupCameras(); 
        mk_securityCameras();
        mk_hospital();
        mk_fireStation();
        mk_broadcast();
        mk_environmentStation();
        mk_loudSpeakers();
        mk_police();

    }); 
    
}); 


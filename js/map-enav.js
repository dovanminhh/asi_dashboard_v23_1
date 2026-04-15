const enav_listSortOrder = { "header_center": ["26"], "header_end": ["2", "3"], "map_top_left": ["25"], "map_top_right": [""], "map_bottom_left": ["8"], "map_bottom_right": [""], "content_footer": ["24"], "main_sidebar": ["27", "28"], "app_footer": ["29","30","31","32"], "inactive_components": ["15","14","6","7","9","1","4","5","10", "11", "12", "13"] };

localStorage.setItem("listSortOrderData", JSON.stringify(enav_listSortOrder));

document.addEventListener("DOMContentLoaded", (event) => {

    map.on("style.load", function () {
        
        map.setCenter([106.7831117, 20.8277361]);
        
        document.getElementById('back_to_center').addEventListener('click', () => {

            map.flyTo({
                center: [106.7831117, 20.8277361],
                essential: true
            });
        });

        mk_seaviewCameras();
        mk_insideViewCameras();
        mk_floats();
        mk_shipBoats();

    }); 
    
}); 


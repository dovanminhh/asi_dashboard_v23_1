//Component Container
const component_containers = document.querySelectorAll('.component-container');

//Danh sách các component

// 1. Thông tin giao thông
// 2. Thông tin thời tiết
// 3. Đồng hồ
// 4. Thông tin sự cố
// 5. Hệ thống nhận diện
// 6. Bản đồ - Thống kê bản đồ
// 7. Bản đồ - Sự cố sự kiện
// 8. Bản đồ - Mini Map
// 9. Bản đồ - Trạng thái sự kiện 
// 10. Thống kê - Lưu lượng giao thông
// 11. Thống kê - Vi phạm giao thông
// 12. Thống kê - Vi phạm theo phương tiện
// 13. Thống kê - Vi phạm theo thể loại
// 14. Bản đồ - Đối tượng
// 15. Inactive Components

// 24. ENAV - Bản dồ - Đối tượng
// 25. ENAV - Bản đồ - Thống kê bản đồ
// 26. ENAV - Thông tin thủy văn
// 27. ENAV - Hệ thống cảnh báo
// 28. ENAV - Hàng rào ảo
// 29. ENAV - Thống kê - Tàu thuyền
// 30. ENAV - Thống kê - Phương tiện
// 31. ENAV - Thống kê - Lượt người ra vào cảng
// 32. ENAV - Thông tin hệ thống



//Thứ tự xắp xếp Mặc định - AI Traffic
// const defaut_listSortOrder = { "header_center": ["1"], "header_end": ["2", "3"], "map_top_left": ["6"], "map_top_right": ["7"], "map_bottom_left": ["8"], "map_bottom_right": ["9"], "content_footer": ["14"], "main_sidebar": ["4", "5"], "app_footer": ["10", "11", "12", "13"], "inactive_components": ["15","24","25","26","27","28","29","30","31","32"] };

//Thứ tự xắp xếp Mặc định - AI An toàn lao động
const defaut_listSortOrder = { "header_center": ["1"], "header_end": ["2", "3"], "map_top_left": ["6"], "map_top_right": ["7"], "map_bottom_left": ["8"], "map_bottom_right": ["9"], "content_footer": ["14"], "main_sidebar": ["4", "5"], "app_footer": ["10", "11", "12", "13"], "inactive_components": ["15", "24", "25", "26", "27", "28", "29", "30", "31", "32"] };

// Thứ tự sắp xếp Mặc Định - ENAV
// const defaut_listSortOrder = { "header_center": ["26"], "header_end": ["2", "3"], "map_top_left": ["25"], "map_top_right": [""], "map_bottom_left": ["8"], "map_bottom_right": [""], "content_footer": ["24"], "main_sidebar": ["27", "28"], "app_footer": ["29","30","31","32"], "inactive_components": ["15","14","6","7","9","1","4","5","10", "11", "12", "13"] };

var listSortOrder = {};

//Render Component vào Container theo listSortOrderData
function renderHTML() {
    //Thứ tự sắp xếp hiện tại
    var listSortOrder = JSON.parse(localStorage.getItem("listSortOrderData"));
    console.log('Thứ tự hiện tại ->');
    console.log(listSortOrder);

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

//Function getListSortOrder
function getListSortOrder(targets) {
    let array = [];
    targets.forEach((target) => {
        array.push(target.getAttribute("data-id"));
    });
    return array;
}

//Sau khi render HTML, Init thư viện Sortable JS
//Thứ tự tạm
var temp_listSortOrder = {};
component_containers.forEach((component_container) => {
    let sortable = Sortable.create(component_container, {
        group: "layout",
        handle: ".dragable-handle",
        draggable: ".component-item",
        onEnd: function (evt) {
            // Cập nhật dữ liệu tạm sau khi Sort
            temp_listSortOrder[evt.from.getAttribute("data-name")] = sortable.toArray();
            temp_listSortOrder[evt.to.getAttribute("data-name")] = getListSortOrder(evt.to.querySelectorAll('.component-item'));
            console.log('Thứ tự tạm thời sau khi thay đổi -> ');
            console.log(temp_listSortOrder);
        },
    });

    // Lưu Order khi khởi tạo
    temp_listSortOrder[component_container.getAttribute("data-name")] = sortable.toArray();

});

// Hiển thị Order Hiện tại
console.log('Thứ tự tạm thời -> ');
console.log(temp_listSortOrder);

//Lưu Order vào listSortOrderData
document.getElementById("btn-save").addEventListener("click", () => {
    localStorage.setItem("listSortOrderData", JSON.stringify(temp_listSortOrder));
    console.log('Thứ tự sau khi cập nhật vào localStorage -> ');
    console.log(JSON.parse(localStorage.getItem("listSortOrderData")));
    renderHTML();
    alert('Đã lưu lại');

});

//Trở về mặc định theo defaut_listSortOrder
document.getElementById("btn-reset").addEventListener("click", () => {
    temp_listSortOrder = defaut_listSortOrder;
    localStorage.setItem("listSortOrderData", JSON.stringify(defaut_listSortOrder));
    console.log('Trở về thứ tự mặc định sau khi cập nhật localStorage -> ');
    console.log(JSON.parse(localStorage.getItem("listSortOrderData")));

    alert('Trở về layout mặc định');
    renderHTML();
});
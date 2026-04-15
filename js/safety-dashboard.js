// ==============================================================================
// 1. BIỂU ĐỒ ĐIỂM SỐ AN TOÀN (GAUGE CHART - GÓC TRÁI TRÊN CÙNG)
// ==============================================================================
// Nhiệm vụ: Vẽ một biểu đồ hình cung (gauge/speedometer) hiển thị điểm an toàn tổng quan.
// Cơ chế: Sử dụng Canvas 2D API để tự tay vẽ từng vành cung gradient và kim chỉ số.
// Hoạt ảnh: Có hiệu ứng chạy "boot sweep" xẹt từ 0 lên 10 rồi mới quay về đúng giá trị thực.
(function () {
    const canvas = document.getElementById('gc');
    canvas.width = 230;
    canvas.height = 125;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H - 18;
    const R = 82, trackW = 16;
    const START_ANG = Math.PI, END_ANG = 2 * Math.PI;
    const BG = '#1b396b';

    /* ── Giá trị đích — đổi số này để thay điểm hiển thị ── */
    const TARGET = 8;

    const statuses = [
        { max: 2, label: 'Nguy hiểm', color: '#ff4400' },
        { max: 4, label: 'Cảnh báo', color: '#ff9900' },
        { max: 6, label: 'An toàn', color: '#7fff00' },
        { max: 8, label: 'An toàn, Tốt', color: '#44dd88' },
        { max: 10, label: 'An toàn, Xuất sắc', color: '#00ffcc' }
    ];

    /* Chuyển giá trị 0-10 thành góc radian */
    function valToAng(v) {
        return START_ANG + (v / 10) * (END_ANG - START_ANG);
    }

    /* Lấy màu RGB tại vị trí val trên cung */
    function colorAtVal(v) {
        const stops = [
            [0, [255, 51, 0]],
            [3, [255, 136, 0]],
            [6, [170, 238, 0]],
            [8.5, [51, 204, 85]],
            [10, [26, 58, 42]]
        ];
        for (let i = 0; i < stops.length - 1; i++) {
            const [v0, c0] = stops[i];
            const [v1, c1] = stops[i + 1];
            if (v >= v0 && v <= v1) {
                const t = (v - v0) / (v1 - v0);
                return [
                    Math.round(c0[0] + (c1[0] - c0[0]) * t),
                    Math.round(c0[1] + (c1[1] - c0[1]) * t),
                    Math.round(c0[2] + (c1[2] - c0[2]) * t)
                ];
            }
        }
        return stops[stops.length - 1][1];
    }

    /* Vẽ toàn bộ gauge tại giá trị val */
    function draw(val) {
        ctx.clearRect(0, 0, W, H);

        /* Track nền mờ */
        ctx.beginPath();
        ctx.arc(cx, cy, R, START_ANG, END_ANG);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = trackW;
        ctx.lineCap = 'butt';
        ctx.stroke();

        /* Cung màu — tô từng đoạn nhỏ để tạo gradient liên tục */
        if (val > 0) {
            const segCount = 120;
            const totalAng = END_ANG - START_ANG;
            const valFrac = val / 10;
            const fillEnd = valToAng(val);

            for (let i = 0; i < segCount; i++) {
                const frac = i / segCount;
                if (frac > valFrac) break;
                const a0 = START_ANG + frac * totalAng;
                const a1 = START_ANG + ((i + 1) / segCount) * totalAng;
                const [r, g, b] = colorAtVal(frac * 10);
                ctx.beginPath();
                ctx.arc(cx, cy, R, a0, Math.min(a1, fillEnd));
                ctx.strokeStyle = `rgb(${r},${g},${b})`;
                ctx.lineWidth = trackW;
                ctx.lineCap = 'butt';
                ctx.stroke();
            }
        }

        /* Kim hình mũi tên */
        const ang = valToAng(val);
        const needleLen = R - 14;
        const tailLen = 16;
        const tipX = cx + needleLen * Math.cos(ang);
        const tipY = cy + needleLen * Math.sin(ang);
        const tailX = cx - tailLen * Math.cos(ang);
        const tailY = cy - tailLen * Math.sin(ang);
        const px = Math.cos(ang + Math.PI / 2);
        const py = Math.sin(ang + Math.PI / 2);

        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(cx + px * 7, cy + py * 7);
        ctx.lineTo(tailX + px * 2.5, tailY + py * 2.5);
        ctx.lineTo(tailX - px * 2.5, tailY - py * 2.5);
        ctx.lineTo(cx - px * 7, cy - py * 7);
        ctx.closePath();
        ctx.fillStyle = '#00e5ff';
        ctx.fill();

        /* Chốt giữa */
        ctx.beginPath();
        ctx.arc(cx, cy, 9, 0, 2 * Math.PI);
        ctx.fillStyle = '#00e5ff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
        ctx.fillStyle = BG;
        ctx.fill();

        /* Nhãn 0 / 10 */
        ctx.fillStyle = 'rgba(170,196,240,0.8)';
        ctx.font = '11px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('0', cx - R + 2, cy + 14);
        ctx.textAlign = 'left';
        ctx.fillText('10', cx + R - 2, cy + 14);

        /* Cập nhật số và trạng thái */
        document.getElementById('gval').textContent = val.toFixed(1);
        const st = statuses.find(s => val <= s.max) || statuses[4];
        const el = document.getElementById('gstat');
        el.textContent = st.label;
        el.style.color = st.color;
    }

    /* Easing */
    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /* Animation: 0 → 10 (boot sweep) → TARGET (settle) */
    let startTime = null;
    const bootDuration = 900;
    const settleDuration = 600;
    let bootDone = false;
    let settleStart = null;

    function animate(ts) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;

        if (!bootDone) {
            const t = Math.min(elapsed / bootDuration, 1);
            draw(easeInOut(t) * 10);
            if (t >= 1) { bootDone = true; settleStart = ts; }
        } else {
            const t2 = Math.min((ts - settleStart) / settleDuration, 1);
            draw(10 + (TARGET - 10) * easeInOut(t2));
            if (t2 >= 1) { draw(TARGET); return; }
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();



// ==============================================================================
// 2. BIỂU ĐỒ VÒNG TRÒN % (DONUT CHARTS) - PHẦN THỐNG KÊ LƯỚI KHỐI TRÊN
// ==============================================================================
// Nhiệm vụ: Tìm tất cả các widget thống kê (ví dụ: Tỷ lệ online, Cảnh báo chưa xử lý)
// và vẽ biểu đồ hình Donut hiển thị tỷ lệ phần trăm đã hoàn thành bằng thư viện Chart.js.

function renderAllCharts() {
    // Tìm tất cả các cụm biểu đồ
    const groups = document.querySelectorAll('.chart-group');

    groups.forEach(group => {
        // Lấy số liệu từ chính các class bạn đã đặt
        const currentText = group.querySelector('.val-current').innerText;
        const totalText = group.querySelector('.val-total').innerText;

        const current = parseFloat(currentText);
        const total = parseFloat(totalText);
        const percentage = Math.round((current / total) * 100);

        // Tìm canvas và label % bên trong cụm này
        const canvas = group.querySelector('.gridItemDonutChart');
        const percentLabel = group.querySelector('.percent-label');
        const color = canvas.getAttribute('data-color') || '#00C896';

        // Cập nhật text % ở giữa
        if (percentLabel) percentLabel.innerText = percentage + "%";

        // Vẽ biểu đồ
        drawDonut(canvas, current, total, color);
    });
}

function drawDonut(canvas, value, total, color) {
    const ctx = canvas.getContext('2d');
    if (Chart.getChart(canvas)) Chart.getChart(canvas).destroy();

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, total - value],
                backgroundColor: [color, 'transparent'],
                borderWidth: 0,
                borderRadius: 10,
                cutout: '76%'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        },
        plugins: [{
            id: 'bg',
            beforeDatasetsDraw(chart) {
                const { ctx, chartArea: { left, top, width, height } } = chart;
                const meta = chart.getDatasetMeta(0).data[0];
                if (!meta) return;
                ctx.save();
                ctx.beginPath();
                ctx.arc(left + width / 2, top + height / 2, meta.outerRadius, 0, Math.PI * 2);
                ctx.arc(left + width / 2, top + height / 2, meta.innerRadius, 0, Math.PI * 2, true);
                ctx.fillStyle = '#1a3a6c'; // Giữ màu nền tối của bạn
                ctx.fill();
                ctx.restore();
            }
        }]
    });
}

document.addEventListener('DOMContentLoaded', renderAllCharts);





// ==============================================================================
// 3. BIỂU ĐỒ CỘT VÀO/RA (BÊN PHẢI) - THEO NHÀ THẦU HOẶC THEO 24 GIỜ
// ==============================================================================
// Nhiệm vụ: Trực quan hóa số lượt hiển thị biến động lượng công nhân Vào/Ra.
// Tính năng đặc biệt do user yêu cầu: 
//   + Khi chọn "Tất cả nhà thầu": Gộp lại thành 5 cột, các cột mập mạp fit 100% layout.
//   + Khi chọn 1 nhà thầu cụ thể: Trở về bảng timeline 24 giờ, mở rộng container thành 
//     1400px (scroll ngang) kèm theo thanh cuộn trượt tới đúng cung giờ hiện tại.
//   + Cột giờ tương lai tự động ép về mức Height 3px để chiếm chỗ giả (minBarLength: 3).
//   + Mã màu phân hóa rõ ràng rực rỡ riêng biệt cho các option "Vào" của nhà thầu.
let trafficChartInstance = null;

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('trafficBarChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const currentHour = new Date().getHours();

    const tVao = document.getElementById('total-vao');
    const tRa = document.getElementById('total-ra');
    const innerWrapper = document.getElementById('trafficChartInner');
    const scrollWrapper = document.querySelector('.chart-scroll-wrapper');
    const selectContractor = document.getElementById('contractorSelect');

    function renderChart(type) {
        if (trafficChartInstance) {
            trafficChartInstance.destroy();
        }

        let labels = [];
        let dataVao = [];
        let dataRa = [];
        let bgVao = [];
        let bgRa = [];

        // Define distinct colors for entries
        const contractColors = {
            'A': '#00FFFF', // Cyan
            'B': '#27AE60', // Green
            'C': '#FF3366', // Pink Red
            'D': '#B233FF', // Purple
            'E': '#335BFF'  // Blue
        };

        if (type === 'ALL') {
            // Hiển thị tất cả 5 nhà thầu
            const contractors = [
                { id: 'A', name: 'Nhà thầu A' },
                { id: 'B', name: 'Nhà thầu B' },
                { id: 'C', name: 'Nhà thầu C' },
                { id: 'D', name: 'Nhà thầu D' },
                { id: 'E', name: 'Nhà thầu E' }
            ];

            const mockData = contractors.map(c => ({
                name: c.name,
                vao: Math.floor(Math.random() * 800) + 200,
                ra: Math.floor(Math.random() * 600) + 100,
                colorCode: contractColors[c.id]
            }));

            labels = mockData.map(d => d.name);
            dataVao = mockData.map(d => d.vao);
            dataRa = mockData.map(d => d.ra);
            bgVao = mockData.map(d => d.colorCode); // Mỗi nhà thầu vào 1 màu riêng
            bgRa = mockData.map(() => '#FF9F43'); // Màu ra chung 1 màu

            // Set width fit parent
            innerWrapper.style.width = '100%';

            // Cập nhật số tổng lên HTML
            if (tVao && tRa) {
                tVao.innerText = mockData.reduce((s, i) => s + i.vao, 0).toLocaleString();
                tRa.innerText = mockData.reduce((s, i) => s + i.ra, 0).toLocaleString();
            }

        } else {
            // Hiển thị theo giờ trong ngày của nhà thầu được chọn
            const hourlyData = Array.from({ length: 24 }, (_, i) => ({
                hour: (i < 10 ? '0' + i : i) + 'h',
                vao: i > currentHour ? 0 : Math.floor(Math.random() * 200) + 50,
                ra: i > currentHour ? 0 : Math.floor(Math.random() * 150) + 20
            }));

            const selectedColor = contractColors[type] || '#00FFFF';

            labels = hourlyData.map(d => d.hour);
            dataVao = hourlyData.map(d => d.vao);
            dataRa = hourlyData.map(d => d.ra);
            bgVao = hourlyData.map((_, i) => i > currentHour ? '#333333' : selectedColor);
            bgRa = hourlyData.map((_, i) => i > currentHour ? '#333333' : '#FF9F43');

            // Set width to 1400px so it spans wide
            innerWrapper.style.width = '1400px';

            if (tVao && tRa) {
                tVao.innerText = hourlyData.reduce((s, i) => s + i.vao, 0).toLocaleString();
                tRa.innerText = hourlyData.reduce((s, i) => s + i.ra, 0).toLocaleString();
            }
        }

        trafficChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Vào',
                        data: dataVao,
                        backgroundColor: bgVao,
                        borderRadius: 0,
                        minBarLength: 3 // Set strictly 3px visual for 0 values
                    },
                    {
                        label: 'Ra',
                        data: dataRa,
                        backgroundColor: bgRa,
                        borderRadius: 0,
                        minBarLength: 3 // Set strictly 3px visual for 0 values
                    }
                ]
            },
            layout: {
                padding: {
                    top: 15 // Ensure the tallest bar never hits the roof, preventing minBarLength overflow
                }
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#888', font: { size: 12 } },
                        categoryPercentage: type === 'ALL' ? 0.6 : 0.7,
                        barPercentage: 0.9
                    },
                    y: {
                        display: false,
                        beginAtZero: true,
                        grace: '10%' // Cấp thêm 10% khoảng không trên đỉnh để không vỡ giao diện
                    }
                }
            }
        });

        // Trigger reflow & center chart if it's hourly view
        if (type !== 'ALL' && scrollWrapper) {
            setTimeout(() => {
                const hourWidth = 1400 / 24;
                scrollWrapper.scrollLeft = (currentHour * hourWidth) - (scrollWrapper.clientWidth / 2);
            }, 50);
        }
    }

    // Initialize with ALL
    renderChart('ALL');

    // On select change
    if (selectContractor) {
        selectContractor.addEventListener('change', (e) => {
            renderChart(e.target.value);
        });
    }
});




// ==============================================================================
// 4. BIỂU ĐỒ BONG BÓNG (BUBBLE CHART) - KHỐI TỔNG SỐ CẢNH BÁO
// ==============================================================================
// Nhiệm vụ: Thay thế hoàn toàn thuật toán Vẽ Canvas của Chart.js bằng BONG BÓNG DOM (Thẻ DIV thuần).
// Cách này thoát khỏi mọi lỗi "Auto-padding" sai lệch tỉ lệ ngầm của Canvas,
// đảm bảo tuyệt đối sự chính xác toán học 100% không bao giờ đè hình!
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('warningBubbleChart');
    if (!canvas) return;

    const values = [96, 20, 3];
    const total = values.reduce((a, b) => a + b, 0);
    const colors = ['#3A9CFF', '#FF4D00', '#FFB300'];
    const labels = ['Quần áo bảo hộ', 'Xâm nhập vùng cấm', 'Mũ bảo hộ'];

    // Lấy thẻ cha và khai tử Canvas (Gốc rễ của lỗi đè độ phân giải)
    const parent = canvas.parentElement;
    parent.style.position = 'relative';
    parent.innerHTML = '';

    // Tạo Khung chứa mới chuẩn DOM Responsive
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '0';
    container.style.overflow = 'visible';
    parent.appendChild(container);

    // Xây Tooltip mượt như Chart.js
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0,0,0,0.8)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '6px 12px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '13px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s';
    tooltip.style.zIndex = '99999';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.fontFamily = 'Inter, sans-serif';
    document.body.appendChild(tooltip);

    // Sinh học thẻ DOM cho từng Bóng
    const bubbles = values.map((val, i) => {
        const b = document.createElement('div');
        b.style.position = 'absolute';
        b.style.borderRadius = '50%';
        b.style.backgroundColor = colors[i] + 'CC'; // Nền Transparent xíu
        b.style.border = `2px solid ${colors[i]}`;
        b.style.display = 'flex';
        b.style.alignItems = 'center';
        b.style.justifyContent = 'center';
        b.style.color = '#ffffff';
        b.style.fontWeight = 'bold';
        b.style.fontFamily = 'Inter, sans-serif';
        b.style.boxSizing = 'border-box';
        // Hiệu ứng di chuyển mượt mà cực kì bắt mắt khi thay đổi Size màn hình:
        b.style.transition = 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        b.style.cursor = 'pointer';

        b.innerText = val;

        // Gắn tương tác thả bóng Tooltip
        b.addEventListener('mouseenter', () => {
            tooltip.innerHTML = `${labels[i]}: <strong>${val}</strong>`;
            tooltip.style.opacity = '1';
        });
        b.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY + 15) + 'px';
        });
        b.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        container.appendChild(b);
        return b;
    });

    // Function dàn xếp thuật toán Tam giác tách rời hoàn chỉnh
    function renderDOMBubbles() {
        // Lấy đúng kích cỡ Pixel thật của thẻ HTML ở thời khắc này
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;

        const rawVals = values.map(v => Math.max(Math.sqrt(v), 0.1));
        const maxRaw = Math.max(...rawVals);

        // Quả nhỏ nhất bét nhất cũng phải to bằng 25% quả to nhất để dễ đọc text
        const minRaw = maxRaw * 0.25;
        const rawRadii = rawVals.map(r => Math.max(r, minRaw));

        const order = rawRadii.map((r, i) => ({ r, i, val: values[i] })).sort((a, b) => b.r - a.r);

        // Khe hở tách biệt an toàn = 15% bóng to nhất
        const gap = maxRaw * 0.15;

        // Vẽ cụm điểm
        const c0 = order[0];
        const c1 = order[1];
        const c2 = order[2];

        c0.x = 0; c0.y = 0;
        c1.x = c0.r + c1.r + gap; c1.y = 0;

        const d02 = c0.r + c2.r + gap;
        const d12 = c1.r + c2.r + gap;

        let x2 = 0, y2 = 0;
        if (c1.x > 0 && d02 + d12 > c1.x) {
            x2 = (d02 * d02 - d12 * d12 + c1.x * c1.x) / (2 * c1.x);
            y2 = Math.sqrt(Math.abs(d02 * d02 - x2 * x2));
        } else {
            y2 = d02;
        }
        c2.x = x2; c2.y = y2;

        // Xoay lệch tạo sự năng động
        const angle = -40 * Math.PI / 180;
        const rotate = (p) => {
            const nx = p.x * Math.cos(angle) - p.y * Math.sin(angle);
            const ny = p.x * Math.sin(angle) + p.y * Math.cos(angle);
            p.x = nx; p.y = ny;
        };
        rotate(c0); rotate(c1); rotate(c2);

        const placed = [];
        placed[c0.i] = c0; placed[c1.i] = c1; placed[c2.i] = c2;

        // Giới hạn hộp (Bounding Box)
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        placed.forEach(p => {
            minX = Math.min(minX, p.x - p.r);
            maxX = Math.max(maxX, p.x + p.r);
            minY = Math.min(minY, p.y - p.r);
            maxY = Math.max(maxY, p.y + p.r);
        });

        const packW = maxX - minX;
        const packH = maxY - minY;

        // Vành đai padding tuyệt đối cách tường DOM = 15% (rộng rãi ko lo kẹt)
        const pad = Math.min(w, h) * 0.15;

        // Co giãn Scale Tự động xuống vừa sát viền Box
        let scale = Math.min((w - pad * 2) / packW, (h - pad * 2) / packH);

        // Khóa phanh hãm bán kính bóng vượt ngưỡng 35% diện tích div
        const maxLimit = Math.min(w, h) * 0.35;
        if (order[0].r * scale > maxLimit) {
            scale = maxLimit / order[0].r;
        }

        const cx = minX + packW / 2;
        const cy = minY + packH / 2;

        // Offset đẩy về chính giữa lõi Container
        const offX = (w / 2) - (cx * scale);
        const offY = (h / 2) - (cy * scale);

        // Update vị trí thẳng vào thẻ DOM - Chính xác trên từng Pixel!
        placed.forEach((p, i) => {
            const finalR = p.r * scale;
            // Góc trên cùng bên trái của div = Tọa độ tâm - Bán Kính
            const left = p.x * scale + offX - finalR;
            const top = p.y * scale + offY - finalR;
            const diameter = finalR * 2;

            const b = bubbles[i];
            b.style.left = left + 'px';
            b.style.top = top + 'px';
            b.style.width = diameter + 'px';
            b.style.height = diameter + 'px';
            // Size text nương theo bán kính nhưng có đáy an toàn là 12px
            b.style.fontSize = Math.max(12, finalR * 0.45) + 'px';
            // Z-Index: Bóng càng nhỏ thì Z-index càng Cao (Nổi Lên TrêN)
            b.style.zIndex = Math.round(1000 - finalR);
        });
    }

    // Khi cửa sổ giãn nở, trình duyệt sẽ tự gõ render lại toạ độ rất thông minh
    const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(renderDOMBubbles);
    });
    resizeObserver.observe(container);

    // Kích nổ khởi tạo lần đầu
    renderDOMBubbles();

    // Cập nhật thẻ chữ Tổng
    const cardEl = document.querySelector('[data-id="5"] .card-header p');
    if (cardEl) {
        cardEl.innerText = total;
    }
});











// ==============================================================================
// 5. MAP & ICON CAMERA HỆ THỐNG - HOẠT ẢNH CẢNH BÁO CAO CẤP
// ==============================================================================
// Quản lý bản đồ mô phỏng và vị trí của các mắt Camera/Bốt bảo vệ.
// Tọa độ sử dụng (%) để Responsive cực tốt khi kéo nhỏ trình duyệt.
const mapCameras = [
    { id: 'Cam-01', left: 49.97, top: 14.79, location: 'Khu vực Bếp (Bên trên)', status: 'Hoạt động', cssClass: 'camera-icon' },
    { id: 'Cam-02', left: 69.93, top: 19.89, location: 'Phòng Family', status: 'Hoạt động', cssClass: 'camera-icon' },
    { id: 'Cam-03', left: 81.45, top: 59.74, location: 'Cửa sổ góc phải', status: 'Hoạt động', cssClass: 'camera-icon' },
    { id: 'Cam-04', left: 35.17, top: 82.19, location: 'Khu vực Cầu thang', status: 'Hoạt động', cssClass: 'camera-icon' },
    { id: 'Booth-01', left: 18.92, top: 63.22, location: 'Bốt bảo vệ', status: 'Cảnh báo', cssClass: 'warning booth-icon' },
    { id: 'Cam-07', left: 13.58, top: 44.68, location: 'Khu hiên ngoài (Porch)', status: 'Hoạt động', cssClass: 'camera-icon' },
    { id: 'Cam-10', left: 75.87, top: 88.68, location: 'Vị trí mới 1', status: 'Hoạt động', cssClass: 'camera-icon' },
    { id: 'Cam-11', left: 42.66, top: 54.51, location: 'Vị trí mới 2', status: 'Hoạt động', cssClass: 'camera-icon' }
];

function initMapIcons() {
    const container = document.querySelector('.content-map');
    const vignetteContainer = container ? container.querySelector('.vignette-container') : null;
    const img = vignetteContainer ? vignetteContainer.querySelector('img') : null;
    if (!container || !vignetteContainer || !img) return;

    if (window.getComputedStyle(vignetteContainer).position === 'static') {
        vignetteContainer.style.position = 'relative';
    }

    // Xóa các icon rỗng đang có trong HTML nếu người dùng lỡ viết
    vignetteContainer.querySelectorAll('.map-icon').forEach(el => el.remove());

    // Khởi tạo các DOM icon từ mảng mapCameras
    const iconElements = mapCameras.map((cam, index) => {
        const icon = document.createElement('div');
        // Add has-alert if status is warning to demonstrate the notification dot
        let classes = 'map-icon ' + (cam.cssClass || '');
        if (cam.status === 'Cảnh báo' || index === 0) classes += ' has-alert';

        icon.className = classes;
        icon.dataset.baseLeft = cam.left;
        icon.dataset.baseTop = cam.top;
        icon.dataset.camId = cam.id;

        let innerIcon = `<i class="fa-solid fa-camera-cctv"></i>`;
        if (cam.cssClass && cam.cssClass.includes('booth-icon')) {
            innerIcon = `<i class="fa-solid fa-shield-halved"></i>`;
        }

        icon.innerHTML = `
            ${innerIcon}
            <div class="alert-dot"></div>
            <div class="brackets">
                <span class="br-tl"></span><span class="br-tr"></span>
                <span class="br-bl"></span><span class="br-br"></span>
            </div>
        `;

        icon.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            document.querySelectorAll('.map-icon').forEach(el => el.classList.remove('active'));
            icon.classList.add('active');

            showCameraPopup({
                name: cam.id,
                location: cam.location,
                status: cam.status
            }, icon);
        });

        vignetteContainer.appendChild(icon);
        return icon;
    });

    function placeIcons() {
        if (!iconElements.length || !img.naturalWidth) return;

        const containerW = vignetteContainer.clientWidth;
        const containerH = vignetteContainer.clientHeight;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const containerRatio = containerW / containerH;

        let renderW, renderH, offsetX = 0, offsetY = 0;

        if (containerRatio > imgRatio) {
            renderH = containerH;
            renderW = containerH * imgRatio;
            offsetX = (containerW - renderW) / 2;
        } else {
            renderW = containerW;
            renderH = containerW / imgRatio;
            offsetY = (containerH - renderH) / 2;
        }

        iconElements.forEach(icon => {
            // Chỉ xếp đặt lại toạ độ nếu đang không bị nắm kéo
            if (icon.classList.contains('dragging')) return;

            const leftRatio = parseFloat(icon.dataset.baseLeft) / 100;
            const topRatio = parseFloat(icon.dataset.baseTop) / 100;

            const pxLeft = offsetX + (leftRatio * renderW);
            const pxTop = offsetY + (topRatio * renderH);

            icon.style.left = `${pxLeft}px`;
            icon.style.top = `${pxTop}px`;
        });
    }

    if (img.complete) {
        placeIcons();
    } else {
        img.addEventListener('load', placeIcons);
    }

    // Theo dõi thay đổi kích thước bằng ResizeObserver để bắt chính xác layout flexbox
    if (window._mapResizeObserver) {
        window._mapResizeObserver.disconnect();
    }
    window._mapResizeObserver = new ResizeObserver(() => {
        placeIcons();
    });
    window._mapResizeObserver.observe(vignetteContainer);

    // ==============================================================================
    // 5B. TÍNH NĂNG ZOOM VÀ KÉO THẢ MAP PAN/ZOOM (BẢN ĐỒ INTERACTIVE)
    // ==============================================================================
    // Giúp người dùng có thể con lăn phóng to thu nhỏ và kéo lê tấm bản đồ giống Google Maps
    let currentZoom = 1;
    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let startX = 0;
    let startY = 0;

    const applyMapTransform = () => {
        vignetteContainer.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
        vignetteContainer.style.transformOrigin = 'center center';
    };

    // Zoom Buttons
    const btnCenter = document.getElementById('back_to_center');
    const btnZoomIn = document.getElementById('zoom_in');
    const btnZoomOut = document.getElementById('zoom_out');

    if (btnCenter) btnCenter.onclick = () => {
        currentZoom = 1;
        panX = 0;
        panY = 0;
        vignetteContainer.style.transition = 'transform 0.3s ease-out';
        applyMapTransform();
    };

    if (btnZoomIn) btnZoomIn.onclick = () => {
        currentZoom = Math.min(currentZoom + 0.25, 4);
        vignetteContainer.style.transition = 'transform 0.2s ease-out';
        applyMapTransform();
    };

    if (btnZoomOut) btnZoomOut.onclick = () => {
        currentZoom = Math.max(currentZoom - 0.25, 0.5);
        vignetteContainer.style.transition = 'transform 0.2s ease-out';
        applyMapTransform();
    };

    // Panning (Drag to Move)
    vignetteContainer.addEventListener('mousedown', (e) => {
        if (e.target.closest('.map-icon') || e.target.closest('.map-popup')) return;
        isPanning = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        vignetteContainer.style.cursor = 'grabbing';
        vignetteContainer.style.transition = 'none'; // remove animation for smooth drag
    });

    window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        applyMapTransform();
    });

    window.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            vignetteContainer.style.cursor = 'grab';
        }
    });

    // Bắt đầu với cursor grab cho bản đồ
    vignetteContainer.style.cursor = 'grab';
}
// ==============================================================================
// 6. POPUP BẢNG ĐIỀU KHIỂN CHI TIẾT CAMERA (MODAL)
// ==============================================================================
// Popup hiển thị bên cạnh khi click vào 1 camera (Tên, nút play, ảnh snapshot nhỏ, v.v)
// Sử dụng thư viện "interact.js" để cấp quyền nhấn-vào-và-kéo (Drag n Drop) nó đi khắp
// trình duyệt, kèm theo Collision Logic bảo vệ giới hạn không cho bị lọt ra ngoài mép.
function showCameraPopup(cam, iconEl) {
    // Xóa modal cũ nếu có
    document.querySelector('.custom-cam-modal')?.remove();

    const popup = document.createElement('div');
    popup.className = 'custom-cam-modal';
    popup.innerHTML = `
        <div class="modal-header">
            <span class="size-32 d-flex align-items-center justify-content-center rounded-circle bg-safety-orange me-2"><i class="fa-solid fa-play"></i></span>
            <div class="title-group">
                <h4 class="fs-16px lh-1 fw-normal text-white mb-1">Camera 01 - Đầu vào</h4>
                <p class="small lh-1 fw-normal text-white opacity-50 mb-0">Lô A1</p>
            </div>
            <button class="close-btn"><i class="fa-light fa-xmark"></i></button>
        </div>
        
        <div class="input-group-choose-date input-group-sm custom-input-group flex items-center justify-between">
            <span class="d-flex align-items-center">
                <i class="text-[16px] me-2 text-white fa-regular fa-calendar"></i>
                <input type="text" class="input-choose-date pl-2 bg-transparent text-white opacity-50 text-[16px] leading-[100%]" placeholder="Chọn ngày" id="dateMarker">
            </span>
            <i class="text-[16px] text-white/50 fa-regular fa-chevron-right cursor-pointer"></i>
        </div>
        
        <div class="modal-body">
            <div class="modal-body-header">
                <h5 class="fs-14px lh-1 fw-medium text-white">Hôm nay</h5>
                <span class="alert-badge min-width text-center fs-14px lh-1 fw-medium text-white py-1"><i class="me-2 fa-solid fa-bell"></i>05+</span>
            </div>
            <div class="custom-scroll-light pe-1" data-overlayscrollbars-initialize style="max-height: 260px; overflow-x: hidden;">
                <div class="snapshots row g-3 mx-0">
                    <div class="col-4">
                        <div class="snapshot-card min-height rounded-1 overflow-hidden position-relative">
                            <img src="img/scene-photo-1.jpg" alt="Snapshot 1" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                            <div class="timestamp bg-orange p-2 position-absolute bottom-0 start-0 w-100">
                                <span class="d-flex align-items-center fs-12px lh-1 fw-normal text-white">
                                    <i class="fa-regular fa-clock me-1"></i>
                                    15:01 
                                </span>
                                <i class="fa-light fa-arrow-up-right"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-4">
                        <div class="snapshot-card min-height rounded-1 overflow-hidden position-relative">
                            <img src="img/scene-photo-2.png" alt="Snapshot 1" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                            <div class="timestamp bg-azure-blue p-2 position-absolute bottom-0 start-0 w-100">
                                <span class="d-flex align-items-center fs-12px lh-1 fw-normal text-white">
                                    <i class="fa-regular fa-clock me-1"></i>
                                    15:01 
                                </span>
                                <i class="fa-light fa-arrow-up-right"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-4">
                        <div class="snapshot-card min-height rounded-1 overflow-hidden position-relative">
                            <img src="img/scene-photo-1.jpg" alt="Snapshot 1" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                            <div class="timestamp bg-orange p-2 position-absolute bottom-0 start-0 w-100">
                                <span class="d-flex align-items-center fs-12px lh-1 fw-normal text-white">
                                    <i class="fa-regular fa-clock me-1"></i>
                                    15:01 
                                </span>
                                <i class="fa-light fa-arrow-up-right"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="snapshot-card min-height rounded-1 overflow-hidden position-relative">
                            <img src="img/scene-photo-1.jpg" alt="Snapshot 1" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                            <div class="timestamp bg-orange p-2 position-absolute bottom-0 start-0 w-100">
                                <span class="d-flex align-items-center fs-12px lh-1 fw-normal text-white">
                                    <i class="fa-regular fa-clock me-1"></i>
                                    15:01 
                                </span>
                                <i class="fa-light fa-arrow-up-right"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="snapshot-card min-height rounded-1 overflow-hidden position-relative">
                            <img src="img/scene-photo-1.jpg" alt="Snapshot 1" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                            <div class="timestamp bg-orange p-2 position-absolute bottom-0 start-0 w-100">
                                <span class="d-flex align-items-center fs-12px lh-1 fw-normal text-white">
                                    <i class="fa-regular fa-clock me-1"></i>
                                    15:01 
                                </span>
                                <i class="fa-light fa-arrow-up-right"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="snapshot-card min-height rounded-1 overflow-hidden position-relative">
                            <img src="img/scene-photo-1.jpg" alt="Snapshot 1" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                            <div class="timestamp bg-orange p-2 position-absolute bottom-0 start-0 w-100">
                                <span class="d-flex align-items-center fs-12px lh-1 fw-normal text-white">
                                    <i class="fa-regular fa-clock me-1"></i>
                                    15:01 
                                </span>
                                <i class="fa-light fa-arrow-up-right"></i>
                            </div>
                        </div>
                    </div>
                <div class="col-4">
                    <div class="snapshot-card min-height rounded-1 overflow-hidden position-relative">
                        <img src="img/scene-photo-1.jpg" alt="Snapshot 1" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                        <div class="timestamp bg-orange p-2 position-absolute bottom-0 start-0 w-100">
                            <span class="d-flex align-items-center fs-12px lh-1 fw-normal text-white">
                                    <i class="fa-regular fa-clock me-1"></i>
                                    15:01 
                                </span>
                                <i class="fa-light fa-arrow-up-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal-footer d-flex align-items-start">
            <span class="label fs-14px lh-1 fw-normal text-white opacity-75">Nhiệm vụ</span>
            <span class="text-end">
                <p class="value fs-14px lh-1 fw-normal text-white mb-1">Quần Áo bảo hộ</p>
                <p class="value fs-14px lh-1 fw-normal text-white mb-1">Mũ bảo hộ</p>
            </span>
            
        </div>
    `;

    // Append directly to body to bypass any local z-index confines
    const container = document.body;

    // Add visually hidden first to calculate real heights
    popup.style.visibility = 'hidden';
    container.appendChild(popup);

    // Kích hoạt cuộn mượt OverlayScrollbars cho popup
    if (typeof OverlayScrollbars !== 'undefined') {
        const scrollEl = popup.querySelector('.custom-scroll-light');
        if (scrollEl) {
            OverlayScrollbars(scrollEl, { scrollbars: { theme: 'os-theme-light' } });
        }
    }

    // Kích hoạt thư viện Flatpickr cho ô chọn ngày (Vì phần tử này vừa được tạo bằng Javascript)
    if (typeof flatpickr !== 'undefined') {
        flatpickr(popup.querySelector('#dateMarker'), {
            altInput: true,
            altFormat: "d/m/Y",
            dateFormat: "Y-m-d",
            locale: "vn",
            allowInput: true,
            disableMobile: true,
            onOpen: function (selectedDates, dateStr, instance) {
                // Tăng tối đa Z-Index của bảng lịch vì hệ thống Modal đang chiếm mốc 999999
                if (instance.calendarContainer) {
                    instance.calendarContainer.style.zIndex = '9999999';
                }
            }
        });
    } else {
        console.error("Flatpickr không hoạt động: Thư viện chưa được nhúng hoặc bị lỗi đường dẫn <script>");
    }

    const iconRect = iconEl.getBoundingClientRect();

    const mWidth = popup.offsetWidth;
    const mHeight = popup.offsetHeight;
    const vWidth = window.innerWidth;
    const vHeight = window.innerHeight;

    let leftPos = iconRect.right + 15; // default to right of icon
    let topPos = iconRect.top - (mHeight / 3);

    // Kiểm tra tràn viền ngang màn hình
    if (leftPos + mWidth > vWidth) {
        leftPos = iconRect.left - mWidth - 15;
        if (leftPos < 0) leftPos = 10; // an toàn ranh trái
    }

    // Kiểm tra tràn viền dọc đáy màn hình
    if (topPos + mHeight > vHeight - 10) {
        topPos = vHeight - mHeight - 10;
    }

    // Kiểm tra tràn nóc màn hình
    if (topPos < 10) {
        topPos = 10;
    }

    popup.style.left = leftPos + 'px';
    popup.style.top = topPos + 'px';
    popup.style.position = 'fixed'; // Ensure it's viewport fixed
    popup.style.zIndex = '999999';  // Max priority overlay
    popup.style.visibility = 'visible';

    // Đóng popup chỉ khi click X
    popup.querySelector('.close-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        popup.remove();
        iconEl.classList.remove('active');
    });

    // Kéo thả Modal (Drag & Drop) chặn tràn viền
    const dragHandle = popup.querySelector('.modal-header');
    dragHandle.style.cursor = 'grab';

    let isDraggingModal = false;
    let mStartX = 0, mStartY = 0, mInitLeft = 0, mInitTop = 0;

    const onModalMouseMove = (e) => {
        if (!isDraggingModal) return;

        let newX = mInitLeft + (e.clientX - mStartX);
        let newY = mInitTop + (e.clientY - mStartY);

        // Tính toán ranh giới màn hình trình duyệt (Fix tràn cạnh khi drag)
        const maxLeft = window.innerWidth - popup.offsetWidth;
        const maxTop = window.innerHeight - popup.offsetHeight;

        if (newX < 0) newX = 0;
        if (newX > maxLeft) newX = maxLeft;

        if (newY < 0) newY = 0;
        if (newY > maxTop) newY = maxTop;

        popup.style.left = newX + 'px';
        popup.style.top = newY + 'px';
    };

    const onModalMouseUp = () => {
        isDraggingModal = false;
        dragHandle.style.cursor = 'grab';
        document.removeEventListener('mousemove', onModalMouseMove);
        document.removeEventListener('mouseup', onModalMouseUp);
    };

    dragHandle.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return; // Bỏ qua nếu click vào nút X hoặc nút Play
        isDraggingModal = true;
        mStartX = e.clientX;
        mStartY = e.clientY;
        mInitLeft = popup.offsetLeft;
        mInitTop = popup.offsetTop;
        dragHandle.style.cursor = 'grabbing';

        document.addEventListener('mousemove', onModalMouseMove);
        document.addEventListener('mouseup', onModalMouseUp);
    });
}

// CSS
const style = document.createElement('style');
style.textContent = `
    .content-map img {   
    }

    .map-icon {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 32px;
        height: 32px;
        background: #00e5ff;
        border: 2px solid transparent; /* default transparent border, handled by pseudo elements */
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        transition: transform 0.2s, background 0.2s;
    }

    .map-icon i {
        font-size: 13px;
        color: #031b2b;
        z-index: 2;
    }

    /* Normal state dashed arcs */
    .map-icon::before {
        content: '';
        position: absolute;
        top: -6px; left: -6px; right: -6px; bottom: -6px;
        border: 2px solid transparent;
        border-top-color: rgba(0, 229, 255, 0.7);
        border-right-color: rgba(0, 229, 255, 0.7);
        border-radius: 50%;
        transition: all 0.3s ease;
        transform: rotate(-15deg);
    }
    
    .map-icon::after {
        content: '';
        position: absolute;
        top: -6px; left: -6px; right: -6px; bottom: -6px;
        border: 2px solid transparent;
        border-bottom-color: rgba(0, 229, 255, 0.7);
        border-left-color: rgba(0, 229, 255, 0.7);
        border-radius: 50%;
        transition: all 0.3s ease;
        transform: rotate(-15deg);
    }

    /* Alert State */
    .map-icon .alert-dot { display: none; }
    .map-icon.has-alert .alert-dot {
        display: block;
        position: absolute;
        top: -2px;
        right: -2px;
        width: 10px;
        height: 10px;
        background: #faba10;
        border-radius: 50%;
        z-index: 12;
    }
    .map-icon.has-alert .alert-dot::before,
    .map-icon.has-alert .alert-dot::after {
        content: '';
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 1.5px solid #faba10;
        animation: radar-ripple 2s infinite ease-out;
    }
    .map-icon.has-alert .alert-dot::after {
        animation-delay: 1s;
    }
    @keyframes radar-ripple {
        0% { width: 0; height: 0; opacity: 1; }
        100% { width: 35px; height: 35px; opacity: 0; }
    }

    /* Brackets container (hidden by default) */
    .map-icon .brackets { display: none; }

    /* Hover effect */
    .map-icon:hover:not(.active) {
        transform: translate(-50%, -50%) scale(1.1);
        background: #00b3cc;
    }

    /* Active State (Yellow Targeting) */
    .map-icon.active {
        background: #f6b43e !important;
    }
    .map-icon.active i {
        color: #fff !important;
    }
    .map-icon.active::before,
    .map-icon.active::after {
        border-color: #f6b43e; /* Make arcs yellow */
        opacity: 1;
        transform: rotate(0deg); /* align them */
    }
    .map-icon.active .brackets {
        display: block;
        position: absolute;
        top: -14px; left: -14px; right: -14px; bottom: -14px;
        pointer-events: none;
        z-index: 1;
    }
    .map-icon.active .brackets span {
        position: absolute;
        width: 8px; height: 8px;
        border: 1.5px solid #f6b43e;
    }
    .br-tl { top: 0; left: 0; border-right: none !important; border-bottom: none !important; }
    .br-tr { top: 0; right: 0; border-left: none !important; border-bottom: none !important; }
    .br-bl { bottom: 0; left: 0; border-right: none !important; border-top: none !important; }
    .br-br { bottom: 0; right: 0; border-left: none !important; border-top: none !important; }

    .map-icon.warning {
        background: #ffab00;
        box-shadow: 0 0 12px rgba(255, 171, 0, 0.6);
    }
    .map-icon.warning i { color: #fff; }

    /* Custom Camera Modal */
    .custom-cam-modal {
        position: absolute;
        width: 320px;
        background: #111a2e; /* dark navy */
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        color: #fff;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .custom-cam-modal .modal-header {
        padding: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .custom-cam-modal .play-btn {
        width: 40px; height: 40px;
        background: #f64e0f; /* orange */
        border: none;
        border-radius: 50%;
        color: #fff;
        display: flex; align-items: center; justify-content: center;
        margin-right: 12px;
        cursor: pointer;
        padding-left: 3px;
    }
    .custom-cam-modal .title-group { flex-grow: 1; }
    .custom-cam-modal .title-group h4 { margin: 0; font-size: 15px; font-weight: 500; font-family: sans-serif; }
    .custom-cam-modal .title-group p { margin: 0; font-size: 13px; color: rgba(255,255,255,0.5); }
    .custom-cam-modal .close-btn { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; padding: 5px; }

    .custom-cam-modal .modal-date {
        padding: 12px 15px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        display: flex; align-items: center; color: rgba(255,255,255,0.6); font-size: 14px;
        cursor: pointer;
    }
    .custom-cam-modal .modal-date i:first-child { margin-right: 10px; font-size: 16px; }

    .custom-cam-modal .modal-body { padding: 15px; }
    .custom-cam-modal .modal-body-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .custom-cam-modal .modal-body-header h5 { margin: 0; font-size: 14px; font-weight: normal; }
    .custom-cam-modal .alert-badge { background: #f64e0f; color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 12px; font-weight: bold; }

    .custom-cam-modal .snapshot-card { flex: 1; position: relative; border-radius: 4px; overflow: hidden; background: #000; }
    .custom-cam-modal .snapshot-card img { width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0.9; }
    
    .custom-cam-modal .snapshot-card .timestamp {
        position: absolute; bottom: 0; left: 0; right: 0;
        padding: 4px 6px; font-size: 11px; color: #fff;
        display: flex; justify-content: space-between; align-items: center;
    }
    .custom-cam-modal .bg-orange { background: #faba10; }
    .custom-cam-modal .bg-blue { background: #3b82f6; }

    .custom-cam-modal .modal-footer {
        padding: 0 15px 15px 15px;
        display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;
    }
    .custom-cam-modal .modal-footer .label { color: rgba(255,255,255,0.5); font-size: 13px; }
    .custom-cam-modal .modal-footer .value { text-align: right; font-size: 13px; font-family: sans-serif; line-height: 1.4; color: #fff;}

    /* Skeleton Loading CSS */
    .skeleton-bg {
        background: #14223d; /* Dark navy */
        position: relative;
        overflow: hidden;
    }
    .skeleton-bar {
        height: 12px;
        background: #14223d;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
    }
    .skeleton-bg::after, .skeleton-bar::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%);
        animation: waveShimmer 1.5s infinite ease-in-out;
    }
    @keyframes waveShimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);


// 7. SKELETON LOADING
document.addEventListener('DOMContentLoaded', () => {
    const skl = document.getElementById('skeleton-alert-list');
    const real = document.getElementById('real-alert-list');
    if (skl && real) {
        setTimeout(() => {
            real.style.display = 'block';
            real.classList.add('fade-in-item');
        }, 1000);
    }
});


// ==============================================================================
// 7. HIỆU ỨNG LOADING GIẢ TRANG SỨC (SKELETON SPINNER) - KHỐI CẢNH BÁO
// ==============================================================================
// Nhiệm vụ: Khi mới tải trang, HTML sẽ render một khối "chiếm chỗ" tàng hình mờ ảo (Skeleton).
// Logic: Sau đúng 2.5 giây, tự động bắt sự kiện mờ dần khối Skeleton đi, 
// và Fade-In mượt mà khối nội dung cảnh báo thật thế chỗ vào.


// Khởi chạy
initMapIcons();






// Coordinate tracker removed
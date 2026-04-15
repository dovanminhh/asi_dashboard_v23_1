// ==============================================================================
// PARKING SECURITY DASHBOARD - LOGIC
// ==============================================================================


// 1. BIỂU ĐỒ ĐIỂM SỐ AN TOÀN (GAUGE CHART)
(function () {
    const canvas = document.getElementById('gc');
    if (!canvas) return;

    canvas.width = 230;
    canvas.height = 125;

    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H - 18;
    const R = 82, trackW = 16;
    const START_ANG = Math.PI, END_ANG = 2 * Math.PI;
    const BG = '#1b396b';
    const TARGET = 8;

    const statuses = [
        { max: 2, label: 'Nguy hiểm', color: '#ff4400' },
        { max: 4, label: 'Cảnh báo', color: '#ff9900' },
        { max: 6, label: 'An toàn', color: '#7fff00' },
        { max: 8, label: 'An toàn, Tốt', color: '#44dd88' },
        { max: 10, label: 'An toàn, Xuất sắc', color: '#00ffcc' }
    ];

    function valToAng(v) {
        return START_ANG + (v / 10) * (END_ANG - START_ANG);
    }

    function colorAtVal(v) {
        const stops = [
            [0, [255, 51, 0]],
            [3, [255, 136, 0]],
            [6, [170, 238, 0]],
            [8.5, [51, 204, 85]],
            [10, [26, 58, 42]]
        ];
        for (let i = 0; i < stops.length - 1; i++) {
            const [v0, c0] = stops[i], [v1, c1] = stops[i + 1];
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

    function draw(val) {
        ctx.clearRect(0, 0, W, H);

        // Track nền
        ctx.beginPath();
        ctx.arc(cx, cy, R, START_ANG, END_ANG);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = trackW;
        ctx.stroke();

        // Track màu
        if (val > 0) {
            const segCount = 120, totalAng = END_ANG - START_ANG;
            const valFrac = val / 10, fillEnd = valToAng(val);
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
                ctx.stroke();
            }
        }

        // Kim chỉ
        const ang = valToAng(val);
        const needleLen = R - 14;
        const tipX = cx + needleLen * Math.cos(ang), tipY = cy + needleLen * Math.sin(ang);
        const tailLen = 16;
        const tailX = cx - tailLen * Math.cos(ang), tailY = cy - tailLen * Math.sin(ang);
        const px = Math.cos(ang + Math.PI / 2), py = Math.sin(ang + Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(cx + px * 7, cy + py * 7);
        ctx.lineTo(tailX + px * 2.5, tailY + py * 2.5);
        ctx.lineTo(tailX - px * 2.5, tailY - py * 2.5);
        ctx.lineTo(cx - px * 7, cy - py * 7);
        ctx.closePath();
        ctx.fillStyle = '#00e5ff';
        ctx.fill();

        // Tâm kim
        ctx.beginPath(); ctx.arc(cx, cy, 9, 0, 2 * Math.PI); ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, 2 * Math.PI); ctx.fillStyle = BG; ctx.fill();

        // Nhãn 0 / 10
        ctx.fillStyle = 'rgba(170,196,240,0.8)';
        ctx.font = '11px Arial';
        ctx.textAlign = 'right'; ctx.fillText('0', cx - R + 2, cy + 14);
        ctx.textAlign = 'left'; ctx.fillText('10', cx + R - 2, cy + 14);

        // Cập nhật DOM
        const gval = document.getElementById('gval');
        if (gval) gval.textContent = val.toFixed(1);

        const st = statuses.find(s => val <= s.max) || statuses[4];
        const el = document.getElementById('gstat');
        if (el) { el.textContent = st.label; el.style.color = st.color; }
    }

    // Animation khởi động
    let startTime = null, bootDuration = 900, settleDuration = 600;
    let bootDone = false, settleStart = null;

    function animate(ts) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        if (!bootDone) {
            const t = Math.min(elapsed / bootDuration, 1);
            draw((t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t) * 10);
            if (t >= 1) { bootDone = true; settleStart = ts; }
        } else {
            const t2 = Math.min((ts - settleStart) / settleDuration, 1);
            const ez = t2 < 0.5 ? 2 * t2 * t2 : -1 + (4 - 2 * t2) * t2;
            draw(10 + (TARGET - 10) * ez);
            if (t2 >= 1) { draw(TARGET); return; }
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();


// 2. DONUT CHARTS
function renderAllCharts() {
    document.querySelectorAll('.chart-group').forEach(group => {
        const current = parseFloat(group.querySelector('.val-current').innerText);
        const total = parseFloat(group.querySelector('.val-total').innerText);
        const percentage = Math.round((current / total) * 100);

        const canvas = group.querySelector('.gridItemDonutChart');
        const percentLabel = group.querySelector('.percent-label');
        const color = canvas.getAttribute('data-color') || '#00C896';

        if (percentLabel) percentLabel.innerText = percentage + '%';
        if (Chart.getChart(canvas)) Chart.getChart(canvas).destroy();

        new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [current, total - current],
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
                    ctx.fillStyle = '#1a3a6c';
                    ctx.fill();
                    ctx.restore();
                }
            }]
        });
    });
}
document.addEventListener('DOMContentLoaded', renderAllCharts);


// 3. TRAFFIC BAR CHART - Chỉ hiển thị Khu A theo giờ
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('trafficBarChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const currentHour = new Date().getHours();
    const COLOR_A = '#00FFFF';
    const COLOR_RA = '#FF9F43';
    const COLOR_FUTURE = '#333333';

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        vao: i > currentHour ? 0 : Math.floor(Math.random() * 200) + 50,
        ra: i > currentHour ? 0 : Math.floor(Math.random() * 150) + 20
    }));

    const labels = Array.from({ length: 24 }, (_, i) => (i < 10 ? '0' + i : i) + 'h');
    const dataVao = hourlyData.map(d => d.vao);
    const dataRa = hourlyData.map(d => d.ra);
    const bgVao = hourlyData.map((_, i) => i > currentHour ? COLOR_FUTURE : COLOR_A);
    const bgRa = hourlyData.map((_, i) => i > currentHour ? COLOR_FUTURE : COLOR_RA);

    // Cập nhật tổng
    const tVao = document.getElementById('total-vao');
    const tRa = document.getElementById('total-ra');
    if (tVao) tVao.innerText = hourlyData.reduce((s, d) => s + d.vao, 0).toLocaleString();
    if (tRa) tRa.innerText = hourlyData.reduce((s, d) => s + d.ra, 0).toLocaleString();

    // Mở rộng wrapper để cuộn ngang
    const innerWrapper = document.getElementById('trafficChartInner');
    if (innerWrapper) innerWrapper.style.width = '1400px';

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Vào', data: dataVao, backgroundColor: bgVao, minBarLength: 3 },
                { label: 'Ra', data: dataRa, backgroundColor: bgRa, minBarLength: 3 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#888' },
                    categoryPercentage: 0.7,
                    barPercentage: 0.9
                },
                y: { display: false, beginAtZero: true, grace: '10%' }
            }
        }
    });

    // Cuộn đến giờ hiện tại
    const scrollWrapper = document.querySelector('.chart-scroll-wrapper');
    if (scrollWrapper) {
        setTimeout(() => {
            const hourWidth = 1400 / 24;
            scrollWrapper.scrollLeft = (currentHour * hourWidth) - (scrollWrapper.clientWidth / 2);
        }, 50);
    }
});


// 4. BUBBLE CHART (DOM Based)
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('warningBubbleChart');
    if (!canvas) return;

    const values = [96, 20, 3];
    const total = values.reduce((a, b) => a + b, 0);
    const colors = ['#3A9CFF', '#FF4D00', '#FFB300'];
    const labels = ['Sai vị trí', 'Xâm nhập', 'Vượt rào'];

    const parent = canvas.parentElement;
    parent.style.position = 'relative';
    parent.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = 'width:100%;height:100%;position:absolute;left:0;top:0;';
    parent.appendChild(container);

    const bubbles = values.map((val, i) => {
        const b = document.createElement('div');
        b.style.cssText = `
            position:absolute; border-radius:50%;
            background-color:${colors[i]}CC; border:2px solid ${colors[i]};
            display:flex; align-items:center; justify-content:center;
            color:#fff; font-weight:bold; transition:all 0.4s; cursor:pointer;
        `;
        b.innerText = val;
        container.appendChild(b);
        return b;
    });

    function renderDOMBubbles() {
        const w = container.clientWidth, h = container.clientHeight;
        if (w === 0 || h === 0) return;

        const rawRadii = values.map(v => Math.max(Math.sqrt(v), Math.sqrt(total) * 0.25));
        const order = rawRadii.map((r, i) => ({ r, i })).sort((a, b) => b.r - a.r);
        const gap = order[0].r * 0.15;
        const c0 = order[0], c1 = order[1], c2 = order[2];

        c0.x = 0; c0.y = 0;
        c1.x = c0.r + c1.r + gap; c1.y = 0;

        const d02 = c0.r + c2.r + gap, d12 = c1.r + c2.r + gap;
        const x2 = (d02 * d02 - d12 * d12 + c1.x * c1.x) / (2 * c1.x);
        const y2 = Math.sqrt(Math.abs(d02 * d02 - x2 * x2));
        c2.x = x2; c2.y = y2;

        const placed = [];
        placed[c0.i] = c0; placed[c1.i] = c1; placed[c2.i] = c2;

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        placed.forEach(p => {
            minX = Math.min(minX, p.x - p.r); maxX = Math.max(maxX, p.x + p.r);
            minY = Math.min(minY, p.y - p.r); maxY = Math.max(maxY, p.y + p.r);
        });

        const packW = maxX - minX, packH = maxY - minY;
        const pad = Math.min(w, h) * 0.15;
        const scale = Math.min((w - pad * 2) / packW, (h - pad * 2) / packH);
        const offX = w / 2 - (minX + packW / 2) * scale;
        const offY = h / 2 - (minY + packH / 2) * scale;

        placed.forEach((p, i) => {
            const finalR = p.r * scale, diameter = finalR * 2;
            bubbles[i].style.left = (p.x * scale + offX - finalR) + 'px';
            bubbles[i].style.top = (p.y * scale + offY - finalR) + 'px';
            bubbles[i].style.width = diameter + 'px';
            bubbles[i].style.height = diameter + 'px';
            bubbles[i].style.fontSize = Math.max(12, finalR * 0.45) + 'px';
        });
    }

    new ResizeObserver(() => requestAnimationFrame(renderDOMBubbles)).observe(container);
    renderDOMBubbles();

    const cardEl = document.querySelector('[data-id="5"] .card-header p');
    if (cardEl) cardEl.innerText = total;
});


// 5. MAP PARKING ICONS
const mapCameras = [
    { id: 'Cam-07', left: 15, top: 45, location: 'Khu vực J', status: 'Hoạt động' },
    { id: 'Cam-06', left: 35, top: 20, location: 'Khu vực F', status: 'Cảnh báo' },
    { id: 'Cam-04', left: 55, top: 30, location: 'Khu vực D', status: 'Hoạt động' },
    { id: 'Cam-01', left: 75, top: 50, location: 'Khu vực A', status: 'Hoạt động' },
    { id: 'Cam-09', left: 25, top: 70, location: 'Khu vực I', status: 'Hoạt động' },
    { id: 'Cam-02', left: 45, top: 80, location: 'Khu vực B', status: 'Hoạt động' },
    { id: 'Cam-03', left: 65, top: 65, location: 'Khu vực C', status: 'Hoạt động' }
];

function initMapIcons() {
    const vc = document.querySelector('.vignette-container');
    const img = vc ? vc.querySelector('img') : null;
    if (!vc || !img) return;

    if (window.getComputedStyle(vc).position === 'static') vc.style.position = 'relative';
    vc.querySelectorAll('.map-icon').forEach(el => el.remove());

    const iconElements = mapCameras.map(cam => {
        const icon = document.createElement('div');
        icon.className = 'map-icon camera-icon' + (cam.status === 'Cảnh báo' ? ' warning has-alert' : '');
        icon.dataset.baseLeft = cam.left;
        icon.dataset.baseTop = cam.top;
        icon.dataset.camId = cam.id;
        icon.innerHTML = `
            <img class="custom-cam-icon" src="img/camera-icon-custom.svg" alt="Camera">
            <div class="alert-dot"></div>
            <div class="brackets">
                <span class="br-tl"></span><span class="br-tr"></span>
                <span class="br-bl"></span><span class="br-br"></span>
            </div>
        `;
        icon.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            document.querySelectorAll('.map-icon').forEach(el => el.classList.remove('active'));
            icon.classList.add('active');
            showCameraPopup(cam, icon);
        });
        vc.appendChild(icon);
        return icon;
    });

    function placeIcons() {
        if (!iconElements.length || !img.naturalWidth) return;
        const cw = vc.clientWidth, ch = vc.clientHeight;
        const ir = img.naturalWidth / img.naturalHeight, cr = cw / ch;
        let rw, rh, ox = 0, oy = 0;
        if (cr > ir) { rh = ch; rw = ch * ir; ox = (cw - rw) / 2; }
        else { rw = cw; rh = cw / ir; oy = (ch - rh) / 2; }
        iconElements.forEach(icon => {
            const l = parseFloat(icon.dataset.baseLeft) / 100;
            const t = parseFloat(icon.dataset.baseTop) / 100;
            icon.style.left = `${ox + l * rw}px`;
            icon.style.top = `${oy + t * rh}px`;
        });
    }

    if (img.complete) placeIcons(); else img.addEventListener('load', placeIcons);
    new ResizeObserver(placeIcons).observe(vc);

    // Zoom & Pan
    let zoom = 1, px = 0, py = 0;
    let isPan = false, startX = 0, startY = 0, startPx = 0, startPy = 0;
    let vx = 0, vy = 0, prevX = 0, prevY = 0, rafId = null;

    function applyT() {
        vc.style.transition = 'none';
        vc.style.transformOrigin = 'center center';
        vc.style.transform = `translate(${px}px, ${py}px) scale(${zoom})`;
    }

    function applySmooth() {
        vc.style.transition = 'transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)';
        vc.style.transformOrigin = 'center center';
        vc.style.transform = `translate(${px}px, ${py}px) scale(${zoom})`;
    }

    // Scroll wheel zoom vào điểm con trỏ
    vc.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = vc.getBoundingClientRect();
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top - rect.height / 2;
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        const newZoom = Math.min(4, Math.max(0.5, zoom * factor));
        const ratio = newZoom / zoom;
        px = mx - (mx - px) * ratio;
        py = my - (my - py) * ratio;
        zoom = newZoom;
        applyT();
    }, { passive: false });

    // Pan
    vc.addEventListener('mousedown', (e) => {
        if (e.target.closest('.map-icon')) return;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        isPan = true; vx = 0; vy = 0;
        startX = e.clientX; startY = e.clientY;
        startPx = px; startPy = py;
        prevX = e.clientX; prevY = e.clientY;
        vc.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isPan) return;
        vx = e.clientX - prevX;
        vy = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
        px = startPx + (e.clientX - startX);
        py = startPy + (e.clientY - startY);
        applyT();
    });

    window.addEventListener('mouseup', () => {
        if (!isPan) return;
        isPan = false;
        vc.style.cursor = 'grab';
        function glide() {
            vx *= 0.88; vy *= 0.88;
            if (Math.abs(vx) < 0.3 && Math.abs(vy) < 0.3) return;
            px += vx; py += vy;
            applyT();
            rafId = requestAnimationFrame(glide);
        }
        rafId = requestAnimationFrame(glide);
    });

    const bC = document.getElementById('back_to_center');
    const bI = document.getElementById('zoom_in');
    const bO = document.getElementById('zoom_out');

    if (bC) bC.onclick = () => { zoom = 1; px = 0; py = 0; applySmooth(); };
    if (bI) bI.onclick = () => { zoom = Math.min(zoom + 0.25, 4); applySmooth(); };
    if (bO) bO.onclick = () => { zoom = Math.max(zoom - 0.25, 0.5); applySmooth(); };

    vc.style.cursor = 'grab';
}


// 6. CAMERA POPUP (MODAL)
function showCameraPopup(cam, iconEl) {
    document.querySelector('.custom-cam-modal')?.remove();

    const popup = document.createElement('div');
    popup.className = 'custom-cam-modal';
    popup.innerHTML = `
        <div class="modal-header">
            <span class="size-32 d-flex align-items-center justify-content-center rounded-circle bg-safety-orange me-2">
                <i class="fa-solid fa-play"></i>
            </span>
            <div class="title-group">
                <h4 class="fs-16px lh-1 fw-normal text-white mb-1">Camera 01 - Đầu vào</h4>
                <p class="small lh-1 fw-normal text-white opacity-50 mb-0">Lô A1</p>
            </div>
            <button class="close-btn"><i class="fa-light fa-xmark"></i></button>
        </div>

        <div class="input-group-choose-date input-group-sm custom-input-group flex items-center justify-between">
            <span class="d-flex align-items-center">
                <i class="text-[16px] me-2 text-white fa-regular fa-calendar"></i>
                <input type="text" class="input-choose-date pl-2 bg-transparent text-white opacity-50 text-[16px] leading-[100%]"
                    placeholder="Chọn ngày" id="dateMarker">
            </span>
            <i class="text-[16px] text-white/50 fa-regular fa-chevron-right cursor-pointer"></i>
        </div>

        <div class="modal-body">
            <div class="modal-body-header">
                <h5 class="fs-14px lh-1 fw-medium text-white">Hôm nay</h5>
                <span class="alert-badge min-width text-center fs-14px lh-1 fw-medium text-white py-1">
                    <i class="me-2 fa-solid fa-bell"></i>05+
                </span>
            </div>
            <div class="custom-scroll-light pe-1" data-overlayscrollbars-initialize style="max-height:260px;overflow-x:hidden;">
                <div class="snapshots row g-3 mx-0">
                    ${[
            { img: 'scene-photo-1.jpg', bg: 'bg-orange' },
            { img: 'scene-photo-2.png', bg: 'bg-blue' },
            { img: 'scene-photo-1.jpg', bg: 'bg-orange' },
            { img: 'scene-photo-1.jpg', bg: 'bg-orange' },
            { img: 'scene-photo-1.jpg', bg: 'bg-orange' },
            { img: 'scene-photo-1.jpg', bg: 'bg-orange' },
            { img: 'scene-photo-1.jpg', bg: 'bg-orange' },
        ].map(s => `
                        <div class="col-4">
                            <div class="snapshot-card min-height rounded-1 overflow-hidden position-relative">
                                <img src="img/${s.img}" alt="Snapshot"
                                    class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
                                <div class="timestamp ${s.bg} p-2 position-absolute bottom-0 start-0 w-100">
                                    <span class="d-flex align-items-center fs-12px lh-1 fw-normal text-white">
                                        <i class="fa-regular fa-clock me-1"></i>15:01
                                    </span>
                                    <i class="fa-light fa-arrow-up-right"></i>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="modal-footer d-flex align-items-start">
            <span class="label fs-14px lh-1 fw-normal text-white opacity-75">Nhiệm vụ</span>
            <span class="text-end">
                <p class="value fs-14px lh-1 fw-normal text-white mb-1">Quần áo bảo hộ</p>
                <p class="value fs-14px lh-1 fw-normal text-white mb-1">Mũ bảo hộ</p>
            </span>
        </div>
    `;

    document.body.appendChild(popup);

    // OverlayScrollbars
    if (typeof OverlayScrollbars !== 'undefined') {
        const scrollEl = popup.querySelector('.custom-scroll-light');
        if (scrollEl) OverlayScrollbars(scrollEl, { scrollbars: { theme: 'os-theme-light' } });
    }

    // Flatpickr
    if (typeof flatpickr !== 'undefined') {
        flatpickr(popup.querySelector('#dateMarker'), {
            altInput: true, altFormat: 'd/m/Y', dateFormat: 'Y-m-d', locale: 'vn',
            onOpen: (s, d, instance) => {
                if (instance.calendarContainer) instance.calendarContainer.style.zIndex = '9999999';
            }
        });
    }

    // Vị trí popup
    const rect = iconEl.getBoundingClientRect();
    const mWidth = 320;
    let leftPos = rect.right + 15, topPos = rect.top - 100;
    if (leftPos + mWidth > window.innerWidth) leftPos = rect.left - mWidth - 15;
    leftPos = Math.max(10, leftPos);
    popup.style.cssText = `position:fixed; z-index:999999; left:${leftPos}px; top:${Math.max(10, topPos)}px;`;

    // Đóng popup
    popup.querySelector('.close-btn').addEventListener('click', () => {
        popup.remove();
        iconEl.classList.remove('active');
    });

    // Kéo thả modal
    const dragHandle = popup.querySelector('.modal-header');
    dragHandle.style.cursor = 'grab';
    let isDragging = false, mStartX, mStartY, mInitLeft, mInitTop;

    const onMove = (e) => {
        if (!isDragging) return;
        let nx = Math.max(0, Math.min(mInitLeft + (e.clientX - mStartX), window.innerWidth - popup.offsetWidth));
        let ny = Math.max(0, Math.min(mInitTop + (e.clientY - mStartY), window.innerHeight - popup.offsetHeight));
        popup.style.left = nx + 'px';
        popup.style.top = ny + 'px';
    };
    const onEnd = () => {
        isDragging = false;
        dragHandle.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
    };
    dragHandle.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        mStartX = e.clientX; mStartY = e.clientY;
        mInitLeft = popup.offsetLeft; mInitTop = popup.offsetTop;
        dragHandle.style.cursor = 'grabbing';
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
    });
}


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


// 8. PARKING DOT GRID
const TOTAL = 60;
const slots = [];

for (let i = 0; i < TOTAL; i++) {
    slots.push(Math.random() < 0.75);
}

function renderParkingGrid() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    grid.innerHTML = '';

    slots.forEach((occ, i) => {
        const d = document.createElement('div');
        d.className = 'dot ' + (occ ? 'occupied' : 'free');
        d.title = `Chỗ ${i + 1}: ${occ ? 'Đã có xe' : 'Còn trống'}`;
        d.onclick = () => { slots[i] = !slots[i]; renderParkingGrid(); };
        grid.appendChild(d);
    });

    const free = slots.filter(x => !x).length;
    const ratio = free / TOTAL;
    const sv = document.getElementById('s-status');
    if (!sv) return;

    if (ratio <= 0.05) { sv.textContent = 'Đầy'; sv.style.color = '#ef4444'; }
    else if (ratio <= 0.3) { sv.textContent = 'Gần đầy'; sv.style.color = '#f97316'; }
    else { sv.textContent = 'Còn chỗ'; sv.style.color = '#22c55e'; }
}

document.addEventListener('DOMContentLoaded', renderParkingGrid);


// KHỞI TẠO MAP
initMapIcons();
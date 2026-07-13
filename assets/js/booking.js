/* =============================================
   BOOKING.JS — Logic trang Đặt Phòng
   - Tính thời gian lưu trú & thành tiền tự động
   - Cập nhật sidebar summary
   - Popup xác nhận thành công
============================================= */
(function () {
    'use strict';

    // ---- Bảng giá tham khảo theo hạng phòng (VNĐ) ----
    var PRICE_TABLE = {
        standard: { hour: 60000, day: 400000, month: 6000000 },
        family:   { hour: 80000, day: 600000, month: 9000000 },
        vip:      { hour: 120000, day: 800000, month: 12000000 }
    };

    // ---- DOM refs ----
    var roomTypeEl    = document.getElementById('room-type');
    var roomNumberEl  = document.getElementById('room-number');
    var checkinEl     = document.getElementById('checkin-time');
    var checkoutEl    = document.getElementById('checkout-time');
    var stayDurationEl = document.getElementById('stay-duration');
    var totalPriceEl  = document.getElementById('total-price');
    var paidPriceEl   = document.getElementById('paid-price');

    // Summary
    var sumTypeEl     = document.getElementById('summary-type');
    var sumRoomEl     = document.getElementById('summary-room');
    var sumStayEl     = document.getElementById('summary-stay');
    var sumCheckinEl  = document.getElementById('summary-checkin');
    var sumCheckoutEl = document.getElementById('summary-checkout');
    var sumDurEl      = document.getElementById('summary-duration');
    var sumTotalEl    = document.getElementById('summary-total');

    // Radios
    var radioInputs   = document.querySelectorAll('.bk-radio-input');
    var radioLabels   = document.querySelectorAll('.bk-radio-item');

    // Counters
    var counterBtns   = document.querySelectorAll('.bk-counter-btn');

    // Form & popup
    var form          = document.getElementById('bookingMainForm');
    var submitBtn     = document.getElementById('submitBooking');
    var confirmBtn    = document.getElementById('confirmBooking');
    var popup         = document.getElementById('bookingPopup');
    var closePopup    = document.getElementById('closePopup');
    var popupInfo     = document.getElementById('popupInfo');

    var currentStayType = 'hour';

    // ---- Helpers ----
    function formatMoney(n) {
        return n.toLocaleString('vi-VN') + ' đ';
    }
    function formatDateTime(dtVal) {
        if (!dtVal) return '—';
        var d = new Date(dtVal);
        return d.toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
    function calcDuration(inVal, outVal) {
        if (!inVal || !outVal) return null;
        var i = new Date(inVal), o = new Date(outVal);
        var diffMs = o - i;
        if (diffMs <= 0) return null;
        var diffH = diffMs / (1000 * 60 * 60);
        return diffH;
    }
    function formatDuration(hours, stayType) {
        if (stayType === 'month') {
            var months = Math.ceil(hours / (24 * 30));
            return months + ' tháng';
        }
        if (stayType === 'day') {
            var days = Math.ceil(hours / 24);
            return days + ' ngày';
        }
        return Math.ceil(hours) + ' giờ';
    }
    function calcPrice(hours, stayType, roomType) {
        var prices = PRICE_TABLE[roomType] || PRICE_TABLE.standard;
        if (stayType === 'month') return Math.ceil(hours / (24 * 30)) * prices.month;
        if (stayType === 'day')   return Math.ceil(hours / 24) * prices.day;
        return Math.ceil(hours) * prices.hour;
    }

    // ---- Main update function ----
    function updateCalculation() {
        var roomType = roomTypeEl ? roomTypeEl.value : 'standard';
        var roomNum  = roomNumberEl ? roomNumberEl.value : '—';
        var inVal    = checkinEl ? checkinEl.value : '';
        var outVal   = checkoutEl ? checkoutEl.value : '';

        var hours = calcDuration(inVal, outVal);
        var durText = '—';
        var priceVal = 0;

        if (hours !== null && roomType) {
            durText  = formatDuration(hours, currentStayType);
            priceVal = calcPrice(hours, currentStayType, roomType);
        }

        // Update estimate row
        if (stayDurationEl)  stayDurationEl.textContent  = durText;
        if (totalPriceEl)    totalPriceEl.textContent     = priceVal ? formatMoney(priceVal) : '— đ';
        if (paidPriceEl)     paidPriceEl.textContent      = priceVal ? formatMoney(priceVal) : '0 đ';

        // Update sidebar summary
        var stayLabels = { hour: 'Theo giờ', day: 'Theo ngày', month: 'Theo tháng' };
        var typeLabels = { standard: 'Standard', family: 'Family', vip: 'VIP' };
        if (sumTypeEl)     sumTypeEl.textContent     = typeLabels[roomType] || 'Standard';
        if (sumRoomEl)     sumRoomEl.textContent      = roomNum || '—';
        if (sumStayEl)     sumStayEl.textContent      = stayLabels[currentStayType];
        if (sumCheckinEl)  sumCheckinEl.textContent   = formatDateTime(inVal);
        if (sumCheckoutEl) sumCheckoutEl.textContent  = formatDateTime(outVal);
        if (sumDurEl)      sumDurEl.textContent       = durText;
        if (sumTotalEl)    sumTotalEl.textContent      = priceVal ? formatMoney(priceVal) : '— đ';
    }

    // ---- Radio stay type ----
    radioInputs.forEach(function (radio) {
        radio.addEventListener('change', function () {
            currentStayType = this.value;
            // Toggle active class on label
            radioLabels.forEach(function (lbl) { lbl.classList.remove('is-active'); });
            var parentLabel = radio.closest('.bk-radio-item');
            if (parentLabel) parentLabel.classList.add('is-active');
            updateCalculation();
        });
    });

    // ---- Input listeners ----
    if (roomTypeEl)  roomTypeEl.addEventListener('change', updateCalculation);
    if (roomNumberEl) roomNumberEl.addEventListener('change', updateCalculation);
    if (checkinEl)   checkinEl.addEventListener('change', updateCalculation);
    if (checkoutEl)  checkoutEl.addEventListener('change', updateCalculation);

    // Set default checkin to now, checkout to tomorrow
    if (checkinEl && !checkinEl.value) {
        var now = new Date();
        now.setHours(14, 0, 0, 0);
        checkinEl.value = now.toISOString().slice(0, 16);
    }
    if (checkoutEl && !checkoutEl.value) {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        checkoutEl.value = tomorrow.toISOString().slice(0, 16);
    }
    updateCalculation();

    // ---- Counters ----
    counterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var target = this.getAttribute('data-target');
            var delta  = parseInt(this.getAttribute('data-delta'));
            var valEl  = document.getElementById(target + '-count');
            if (!valEl) return;
            var min = target === 'adults' ? 1 : 0;
            var val = parseInt(valEl.textContent) + delta;
            if (val < min) val = min;
            valEl.textContent = val;
        });
    });

    // ---- Form submit → show popup ----
    function showPopup() {
        var name     = document.getElementById('guest-name');
        var phone    = document.getElementById('guest-phone');
        var roomType = roomTypeEl ? roomTypeEl.options[roomTypeEl.selectedIndex] : null;
        var roomNum  = roomNumberEl ? roomNumberEl.value : '—';
        var typeLabels = { standard: 'Standard', family: 'Family', vip: 'VIP' };

        if (popupInfo) {
            popupInfo.innerHTML =
                '<strong>Hạng phòng:</strong> ' + (typeLabels[roomTypeEl ? roomTypeEl.value : ''] || '—') + '<br>' +
                '<strong>Số phòng:</strong> ' + (roomNum || '—') + '<br>' +
                '<strong>Nhận phòng:</strong> ' + formatDateTime(checkinEl ? checkinEl.value : '') + '<br>' +
                '<strong>Trả phòng:</strong> '  + formatDateTime(checkoutEl ? checkoutEl.value : '') + '<br>' +
                '<strong>Khách:</strong> ' + (name ? name.value || '—' : '—') + '<br>' +
                '<strong>SĐT:</strong> '   + (phone ? phone.value || '—' : '—') + '<br>' +
                '<strong>Thành tiền:</strong> ' + (sumTotalEl ? sumTotalEl.textContent : '—');
        }
        if (popup) popup.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', function (e) {
            e.preventDefault();
            var required = form ? form.querySelectorAll('[required]') : [];
            var valid = true;
            required.forEach(function (el) {
                if (!el.value.trim()) { valid = false; el.style.borderColor = '#ef4444'; }
                else el.style.borderColor = '';
            });
            if (!valid) {
                var first = form.querySelector('[required]:invalid, [required][style*="ef4444"]');
                if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            showPopup();
        });
    }
    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            showPopup();
        });
    }

    // ---- Close popup ----
    if (closePopup) {
        closePopup.addEventListener('click', function () {
            popup.classList.remove('is-open');
            document.body.style.overflow = '';
        });
    }
    if (popup) {
        popup.addEventListener('click', function (e) {
            if (e.target === popup) {
                popup.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });
    }

})();

/***********************************************************************************************
 * Program Name : 대시보드 메인 - (DASH100M.js)
 * Creator      : 강동우
 * Create Date  : 2022.05.17
 * Description  : 대시보드 메인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.17     강동우           최초생성
 * 2023.02.22     이민호           불필요한 소스 삭제
 ************************************************************************************************/
var DASH100M_weatherSource = {};
// 슬로건 조회
function DASH100M_fnLoadDashSlogan(target, data, count = 0) {
    const DASH_slogan = data[count];
    let dispShpCd;
    let html = "";

    dispShpCd = DASH_slogan.dispShpCd;
    html = `<span class='marquee_items'>${DASH_slogan.dispCtt}</span>`;

    const $target = $('#' + target);
    const $slogan = $target.find("#slogan");

    // 이전 슬로건 애니메이션 중지
    $slogan.stop(true, true);

    $slogan.html(html); // 이전 슬로건을 초기화하고 새로운 슬로건 추가

    if (data.length > 1) {
        count++;
        if (count === data.length) count = 0;
    }

    // JavaScript를 사용하여 서서히 깜빡이는 효과 적용
    if (dispShpCd === "3") {
        const marqueeItem = $slogan.find(".marquee_items");

        function fadeBlink() {
            marqueeItem.fadeOut(1000, function() { // 1초 동안 서서히 사라짐
                marqueeItem.fadeIn(1000, function() { // 1초 동안 서서히 나타남
                    fadeBlink(); // 다시 호출하여 무한 반복
                });
            });
        }
        fadeBlink();
    }

    let setMarquee = function() {
        $slogan.off("finished"); // 이전에 등록된 'finished' 이벤트 핸들러 제거

        // 마퀴 애니메이션 설정
        $slogan.marquee({
            speed: dispShpCd !== "2" ? 100 : 1000,
            direction: dispShpCd !== "2" ? "left" : "down",
            pauseOnHover: true,
        }).on("finished", function() {
            DASH100M_fnLoadDashSlogan(target, data, count);
        });
    };
    setMarquee();
}


// 오늘의 명언 조회
function DASH100M_fnLoadslidePhrase(target, data) {
    const $target = $('#' + target);
    const DASH_phrase = data.filter(x=>Utils.isNotNull(x.dashBrdTypCd));
    if (DASH_phrase.length === 0 || Utils.isNull(DASH_phrase)) {
        // return $target.append("<p class='noneData'><mark class='k-icon k-i-image'></mark>데이터가 없습니다.</p>");
        return $target.append("<p class='nodataMsg'></p>");
    }
    let tempHtml = `<ul class='slideGallery' id='slide'>`;
    for (const obj of DASH_phrase) {
        tempHtml += `<li class='slidePanel'>`;
        if (obj.fileNmIdx)
            tempHtml += `<img src='/bcs/dashphoto/${obj.tenantId}/${obj.fileNmIdx}' alt='' style='width: 100%; background-size: 100%; object-fit: cover; border-radius: 20px;'/>`;
        else {
            tempHtml += `<div style='background-color: ${obj.bgColrCd}; border-radius: 20px;'>${Utils.htmlDecode(obj.dispCtt)}</div>`
        }
        tempHtml += `</li>`;
    }
    tempHtml += `</ul>`;
    $target.append(tempHtml);
    if (data.length > 1) {
    $target.find(".slideGallery").bxSlider({
        speed: 500,
        pause: 4000,
        mode: 'fade',   //  horizontal, vertical
        infiniteLoop: true,
        adaptiveHeight: true,
        auto: true,
        autoControls: false,
        controls: false,
        slideMargin: 1,
        pager: true,
        // stopAutoOnClick: true,
    });
    }
}

// 테마이미지 조회
function DASH100M_fnLoadThemeImg(target, data) {
    const $target = $('#' + target);
    const DASH_theme = data
    if (DASH_theme.length === 0 || Utils.isNull(DASH_theme)) {
        return $target.append("<p class='nodataMsg'></p>");
        // return $target.append("<p class='noneData'><mark class='k-icon k-i-image'></mark>데이터가 없습니다.</p>");
    }
    let tempHtml = `<ul class='slideGallery' id='slide'>`;
    for (const obj of DASH_theme) {
        tempHtml += `<li class='slidePanel'>`;
        tempHtml += `<img src='/bcs/dashimg/${obj.tenantId}/${obj.fileNmIdx}' alt='' style='width: 100%; background-size: 100%; object-fit: cover; border-radius: 20px;'/>`;
        tempHtml += `</li>`;
    }
    tempHtml += `</ul>`;
    $target.append(tempHtml);
    if (data.length > 1) {
        $target.find(".slideGallery").bxSlider({
            speed: 500,
            pause: 4000,
            mode: 'fade',   //  horizontal, vertical
            infiniteLoop: true,
            adaptiveHeight: true,
            auto: true,
            autoControls: false,
            controls: false,
            slideMargin: 1,
            pager: true,
            // stopAutoOnClick: true,
        });
    }

}

// 오늘의 날씨  최고 죄저 온도 조회
function DASH100M_fnLoadDashWeather(target, data=[]) {
    const $target = $('#' + target);
    $target.empty();
    navigator.geolocation.getCurrentPosition(
        function (position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude

            let xy = dfs_xy_conv("toXY", latitude, longitude);
            DASH100M_weatherSource.strX = xy.x + String.fromCharCode(10);
            DASH100M_weatherSource.strY = xy.y + String.fromCharCode(10);
            DASH100M_weatherSource.strX.trim();
            DASH100M_weatherSource.strY.trim();
            $.ajax({
                url: "/bcs/dash/dashGetWeather",
                type: 'POST',
                data: JSON.stringify({
                    strX: DASH100M_weatherSource.strX,
                    strY: DASH100M_weatherSource.strY,
                    getTmp: "Y",
                }),
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                success: function (data, status, xhr) {
                    if ($.isEmptyObject(data) || Utils.isNull(data)) {
                        return DASH100M_fnLoadDashWeather(target);
                    }
                    let dataArr = data.response.body.items.item;
                    const today = kendo.toString(new Date(), 'yyyyMMdd');
                    let SKY = dataArr.find(x => x.fcstDate === today && x.category === 'SKY');
                    let T1H = dataArr.find(x => x.fcstDate === today && x.category === 'T1H');
                    if (Utils.isNull(SKY) || Utils.isNull(T1H)) {
                        return DASH100M_fnLoadDashWeather(target);
                    }
                    DASH100M_weatherSource.highTemperature = SKY.fcstValue;
                    DASH100M_weatherSource.minTemperature = T1H.fcstValue;
                    DASH100M_getWeatherEveryHour(target);
                },
                error: function (e, status, xhr, data) {
                    console.error(e);
                }
            });
        }
    );
// LCC DFS 좌표변환을 위한 기초 자료
    const RE = 6371.00877; // 지구 반경(km)
    const GRID = 5.0; // 격자 간격(km)
    const SLAT1 = 30.0; // 투영 위도1(degree)
    const SLAT2 = 60.0; // 투영 위도2(degree)
    const OLON = 126.0; // 기준점 경도(degree)
    const OLAT = 38.0; // 기준점 위도(degree)
    const XO = 43; // 기준점 X좌표(GRID)
    const YO = 136; // 기1준점 Y좌표(GRID)

    //LCC DFS 좌표변환 ( code :
    //      "toXY"(위경도->좌표, v1:위도, v2:경도)
    //

    const dfs_xy_conv = (code, v1, v2) => {
        let DEGRAD = Math.PI / 180.0;
        let RADDEG = 180.0 / Math.PI;

        let re = RE / GRID;
        let slat1 = SLAT1 * DEGRAD;
        let slat2 = SLAT2 * DEGRAD;
        let olon = OLON * DEGRAD;
        let olat = OLAT * DEGRAD;

        let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
        let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
        let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
        ro = re * sf / Math.pow(ro, sn);
        let rs = {};
        if (code == "toXY") {
            rs['lat'] = v1;
            rs['lng'] = v2;
            let ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
            ra = re * sf / Math.pow(ra, sn);
            let theta = v2 * DEGRAD - olon;
            if (theta > Math.PI) theta -= 2.0 * Math.PI;
            if (theta < -Math.PI) theta += 2.0 * Math.PI;
            theta *= sn;
            rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
            rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
        } else {
            rs['x'] = v1;
            rs['y'] = v2;
            let xn = v1 - XO;
            let yn = ro - v2 + YO;
            ra = Math.sqrt(xn * xn + yn * yn);
            if (sn < 0.0) -ra;
            let alat = Math.pow((re * sf / ra), (1.0 / sn));
            alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

            if (Math.abs(xn) <= 0.0) {
                theta = 0.0;
            } else {
                if (Math.abs(yn) <= 0.0) {
                    theta = Math.PI * 0.5;
                    if (xn < 0.0) -theta;
                } else theta = Math.atan2(xn, yn);
            }
            let alon = theta / sn + olon;
            rs['lat'] = alat * RADDEG;
            rs['lng'] = alon * RADDEG;
        }
        return rs;
    }
}

// 1시간 단위 날씨 조회
function DASH100M_getWeatherEveryHour(target) {
    const $target = $('#' + target);
    $target.empty();
    let tempHtml = "";
    let getNoDatagHtml = () => {
        let html;
        html += "<p class='noneData'>";
        html += "<span><mark class='k-icon k-i-warning'></mark>"+ DASH_BOARD.langMap.get("DASH100M.fail.API") +"</span>";
        html += `<button class='bt' onclick='DASH100M_fnLoadDashWeather(${target})'><span class='k-icon k-i-reload'></span>새로고침</button>`;
        html += "</p>";
        return html;
    };
    $.ajax({
        url: "/bcs/dash/dashGetWeather",
        type: 'POST',
        data: JSON.stringify({
            strX: DASH100M_weatherSource.strX,
            strY: DASH100M_weatherSource.strY,
            getTmp: 'N',
        }),
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        success: function (data, status, xhr) {
            if ($.isEmptyObject(data.response) || Utils.isNull(data.response) || Utils.isNull(data.response.body)) {
                tempHtml = getNoDatagHtml();
                $("#dashWeather").append(tempHtml);
                return;
            }
            let weatherArr = data.response.body.items.item;
            let dateInfo = ''.concat(Utils.stringToDateFormat(weatherArr[0].baseDate), 'T', Utils.stringToTimeFormat(weatherArr[0].baseTime));
            const getDayOfWeek = (dateInfo) => {
                const week = ['일', '월', '화', '수', '목', '금', '토'];
                return week[new Date(dateInfo).getDay()];
            }
            let referDate = kendo.toString(new Date(dateInfo), `yyyy-MM-dd(ddd) HH:mm`, GLOBAL.session.user.mlingCd);

            let SKY = weatherArr.find(x => x.category === "SKY").fcstValue;  // 하늘상태
            let PTY = weatherArr.find(x => x.category === "PTY").fcstValue;  // 강수형태
            let T1H = weatherArr.find(x => x.category === "T1H").fcstValue;  // 기온
            let REH = weatherArr.find(x => x.category === "REH").fcstValue;  // 습도
            let minTempStr = DASH100M_weatherSource.minTemperature.substring(0, 2).replace('.', "");
            let highTempStr = DASH100M_weatherSource.highTemperature.substring(0, 2).replace('.', "");

            const weatherCodes = {
                1: {name: DASH_BOARD.langMap.get("DASH100M.weather.sunny"),      class: "WICO_1"},
                2: {name: DASH_BOARD.langMap.get("DASH100M.weather.aLittleCloud"),  class: "WICO_2"},
                3: {name: DASH_BOARD.langMap.get("DASH100M.weather.aLotOfClouds"),   class: "WICO_3"},
                4: {name: DASH_BOARD.langMap.get("DASH100M.weather.blur"),    class: "WICO_4"},
                5: {name: DASH_BOARD.langMap.get("DASH100M.weather.rain"),     class: "WICO_5"},
                6: {name: DASH_BOARD.langMap.get("DASH100M.weather.rainOrSnow"),   class: "WICO_6"},
                // 7: {DASH_BOARD.langMap.get("DASH100M.weather.snowOrRain"),  class: "WICO_7"},
                7: {name: DASH_BOARD.langMap.get("DASH100M.weather.snow"),     class: "WICO_8"},
                8: {name: DASH_BOARD.langMap.get("DASH100M.weather.shower"),   class: "WICO_9"},
                9: {name: DASH_BOARD.langMap.get("DASH100M.weather.raindrop"),   class: "WICO_10"},
                10: {name:DASH_BOARD.langMap.get("DASH100M.weather.Thunder"),   class: "WICO_11"},
                11: {name:DASH_BOARD.langMap.get("DASH100M.weather.Snowstorm"),  class: "WICO_12"},
                12: {name:DASH_BOARD.langMap.get("DASH100M.weather.rainAndSnow"), class: "WICO_13"},
                // 13: {name: "안개", class: "WICO_14"}
                // (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
            };
            tempHtml += "<dl class='weatherCnt'>";
            tempHtml += "<dt class='date'>" + referDate + " 갱신 <button class='k-icon k-i-reload' onclick='DASH100M_fnLoadDashWeather(\"" + target + "\")' title='새로고침'></button></dt>";
            tempHtml += `<dd><div class='summary'><p>최저기온 ${minTempStr}°</p> <p>최고기온 ${highTempStr}°</p>  <p>습도 ${REH}%</p></div>`;
            if (PTY in weatherCodes || PTY !== "0") {
                const weather = weatherCodes[parseInt(PTY) + 4];
                tempHtml += `<div class='weather ${weather.class}'><p class='sub'>${weather.name}</p>`
            } else {
                const weather = weatherCodes[parseInt(SKY)];
                tempHtml += `<div class='weather ${weather.class}'><p class='sub'>${weather.name}</p>`
            }
            tempHtml += `<p class='temper'>${T1H}<small>°</small></p></div></dd></dl>`;

            $target.append(tempHtml);
        },
        error: function (e, status, xhr, data) {
            console.error(e);
            let html = getNoDatagHtml()
            $target.append(html);
        }
    });
}

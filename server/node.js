const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require("fs")
const jsdom = require("jsdom")
const app = express();
const port = 3000;
let file_path = ""
const reader = require('xlsx') 
const dom = new jsdom.JSDOM(`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IN SƠ ĐỒ</title>
    <link rel="shortcut icon" href="../../../server/database/images/favicon.ico?v=2" type="image/x-icon">
    <style>
        * {
            transition-duration: 0.5s;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            margin: 0px;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
        }

        #main-form {
            display: flex;
            font-weight: bold;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: auto;
        }

        .display-id {
            font-size: 1.25vw;
            text-align: center;
            border: 1px solid black;
            padding: 0.25vw 4.25vw;
            font-size: 150%;
            cursor: pointer;
            font-weight: 500;
        }

        .caption {
            font-family: inherit;
            text-align: center;
            font-weight: bold;
            margin: 1vw 0vw 0vw 0vw;
            padding: 0px;
        }

        table {
            border-spacing: 0vw;
            margin: auto;
        }

        th {
            text-transform: uppercase;
        }

        #info {
            height: inherit;
            background-color: #5cce93;
            padding: 1vw;
            display: flex;
            flex-direction: column;
            color: white;
        }

        img {
            display: none;
        }

        .property {
            width: fit-content;
            margin-right: 7vw;
        }
        .signature{
            margin-top: 4vw;
            display: flex;
            justify-content: space-around;
        }
        @media print {
            .container { 
                width: 100%;
                height:100%;
                top:0px;
                bottom:0px;
                margin: auto;
                margin-top: 0px !important;
                page-break-after: always;
            }
        }
    </style>
    <link rel="shortcut icon" href="../../../server/database/images/favicon.ico?v=2" type="image/x-icon">

<body>
    <div id="main-form">
    </div>
</body>

</html>
`)

function appendCode (code, title = "none", start_hour, start_min, end_hour, end_min, subject, time_restrain, day, month, year, school, period, department, grade, obj = "{}", names_obj = "{}", rows, cols, timeline){

    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../../../server/database/images/favicon.ico?v=1" type="image/x-icon">
    <title>${title}</title>
    <style>
    * {
    transition-duration: 0.5s;
}

body {
    font-family: 'Times New Roman', Times, serif;
    display: flex;
    align-items: center;
    padding: 0vw 5vw;
    overflow-x: hidden;
}

#main-form {
    display: flex;
    font-weight: bold;
    justify-content: center;
    margin: auto;
}


.display-id {
    width: 5vw;
    font-size: 1.10vw;
    text-align: center;
    border: 1px solid black;
    padding: 0px;
    cursor: pointer;
}

img {
    height: 5vw;
    width: 4vw;
    font-weight: lighter;
    font-size: 1vw;
}

caption {
    font-family: inherit;
    text-align: center;
    font-weight: bold;
    font-size: 1vw;
}

table {
    font-weight: bold;
    font-size: 2vw;
    border-spacing: 3.5vw 0.10vw;
    margin: auto;
}

th {
    text-transform: uppercase;
}

#time-section {
    width: 25vw;
    display: flex;
    height: 3vw;
    margin: 0.5vw;
    padding: 0px;
}

#start,
#progress-bar,
#end {
    border: 1px solid black;
    height: 100%;
}

#start,
#end {
    width: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0vw 0.5vw;
}

#progress-bar {
    width: 80%;
}

#progress {
    height: 100%;
    width: 0%;
    background-color: rgb(0, 153, 255);
    transition: width 2s linear 1s;
}


#real-time {
    height: 2vw;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px;
    padding: 0px;
}
    </style>

<body>
    <div id="main-form">
        <div style="display: flex;">
            <div>
                <div
                    style="display: flex; flex-direction: column; justify-content: center; align-items: center; line-height: 2vw; margin-bottom: 1vw;">
                    <span>ỦY BAN NHÂN DÂN ${department.toUpperCase()}</span>
                    <span>TRƯỜNG THCS ${school.toUpperCase()}</span>
                </div>
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <span>THI ${period.toUpperCase()}</span>
                    <span>KHỐI: ${grade.toUpperCase()}</span>
                    <span style="margin: 0.75vw;">MÔN: ${subject.toUpperCase()}</span>
                    <span style="text-align: center;">NGÀY ${day} THÁNG ${month} NĂM ${year} <br> THỜI GIAN: ${time_restrain} PHÚT</span>
                </div>
                <div>
                    <h1 id="time-runout" style="text-align: center; color: crimson; display: none;">! HẾT GIỜ LÀM BÀI!
                    </h1>
                </div>
                <div>
                    <div id="real-time">
                    </div>
                    <div>
                        <div id="time-section" class="time">
                            <div id="start" class="time"></div>
                            <div id="progress-bar" class="time">
                                <div id="progress"></div>
                            </div>
                            <div id="end" class="time"></div>
                        </div>
                        <span>Thí sinh vắng thi: </span><br>
                        <span style="margin-right: 1vw;">SBD</span>
                        <span>Họ và tên</span>
                        <div id="absent">
                        </div>
                    </div>
                </div>
            </div>
            <div style ="margin-left: 7vw;">
                <div style="display: block;">
                    <hr>
                    <div id="room-list">
                        ${code}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="module">
        let absents = {

        }
        const timeline = ${JSON.stringify(timeline)}
        const names = ${JSON.stringify(names_obj)}
        let called = [0, 0, 0]
        let minBeforeStart = 5, runned = 0;
        let beginRunned = 0;
        let zone = 0, soundPath = "";
            if (timeline["near-end-time"] == "5 phút") {
                zone = 5;
                soundPath = "../../../server/database/sounds/near-end-5.mp3"
            }
            if (timeline["near-end-time"] == "15 phút") {
                zone = 15;
                soundPath = "../../../server/database/sounds/near-end-15.mp3"
            }
            if (timeline["near-end-time"] == "30 phút") {
                zone = 30;
                soundPath = "../../../server/database/sounds/near-end-30.mp3"
            }
        function formatTime(hour, min) {
            if (min < 10) return hour + ":0" + min;
            else return hour + ":" + min;
        }

        function announce(path) {
            let audio = new Audio(path);
            audio.play();
        }

        // man im ded
        function timeValue(h, m) {
            return h * 60 * 60 + m * 60;
        }

        function blastNearEnd(tn, te){
            if ((te - tn) <= zone*60){
                announce(soundPath)
                return 1;
            }
            return 0;
        }

        function getDiff(start_hour, start_min, end_hour, end_min, h, m, s) {
            let ts = timeValue(start_hour, start_min);
            let te = timeValue(end_hour, end_min);
            let tn = timeValue(h, m) + s;
            let call_in = timeValue(Number(timeline["call-in-time-hour"]), Number(timeline["call-in-time-minute"]))
            let distribute = timeValue(Number(timeline["distribute-time-hour"]), Number(timeline["distribute-time-minute"]))

            if (tn > call_in && called[0] == 0){
                announce("../../../server/database/sounds/call-in.mp3")
                called[0]++;
            }
            if (tn > distribute && called[1] == 0){
                announce("../../../server/database/sounds/distribute the papers.mp3")
                called[1]++;
            }
            if (called[2] == 0){
                called[2] += blastNearEnd(tn, te);
            }
            if (tn > ts && beginRunned == 0) {
                announce("../../../server/database/sounds/begin.mp3")
                document.getElementById("room-list").style.display = "none";
                beginRunned++;
            }
            else if (tn >= te) {
                return 1;
            }
            else {
                // console.log((tn-ts)/(te-ts)*1.0)
                return ((tn - ts) / (te - ts)) * 1.0;
            }
        }


        function startClock(start_hour, start_min, end_hour, end_min) {
            var element = document.getElementById("progress-bar");
            var width = 1;
            var identity = setInterval(scene, 500);
            function scene() {
                if (width >= 100) {
                    width = 100;
                    clearInterval(identity);
                    element.innerHTML = '<div id="progress" style="width: ' + 100 + '%;"></div>'
                    announce("../../../server/database/sounds/announcement (end).mp3")
                    document.getElementById("time-runout").style.display = "block"
                } else {
                    const today = new Date();
                    let h = today.getHours();
                    let m = today.getMinutes();
                    let s = today.getSeconds();
                    width = getDiff(start_hour, start_min, end_hour, end_min, h, m, s) * 100;
                    element.innerHTML = '<div id="progress" style="width: ' + width + '%;"></div>'
                }
            }
        }

        function writeTime(start_hour, start_min, end_hour, end_min) {
            document.getElementById("start").innerHTML = formatTime(start_hour, start_min);
            document.getElementById("end").innerHTML = formatTime(end_hour, end_min);

            startClock(start_hour, start_min, end_hour, end_min)
        }

        function check(i) {
            if (i < 10) return '0' + i;
            return i;
        }

        function startPermanentClock() {
            let id = setInterval(scene, 800);
            function scene() {
                const today = new Date();
                let h = today.getHours();
                let m = today.getMinutes();
                let s = today.getSeconds();
                document.getElementById("real-time").innerHTML = check(h) + ':' + check(m) + ':' + check(s);
            }
            console.log("hi")
        }
        function renderAbsents() {
            document.getElementById("absent").innerHTML = ""
            for (let id in absents){
                document.getElementById("absent").innerHTML +=  "<span>" +id+ ": " + absents[id]+" </span> <br>"
            }
        }

        startPermanentClock()
        writeTime(${start_hour}, ${start_min}, ${end_hour}, ${end_min})

        let ids = {};
        let activate = {};

        let rooms = document.getElementsByTagName("table").length;
        for (let room = 1; room <= rooms; room++) {
            ids["room_" + room] = [];
            activate["room_" + room] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,];
            for (let i = 0; i < ${rows*cols}; i++) {
                ids["room_" + room].push(document.getElementById("room-" + room + "-cell-" + (i + 1)).textContent)
            }
        }

        for (let room = 1; room <= rooms; room++) {
            for (let i = 0; i < ${rows*cols}; i++) {
                let cell = document.getElementById("room-" + room + "-cell-" + (i + 1))
                cell.addEventListener("click", (e) => {
                    let obj;
                    if (e.target.tagName != "TD") obj = e.target.parentNode;
                    else obj = e.target;

                    let dis = activate["room_" + room][i];
                    if (activate["room_" + room][i] == false) activate["room_" + room][i] = true;
                    else if (activate["room_" + room][i] == true) activate["room_" + room][i] = false;

                    if (dis == false && ids["room_" + room][i] != "") {
                        obj.innerHTML = ids["room_" + room][i] + '<p> vắng <br> ' + names[ids["room_" + room][i]] + '</p>'
                        absents[ids["room_" + room][i]] = names[ids["room_" + room][i]];
                    }
                    else if (dis == true && ids["room_" + room][i] != "") {
                        obj.innerHTML = ids["room_" + room][i] + '<img src="../../../server/database/photos/' + ids["room_" + room][i] + '.jpg" alt="">'
                        delete absents[ids["room_" + room][i]]
                    }
                    renderAbsents();
                })
            }
        }

        const creds = ${JSON.stringify(obj)}
    </script>
</body>

</html>
    `
}

function appendCode2 (code, title = "none", start_hour, start_min, end_hour, end_min, subject, time_restrain, day, month, year, school, period, department, grade, obj = "{}", names_obj = "{}", rows, cols, timeline){

    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../../../server/database/images/favicon.ico?v=1" type="image/x-icon">
    <title>${title}</title>
    <style>
    * {
    transition-duration: 0.5s;
}

body {
    font-family: 'Times New Roman', Times, serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0vw 5vw;
    overflow-x: hidden;
}

#main-form {
    display: none;
    font-weight: bold;
}

.display-id {
    width: 5vw;
    font-size: 1.10vw;
    text-align: center;
    border: 1px solid black;
    padding: 0px;
    cursor: pointer;
}

img {
    height: 5vw;
    width: 4vw;
    font-weight: lighter;
    font-size: 1vw;
}

caption {
    font-family: inherit;
    text-align: center;
    font-weight: bold;
    font-size: 1vw;
}

table {
    font-weight: bold;
    font-size: 2vw;
    border-spacing: 3.5vw 0.10vw;
    margin: auto;
}
 

th {
    text-transform: uppercase;
}

#time-section {
    width: 25vw;
    display: flex;
    height: 3vw;
    margin: 0.5vw;
    padding: 0px;
}

#start,
#progress-bar,
#end {
    border: 1px solid black;
    height: 100%;
}

#start,
#end {
    width: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0vw 0.5vw;
}

#progress-bar {
    width: 80%;
}

#progress {
    height: 100%;
    width: 0%;
    background-color: rgb(0, 153, 255);
    transition: width 2s linear 1s;
}


#real-time {
    height: 2vw;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px;
    padding: 0px;
}
#users {
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2vw;
}
#users input {
    outline: none;
    margin: 0.5vw 0vw;
}

#username {
    margin-right: 3vw;
}

#post-cred {
    border-radius: 0;
    padding: 1vw;
    cursor: pointer;
}

#post-cred:active {
    background-color: #2ae082;
} 
    </style>

<body>
    <div id="main-form">
        <div style="display: flex;">
            <div>
                <div
                    style="display: flex; flex-direction: column; justify-content: center; align-items: center; line-height: 2vw; margin-bottom: 1vw;">
                    <span>ỦY BAN NHÂN DÂN ${department.toUpperCase()}</span>
                    <span>TRƯỜNG THCS ${school.toUpperCase()}</span>
                </div>
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <span>THI ${period.toUpperCase()}</span>
                    <span>KHỐI: ${grade.toUpperCase()}</span>
                    <span style="margin: 0.75vw;">MÔN: ${subject.toUpperCase()}</span>
                    <span>PHÒNG: <span id="room-name"></span> </span> <br>
                    <span style="text-align: center;">NGÀY ${day} THÁNG ${month} NĂM ${year} <br> THỜI GIAN: ${time_restrain} PHÚT</span>
                </div>
                <div>
                    <h1 id="time-runout" style="text-align: center; color: crimson; display: none;">! HẾT GIỜ LÀM BÀI!
                    </h1>
                </div>
                <div>
                    <div id="real-time">
                    </div>
                    <div>
                        <div id="time-section" class="time">
                            <div id="start" class="time"></div>
                            <div id="progress-bar" class="time">
                                <div id="progress"></div>
                            </div>
                            <div id="end" class="time"></div>
                        </div>                        
                        <span>Thí sinh vắng thi: </span><br>
                        <span style="margin-right: 1vw;">SBD</span>
                        <span>Họ và tên</span>
                        <div id="absent">
                        </div>
                    </div>
                </div>
            </div>
            <div style ="margin-left: 7vw;">
                <div style="display: block;">
                    <hr>
                    <div id="room-list">
                        ${code}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="users">
        <div style="display: flex;">
            <div id="users">
                <div style="display: flex;">
                    <div id="username">
                        <span>Tên phòng: </span> <br>
                        <input type="text" id="name">
                    </div>
                    <div id="password">
                        <span>Mật khẩu phòng: </span> <br>
                        <input type="password" id="pass">
                    </div>
                </div>
                <div>
                    <input type="button" value="SUBMIT" id="post-cred">
                </div>
            </div>
        </div>
    </div>
    <script type="module">
        var element = document.getElementsByTagName("hr"), index;
        const timeline = ${JSON.stringify(timeline)}
        const names = ${JSON.stringify(names_obj)}
        let minBeforeStart = 5, runned = 0;
        let beginRunned = 0;
        let zone = 0, soundPath = "";
            if (timeline["near-end-time"] == "5 phút") {
                zone = 5;
                soundPath = "../../../server/database/sounds/near-end-5.mp3"
            }
            if (timeline["near-end-time"] == "15 phút") {
                zone = 15;
                soundPath = "../../../server/database/sounds/near-end-15.mp3"
            }
            if (timeline["near-end-time"] == "30 phút") {
                zone = 30;
                soundPath = "../../../server/database/sounds/near-end-30.mp3"
            }

        let absents = {

        }
        let called = [0, 0, 0]

        for (index = element.length - 1; index >= 0; index--) {
            element[index].parentNode.removeChild(element[index]);
        }    
        const creds = ${JSON.stringify(obj)}
                document.getElementById("post-cred").addEventListener("click", () => {
                    let room_num = 1;
                    let name = document.getElementById("name").value.trim()
                    let pass = document.getElementById("pass").value.trim()
                    let known = false;
                    for (let obj in creds) {
                        let e = creds[obj]
                        if (e.username == name && e.password == pass) {
                            known = renderRoom(obj);
                            document.getElementById("room-name").innerHTML = room_num;
                            return;
                        }
                        room_num++;
                    }
                    if (known == false) alert("THÔNG TIN ĐĂNG NHẬP SAI")
                })


        function renderRoom (id){
            document.getElementById("main-form").style.display = "flex";
            document.getElementById("users").style.display = "none";
            let rooms = Object.keys(creds).length;
            for (let i = 1; i <= rooms; i++){
                let name = "room_" + i;
                if (name == id) continue;
                else {
                    document.getElementById(name).remove();
                }
            }
        }
        function formatTime(hour, min) {
            if (min < 10) return hour + ":0" + min;
            else return hour + ":" + min;
        }

        function announce(path) {
            let audio = new Audio(path);
            audio.play();
        }

        // man im ded
        function timeValue(h, m) {
            return h * 60 * 60 + m * 60;
        }

        function blastNearEnd(tn, te){
            if ((te - tn) <= zone*60){
                announce(soundPath)
                return 1;
            }
            return 0;
        }

        function getDiff(start_hour, start_min, end_hour, end_min, h, m, s) {
            let ts = timeValue(start_hour, start_min);
            let te = timeValue(end_hour, end_min);
            let tn = timeValue(h, m) + s;
            let call_in = timeValue(Number(timeline["call-in-time-hour"]), Number(timeline["call-in-time-minute"]))
            let distribute = timeValue(Number(timeline["distribute-time-hour"]), Number(timeline["distribute-time-minute"]))

            if (tn > call_in && called[0] == 0){
                announce("../../../server/database/sounds/call-in.mp3")
                called[0]++;
            }
            if (tn > distribute && called[1] == 0){
                announce("../../../server/database/sounds/distribute the papers.mp3")
                called[1]++;
            }
            if (called[2] == 0){
                called[2] += blastNearEnd(tn, te);
            }
            if (tn > ts && beginRunned == 0) {
                announce("../../../server/database/sounds/begin.mp3")
                document.getElementById("room-list").style.display = "none";
                beginRunned++;
            }
            else if (tn >= te) {
                return 1;
            }
            else {
                // console.log((tn-ts)/(te-ts)*1.0)
                return ((tn - ts) / (te - ts)) * 1.0;
            }
        }

        function startClock(start_hour, start_min, end_hour, end_min) {
            var element = document.getElementById("progress-bar");
            var width = 1;
            var identity = setInterval(scene, 500);
            function scene() {
                if (width >= 100) {
                    width = 100;
                    clearInterval(identity);
                    element.innerHTML = '<div id="progress" style="width: ' + 100 + '%;"></div>'
                    announce("../../../server/database/sounds/announcement (end).mp3")
                    document.getElementById("time-runout").style.display = "block"
                } else {
                    const today = new Date();
                    let h = today.getHours();
                    let m = today.getMinutes();
                    let s = today.getSeconds();
                    width = getDiff(start_hour, start_min, end_hour, end_min, h, m, s) * 100;
                    element.innerHTML = '<div id="progress" style="width: ' + width + '%;"></div>'
                }
            }
        }

        function writeTime(start_hour, start_min, end_hour, end_min) {
            document.getElementById("start").innerHTML = formatTime(start_hour, start_min);
            document.getElementById("end").innerHTML = formatTime(end_hour, end_min);

            startClock(start_hour, start_min, end_hour, end_min)
        }

        function check(i) {
            if (i < 10) return '0' + i;
            return i;
        }

        function startPermanentClock() {
            let id = setInterval(scene, 800);
            function scene() {
                const today = new Date();
                let h = today.getHours();
                let m = today.getMinutes();
                let s = today.getSeconds();
                document.getElementById("real-time").innerHTML = check(h) + ':' + check(m) + ':' + check(s);
            }
        }
        function renderAbsents() {
            document.getElementById("absent").innerHTML = ""
            for (let id in absents){
                document.getElementById("absent").innerHTML +=  "<span>" +id+ ": " + absents[id]+" </span> <br>"
            }
        }

        startPermanentClock()
        writeTime(${start_hour}, ${start_min}, ${end_hour}, ${end_min})

        let ids = {};
        let activate = {};

        let rooms = document.getElementsByTagName("table").length;
        for (let room = 1; room <= rooms; room++) {
            ids["room_" + room] = [];
            activate["room_" + room] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,];
            for (let i = 0; i < ${rows*cols}; i++) {
                ids["room_" + room].push(document.getElementById("room-" + room + "-cell-" + (i + 1)).textContent)
            }
        }

        for (let room = 1; room <= rooms; room++) {
            for (let i = 0; i < ${rows*cols}; i++) {
                let cell = document.getElementById("room-" + room + "-cell-" + (i + 1))
                cell.addEventListener("click", (e) => {
                    let obj;
                    if (e.target.tagName != "TD") obj = e.target.parentNode;
                    else obj = e.target;

                    let dis = activate["room_" + room][i];
                    if (activate["room_" + room][i] == false) activate["room_" + room][i] = true;
                    else if (activate["room_" + room][i] == true) activate["room_" + room][i] = false;
                    if (dis == false && ids["room_" + room][i] != "") {
                        obj.innerHTML = ids["room_" + room][i] + '<p> vắng <br> ' + names[ids["room_" + room][i]] + '</p>'
                        absents[ids["room_" + room][i]] = names[ids["room_" + room][i]];
                    }
                    else if (dis == true && ids["room_" + room][i] != "") {
                        obj.innerHTML = ids["room_" + room][i] + '<img src="../../../server/database/photos/' + ids["room_" + room][i] + '.jpg" alt="">'
                        delete absents[ids["room_" + room][i]]
                    }
                    renderAbsents();

                })
            }
        }

    </script>
</body>

</html>
    `
}

function appendSection(obj, length, rows, cols, file_path){
    let e = dom.window.document;
    e.querySelector("#main-form").innerHTML = "";
    for (let i = 1; i <= length; i++){
        let track = 0;
        let html = `
        <div style="margin: 1vw; width: 100%; " class="container">
            <div
                style="width: fit-content; display: flex; flex-direction: column; justify-content: center; line-height: 200%; margin-bottom: 2vw;">
                <h2>ỦY BAN NHÂN DÂN QUẬN 6</h2>
                <h2>TRƯỜNG THCS ${obj.school.toUpperCase()}</h2>
            </div>
            <div style="width: 75%; margin: auto;">
                <h2>PHÒNG ${i}</h2>
                <div style="display: flex; line-height: 200%;">
                    <div class="property">
                        <h2>Khối </h2>
                        <h2>Ngày thi</h2>
                        <h2>Giờ thi</h2>
                        <h2>Môn thi</h2>
                    </div>
                    <div style="width: fit-content">
                        <h2>${obj.grade}</h2>
                        <h2>${obj.day}/${obj.month}/${obj.year}</h2>
                        <h2>Từ ${obj.times[0]}g${obj.times[1]} đến ${obj.times[2]}g${obj.times[3]}</h2>
                        <h2>${obj.subject.toUpperCase()}</h2>
                    </div>
                </div>
            </div>
            <div style="display: block;" id ="table-container">
                <h2 class="caption">SƠ ĐỒ CHỖ NGỒI</h2>
                <table id="room_${i}">

                </table>
            </div>
            <div class="signature">
                <div>
                    <h2 style="font-weight: 300; margin-bottom: 10vw; font-size: 2vw;">Họ tên cán bộ coi thi 1</h2>
                    <h2 style="font-weight: 300; font-size: 2vw;">Chữ kí cán bộ coi thi 1</h2>
                </div>
                <div>
                    <h2 style="font-weight: 300; margin-bottom: 10vw; font-size: 2vw;">Họ tên cán bộ coi thi 2</h2>
                    <h2 style="font-weight: 300; font-size: 2vw;">Chữ kí cán bộ coi thi 2</h2>
                </div>
            </div>
        </div>    
        `
        e.querySelector("#main-form").innerHTML += html;
        e.querySelector(`#room_${i}`).innerHTML = "";
        for (let j = 1; j <= 6; j++){
            let html2 = `
                <tr id="room-${i}-row-${j}"></tr>
            `
            e.querySelector(`#room_${i}`).innerHTML += html2;
            e.querySelector(`#room-${i}-row-${j}`).innerHTML = "";

            for (let y = 1; y <= cols; y++){
                let html3 = `
                    <td class="display-id">${obj.rooms_info[`${i}`][track]}</td>
                `
                e.querySelector(`#room-${i}-row-${j}`).innerHTML += html3;
                track++;
            }
        }
    }
    fs.writeFileSync(file_path + "IN.html", dom.serialize(),{encoding:'utf8',flag:'w'})
}

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.use(cors())

app.get('/', (req, res)=>{
    res.send("Welcome to your server")
})

app.post('/',  (req, res) =>{
    let rows = 6, cols = 4;
    if (req.body.id == 1) {
        file_path = "../client/SO DO 24 CHO/SO DO/"
        cols = 4;
    }
    else {
        file_path = "../client/SO DO 36 CHO/SO DO/"
        cols = 6;
    }

    /////////
    let student_names = {}
    const file = reader.readFile('./database/data.xlsx')       
    const sheet = file.SheetNames[0] 

    const temp = reader.utils.sheet_to_json(file.Sheets[sheet]) 
    for (let i = 0; i < temp.length; i++){
        let name = temp[i].HO + " " + temp[i].TEN;
        let id = temp[i].SOBAODANH
        student_names[id] = name;
    }

    ///////////

    fs.writeFileSync(file_path + "SO DO TONG.html",  
                appendCode(req.body.body_HTML, 
                          `SƠ ĐỒ CHỖ NGỒI`, 
                          req.body.times[0], 
                          req.body.times[1],
                          req.body.times[2],
                          req.body.times[3], 
                          req.body.subject, 
                          req.body.time_restrain, 
                          req.body.day, 
                          req.body.month, 
                          req.body.year, 
                          req.body.school, 
                          req.body.period, 
                          req.body.department, 
                          req.body.grade, 
                          "", 
                          student_names,
                          rows,
                          cols,
                          req.body.timeline), 
                          {encoding:'utf8',flag:'w'})

    fs.writeFileSync(file_path + "DANG NHAP.html",  
                appendCode2(req.body.body_HTML, 
                            `PHẦN MỀM COI THI`, 
                            req.body.times[0], 
                            req.body.times[1],
                            req.body.times[2],
                            req.body.times[3], 
                            req.body.subject, 
                            req.body.time_restrain, 
                            req.body.day, 
                            req.body.month, 
                            req.body.year, 
                            req.body.school, 
                            req.body.period, 
                            req.body.department, 
                            req.body.grade,
                            req.body.credentials,
                            student_names,
                            rows,
                            cols,
                            req.body.timeline), 
                            {encoding:'utf8',flag:'w'})

    let obj = req.body;
    appendSection(obj, req.body.rooms.length, rows, cols, file_path)
    res.end()
})

app.listen(port, ()=>{
    console.log(`Server is runing on port ${port}`)
})


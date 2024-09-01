const rows = 6,
    columns = 4,
    standard_id_length = 3,
    amount = rows * columns,
    local_images_path = "../../../server/database/photos/";
const img_ext = "jpg";
const original_formats = {
    "mẫu 1": [2, 1, 14, 15, 3, 4, 15, 16, 6, 5, 18, 17, 7, 8, 19, 20, 10, 9, 22, 21, 11, 12, 23, 24],
    "mẫu 2": [12, 9, 24, 21, 11, 10, 23, 22, 8, 5, 20, 17, 7, 6, 19, 18, 4, 1, 16, 13, 3, 2, 15, 14],
    "mẫu 3": [1, 2, 5, 6, 4, 3, 8, 7, 9, 10, 13, 14, 12, 11, 16, 15, 17, 18, 21, 22, 20, 19, 24, 23],
    "mẫu 4": [20, 19, 24, 23, 17, 18, 21, 22, 12, 11, 16, 15, 9, 10, 13, 14, 4, 3, 8, 7, 1, 2, 5, 6]
}
const url = "http://127.0.0.1:3000/"
let rooms_info = {};
let minBeforeStart = 5, runned = 0;
let beginRunned = 0,
    department = "QUẬN 6";
let credentials = {}
let wait = 0;

function writeHeader(subject, time_restrain, day, month, year, school, period, department, grade, school){
    document.getElementById("headers").innerHTML = `
    <div style="width: fit-content; display: flex; flex-direction: column; justify-content: center; align-items: center; line-height: 2vw; margin-bottom: 1vw;">
        <span>ỦY BAN NHÂN DÂN `+ department.toUpperCase()  +`</span>
        <span>TRƯỜNG THCS `+ school.toUpperCase()  +`</span>
    </div>
    <div style="width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <span>KIỂM TRA  `+ period.toUpperCase()  +`</span>
        <span>KHỐI: `+grade.toUpperCase() +`</span>
        <span style="margin: 0.75vw;">MÔN: `+ subject.toUpperCase() +`</span>
        <span style="text-align: center;">NGÀY `+ day +` THÁNG `+ month +` NĂM `+ year +` <br> THỜI GIAN: `+ time_restrain +` PHÚT</span>
    </div>    
    `
}

function formatTime (hour, min) {
    if (min < 10) return hour+":0"+min;
    else return  hour+":"+min;
}

function announce (path){
    let audio = new Audio(path);
    audio.play();
}

function timeValue (h, m){
    return h*60*60 + m*60;
}

function getDiff(start_hour, start_min, end_hour, end_min, h, m, s){
    let ts = timeValue(start_hour, start_min);
    let te = timeValue(end_hour, end_min);
    let tn = timeValue(h, m) + s;

    if (tn < ts){
        if (((ts - tn) <= (minBeforeStart)*60) && runned == 0){
            announce("/server/database/sounds/distribute the papers.mp3")
            runned++;
        }
        return 0;
    }
    if (tn > ts && beginRunned == 0){ 
        announce("/server/database/sounds/begin.mp3")
        beginRunned++;
    }
    else if (tn >= te){
        return 1;
    }
    else {
        // console.log((tn-ts)/(te-ts)*1.0)
        return ((tn-ts)/(te-ts))*1.0;
    }
}

function startClock(start_hour, start_min, end_hour, end_min){
    var element = document.getElementById("progress-bar");   
    element.innerHTML = '<div id="progress" style="width: '+ 0 +'%;"></div>'
    var width = 1;
    var identity = setInterval(scene, 500);
    function scene() {        
        document.getElementById("get-id-btn").addEventListener("click", () => {
            clearInterval(identity)
        })
        if (width >= 100) {
            clearInterval(identity);
            announce("/server/database/sounds/announcement (end).mp3")
        } else {
            const today = new Date();
            let h = today.getHours();
            let m = today.getMinutes();
            let s = today.getSeconds();
            width = getDiff(start_hour, start_min, end_hour, end_min, h, m, s) * 100;
            element.innerHTML = '<div id="progress" style="width: '+ width  +'%;"></div>'
        }
    }
}
function writeTime(start_hour, start_min, end_hour, end_min){
    document.getElementById("start").innerHTML = formatTime(start_hour, start_min);
    document.getElementById("end").innerHTML =  formatTime(end_hour, end_min);

    startClock(start_hour, start_min, end_hour, end_min)
}

function check(i){
    if (i < 10) return '0'+i;
    return i;
}

function startPermanentClock(){
    let id = setInterval(scene, 500);
    function scene () {
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        document.getElementById("real-time").innerHTML = check(h) + ':' + check(m) + ':' + check(s);
    }
}

function checkTimeInput () {
    let start_hour = document.getElementById("start-time-hour").value.trim();
    let start_min = document.getElementById("start-time-minute").value.trim();
    let end_hour = document.getElementById("end-time-hour").value.trim();
    let end_min = document.getElementById("end-time-minute").value.trim();
    let one0 = document.getElementById("call-in-time-hour").value.trim()
    let one1 = document.getElementById("call-in-time-minute").value.trim()
    let one2 =  document.getElementById("distribute-time-hour").value.trim()
    let one3 =  document.getElementById("distribute-time-minute").value.trim()

    if (one0 == "" || one1 == "" || one2 == "" || one3 == ""){
        alert("KHÔNG ĐƯỢC BỎ TRỐNG CÁC KHOẢNG THỜI GIAN")
        return 0;
    }
    if (start_hour == "" || start_min == ""){
        alert("KHÔNG ĐƯỢC BỎ TRỐNG THỜI GIAN BẮT ĐẦU")
        return 0;
    }
    else if (end_hour == "" || end_min == ""){
        alert("KHÔNG ĐƯỢC BỎ TRỐNG THỜI GIAN KẾT THÚC")
        return 0;
    }
    else {
        writeTime(start_hour, start_min, end_hour, end_min);
    }
}

function getCreds () {
    let rooms = document.getElementById("room-id").value;
    for (let i = 1; i <= rooms; i++){
        credentials[`room_${i}`] = {
            'username' : document.getElementById(`name_room_${i}`).value,
            'password' : document.getElementById(`pass_room_${i}`).value
        }
    }
    let form = document.getElementById("main-form")
    let cred = document.getElementById("users")
    form.style.display = "flex";
    cred.style.display = "none";
    sendRequest(rooms);
}

function renderCredentials (rooms) {
    let form = document.getElementById("main-form")
    let cred = document.getElementById("users")
    form.style.display = "none";
    cred.style.display = "flex";
    document.getElementById("username").innerHTML = `<span>Tên phòng: </span> <br> `
    document.getElementById("password").innerHTML = `<span>Mật khẩu phòng: </span> <br> `

    for (let i = 1; i <= rooms; i++){
        document.getElementById("username").innerHTML += `
            <br>
            <label>P${i}: </label>
            <input type="text" name="room_${i}" id="name_room_${i}" value="room_${i}">   
        `
        document.getElementById("password").innerHTML += `
            <br>
            <input type="text" name="pass_${i}" id="pass_room_${i}" value="abc">
        `
    }
}

function sendRequest(rooms) {
    let start_hour = document.getElementById("start-time-hour").value.trim();
    let start_min = document.getElementById("start-time-minute").value.trim();
    let end_hour = document.getElementById("end-time-hour").value.trim();
    let end_min = document.getElementById("end-time-minute").value.trim();
    let exam_date = new Date(document.getElementById("exam-date").value);
    let arr = [];
    for (let i = 1; i <= rooms; i++){
        let content = document.getElementById(`room_${i}`).outerHTML;
        arr.push(content)
    }

    let postObj = {
        id: 1,
        title: "MAIN WEB INFORMATION",
        body_HTML: document.getElementById("room-list").innerHTML,
        rooms: arr,
        chosen_format: document.getElementById("formats").value,
        times: [start_hour, start_min, end_hour, end_min],
        subject: document.getElementById("subject").value,
        time_restrain : document.getElementById("time-restrain").value,
        day : exam_date.getDate(),
        month : exam_date.getMonth() + 1,
        year : exam_date.getFullYear(),
        school: document.getElementById("school").value,
        department: department,
        period: document.getElementById("period").value,
        rooms_info: rooms_info,
        grade: document.getElementById("grade").value,
        credentials: credentials,
        timeline: {
            "call-in-time-hour": document.getElementById("call-in-time-hour").value,
            "call-in-time-minute": document.getElementById("call-in-time-minute").value,
            "distribute-time-hour": document.getElementById("distribute-time-hour").value,
            "distribute-time-minute": document.getElementById("distribute-time-minute").value,
            "near-end-time": document.getElementById("near-end-time").value,
        }
    }
    
    let post = JSON.stringify(postObj)
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(post);

    alert("Đã tạo file")
    rooms_info = {};
    minBeforeStart = 5, runned = 0;
    department = "";
    credentials = {}
    rooms_info = {}
    
}

function processData() {
    const room_id = document.getElementById("room-id").value;

    if (room_id.trim() == "") {
        alert("KHÔNG ĐƯỢC BỎ TRỐNG SỐ PHÒNG");
        return;
    }
    else {
        if (checkHeaders() == 0) return;
        else {
            if (checkTimeInput() == 0) return;
        }
    }

    renderRooms(room_id);
    renderInfo(room_id);
    renderCredentials(room_id);

    //sendRequest(room_id);
}

function renderFormatInfo() {
    let formats = JSON.parse(window.localStorage.getItem("room-id-formats"));
    let i = 1;
    for (const property in formats) {
        for (let j = 0; j < amount; j++) {
            let cell = document.getElementById(`list-${i}-cell-${j + 1}`)
            cell.innerHTML = formats[property][j];
        }
        i++;
    }
}

function renderFormatList() {
    let formats = JSON.parse(window.localStorage.getItem("room-id-formats"));
    let lists = document.getElementById("formats-list")
    lists.innerHTML = ""
    let i = 1;
    for (const property in formats) {
        lists.innerHTML += `
        <hr>
        <table id="list_${i}">
            <caption style="text-align: left; font-size: 1.5vw; margin-left: 2vw; width:25vw;">Mẫu ${i}</caption>
        </table>        
        `
        let list = document.getElementById(`list_${i}`);
        for (let j = 1; j <= rows; j++) {
            list.innerHTML += `
            <tr id="list-${i}-row-${j}"></tr>
            `
            let row = document.getElementById(`list-${i}-row-${j}`)
            for (let y = 1; y <= columns; y++) {
                row.innerHTML +=
                    `<td class="display-id" id="list-${i}-cell-${columns * (j - 1) + y}"></td>`
            }
        }
        i++;
    }
    renderFormatInfo();
}

function renderRooms(n) {
    let school = document.getElementById("room-list")
    school.innerHTML = "";

    ///////// 3 nested loops this is gonna be mah death
    for (let i = 1; i <= n; i++) {
        school.innerHTML += `
        <hr>
        <table id="room_${i}">
            <caption style="text-align: center; font-size: 1.5vw; width:100%;">PHÒNG ${i} SƠ ĐỒ CHỖ NGỒI THÍ SINH</caption>
        </table>
        `
        let room = document.getElementById(`room_${i}`);
        for (let j = 1; j <= rows; j++) {
            room.innerHTML += `
            <tr id="room-${i}-row-${j}"></tr>
            `
            let row = document.getElementById(`room-${i}-row-${j}`)
            for (let y = 1; y <= columns; y++) {
                row.innerHTML +=
                    `<td class="display-id" id="room-${i}-cell-${columns * (j - 1) + y}"></td>`
            }
        }
    }
}

function renderInfo(n) {
    let minus = 0;
    for (let i = 1; i <= amount; i++){
        let val = document.getElementById(`cell_${i}`).value
        if (val.trim() == ""){
            minus++
        }
    }
    for (let i = 1; i <= n; i++){
        for (let j = 1; j <= amount; j++){
            let val = document.getElementById(`cell_${j}`).value
            let id = "";
            if (val.trim() == ""){
                id = "";
            }
            else {
                let low = (rows * columns) * (i - 1);
                if (i == 1){
                    id = formatStandardId(low + Number(val));
                }
                else{
                    id = formatStandardId(low + Number(val) - minus*(i-1));
                }
                let cell = document.getElementById(`room-${i}-cell-${j}`);
                cell.innerHTML = id;
                cell.innerHTML += `<img src="${local_images_path}${id}.${img_ext}" alt="${id}"></img>`
            }

            if (j == 1){
                rooms_info[i] = [id];
            }
            else {
                rooms_info[i].push(id);
            }

        } 
    }

}

function setValuesForInputs(arr) {
    for (let i = 1; i <= amount; i++) {
        let that_cell = document.getElementById(`cell_${i}`)
        that_cell.value = arr[i - 1];
    }
}

function renderFormatByOption(e) {
    // reset    
    if (e === "chưa chọn") {
        renderInputGrid(rows, columns);
        return;
    }

    let format = JSON.parse(window.localStorage.getItem("room-id-formats"))[e];
    setValuesForInputs(format)
}

function setNull() {
    if (localStorage.getItem("room-id-formats") === null || localStorage.getItem("room-id-formats") == "{}") {
        window.localStorage.setItem("room-id-formats", JSON.stringify(original_formats))
    }
}

function formatStandardId(id) {
    let string = "A", temp = id.toString();
    for (let i = temp.length; i < standard_id_length; i++) {
        string += "0";
    }
    return string + temp;
}

function renderInputGrid(rows, columns) {
    const id_sheet = document.getElementById("primitive-id-sheet");
    id_sheet.innerHTML = "";

    // render rows
    for (let i = 1; i <= rows; i++) {
        let rows_id = i;
        const rows_contxt = `<tr id="row_${rows_id}"></tr>`;
        id_sheet.innerHTML += rows_contxt;

        const that_row = document.getElementById(`row_${rows_id}`);
        for (let j = 1; j <= columns; j++) {
            let cell_id = columns * (i - 1) + j;
            const input_contxt = `<td> <input type="text" name="cell_${cell_id}" id="cell_${cell_id}" class="primitive-id" maxlength="4"> </td>`
            that_row.innerHTML += input_contxt;
        }
    }
}

function renderDisplayGrid(rows, columns) {
    const id_sheet = document.getElementById("display-processed-id");

    for (let i = 1; i <= rows; i++) {
        let rows_id = i;
        const rows_contxt = `<tr id="display_${rows_id}"></tr>`;
        id_sheet.innerHTML += rows_contxt;

        const that_row = document.getElementById(`display_${rows_id}`);
        for (let j = 1; j <= columns; j++) {
            let cell_id = columns * (i - 1) + j;
            const input_contxt = ` <td class="display-id" id="student-id-${cell_id}"></td>`;
            that_row.innerHTML += input_contxt;
        }
    }
}

function renderFormatOptions(id) {
    let selector = document.getElementById(id);
    selector.innerHTML = `<option value="chưa chọn" selected>chưa chọn</option>`;
    setNull();
    let format = JSON.parse(window.localStorage.getItem("room-id-formats"))
    for (const property in format) {
        const option_contxt = `<option value="${property}">${property}</option>`;
        selector.innerHTML += option_contxt;
    }
}

function saveFormat() {
    setNull();
    let formats = JSON.parse(window.localStorage.getItem("room-id-formats"));
    let format_name = `mẫu ${Object.keys(formats).length + 1}`;
    formats[format_name] = [];
    for (let id = 1; id <= amount; id++) {
        let that_cell = document.getElementById(`cell_${id}`);
        formats[format_name].push(that_cell.value);
    }
    //console.log(formats)
    alert("Đã lưu");
    window.localStorage.setItem("room-id-formats", JSON.stringify(formats))

    renderFormatOptions("formats");
    renderFormatOptions("del-formats");
    renderFormatList()
}

function removeFormat() {
    let value = document.getElementById("del-formats").value;
    if (value === "chưa chọn") {
        return;
    }
    let formats = JSON.parse(window.localStorage.getItem("room-id-formats"))
    delete formats[value];
    window.localStorage.setItem("room-id-formats", JSON.stringify(formats))
    alert("Đã xóa");

    setNull();
    renderFormatOptions("formats");
    renderFormatOptions("del-formats")
    renderFormatList()
}

function eventListenerSubmit() {
    // process data
    const submit = document.getElementById("get-id-btn");
    submit.addEventListener("click", processData);

    // save form format
    const form = document.getElementById("save-btn");
    form.addEventListener("click", saveFormat);

    // render room format
    const chosen = document.getElementById("formats")
    chosen.addEventListener("change", function () {
        renderFormatByOption(this.value);
    })

    // remove a room format
    const remove = document.getElementById("get-remove-btn");
    remove.addEventListener("click", removeFormat)

    const creds = document.getElementById("post-cred")
    creds.addEventListener("click", getCreds)
}

function main () {
    renderInputGrid(rows, columns);
    renderDisplayGrid(rows, columns);
    renderFormatOptions("formats");
    renderFormatOptions("del-formats")
    renderFormatList();
    startPermanentClock()
    eventListenerSubmit();
}

function checkHeaders(){
    let subject = document.getElementById("subject").value
    let time_restrain = document.getElementById("time-restrain").value
    let exam_date = document.getElementById("exam-date").value
    let period = document.getElementById("period").value
    let grade = document.getElementById("grade").value
    let school = document.getElementById("school").value

    let date = new Date(exam_date)
    let flag = true;
    if (subject.trim() == ""){
        alert("KHÔNG ĐƯỢC BỎ TRỐNG MÔN THI")
        flag = false;
        return 0;
    }
    if (date == "Invalid Date"){
        alert("KHÔNG ĐƯỢC BỎ TRỐNG NGÀY THI")
        flag = false;
        return 0;
    }
    if (time_restrain == ""){
        alert("KHÔNG ĐƯỢC BỎ TRỐNG THỜI GIAN THI")
        flag = false;
        return 0;
    }
    if (period.trim() == ""){
        alert("KHÔNG ĐƯỢC BỎ TRỐNG KỲ KIỂM TRA")
        flag = false;
        return 0;
    }
    if (grade.trim() == ""){
        alert("KHÔNG ĐƯỢC BỎ TRỐNG KHỐI KIỂM TRA")
        flag = false;
        return 0;
    }
    if (school.trim() == ""){
        alert("KHÔNG ĐƯỢC BỎ TRỐNG TÊN TRƯỜNG")
        flag = false;
        return 0;
    }

    if (flag){
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        writeHeader(subject, time_restrain, day, month, year, school, period, department, grade, school)
    }
    return 1;
}

main();

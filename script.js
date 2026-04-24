function openLink(url){
    window.open(url, "_blank");
}

function scrollToSection(id){
    document.getElementById(id).scrollIntoView({
        behavior:"smooth"
    });
}
const images = [
    "image/img1.jpg",
    "image/img2.jpg",
    "image/img3.jpg",
    "image/img4.jpg"
];

let index = 0;

document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector(".hero-bg");
    if(!hero) return;

    hero.style.backgroundImage = `url('${images[0]}')`;

    function changeBackground(){

        hero.style.opacity = "0";
        hero.style.transform = "scale(1.05)";  // zoom خفيف

        setTimeout(() => {

            index = (index + 1) % images.length;

            hero.style.backgroundImage = `url('${images[index]}')`;

            hero.style.opacity = "1";
            hero.style.transform = "scale(1)";

        }, 800);  // وقت الفيد
    }

    setInterval(changeBackground, 5000); // كل 6 ثواني
});

/* PARTICLES */
particlesJS("particles-js", {
    "particles": {
    "number": { "value": 60 },
    "color": { "value": "#ff0033" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.4 },
    "size": { "value": 3 },
    "move": { "enable": true, "speed": 2 }
    },
    "interactivity": {
        "detect_on": "window", // التفاعل يتم على مستوى النافذة كلها
        "events": {
            "onhover": { "enable": true, "mode": "grab" }, // أو grab
            "onclick": { "enable": true, "mode": "push" }
        }
    }
});

const canvas = document.getElementById("card-particles");
const ctx = canvas.getContext("2d");

let w, h;
let particles = [];
let mouse = { x: null, y: null };

function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
}

window.addEventListener("resize", resize);
resize();

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.baseX = this.x; // لحفظ الموقع الأصلي إذا أردت عودتها
        this.baseY = this.y;
        this.size = 2;
    }

    move() {
    // 1. تفاعل الجذب مع الماوس
    if (mouse.x !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = 150; // مسافة التأثير

        if (distance < maxDistance) {
            // حساب قوة الجذب: كل ما كانت النقطة أبعد، سحبناها أبطأ
            // وكل ما قربت، سحبناها أسرع
            let force = (maxDistance - distance) / maxDistance;
            
            // جرب تقليل الرقم 0.05 إلى 0.02 لجعلها أسلس
            this.x += dx * force * 0.03; 
            this.y += dy * force * 0.03;
        }
    }

    // 2. الحركة العشوائية المستمرة
    this.x += this.vx;
    this.y += this.vy;

    // 3. الارتداد من الحواف
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
}
}

// إنشاء النقاط
particles = [];
for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

// استماع لحركة الماوس على الكانفاس بدقة
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
        p.move();
        p.draw();
    }
    requestAnimationFrame(animate);
}

animate();

function addGame(){
    const input = document.getElementById("gameInput");
    const value = input.value.trim();

    if(value === "") return;

    const item = document.createElement("div");
    item.className = "item";

    item.innerHTML = `
        <span>${value}</span>
        <button onclick="moveToFinished(this)">✔</button>
        <button onclick="this.parentElement.remove()">❌</button>
    `;

    document.getElementById("requestList").appendChild(item);

    input.value = "";
}

function moveToFinished(btn){
    const item = btn.parentElement;

    // نشيل الزرار بعد النقل
    btn.remove();

    document.getElementById("finishedList").appendChild(item);
}

document.addEventListener("DOMContentLoaded", loadChat);

function sendMessage(){

    const input = document.getElementById("messageInput");
    const fileInput = document.getElementById("fileInput");
    const chatBox = document.getElementById("chatBox");

    const text = input.value.trim();
    const file = fileInput.files[0];

    if(text === "" && !file) return;

    const msg = document.createElement("div");
    msg.className = "message";

    // نص
    if(text){
        const p = document.createElement("p");
        p.textContent = text;
        msg.appendChild(p);
    }

    // ملف (صورة / فيديو)
    if(file){
        const reader = new FileReader();

        reader.onload = function(e){
            if(file.type.startsWith("image")){
                const img = document.createElement("img");
                img.src = e.target.result;
                msg.appendChild(img);
            }
            else if(file.type.startsWith("video")){
                const video = document.createElement("video");
                video.src = e.target.result;
                video.controls = true;
                msg.appendChild(video);
            }

            chatBox.appendChild(msg);
            saveChat();
        };

        reader.readAsDataURL(file);
    } else {
        chatBox.appendChild(msg);
        saveChat();
    }

    input.value = "";
    fileInput.value = "";
}


// 💾 حفظ
function saveChat(){
    localStorage.setItem("chatData", document.getElementById("chatBox").innerHTML);
}


// 🔄 تحميل
function loadChat(){
    const data = localStorage.getItem("chatData");
    if(data){
        document.getElementById("chatBox").innerHTML = data;
    }
}

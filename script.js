let alarmTimeout;
let alarmAudio = document.getElementById("alarm-sound");

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById("current-time").textContent = timeString;
}

setInterval(updateTime, 1000);
updateTime();

document.getElementById("alarm-tone").addEventListener("change", function () {
    if (this.value === "custom") {
        document.getElementById("custom-tone").style.display = "block";
    } else {
        document.getElementById("custom-tone").style.display = "none";
    }
});

function setAlarm() {
    const alarmDate = document.getElementById("alarm-date").value;
    const alarmTime = document.getElementById("alarm-time").value;
    const tone = document.getElementById("alarm-tone").value;
    const repeat = document.getElementById("alarm-repeat").value;
    const customToneFile = document.getElementById("custom-tone").files[0];

    if (!alarmDate || !alarmTime) {
        alert("Please select both date and time for the alarm.");
        return;
    }

    const alarmDateTime = new Date(`${alarmDate}T${alarmTime}`);
    const now = new Date();
    const timeDiff = alarmDateTime.getTime() - now.getTime();

    if (timeDiff < 0) {
        alert("The selected time is in the past.");
        return;
    }

    alarmTimeout = setTimeout(() => {
        if (tone === "custom" && customToneFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                alarmAudio.src = e.target.result;
                alarmAudio.play();
            };
            reader.readAsDataURL(customToneFile);
        } else {
            alarmAudio.src = tone;
            alarmAudio.play();
        }

        document.getElementById("alarm-status").textContent = "⏰ Alarm Ringing!";

        if (repeat === "daily") {
            alarmTimeout = setInterval(() => alarmAudio.play(), 86400000);
        } else if (repeat === "weekly") {
            alarmTimeout = setInterval(() => alarmAudio.play(), 604800000);
        } else if (repeat === "yearly") {
            alarmTimeout = setInterval(() => alarmAudio.play(), 31536000000);
        }
    }, timeDiff);

    document.getElementById("alarm-status").textContent = "✅ Alarm is set.";
}

function cancelAlarm() {
    clearTimeout(alarmTimeout);
    clearInterval(alarmTimeout);
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    document.getElementById("alarm-status").textContent = "❌ Alarm canceled.";
}

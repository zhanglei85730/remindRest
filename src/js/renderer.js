const { ipcRenderer } = require('electron');
const workTimeKey = 'workTime'
const restTimeKey = 'restTime'
// 时间倒计时
function startCountdown(totalSeconds) {
    // 将总秒数转换为时分秒 
    let _totalSeconds = totalSeconds
    // 显示倒计时  
    function displayCountdown(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 初始显示  
    displayCountdown(_totalSeconds);

    // 每秒更新倒计时  
    const countdownInterval = setInterval(() => {
        if (_totalSeconds > 0) {
            _totalSeconds--;
            displayCountdown(_totalSeconds);
        } else {
            // 休息时间到
            clearInterval(countdownInterval);
            // 倒计时结束后的操作，例如显示一条消息             
            // document.getElementById('countdown').textContent = '本次休息时间结束';
            // document.getElementById('setForm').style.display = "block"
            document.body.classList.add("fade-out")
            ipcRenderer.send("countDownEnd", localStorage.getItem(restTimeKey))

        }
    }, 1000);
}

// 使用示例：开始一个10分钟的倒计时（10分钟 * 60秒/分钟）  


ipcRenderer.on('startTime', () => {
    document.getElementById('setForm').style.display = "none"
    document.body.classList.add("fade-in")
    document.querySelector('.countdown-box').style.display = 'block';
    const restTime = localStorage.getItem(restTimeKey)
    const restTimeData = typeof (restTime) == 'string' ? parseInt(restTime) : restTime
    startCountdown(restTimeData);
})


//  点击保存设置按钮
document.querySelector("#saveSetting").addEventListener('click', () => {

    const restTimeObj = document.querySelector('#restTime')
    const restTimeValue = restTimeObj ? restTimeObj.value : 10

    const workTimeObj = document.querySelector('#workTime')
    const workTimeValue = workTimeObj ? workTimeObj.value : 10

    localStorage.setItem(workTimeKey, workTimeValue.toString())
    localStorage.setItem(restTimeKey, restTimeValue.toString())

    const parmas = {
        restTime: typeof (restTimeValue) == 'string' ? parseInt(restTimeValue) : restTimeValue,
        workTime: typeof (workTimeValue) == 'string' ? parseInt(workTimeValue) : workTimeValue
    }

    ipcRenderer.send('saveSetting', parmas)
})
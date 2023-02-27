const getCurrentRate = () => {
    fetch(`${API_URL}/current-rate`)
    .then(res => res.json())
    .then(res => {
        if(res.status)
            localStorage.setItem("CurrentRate", res.response.data)
    })
}
if(CURRENT_RATE)
    localStorage.setItem("CurrentRate", CURRENT_RATE)
setInterval(getCurrentRate, 1000*60*2)

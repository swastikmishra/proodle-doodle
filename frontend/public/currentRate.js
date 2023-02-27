const getCurrentRate = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/current-rate`)
    .then(res => res.json())
    .then(res => {
        if(res.status)
            localStorage.setItem("CurrentRate", res.response.data)
    })
}

setInterval(getCurrentRate, 1000*60*2)
getCurrentRate();
ajax = (method, url, options) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open(method, url);
        request.onreadystatechange = () => {
            if (request.readyState === 4)
                if (request.status < 400) {
                    resolve.call(null, request.response)
                } else {
                    reject.call(null, request)
                }
        }
        request.send()
    })
}


ajax('GET', '/friends.json')
    .then(
        (response) => {
            friends = JSON.parse(response)
            friends.forEach(item => {
                $(".friends").append(`
                    <li>
                        <div>${item.name}</div>
                        <div>${item.age}</div>
                    </li>
                `)
            })
        },
        (response) => {
            console.log(response.status);
        }
    )

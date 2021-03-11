getLocation();
loadFavoriteCities();

function loadFavoriteCities() {
    let url = `http://37.147.189.132:3000/favorites`;

    fetch(url)
        .then(response => {return response.json()})
        .then(commits => {
            for (let i = 0; i < commits.length; i++)
                loadCity(commits[i].name, commits[i]._id);
        })
        .catch(err => {
            alert('Произошла ошибка при загрузке избранных городов');
            console.error(err);
        });
}

function loadCity(nameCity, id) {
    createEmptyElement(nameCity, id);
    let url = `http://37.147.189.132:3000/weather/city?q=${nameCity}`;

    fetch(url)
        .then(response => {return response.json()})
        .then(commits => {
            if (commits.cod === "401" || commits.cod === "404" || commits.cod === "429")
                throw commits.cod;

            let temp = ~~commits.main.temp;
            let img = commits.weather[0].icon + '.png';
            let wind = commits.wind.speed;
            let cloud = commits.weather[0].description;
            let press = commits.main.pressure;
            let hum = commits.main.humidity;
            let x = commits.coord.lon.toFixed(1);
            let y = commits.coord.lat.toFixed(1);

            refactorElement(nameCity, temp, img, wind, cloud, press, hum, x, y, id);
        })
        .catch(err => console.error(err));
}

function addNewCity(nameCity = undefined, id='id-1') {
    let input_city = document.getElementById('add_city');

    nameCity = input_city.value;
    input_city.value = '';

    if (nameCity === "")
        return;

    let url = `http://37.147.189.132:3000/weather/city?q=${nameCity}`;

    id = Date.now().toString();
    createEmptyElement(nameCity, id);

    fetch(url)
        .then(response => {return response.json()})
        .then(commits => {
            if (commits.cod === "401" || commits.cod === "404" || commits.cod === "429")
                throw commits.cod;

            url = `http://37.147.189.132:3000/favorites`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nameCity
                })
            })
                .then(response => {return response.json()})
                .then(commitsPost => {
                    document.getElementById(id).querySelector(".delete").setAttribute('onclick', "del('" + commitsPost._id + "')");
                    document.getElementById(id).setAttribute('id', commitsPost._id);

                    let temp = ~~commits.main.temp;
                    let img = commits.weather[0].icon + '.png';
                    let wind = commits.wind.speed;
                    let cloud = commits.weather[0].description;
                    let press = commits.main.pressure;
                    let hum = commits.main.humidity;
                    let x = commits.coord.lon.toFixed(1);
                    let y = commits.coord.lat.toFixed(1);

                    refactorElement(nameCity, temp, img, wind, cloud, press, hum, x, y, commitsPost._id);
                })
                .catch(err => {
                    alert('Произошла ошибка');
                    console.error(err);
                    delFast(id);
                });
            })
        .catch(err => {
            if (err === "401")
                alert('Проблемы с ключом');
            else
                if (err === "404")
                    alert('Нет информации об этом городе');
                else
                    if (err === "429")
                        alert('Запросы в минуту превышают лимит бесплатного аккаунта');
                    else
                        alert('Произошла ошибка');
            delFast(id);
        });
}

function refactorElement(city='Moscow', temperature=5, img='weather.png',
                    wind=6.0, cloud='Сloudy', pressure=1013,
                    humidity=52, y=59.88, x=30.42, id='id-1') {
    let newFavorite = document.getElementById(id);
    newFavorite.querySelector('h3').textContent = city;
    newFavorite.querySelector('.temperature').textContent = temperature.toString()+'°C';
    newFavorite.querySelector('img').setAttribute('src', 'images/' + img);
    newFavorite.querySelector('.wind .normal').textContent = wind.toString() + ' м/c';
    newFavorite.querySelector('.cloud .normal').textContent = cloud;
    newFavorite.querySelector('.pressure .normal').textContent = pressure.toString() + ' мм';
    newFavorite.querySelector('.humidity .normal').textContent = humidity.toString() + '%';
    newFavorite.querySelector('.coord .normal').textContent = '[' + x.toString() + ', ' + y.toString() +']';

}

function getLocation() {
    navigator.geolocation.getCurrentPosition(success, error);
    async function success(coords) {
        let x = coords.coords.latitude;
        let y = coords.coords.longitude;

        let url = `http://37.147.189.132:3000/weather/coordinates?lat=${x}&lon=${y}`;

        fetch(url)
            .then(response => {return response.json()})
            .then(commits => {
                if (commits.cod === "401" || commits.cod === "404" || commits.cod === "429")
                    throw commits.cod;

                let nameCity = commits.name;
                let temp = ~~commits.main.temp;
                let img = commits.weather[0].icon + '.png';
                let wind = commits.wind.speed;
                let cloud = commits.weather[0].description;
                let press = commits.main.pressure;
                let hum = commits.main.humidity;
                x = commits.coord.lon.toFixed(1);
                y = commits.coord.lat.toFixed(1);

                refactorTopCity(nameCity, temp, img, wind, cloud, press, hum, x, y);
            })
            .catch(err => {
                if (err === "401")
                    alert('Проблемы с ключом');
                else if (err === "404")
                    alert('Нет информации об этом городе');
                else if (err === "429")
                    alert('Запросы в минуту превышают лимит бесплатного аккаунта');
                else
                    alert('Произошла ошибка при загрузке данных геолокации');

                console.error(err);
            });
    }

    async function error({ message }) {
        let url = `http://37.147.189.132:3000/weather/city?q=Москва`;

        fetch(url)
            .then(response => {return response.json()})
            .then(commits => {
                if (commits.cod === "401" || commits.cod === "404" || commits.cod === "429")
                    throw commits.cod;

                let nameCity = commits.name;
                let temp = ~~commits.main.temp;
                let img = commits.weather[0].icon + '.png';
                let wind = commits.wind.speed;
                let cloud = commits.weather[0].description;
                let press = commits.main.pressure;
                let hum = commits.main.humidity;
                x = commits.coord.lon.toFixed(1);
                y = commits.coord.lat.toFixed(1);

                refactorTopCity(nameCity, temp, img, wind, cloud, press, hum, x, y);
            })
            .catch(err => {
                if (err === "401")
                    alert('Проблемы с ключом');
                else if (err === "404")
                    alert('Нет информации об этом городе');
                else if (err === "429")
                    alert('Запросы в минуту превышают лимит бесплатного аккаунта');
                else
                    alert('Произошла ошибка при загрузке данных геолокации');

                console.error(err);
            });

        console.error('Пользователь запретил геолокацию');
    }
}

function update() {
    clearTop();
    getLocation();
}

function refactorTopCity(city, temperature, img, wind, cloud, pressure, humidity, y, x) {
    let newFavorite = document.querySelector('.top');
    newFavorite.querySelector('h2').textContent = city;
    newFavorite.querySelector('.temperature').textContent = temperature.toString()+'°C';
    newFavorite.querySelector('img').setAttribute('src', 'images/' + img);
    newFavorite.querySelector('.wind .normal').textContent = wind.toString() + ' м/c';
    newFavorite.querySelector('.cloud .normal').textContent = cloud;
    newFavorite.querySelector('.pressure .normal').textContent = pressure.toString() + ' мм';
    newFavorite.querySelector('.humidity .normal').textContent = humidity.toString() + '%';
    newFavorite.querySelector('.coord .normal').textContent = '[' + x.toString() + ', ' + y.toString() +']';

}

function clearTop() {
    let city = document.querySelector('.top');
    city.querySelector('h2').textContent = "Обновление...";
    city.querySelector('.temperature').textContent = "-°C";
    city.querySelector('img').setAttribute('src', 'images/unknown.png');
    city.querySelector('.wind .normal').textContent = "-";
    city.querySelector('.cloud .normal').textContent = "-";
    city.querySelector('.pressure .normal').textContent = "-";
    city.querySelector('.humidity .normal').textContent = "-";
    city.querySelector('.coord .normal').textContent = "-";

}

function createEmptyElement(city='Moscow', id='id-1') {
    let list = document.querySelector('.favorites');

    let newFavorite = tempCity.content.cloneNode(true);
    newFavorite.querySelector('.favorite').setAttribute('id', id);
    newFavorite.querySelector('.delete').setAttribute('onclick', "del('" + id + "')");
    list.appendChild(newFavorite);
}

function del(idCity) {
    let url = `http://37.147.189.132:3000/favorites`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idCity
        })
    })
        .then(res => {
            document.getElementById(idCity).style.display = "none";
        })
        .catch(err => {
            if (err === "401")
                alert('Проблемы с ключом');
            else if (err === "404")
                alert('Нет информации об этом городе');
            else if (err === "429")
                alert('Запросы в минуту превышают лимит бесплатного аккаунта');
            else
                alert('Произошла ошибка');

            console.error(err);
        });
}


function delFast(idCity) {
    document.getElementById(idCity).style.display = "none";
}

document.getElementById("myForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();
        addNewCity();
    });

document.getElementById("butHeader")
    .addEventListener("click", function(event) {
        event.preventDefault();
        update();
    });
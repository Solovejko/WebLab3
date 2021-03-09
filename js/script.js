const timePause = 700;

getLocation();
loadFavoriteCity();

async function loadFavoriteCity() {
    let url = `http://localhost:3000/favorites`;

    let response = await fetch(url);
    let commits = await response.json();

    for (let i = 0; i < commits.length; i++)
        addNewCity(commits[i].name, true, commits[i]._id);
}


async function addNewCity(nameCity = undefined, load=false, id='id-1') {
    if (nameCity === null)
        return;

    let input_city = document.getElementById('add_city');

    if (nameCity === undefined){
        nameCity = input_city.value;
        input_city.value = '';
    }

    if (nameCity === "")
        return;

    let url = `http://localhost:3000/weather/city?q=${nameCity}`;

    if (load)
        createEmptyElement(nameCity, id);

    let response = await fetch(url);
    let commits = await response.json();

    if (commits.cod === "401"){
        console.error('Проблемы с ключом');
        return;
    }

    if (commits.cod === "404"){
        console.error('Нет информации об этом городе');
        return;
    }

    if (commits.cod === "429"){
        console.error('Запросы в минуту превышают лимит бесплатного аккаунта');
        return;
    }

    if (!load) {
        url = `http://localhost:3000/favorites`;
        console.log(nameCity);

        let responsePost = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameCity
            })
        });

        let commitsPost = await responsePost.json();

        console.log('Post ', commitsPost);
        id = commitsPost._id;
        createEmptyElement(nameCity, id);
    }

    let temp = ~~commits.main.temp;
    let img = commits.weather[0].icon + '.png';
    let wind = commits.wind.speed;
    let cloud = commits.weather[0].description;
    let press = commits.main.pressure;
    let hum = commits.main.humidity;
    let x = commits.coord.lon.toFixed(1);
    let y = commits.coord.lat.toFixed(1);

    setTimeout(() => {
    refactorElement(nameCity, temp, img, wind, cloud, press, hum, x, y, id);
    }, timePause);
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

        let url = `http://localhost:3000/weather/coordinates?lat=${x}&lon=${y}`;

        let response = await fetch(url);
        let commits = await response.json();

        if (commits.cod === "401"){
            console.error('Проблемы с ключом');
            return;
        }

        if (commits.cod === "404"){
            console.error('Нет информации об этом городе');

            url = `http://localhost:3000/weather/city?q=Москва`;
            response = await fetch(url);
            commits = await response.json();
        }

        if (commits.cod === "429"){
            console.error('Запросы в минуту превышают лимит бесплатного аккаунта');
            return;
        }

        let nameCity = commits.name;
        let temp = ~~commits.main.temp;
        let img = commits.weather[0].icon + '.png';
        let wind = commits.wind.speed;
        let cloud = commits.weather[0].description;
        let press = commits.main.pressure;
        let hum = commits.main.humidity;
        x = commits.coord.lon.toFixed(1);
        y = commits.coord.lat.toFixed(1);

        setTimeout(() => {
            refactorTopCity(nameCity, temp, img, wind, cloud, press, hum, x, y);
        }, timePause);
    }

    async function error({ message }) {
        let url = `http://localhost:3000/weather/city?q=Москва`;
        let response = await fetch(url);
        let commits = await response.json();

        if (commits.cod === "401"){
            console.error('Проблемы с ключом');
            return;
        }

        if (commits.cod === "429"){
            console.error('Запросы в минуту превышают лимит бесплатного аккаунта');
            return;
        }

        let nameCity = commits.name;
        let temp = ~~commits.main.temp;
        let img = commits.weather[0].icon + '.png';
        let wind = commits.wind.speed;
        let cloud = commits.weather[0].description;
        let press = commits.main.pressure;
        let hum = commits.main.humidity;
        x = commits.coord.lon.toFixed(1);
        y = commits.coord.lat.toFixed(1);

        setTimeout(() => {
            refactorTopCity(nameCity, temp, img, wind, cloud, press, hum, x, y);
        }, timePause);

        console.error(message);
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

    let newFavorite = document.createElement('li');
    newFavorite.setAttribute('class', 'favorite');
    newFavorite.setAttribute('id', id);
    let newH3 = document.createElement('h3');
    newH3.textContent = city;

    let newSpan = document.createElement('span');
    newSpan.setAttribute('class', 'temperature');
    newSpan.textContent = '-°C';
    let newImg = document.createElement('img');
    newImg.setAttribute('src', 'images/unknown.png');
    let newButton = document.createElement('button');
    newButton.setAttribute('type', 'button');
    newButton.setAttribute('class', 'delete');
    newButton.setAttribute('onclick', "del('" + newFavorite.getAttribute('id') + "')");

    let newUl = document.createElement('ul');
    newUl.setAttribute('class', 'weather');

    let newLi1 = document.createElement('li');
    newLi1.setAttribute('class', 'wind');
    let newSpanBold1 = document.createElement('span');
    newSpanBold1.setAttribute('class', 'bold');
    newSpanBold1.textContent = 'Ветер';

    let newSpanNormal1 = document.createElement('span');
    newSpanNormal1.setAttribute('class', 'normal');
    newSpanNormal1.textContent = '-';
    newLi1.appendChild(newSpanBold1);
    newLi1.appendChild(newSpanNormal1);

    let newLi2 = document.createElement('li');
    newLi2.setAttribute('class', 'cloud');
    let newSpanBold2 = document.createElement('span');
    newSpanBold2.setAttribute('class', 'bold');
    newSpanBold2.textContent = 'Облачность';

    let newSpanNormal2 = document.createElement('span');
    newSpanNormal2.setAttribute('class', 'normal');
    newSpanNormal2.textContent = '-';

    newLi2.appendChild(newSpanBold2);
    newLi2.appendChild(newSpanNormal2);

    let newLi3 = document.createElement('li');
    newLi3.setAttribute('class', 'pressure');
    let newSpanBold3 = document.createElement('span');
    newSpanBold3.setAttribute('class', 'bold');
    newSpanBold3.textContent = 'Давление';

    let newSpanNormal3 = document.createElement('span');
    newSpanNormal3.setAttribute('class', 'normal');
    newSpanNormal3.textContent = '-';

    newLi3.appendChild(newSpanBold3);
    newLi3.appendChild(newSpanNormal3);

    let newLi4 = document.createElement('li');
    newLi4.setAttribute('class', 'humidity');
    let newSpanBold4 = document.createElement('span');
    newSpanBold4.setAttribute('class', 'bold');
    newSpanBold4.textContent = 'Влажность';

    let newSpanNormal4 = document.createElement('span');
    newSpanNormal4.setAttribute('class', 'normal');
    newSpanNormal4.textContent = '-';

    newLi4.appendChild(newSpanBold4);
    newLi4.appendChild(newSpanNormal4);

    let newLi5 = document.createElement('li');
    newLi5.setAttribute('class', 'coord');
    let newSpanBold5 = document.createElement('span');
    newSpanBold5.setAttribute('class', 'bold');
    newSpanBold5.textContent = 'Координаты';

    let newSpanNormal5 = document.createElement('span');
    newSpanNormal5.setAttribute('class', 'normal');
    newSpanNormal5.textContent = '-';

    newLi5.appendChild(newSpanBold5);
    newLi5.appendChild(newSpanNormal5);

    newUl.appendChild(newLi1);
    newUl.appendChild(newLi2);
    newUl.appendChild(newLi3);
    newUl.appendChild(newLi4);
    newUl.appendChild(newLi5);

    newFavorite.appendChild(newH3);
    newFavorite.appendChild(newSpan);
    newFavorite.appendChild(newImg);
    newFavorite.appendChild(newButton);
    newFavorite.appendChild(newUl);

    list.appendChild(newFavorite);
}

function del(idCity) {
    let url = `http://localhost:3000/favorites`;

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
            console.log(res);
        })
        .catch(err => console.error(err));
}

document.getElementById("add_city").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13)
            document.getElementById("submit_city").click();
    });

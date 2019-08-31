export function getAllSpecialities(usersData) {
    let allSpecialities = [];
    usersData.map(user => {
        if (user.speciality && user.speciality.length){
            user.speciality.map(spec => {
                if (allSpecialities.indexOf(spec) == -1){
                    allSpecialities.push(spec);
                }
            });
        }
    });
    return allSpecialities;
}

export function showFilteredUsers(users) {
    const doctorsList = document.getElementById('doctorsList');
    // clear doctors list before filtering
    doctorsList.innerHTML = '';
    users.map(user => {
        // inserting all doctors, which passed search and speciality filters
        doctorsList.insertAdjacentHTML('beforeend', `
        <section class="doctor">
            <div class="doctor-photo">
                <img src="${user.avatar}" alt="${user.first_name}">
            </div>
            <div class="doctor-info">
                <h2 class="doctor__name">${user.first_name} ${user.last_name}</h2>
                <span class="doctor__status ${user.status ? 'online' : 'offline'}">${user.status ? 'В сети' : 'Не в сети'}</span>
                <div class="doctor__rating">
                    <div class="doctor__rating-stars">
                        <i class="icon-${getFiveStarsRating(1,user.rate)}"></i>
                        <i class="icon-${getFiveStarsRating(2,user.rate)}"></i>
                        <i class="icon-${getFiveStarsRating(3,user.rate)}"></i>
                        <i class="icon-${getFiveStarsRating(4,user.rate)}"></i>
                        <i class="icon-${getFiveStarsRating(5,user.rate)}"></i>
                        (${user.rate})
                    </div>
                    <div class="doctor__rating-reviews">
                        ${user.comments} отзыв
                    </div>
                </div>
                <div class="doctor__speciality">
                    ${user.speciality}
                </div>
                <div class="doctor__price">
                    250 грн
                    <span>(10 минут)</span>
                </div>
                <div class="doctor__contacts">
                    <a href="#"><i class="icon-phone"></i></a>
                    <a href="#"><i class="icon-videocam"></i></a>
                    <a href="#"><i class="icon-conversation-speech-bubbles-"></i></a>
                </div>
            </div>
            <a href="#" class="doctor-profile-link ${user.status ? 'vissible' : 'hidden'}">
                <i class="icon-right-open-big"></i>
            </a>
        </section>
        `);
    });
}

function getFiveStarsRating(starNumber, rating){
    let starClass;
    const starView = rating - starNumber;
    if (starView >= 0){
        starClass = 'star';
    } else if (starView === -0.5){
        starClass = 'star-half-alt';
    } else {
        starClass = 'star-empty';
    }
    return starClass;
}
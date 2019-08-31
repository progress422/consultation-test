import '../styles/index.scss';
import {getAllSpecialities, showFilteredUsers, logSearch} from './modules.js';

// import json users data
import * as user_data from './user_data.json';


const doctorsData = user_data.default;

console.log(doctorsData);
let filteredUsersByName = doctorsData;
let filteredUsers = doctorsData;

let allSpecialities = getAllSpecialities(doctorsData);
console.log(allSpecialities);

// Специализации, по которым фильтрует хардкодом (динамический функционал реализовать не успел).
let filterUsersBySpecialityArr = ['Хирург', 'Терапевт'];

let searchTimeout;
function bindUserNameSearch() {
    const searchInput = document.getElementById('userSearch');
    searchInput.addEventListener('keyup', event => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const filterUsersByTextValue = searchInput.value.toLowerCase();
            filterUsers(filterUsersByTextValue);
            logSearch(searchInput.value);
        }, 1000);
    });
}
bindUserNameSearch();

// не успел реализовать поиск и выбор фильтров, но сама фильтрация по словам и по специализациям работает.
function bindUserSpecialitySearch() {
    // const searchInput
    filterUsersBySpeciality();
}
bindUserSpecialitySearch();

function filterUsers(searchText) {
    filteredUsersByName = doctorsData.filter(user => {
        // filter all users first_name last_name by search input text
        return (`${user.first_name} ${user.last_name}`).toLowerCase().includes(searchText);
    });
    filterUsersBySpeciality();
    showFilteredUsers(filteredUsers);
}

function filterUsersBySpeciality() {
    // if there are active Speciality filters - we filter already filtrated list by name (filteredUsers)
    if (filterUsersBySpecialityArr.length){
        filteredUsers = filteredUsersByName.filter(user => {
            let successfulFilter = false;
            if (user.speciality && user.speciality.length){
                filterUsersBySpecialityArr.forEach(filterSpec => {
                    user.speciality.forEach(spec => {
                        if (successfulFilter) return;
                        successfulFilter = filterSpec === spec;
                    });
                });
            }
            return successfulFilter;
        });
    } else {
        filteredUsers = filteredUsersByName;
    }
}

// Filter reset
function filterReset() {
    document.getElementById('filterReset').addEventListener('click', function(event) {
        filteredUsers = doctorsData;
        filterUsersBySpecialityArr = [];
        document.getElementById('userSearch').value = '';
        document.getElementById('specialityFilter').value = '';
        showFilteredUsers(filteredUsers);
    });
}
filterReset();

showFilteredUsers(filteredUsers);
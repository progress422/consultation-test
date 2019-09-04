import '../styles/index.scss';
import {getAllSpecialities, showFilteredUsers} from './modules.js';
import {logSearch, getSearchLog} from './log.js';

// import json users data
import * as user_data from './user_data.json';

const doctorsData = user_data.default;
console.log(doctorsData);

let filteredUsersByName = doctorsData;
let filteredUsers = doctorsData;
let filterUsersBySpecialityArr = [];

let searchTimeout;
function bindUserNameSearch() {
    const searchInput = document.getElementById('userSearch');
    if (searchInput){
        searchInput.addEventListener('keyup', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const filterUsersByTextValue = searchInput.value.toLowerCase();
                filterUsers(filterUsersByTextValue);
                logSearch(searchInput.value, 'Search By Name');
            }, 1000);
        });
    }
}
bindUserNameSearch();

// ---------- SPECIALITY FILTER -------------

let filterTimeout;
function bindUserSpecialitySearch() {
    const filterResult = document.getElementById('specialitiesFiltersList');
    const filterInput = document.getElementById('specialityFilter');
    if (filterInput){
        filterInput.addEventListener('focusin', () => {
            filterResult.style.display = 'block';
        });
        filterInput.addEventListener('focusout', (event) => {
            // need to give a time before result hidden to click on the list item
            setTimeout(() => {
                filterResult.style.display = 'none';
            }, 200);
        });
        filterInput.addEventListener('keyup', () => {
            clearTimeout(filterTimeout);
            if (filterInput.value !== ''){
                filterTimeout = setTimeout(() => {
                    const specFilterTextValue = filterInput.value.toLowerCase();
                    filterSpecialities(specFilterTextValue, filterResult.childNodes);
                }, 500);
            } else {
                filterResult.childNodes.forEach(spec => {
                    spec.classList.remove('show');
                });
            }
        });
    }
}
bindUserSpecialitySearch();

function filterSpecialities(searchText, allSpecialities) {
    allSpecialities.forEach(spec => {
        if (spec.textContent.toLowerCase().includes(searchText)){
            spec.classList.add('show');
        } else {
            spec.classList.remove('show');
        }
    });
}

// add all possible filters in hidden list
function setSpecialitiesToHTML() {
    const allSpecialities = getAllSpecialities(doctorsData);
    const list = document.getElementById('specialitiesFiltersList');
    if (list){
        allSpecialities.map(speciality => {
            let specElemText = document.createTextNode(speciality);
            let specElem = document.createElement('li');
                specElem.appendChild(specElemText);
                specElem.addEventListener('click', chooseFilter);
                
            list.appendChild(specElem);
        });
    }
}
setSpecialitiesToHTML();

function chooseFilter(event) {
    event.target.style.display = 'none';
    applyFilter(event.target.textContent);
    logSearch(event.target.textContent, 'Search by Speciality');
    filterUsersBySpeciality();
}

// ---------- SPECIALITY FILTER BUTTONS -------------

// apply filter + add filter button
function applyFilter(filterName) {
    // add filter name to filter Array
    filterUsersBySpecialityArr.push(filterName);

    // add filter button indicator
    const activeFiltersList = document.getElementById('activeFiltersList');
    activeFiltersList.insertAdjacentHTML('beforeend', `
        <li>
            <span>${filterName}</span>
            <button class="remove-filter" data-filter-name="${filterName}"><i class="icon-cross"></i></button>
        </li>
    `);
    bindRemoveButton(activeFiltersList.lastElementChild.getElementsByClassName('remove-filter')[0]);
}

// bind remove button
function bindRemoveButton(button) {
    button.addEventListener('click', turnFilterOff);
}

// filter off
function turnFilterOff(filterCloseButton) {
    let filterName = filterCloseButton.target.dataset['filterName'];
    // remove filter button from the UI
    filterCloseButton.target.parentElement.remove();
    // remove filter name from filters array
    filterUsersBySpecialityArr = filterUsersBySpecialityArr.filter(el => el !== filterName);
    filterUsersBySpeciality();
    // make speciality in filter result visible again
    document.getElementById('specialitiesFiltersList').childNodes.forEach(spec => {
        if (spec.textContent === filterName) {
            spec.style.display = 'block';
        }
    });
}

// ---------- SEARCH USERS BY NAME ------------

function filterUsers(searchText) {
    filteredUsersByName = doctorsData.filter(user => {
        // filter all users first_name last_name by search input text
        return (`${user.first_name} ${user.last_name}`).toLowerCase().includes(searchText);
    });
    filterUsersBySpeciality();
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
    showFilteredUsers(filteredUsers);
}

// Filter reset
function filterReset() {
    const resetButton = document.getElementById('filterReset');
    if (resetButton){
        resetButton.addEventListener('click', function(event) {
            filteredUsers = doctorsData;
            filterUsersBySpecialityArr = [];
            document.getElementById('userSearch').value = '';
            document.getElementById('specialityFilter').value = '';
            showFilteredUsers(filteredUsers);
        });
    }
}
filterReset();

showFilteredUsers(filteredUsers);
getSearchLog();
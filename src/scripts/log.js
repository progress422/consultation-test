import { log } from "util";

export function logSearch(searchRequest, searchType) {
    const date = new Date();
    const day = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}`;
    let storagedData;
    if (localStorage.getItem('consultation-search-request') !== null){
        storagedData = localStorage.getItem('consultation-search-request');
        localStorage.removeItem('consultation-search-request');
        localStorage.setItem('consultation-search-request', `${storagedData}, ${searchType}: ${searchRequest} ${day} ${time}`);
    } else {
        localStorage.setItem('consultation-search-request', ` ${searchType}: ${searchRequest} ${day} ${time}`);
    }
}

export function getSearchLog() {
    //write to the document
    const searchList = document.getElementById('searchLog');
    const storagedData = localStorage.getItem('consultation-search-request');
    
    if (searchList && storagedData){
        let storagedDataArr = storagedData.split(',');
        searchList.innerHTML = '';
        storagedDataArr.map(searchRequest => {
            searchList.insertAdjacentHTML('beforeend', `
                <li>${searchRequest}</li>
            `);
        });

        document.getElementById('clearLog').addEventListener('click', function() {
            searchList.innerHTML = '';
            localStorage.removeItem('consultation-search-request');
        });
    }
}
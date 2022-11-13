mapboxgl.accessToken = 'pk.eyJ1IjoiY2N0aGVncmVhdCIsImEiOiJjbDI2a2lodnYwMnRnM2ZvdXVhZXNjbHd0In0.4CfhKr_VP1IDEM08Nk7PXg';
const stateCoords = [-79.8, 35.3];
const defaultZoom = 6;

// Fetch meetings.json
// TODO: Refactor to fetch from database instead of locally
const getMeetings = () => {
    fetch('assets/meetings2.json')
        .then((response) => (response.json()))
        .then((data) => {
            console.log(getMeetingsByCounty(data))
            addCountysToMap(data)
        })
        .catch((error) => (console.log('error getting mettings', error)));
};


const createDiv = () => {
    return
}

// Sort meeting list to organize meetings by county
function getMeetingsByCounty(meetings) {

    // For each meeting in the meeting list,
    return meetings.reduce((meetingsByCounty, item) => {

        // get the county the meeting is in,
        const county = item.properties.county;

        // if county is not blank,
        if (county) {
            // check if it's in our new list,
            if (meetingsByCounty[county]) {
                // add the meeting to the county,
                meetingsByCounty[county].push({properties: {...item.properties}, geometry: {...item.geometry}});
            } else {
                // otherwise add a new entry for the county.
                meetingsByCounty[county] = [{properties: {...item.properties}, geometry: {...item.geometry}}];
            }
        }

        // Return a nice sorted object!
        return meetingsByCounty;
    }, []);
}

const showMeeting = (event) => {
    const {id} = event.target;
    console.log(id);
};


function flytoMeeting(meeting) {
    map.flyTo({
        center: meeting.geometry.coordinates,
        zoom: 15
    });
};

// Adds the meetingsByCounty list to the page
function addCountysToMap(meetingList) {

    const meetingsByCountyList = getMeetingsByCounty(meetingList)
    const countiesDiv = document.querySelector('#counties');

    // Create a list of county names sorted alphabetically.
    const countyNamesSorted = Object.keys(meetingsByCountyList).sort((c1, c2) => c1.localeCompare(c2))

    for (const countyName of countyNamesSorted) {
        // Create a new div for the county.
        const countyDiv = document.createElement('div');
        countyDiv.className = 'item border border-4 border-primary';
        const countyButton = document.createElement('button');
        countyButton.className = 'county-btn';
        countyButton.id = `${countyName}`;
        countyButton.innerHTML = `${countyName}`
        countyButton.onclick = showMeeting;
        countyDiv.appendChild(countyButton);
        countiesDiv.appendChild(countyDiv);
    }
    return countiesDiv;
}




// Create new map
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: stateCoords,
    zoom:defaultZoom
    // projection: 'globe' // display the map as a 3D globe
});

// Add map to page when html loads mapbox style
map.on('style.load', () => {
    // map.setFog({}); // Set the default atmosphere style
    getMeetings();
});


            //adding zoom and rotation controls to map
            map.addControl(new mapboxgl.NavigationControl());
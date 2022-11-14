// https://geojson.org/
// https://docs.mapbox.com/


mapboxgl.accessToken = 'pk.eyJ1IjoiY2N0aGVncmVhdCIsImEiOiJjbDI2a2lodnYwMnRnM2ZvdXVhZXNjbHd0In0.4CfhKr_VP1IDEM08Nk7PXg';

// Put your city's cordinates here.
const stateCoords = [ -78.8986, 35.9940];
const defaultZoom = 10;

// Fetch meetings.json
// TODO:
// Refactor to fetch from database instead of locally
// Refactor data to sort meetings by county?
const getMeetings = () => {
    return fetch('assets/meetings2.json')
        .then((response) => (response.json()))
        .then((data) => {
            return data;
        })
        .catch((error) => (console.log('error getting mettings', error)));
};

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

// TODO: Implement function to show meeting when clicked
const showMeeting = (event) => {
    const {id} = event.target;
    console.log(id);
};

// Goes to meeting location on map.
function flytoMeeting(meeting) {
    map.flyTo({
        center: meeting.geometry.coordinates,
        zoom: 15
    });
};

// Adds a list of meetings to the DOM.
function addCountyListToDOM(meetingList) {

    const meetingsByCountyList = getMeetingsByCounty(meetingList)
    const countiesDiv = document.querySelector('#counties');

    // Create a list of county names sorted alphabetically.
    const countyNamesSorted = Object.keys(meetingsByCountyList).sort((c1, c2) => c1.localeCompare(c2));

    // For each county in list,
    for (const countyName of countyNamesSorted) {
        // create a new div for the county,
        const countyDiv = document.createElement('div');
        countyDiv.className = 'item border border-4 border-primary';
        // render each county as a button for better accessablitiy(sp),
        const countyButton = document.createElement('button');
        countyButton.className = 'county-btn';
        countyButton.id = `${countyName}`;
        countyButton.innerHTML = `${countyName}`
        // add event to button to show meeting when clicked,
        countyButton.onclick = showMeeting;
        // add button to div,
        countyDiv.appendChild(countyButton);
        // then div to DOM.
        countiesDiv.appendChild(countyDiv);
    }
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

    // Get all the meetings.
    getMeetings()
    .then((data) => {
        addCountyListToDOM(data);
        console.log(data)
        map.addSource('meetings', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': data,
            }
        });

    })
    .catch((error) => (console.log('Error on page load:', error)));

    // addCountysToMap(meetings)



});

//adding zoom and rotation controls to map
map.addControl(new mapboxgl.NavigationControl());

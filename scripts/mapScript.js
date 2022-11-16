// https://geojson.org/
// https://docs.mapbox.com/

mapboxgl.accessToken = 'pk.eyJ1IjoiY2N0aGVncmVhdCIsImEiOiJjbDI2a2lodnYwMnRnM2ZvdXVhZXNjbHd0In0.4CfhKr_VP1IDEM08Nk7PXg';

// Put your city's cordinates here.
// const stateCoords = [ -78.8986, 35.9940];
const stateCoords = [ -82.554016, 35.60095];
const defaultZoom = 10;

//  ___General Helper Functions___
const clearDiv = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

// Get the meeting data.
const getMeetings = () => {
    return fetch('assets/meetingsFull.json')
        .then((response) => (response.json()))
        .then((data) => {
            return data;
        })
        .catch((error) => (console.log('error getting mettings', error)));
};

// Groups meetings by county then sorts A-Z
const groupMeetingsByCounty = (meetings) => {
    // For each meeting in the meeting list,
    return meetings.reduce((meetingsByCounty, item) => {
        // get the county the meeting is in,
        const county = item.properties.government;
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
};

// TODO: Implement function to show meeting when clicked
const showMeetings = (meetings) => {
    const {id} = event.target;
    console.log(meetings);
    // list meetings
    const meetingList = document.getElementById('meeting-list');
    clearDiv(meetingList);
    for (let meeting of meetings) {
        const meetingButton = document.createElement('button');
        meetingButton.className = 'meeting-btn';
        meetingButton.id = `${meeting.properties.id}`;
        meetingButton.innerHTML = `${meeting.properties.publicbody}`;
        meetingButton.onclick = (event) => {
            event.preventDefault();
            flyToMeeting(meeting.geometry.coordinates);
            showMeetingInfo(meeting);
        };
        meetingList.appendChild(meetingButton)
    }
};

// Adds a list of meetings to the DOM.
const addCountyListToDOM = (meetingList) => {

    const meetingsByCountyList = groupMeetingsByCounty(meetingList)
    const countiesDiv = document.querySelector('#county-list');

    // Create a list of county names sorted alphabetically.
    const countyNamesSorted = Object.keys(meetingsByCountyList).sort((c1, c2) => c1.localeCompare(c2));
    // For each county in list,
    for (const countyName of countyNamesSorted) {

        // render each county as a button for better accessablitiy(sp),
        const countyButton = document.createElement('button');
        countyButton.className = 'meeting-btn';
        countyButton.id = `${countyName}`;
        countyButton.textContent = `${countyName}`

        // add event to button to show meeting when clicked,
        countyButton.onclick = (event) => {
            event.preventDefault();
            showMeetings(meetingsByCountyList[countyName]);
        };
        countiesDiv.appendChild(countyButton);
    }
};

// Goes to meeting location on map.
const flyToMeeting = (meetingLocation) => {
    map.flyTo({
        center: meetingLocation,
        zoom: 15
    });
};

// Shows the meeting info as a popup in the map.
const showMeetingInfo = (meeting) => {
    // add logic to find if popup exists before creating a new one.
    const {address, county, location, publicbody, start, end, remote, schedule} = meeting.properties;

    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) {
        popUps[0].remove();
    }
    const popup = new mapboxgl.Popup({
            closeOnClick: false,
            anchor: 'center',
            maxWidth: '80%',
            focusAfterOpen: false
        })
        .setHTML(
            `<table class="meeting-info-table text-center">
                <caption>${publicbody}</caption>
                <tr>
                <th>Government</th>
                <th>Public Body</th>
                <th>Location</th>
                </tr>
                <tr>
                <td>${county}</td>
                <td>${publicbody}</td>
                <td>${location}</td>
                </tr>
                <tr>
                <th>Address</th>
                <th>Schedule</th>
                <th>Start Time</th>
                </tr>
                <tr>
                <td>${address}</td>
                <td>${schedule}</td>
                <td>${start}</td>
                </tr>
                <tr>
                <th>End Time</th>
                <th>Remote Options</th>
                </tr>
                <tr>
                <td>${end}</td>
                <td>${remote}</td>
                </table>
            </div>`)
        .setLngLat(meeting.geometry.coordinates)
        .addTo(map);
};

// Create new map
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: stateCoords,
    zoom:defaultZoom,
});

// Add map to page when html loads mapbox style
map.on('style.load', () => {

    // Get all the meetings.
    getMeetings()
    .then((data) => {

        // Create the list of counties in the #map div.
        addCountyListToDOM(data);

        // Adds all the meeting locations to the map.
        map.addSource('meetings', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': data,
            }
        });

        // Create a MapBox marker for each meeting location.
        for (let i in data) {
            const marker = new mapboxgl.Marker({
                'anchor': 'center',
            })
            .setLngLat(data[i].geometry.coordinates)
            .addTo(map);
        }

    })
    .catch((error) => (console.log('Error on page load:', error)));
});

//adding zoom and rotation controls to map
map.addControl(new mapboxgl.NavigationControl());

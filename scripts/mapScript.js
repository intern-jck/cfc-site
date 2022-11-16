// https://geojson.org/
// https://docs.mapbox.com/

mapboxgl.accessToken = 'pk.eyJ1IjoiY2N0aGVncmVhdCIsImEiOiJjbDI2a2lodnYwMnRnM2ZvdXVhZXNjbHd0In0.4CfhKr_VP1IDEM08Nk7PXg';

// Put your city's cordinates here.
// const stateCoords = [ -78.8986, 35.9940];
const stateCoords = [ -82.554016, 35.60095];
const defaultZoom = 10;

//  ___General Helper Functions___
// Fetch meetings.json
// TODO:
// Refactor to fetch from database instead of locally
// Refactor data to sort meetings by county?
const getMeetings = () => {
    return fetch('assets/meetings.json')
        .then((response) => (response.json()))
        .then((data) => {
            return data;
        })
        .catch((error) => (console.log('error getting mettings', error)));
};

const clearDiv = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

// Sort meeting list to organize meetings by county
const sortMeetingsByCounty = (meetings) => {
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
};

// TODO: Implement function to show meeting when clicked
const showMeetings = (meetings) => {
    const {id} = event.target;
    console.log(meetings);
    // list meetings
    const meetingList = document.getElementById('meeting-list');
    clearDiv(meetingList)
    for (let meeting of meetings) {
        const meetingButton = document.createElement('button');
        meetingButton.className = 'meeting-btn';
        meetingButton.id = `${meeting.properties.id}`;
        meetingButton.innerHTML = `${meeting.properties.publicbody}`;
        meetingButton.onclick = () => {
            flyToMeeting(meeting.geometry.coordinates);
            if (this.__popup) {
                console.log('popup found!')
            }
            showMeetingInfo(meeting);
        };
        meetingList.appendChild(meetingButton)
    }
};



// Adds a list of meetings to the DOM.
// TODO:  Refactor this to render accordians instead of buttons
const addCountyListToDOM = (meetingList) => {

    const meetingsByCountyList = sortMeetingsByCounty(meetingList)
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

// ___MapBox Functions___

// Goes to meeting location on map.
const flyToMeeting = (meetingLocation) => {
    map.flyTo({
        center: meetingLocation,
        zoom: 15
    });
};

const createMeetingPopup = () => {

};


const showMeetingInfo = (meeting) => {
    console.log(meeting)
    // add logic to find if popup exists before creating a new one.
    const {address, county, location, publicbody, start, end, remote, schedule} = meeting.properties;
    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(meeting.geometry.coordinates)
        .setHTML(
            `<div class='row border border-4 border-dark'>
            <h3><center>${publicbody}</center></h3>
            <table>
            <tr>
            <th><center>Government</center></th>
            <th><center>Public Body</center></th>
            <th><center>Location</center></th>
            </tr>
            <tr>
            <td><center>${county}</center></td>
            <td><center>${publicbody}</center></td>
            <td><center>${location}</center></td>
            </tr>
            <tr>
            <th><center>Address</center></th>
            <th><center>Schedule</center></th>
            <th><center>Start Time</center></th>
            </tr>
            <tr>
            <td><center>${address}</center></td>
            <td><center>${schedule}</center></td>
            <td><center>${start}</center></td>
            </tr>
            <tr>
            <th><center>End Time</center></th>
            <th><center>Remote Options</center></th>
            </tr>
            <tr>
            <td><center>${end}</center></td>
            <td><center>${remote}</center></td>
            </div>`)
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

        // Adds a circle for each meeting location.
        // map.addLayer({
        //     'id': 'meeting-markers',
        //     'type': 'circle',
        //     'source': 'meetings',
        //     'paint': {
        //         'circle-radius': 4,
        //         'circle-color': '#B42222'
        //     },
        // });

        // Create a MapBox marker for each meeting location.
        for (let i in data) {
            const marker = new mapboxgl.Marker({
                'anchor': 'center',
                // Create custom element for marker.
                // 'element': document.createElement('div'),
            })
            .setLngLat(data[i].geometry.coordinates)
            .addTo(map);
        }

    })
    .catch((error) => (console.log('Error on page load:', error)));

});

//adding zoom and rotation controls to map
map.addControl(new mapboxgl.NavigationControl());

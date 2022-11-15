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
    return fetch('assets/meetings2.json')
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

// TODO: Implement function to show meeting when clicked
const showMeetings = (meetings) => {
    const {id} = event.target;
    console.log(meetings);
    // list meetings
    const meetingList = document.getElementById('meeting-list');
    clearDiv(meetingList)
    for (let meeting of meetings) {
        const meetingButton = document.createElement('button');
        meetingButton.className = 'county-btn';
        meetingButton.id = `${meeting.properties.id}`;
        meetingButton.innerHTML = `${meeting.properties.publicbody}`;
        meetingButton.onclick = () => {
            flyToMeeting(meeting.geometry.coordinates)
        };
        meetingList.appendChild(meetingButton)
    }
};



// Adds a list of meetings to the DOM.
// TODO:  Refactor this to render accordians instead of buttons
function addCountyListToDOM(meetingList) {

    const meetingsByCountyList = getMeetingsByCounty(meetingList)
    const countiesDiv = document.querySelector('#county-list');

    // Create a list of county names sorted alphabetically.
    const countyNamesSorted = Object.keys(meetingsByCountyList).sort((c1, c2) => c1.localeCompare(c2));
    // For each county in list,
    for (const countyName of countyNamesSorted) {
      
        // render each county as a button for better accessablitiy(sp),
        const countyButton = document.createElement('button');
        countyButton.className = 'county-btn';
        countyButton.id = `${countyName}`;
        countyButton.innerHTML = `${countyName}`
        // add event to button to show meeting when clicked,
        countyButton.onclick = () => {
            showMeetings(meetingsByCountyList[countyName]);
        };
        // add button to div,
        // countyDiv.appendChild(countyButton);
        // then div to DOM.
        countiesDiv.appendChild(countyButton);
    }
}

// ___MapBox Functions___

// Goes to meeting location on map.
const flyToMeeting = (meetingLocation) => {
    map.flyTo({
        center: meetingLocation,
        zoom: 15
    });
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

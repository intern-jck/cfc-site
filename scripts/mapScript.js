mapboxgl.accessToken = 'pk.eyJ1IjoiY2N0aGVncmVhdCIsImEiOiJjbDI2a2lodnYwMnRnM2ZvdXVhZXNjbHd0In0.4CfhKr_VP1IDEM08Nk7PXg';
const stateCoords = [-79.8, 35.3];
const defaultZoom = 6;

const getMeetings = () => {
    fetch('assets/meetings2.json')
        .then((response) => (response.json()))
        .then((data) => (data))
        .catch((error) => (console.log('error getting mettings', error)));
};

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: stateCoords,
    zoom:defaultZoom
    // projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
    // map.setFog({}); // Set the default atmosphere style
});

function buildMeetingListByCounty(meetings) {
    return meetings.features.reduce((obj, item) => {
        // TODO:  change goverment to county in meetings.json
        // just makes more sense
        const county = item.properties.government;

        if (county !== "") {
            if (!obj[county]) {
                obj[county] = [{properties: {...item.properties}, geometry: {...item.geometry}}];
            } else {
                obj[county].push({properties: {...item.properties}, geometry: {...item.geometry}});
            }
        }
        return obj;
    }, []);
}

// Adds the County list to sidebar
function buildCountyList(meetingList) {
    const countyList = buildMeetingListByCounty(meetingList)
    const counties = document.querySelector('#counties');

    /* Sort list of counties */
    const sortedCounties = Object.keys(countyList).sort((c1, c2) => c1.localeCompare(c2))

    for (const countyName of sortedCounties) {

        /* Add a new county listing section to the sidebar. */
        const county = counties.appendChild(document.createElement('div'));
        /* Assign the `item` class to each listing for styling. */
        county.className = 'item';

        /* Add the link to the individual listing created above. */
        const link = county.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.id = `${countyName}`;
        link.innerHTML = `${countyName}`

    }
    /**
      * Uses event delegation to listen for clicks on list items
      * Build meeting list for the county and add markers to map
      **/

    counties.addEventListener('click', function(event) {
        // ignore if not clicking on link
        if(!event.target.matches('.title')) return
        event.preventDefault();

        // hide counties list when a county is clicked
        counties.style.display = 'none'

        const meetingList = countyList[event.target.id]

        /* Fly to general are of listings*/
        flytoMeeting(meetingList[0].geometry.coordinates, 8)
        buildLocationList(meetingList)
        addMarkers(meetingList)
    }, false)
    return countyList
}

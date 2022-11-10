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


// Sort meeting list to organize meetings by county
function getMeetingsByCounty(meetings) {
    // For each meeting in the meeting list,
    return meetings.reduce((meetingsByCounty, item) => {

        // get the county the meeting is in,
        // TODO:  change goverment to county in meetings.json
        const county = item.properties.county;

        // if (county !== "") {
        if (county) {
            // Adds the meeting to the
            if (!meetingsByCounty[county]) {
                meetingsByCounty[county] = [{properties: {...item.properties}, geometry: {...item.geometry}}];
            } else {
                meetingsByCounty[county].push({properties: {...item.properties}, geometry: {...item.geometry}});
            }
        }
        return meetingsByCounty;
    }, []);
}

// Adds
function addCountysToMap(meetingList) {
    const countyList = getMeetingsByCounty(meetingList)
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

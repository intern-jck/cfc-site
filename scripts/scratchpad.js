
// /**
//  * Wait until the map loads to make changes to the map.
//  */
map.on('load', () => {
  buildLocationList(meetings);
  addMarkers(meetings);
  console.log('map loaded');

  .then(moreMeetings => {

    // https://docs.mapbox.com/help/glossary/geojson/
      map.addSource('morePlaces', {
          'type': 'geojson',
          'data': moreMeetings
      });
      buildCountyList(moreMeetings)
  })
  .catch((error) => {
    console.log('failed to get meetings', error)
  });

});



        // create a new accordian item for the county,
        const countyAccordionItem = document.createElement('div');
        countyAccordionItem.className = 'accordion-item';

        // Add the header for the accordion item.
        const accordionHeader = document.createElement('h4');
        accordionHeader.className = 'accordion-header';
        // Should refactor to convert spaces to hyphens and lowercase letters.
        accordionHeader.id = countyName;
        console.log(countyName)
        // The button will expand and collapse the accordion item.
        const accordionButton = document.createElement('button');
        accordionButton.className = 'accordion-button';
        accordionButton.type = 'button';
        accordionButton.dataset.bsToggle = 'collapse';
        accordionButton.dataset.bsTarget = `#${countyName}-body`;
        // accordionButton.ariaExpanded = false;
        accordionButton.setAttribute('aria-expanded', false);
        accordionButton.setAttribute('aria-controls', `${countyName}-body`);
        // accordionButton.ariaControls = `${countyName}-body`;
        accordionButton.textContent = countyName;
        accordionHeader.appendChild(accordionButton);
        countyAccordionItem.appendChild(accordionHeader);

        // The accordion body will contain the meetings for the county.
        const accordionBodyDiv = document.createElement('div');
        accordionBodyDiv.id = `${countyName}-body`;        
        accordionBodyDiv.className = 'accordion-collapse collapse';
        // accordionBodyDiv['aria-labelledby'] = countyName;
        // accordionBodyDiv['data-bs-parent'] = '#county-list';
        // accordionBodyDiv.ariaLabelledBy = countyName;
        accordionButton.setAttribute('aria-labelledby', countyName);
        accordionBodyDiv.dataset.bsParent = '#county-list';

        // // Which will be rendered as buttons which will show the info for
        // // that meeting when clicked.
        const accordionBody = document.createElement('div');
        accordionBody.className = 'accordion-body';
        accordionBody.textContent = 'test';
        accordionBodyDiv.appendChild(accordionBody);
        countyAccordionItem.appendChild(accordionBodyDiv);

        // // for (let meeting of meetingsByCountyList[countyName]) {
        // //     // console.log(meeting);
        // //     const meetingButton = document.createElement('button');
        // //     meetingButton.tectContent = meeting.properties.publicbody;
        // //     accordionBodyDiv.appendChild(meetingButton);
        // // }

        
        // const accordionBodyHeader = document.createElement('h3');
        // console.log(meetingsByCountyList[countyName])
        // accordionBodyHeader.textContent = meetingsByCountyList[countyName].properties.publicbody;
        // accordionButton['aria-controls'] = 'collapseOne';
        // accordionButton['aria-expanded'] = 'true';
        

        // Add the accordion item to the DOM.
        // countyAccordion.appendChild(accordionBodyDiv);
        countiesDiv.appendChild(countyAccordionItem);
        







// /**
//  * Add a marker to the map for every meeting listing.
//  **/
// function addMarkers(meetings) {
//     /* For each feature in the GeoJSON object above: */
//     for (const marker of meetings) {
//         /* Create a div element for the marker. */
//         const el = document.createElement('div');
//         /* Assign a unique `id` to the marker. */
//         el.id = `marker-${marker.properties.id}`;
//         /* Assign the `marker` class to each marker for styling. */
//         el.className = 'marker';

//         /**
//           * Create a marker using the div element
//           * defined above and add it to the map.
//           **/
//         new mapboxgl.Marker(el, { offset: [0, -23] })
//             .setLngLat(marker.geometry.coordinates)
//             .addTo(map);

//         /**
//           * Listen to the element and when it is clicked, do three things:
//           * 1. Fly to the point
//           * 2. Close all other popups and display popup for clicked meeting
//           * 3. Highlight listing in sidebar (and remove highlight for all other listings)
//           **/
//         el.addEventListener('click', (e) => {
//             /* Fly to the point */
//             flytoMeeting(marker.geometry.coordinates, 15);
//             /* Close all other popups and display popup for clicked meeting */
//             createPopUp(marker);
//             /* Highlight listing in sidebar */
//             const activeItem = document.getElementsByClassName('active');
//             e.stopPropagation();
//             if (activeItem[0]) {
//                 activeItem[0].classList.remove('active');
//             }
//             const listing = document.getElementById(
//                 `listing-${marker.properties.id}`
//             );
//             listing.classList.add('active');
//         });
//     }
// }

// /**
//   * Clear the map of markers and zoom back out
//   * Remove popup
//   */
//   function removeAllMarkers() {
//     const markers = document.querySelectorAll('.marker')
//     const popup = document.querySelector('.mapboxgl-popup')
//     if(popup) popup.remove()
//     for(const marker of markers) {
//         marker.remove()
//     }
//     flytoMeeting();
//   }

// /**
//   * Builds and returns a full meeting list separated by county
// **/


// /**
//   *  Back button handles re-showing the county list
//   *  Removes previous meeting listings and each event handler
//   *  Removes markers from maps
//   *  String with selector type is required for now
//   *  Future: pass the elements as arguments
//   **/
// function backButton(showElem, parentElem, removeEle) {
//     const listings = document.querySelector(parentElem)
//     const backButton = listings.appendChild(document.createElement('div'))
//     backButton.className = 'item'

//     /* Make the back button a link for accessibility */
//     const link = backButton.appendChild(document.createElement('a'))
//     link.href = '#'
//     link.className = 'title'
//     link.id = 'Back'
//     link.innerText = '< Back to Counties'


//     backButton.addEventListener('click', () => {
//         document.querySelector(showElem).style.display = 'block'
//         removeAllMarkers();
//         const collection = listings.querySelectorAll(removeEle)
//         for (const elem of collection) {
//             elem.parentNode.removeChild(elem)
//         }
//     })
// }

// /**
//   * Add a listing for each meeting to the sidebar.
//   **/
// function buildLocationList(meetings) {
//     /* Add back button to top of list to nav back to counties */
//     backButton('#counties', '#listings', '.item')

//     /* Continue to add meeting listings */
//     for (const meeting of (meetings)) {
//         /* Add a new listing section to the sidebar. */
//         const listings = document.getElementById('listings');
//         const listing = listings.appendChild(document.createElement('div'));
//         /* Assign a unique `id` to the listing. */
//         listing.id = `listing-${meeting.properties.id}`;
//         /* Assign the `item` class to each listing for styling. */
//         listing.className = 'item';

//         /* Add the link to the individual listing created above. */
//         const link = listing.appendChild(document.createElement('a'));
//         link.href = '#';
//         link.className = 'title';
//         link.id = `link-${meeting.properties.id}`;
//         link.innerHTML = `${meeting.properties.publicbody}`;

//         /* Add details to the individual listing. */
//         const details = listing.appendChild(document.createElement('div'));
//         details.innerHTML = `${meeting.properties.location}`;
//         if (meeting.properties.phone) {
//             details.innerHTML += ` &middot; ${meeting.properties.phoneFormatted}`;
//         }

//         /**
//           * Listen to the element and when it is clicked, do four things:
//           * 1. Update the `currentFeature` to the meeting associated with the clicked link
//           * 2. Fly to the point
//           * 3. Close all other popups and display popup for clicked meeting
//           * 4. Highlight listing in sidebar (and remove highlight for all other listings)
//           **/
//         link.addEventListener('click', function () {
//             for (const feature of meetings) {
//                 if (this.id === `link-${feature.properties.id}`) {
//                     flytoMeeting(feature.geometry.coordinates, 15);
//                     createPopUp(feature);
//                 }
//             }
//             const activeItem = document.getElementsByClassName('active');
//             if (activeItem[0]) {
//                 activeItem[0].classList.remove('active');
//             }
//             this.parentNode.classList.add('active');
//         });
//     }

// }

// /**
//   * Use Mapbox GL JS's `flyTo` to move the camera smoothly
//   * a given center point.
//   * Defaults: coords = center of State, zoomLevel = state in focus
//   **/
// function flytoMeeting(coords = stateCoords, zoomLevel = defaultZoom) {
//     map.flyTo({
//         center: coords,
//         zoom: zoomLevel
//     });
// }

// /**
//   * Create a Mapbox GL JS `Popup`.
//   **/
// function createPopUp(currentFeature) {
//     const popUps = document.getElementsByClassName('mapboxgl-popup');
//     if (popUps[0]) popUps[0].remove();
//     const popup = new mapboxgl.Popup({ closeOnClick: false })
//         .setLngLat(currentFeature.geometry.coordinates)
//         .setHTML(
//             `<h3><center>${currentFeature.properties.publicbody}</center></h3>
//                         <h4>
//                         <table>
//                         <tr>
//                         <th><center>Government</center></th>
//                         <th><center>Public Body</center></th>
//                         <th><center>Location</center></th>
//                         </tr>
//                         <tr>
//                         <td><center>${currentFeature.properties.government}</center></td>
//                         <td><center>${currentFeature.properties.publicbody}</center></td>
//                         <td><center>${currentFeature.properties.location}</center></td>
//                         </tr>
//                         <tr>
//                         <th><center>Address</center></th>
//                         <th><center>Schedule</center></th>
//                         <th><center>Start Time</center></th>
//                         </tr>
//                         <tr>
//                         <td><center>${currentFeature.properties.address}</center></td>
//                         <td><center>${currentFeature.properties.schedule}</center></td>
//                         <td><center>${currentFeature.properties.start}</center></td>
//                         </tr>
//                         <tr>
//                         <th><center>End Time</center></th>
//                         <th><center>Remote Options</center></th>
//                         </tr>
//                         <tr>
//                         <td><center>${currentFeature.properties.end}</center></td>
//                         <td><center>${currentFeature.properties.remote}</center></td>
//                         </h4>`
//         )
//         .addTo(map);
// }

// //adding zoom and rotation controls to map
// map.addControl(new mapboxgl.NavigationControl());

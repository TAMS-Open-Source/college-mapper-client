import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Marker from 'react-leaflet-enhanced-marker';
import styled from 'styled-components';

import CustomPopup from 'components/Popup';

import { getCollegesInBox }from 'util/api';
import COLORS from 'util/colors';
import ControlContext from 'util/controlContext';
import Rankings from 'util/rankings';
import { ALL_COLLEGES } from 'util/filterChoices';

const DEFAULT_LOCATION = { lat: 38.0, lon: -97.7548 }
const TESTING_LOC = { lat: 33.2101, lon: -97.7548 }

function MapView() {
  const [currentLoc, setCurrentLoc] = useState(DEFAULT_LOCATION)
  const [zoom, setZoom] = useState(5);
  const [map, setMap] = useState()
  const [bounds, setBounds] = useState()
  const [colleges, setColleges] = useState([]);
  const { filter } = React.useContext(ControlContext);

  useEffect(() => {
    if (map) {
      map.on('moveend', handleMoveEnd);
      map.on('movestart', handleMoveStart)
      // by returning this, we ensure we don't get much more movement
      // actions than necessary.
      return () => {
        map.removeEventListener("moveend", handleMoveEnd)
      }
    }
  }, [map]);

  // this is where we'll continually update which markers can be shown
  const handleMoveEnd = () => {
    setBounds(map.getBounds())
  }

  const handleMoveStart = () => {
    if (map) {
      map.closePopup();
    }
  }

  useEffect(() => {
    if (!bounds && map) {
      setBounds(map.getBounds())
    }
  }, [map])

  // watch bounds
  useEffect(() => {
    if (filter === ALL_COLLEGES) {
      if (!bounds) {
        return;
      }
      const sw = bounds._southWest;
      const ne = bounds._northEast;
      getCollegesInBox(sw.lat, sw.lng, ne.lat, ne.lng).then(colleges => {
        setColleges(colleges);
      });
    } else {
      console.log(Rankings[filter])
      setColleges(Rankings[filter])
    }
  }, [bounds, filter])

  
  return (
    <>
    <MapContainer 
      zoom={zoom} 
      center={currentLoc} 
      whenCreated={map => setMap(map)}
      style={{ 
        height: '100%', 
        width: '100%', 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        zIndex: 0 
      }} 
      zoomControl={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <ZoomControl position="bottomleft" />
      {colleges.map((college, ind) => (
        <Marker
          
          key={ind}
          icon={<PopulatedIndicator num={ind+1} />}
          position={[
            college.lat,
            college.lon
          ]}
          eventHandlers={{
            mouseover: (e) => {
              e.target.openPopup();
            }
          }}
        >
          <Popup maxWidth={"250"} autoPan={false}>
            <CustomPopup id={college.unitid} onMore={() => {
              if (map) {
                map.flyTo([college.lat, college.lon], 14)
              }
            }}/>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </>
  )
}

const PopulatedIndicator = ({num}) => (
  <Indicator>{num}</Indicator>
)

const IND_WIDTH = 30;
const Indicator = styled.div`
  height: ${IND_WIDTH}px;
  width: ${IND_WIDTH}px;
  border-radius: ${IND_WIDTH}px;
  border: 3px solid ${COLORS.BLUE};
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.BLUE};
  font-size: 18px;
  font-weight: 600;
  transform: translateX(${IND_WIDTH + 1.5}px) translateY(16px);
`

export default MapView;
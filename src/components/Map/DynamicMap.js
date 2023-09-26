import { useEffect, useState } from "react";
import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Button from '@components/Button';

import styles from "./Map.module.scss";

const { useMapEvents, MapContainer, Marker, Popup } = ReactLeaflet;

const Map = ({ children, className, width, height, loadPins, ...rest }) => {
  let mapClassName = styles.map;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  useEffect(() => {
    (async function init() {
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
        iconUrl: "leaflet/images/marker-icon.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
      });
    })();
  }, []);

  return (
    <MapContainer className={mapClassName} {...rest}>
      {children(ReactLeaflet, Leaflet)}
      <NewMarker loadPins={loadPins} />
    </MapContainer>
  );
};

import myStyles from "@styles/Home.module.scss";
import { useComposeDB } from '../../hooks/useComposeDB'

function NewMarker({ loadPins }) {
  const [position, setPosition] = useState(null)
  const [isAdding, setAdding] = useState(false)
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })

  const { compose, isAuthenticated } = useComposeDB()

  async function addPin(position, event) {
    setAdding(true)
    console.log(position);
    event.preventDefault();
    const name = event.target.elements[0].value;
    const description = event.target.elements[1].value;
    const tag = event.target.elements[2].value;

    const update = await compose.executeQuery(`
       mutation {
         createPin(input: {
           content: {
             name: "${name}",
             description: "${description}",
             tag: "${tag}",
             lat: ${position.lat},
             lon: ${position.lng},
           }
         }) {
           document { lat, lon }
         }
       }
      `);
    console.log('update result', update);
    await loadPins();
    setAdding(false);
  }

  const popup = isAdding ? null : (
    <Popup>
      <form onSubmit={(event) => addPin(position, event)} >
        <label className={myStyles.formLabel}>
          Name:
          <br />
          <input type='text' className={myStyles.formInput} />
        </label>
        <br />
        <label className={myStyles.formLabel}>
          Description:
          <br />
          <textarea className={myStyles.textAreaInput}></textarea>
          <br />
          <label className={myStyles.formLabel}>
            Category:
            <br />
            <select className={myStyles.formSelect}>
              <option value='danger'>Danger</option>
              <option value='interest'>Interest Point</option>
              <option value='food'>Good Food</option>
            </select>
          </label>
          <br />
          <Button >Add to map</Button>
        </label>
      </form>
    </Popup>
  )


  return position === null ? null : (
    <Marker position={position}>
      {popup}
    </Marker>
  )
}


export default Map;


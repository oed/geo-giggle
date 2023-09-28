import Head from "next/head";
import { useState, useEffect } from "react";

import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";
import Map from "@components/Map";
import PinContent from "@components/PinContent";

import styles from "@styles/Home.module.scss";

import { useComposeDB } from "../hooks/useComposeDB";

const DEFAULT_CENTER = [19.413894958323255, -99.17421357377354];
const DESCRIPTION =
  "GeoJiggle is a user-friendly, decentralized platform for collaborative and interactive mapping experiences.";

export default function Home() {
  const { compose, isAuthenticated } = useComposeDB();
  const [tags, setTags] = useState({
    "danger": true,
    "interest": true,
    "food": true,
  });

  const [pins, setPins] = useState([]);
  async function loadPins() {
    const tagList = Object.keys(tags).flatMap((k) => tags[k] ? [k] : []);
    const input = { where: { tag: { in: tagList } } };
    const pins = await compose.executeQuery(`
        query($input: PinFiltersInput) {
          pinIndex(first:100, filters: $input) {
            edges {
              node {
                id
                name
                description
                tag
                lat
                lon
                author { id }
              }
            }
          }
      }`, { input });
    if (pins.data && pins.data.pinIndex) {
      setPins(pins.data.pinIndex.edges.map((edge) => edge.node));
    } else {
      setPins([])
    }
  }

  const [loc, setLoc] = useState(null)
  async function loadLocation() {
    const { coords: { latitude, longitude } } = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    setLoc([latitude, longitude])
  }


  useEffect(() => {
    loadPins()
  }, [tags])

  useEffect(() => {
    loadLocation()
  }, [])


  const [newMarker, setNewMarker] = useState(false);

  return (
    <Layout newMarker={newMarker} setNewMarker={setNewMarker} tags={tags} setTags={setTags}>
      <Head>
        <title>GeoJiggle</title>
        <meta name='description' content={DESCRIPTION} />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Section>
        <Container>
          <Map className={styles.homeMap} center={loc || DEFAULT_CENTER} zoom={15} loadPins={loadPins} newMarker={newMarker} setNewMarker={setNewMarker}>
            {({ TileLayer, Marker, Popup, CircleMarker }, { Icon }) => (
              <>
                <TileLayer
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {loc && <CircleMarker center={loc} radius={4} />}
                {
                  pins.map((pin) => {
                    const colorMod = (new TextEncoder()).encode(pin.tag).join('')
                    const icon = new Icon.Default({ className: `color-${colorMod}` })

                    const styleSheet = document.createElement("style")
                    styleSheet.innerText += `
                      .color-${colorMod} { filter: hue-rotate(${colorMod%999}deg); }
                    `
                    document.head.appendChild(styleSheet)

                    return (
                      <Marker position={[pin.lat, pin.lon]} key={pin.id} icon={icon} style="234">
                        <Popup>
                          <PinContent pin={pin} />
                        </Popup>
                      </Marker>
                    )
                  })
                }
              </>
            )}
          </Map>
        </Container>
      </Section>
    </Layout>
  );
}


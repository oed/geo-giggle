import Head from "next/head";
import { useState, useEffect } from "react";

import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";
import Map from "@components/Map";

import styles from "@styles/Home.module.scss";

import { useComposeDB } from "../hooks/useComposeDB";

const DEFAULT_CENTER = [19.413894958323255, -99.17421357377354];
const DESCRIPTION =
  "GeoJiggle is a user-friendly, decentralized platform for collaborative and interactive mapping experiences.";

export default function Home() {
  const { compose, isAuthenticated } = useComposeDB();

  const [pins, setPins] = useState([])
  async function loadPins() {
    const pins = await compose.executeQuery(`
    query {
      pinIndex(first:100) {
        edges {
          node {
            id
            name
            description
            tag
            lat
            lon
          }
        }
      }
    }`);
    setPins(pins.data.pinIndex.edges.map((edge) => edge.node));
  }

  const [loc, setLoc] = useState(null)
  async function loadLocation() {
    const { coords: { latitude, longitude } } = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    console.log(latitude, longitude)
    setLoc([latitude, longitude])
  }


  useEffect(() => {
    loadPins()
    loadLocation()
  }, [])



  return (
    <Layout>
      <Head>
        <title>GeoJiggle</title>
        <meta name='description' content={DESCRIPTION} />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Section>
        <Container>
          <Map className={styles.homeMap} center={DEFAULT_CENTER} zoom={15} loadPins={loadPins}>
            {({ TileLayer, Marker, Popup, CircleMarker }) => (
              <>
                <TileLayer
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={DEFAULT_CENTER}>
                  <Popup>
                    This is where GeoJiggle was born.
                    <br /> Date: <strong>September 25, 2023</strong>.
                  </Popup>
                </Marker>
                { loc && <CircleMarker center={loc} radius={4} /> }

                <Marker position={[19.406470183927166, -99.17474422883603]}>
                  <Popup>
                    Saltillo. There be tokens.
                    <br />
                    Note: <strong>You need to cross a bridge to get there</strong>.
                  </Popup>
                </Marker>

                <Marker position={[19.41330622370157, -99.17588269083605]}>
                  <Popup>
                    Frida. There be Rust.
                    <br />
                    Note: <strong>It's rumored Frida actually lived here.</strong>.
                  </Popup>
                </Marker>

                {
                  pins.map((pin) => (
                    <Marker position={[pin.lat, pin.lon]} key={pin.id}>
                      <Popup>
                        {pin.name}
                        <br />
                        {pin.description}
                      </Popup>
                    </Marker>
                  ))
                }

              </>
            )}
          </Map>
        </Container>
      </Section>
    </Layout>
  );
}

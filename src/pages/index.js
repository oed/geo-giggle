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

  function getPins() {
    useEffect(() => {
      loadPins()
    }, [])

    return pins
  }

  const loadedPins = getPins();



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
            {({ TileLayer, Marker, Popup }) => (
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
                  loadedPins.map((pin) => (
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
        <LeaderBoard />
      </Section>
    </Layout>
  );
}


function LeaderBoard() {

  const { compose } = useComposeDB();

  const [leaders, setLeaders] = useState([])
  async function loadLeaders() {
    const pins = await compose.executeQuery(`
    query {
      pinIndex(first:100) {
        edges {
          node {
            id
            author {id}
          }
        }
      }
    }`);
    console.log(pins)

    const counts = pins.data.pinIndex.edges.map((edge) => edge.node).reduce((acc, pin) => {
      if (!(pin.author.id in acc)) {
        acc[pin.author.id] = 0;
      }
      acc[pin.author.id] += 1;
      return acc
    }, {});

    console.log(counts)
    setLeaders(Object.keys(counts).map((k) => ({ author: k, count: counts[k] })).sort((a, b) => a.count - b.count))
  }

  function getLeaders() {
    useEffect(() => {
      loadLeaders()
    }, [])

    return leaders
  }

  const leaderComponents = getLeaders();

  return (
    <ol>
      {
        leaderComponents.map((leader) => (
          <li >
            {leader.author} -- {leader.count}
          </li>
        ))
      }
    </ol >
  );
}

import Head from "next/head";
import { useState } from "react";
import { useWalletClient } from "wagmi";

import { DIDSession } from "did-session";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";

import { MapContainer, useMapEvents } from 'react-leaflet';

import styles from "@styles/Home.module.scss";

const DEFAULT_CENTER = [19.413894958323255, -99.17421357377354];
const DESCRIPTION =
  "GeoJiggle is a user-friendly, decentralized platform for collaborative and interactive mapping experiences.";

export default function Home() {
  const { data: walletClient, isError, isLoading } = useWalletClient();

  async function createSession(walletClient) {
    const accountId = await getAccountId(walletClient, walletClient.account.address);
    const authMethod = await EthereumWebAuth.getAuthMethod(walletClient, accountId);
    // change to use specific resource
    const session = await DIDSession.get(accountId, authMethod, { resources: ['*'] })
  }
  if (walletClient) {
    createSession(walletClient);
  }

  return (
    <Layout>
      <Head>
        <title>GeoJiggle</title>
        <meta name='description' content={DESCRIPTION} />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Section>
        <MapContainer className={styles.homeMap} width='800' height='600' center={DEFAULT_CENTER} zoom={15}>
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

              <Marker position={[19.40330622370157, -99.15588269083605]}>
                <Popup>
                  <form>
                    <label className={styles.formLabel}>
                      Name:
                      <br />
                      <input type='text' className={styles.formInput} />
                    </label>
                    <br />
                    <label className={styles.formLabel}>
                      Description:
                      <br />
                      <textarea className={styles.textAreaInput}></textarea>
                      <br />
                      <label className={styles.formLabel}>
                        Category:
                        <br />
                        <select className={styles.formSelect}>
                          <option value='danger'>Danger</option>
                          <option value='interest'>Interest Point</option>
                          <option value='food'>Good Food</option>
                        </select>
                      </label>
                      <br />
                      <Button>Add to map</Button>
                    </label>
                  </form>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </Section>
    </Layout>
  );
}


function LocationMarker() {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click(e) {
      console.log('click');
      setPosition(e.latlng);
      map.flyTo(e.latlng);
    },
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You clicked here</Popup>
    </Marker>
  )
}

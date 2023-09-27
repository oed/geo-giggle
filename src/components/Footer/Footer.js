import React from "react";

import Container from "@components/Container";
import GeoJiggleModal from "@components/Modal";
import Button from "react-bootstrap/Button";
import Image from "next/image";

import styles from "./Footer.module.scss";

import { useComposeDB } from "../../hooks/useComposeDB";

const Footer = ({ newMarker, setNewMarker, ...rest }) => {
  const [modalShow, setModalShow] = React.useState(false);
  
  const { compose, isAuthenticated } = useComposeDB();
  
  return (
    <footer className={styles.footer} {...rest}>
      {isAuthenticated ?
        newMarker ?
          <span>Click anywhere on the map to place marker</span>
          : <Image src='/new-pin.png' alt='GeoJiggle' width={32} height={32} onClick={() => setNewMarker(true)} />
        : null
      }
      <Container className={`${styles.footerContainer} ${styles.footerLegal}`}>
        <GeoJiggleModal />
        <Button variant='primary' onClick={() => setModalShow(true)}>
          Leaderboard
        </Button>

        <GeoJiggleModal title='Leaderboard' show={modalShow} onHide={() => setModalShow(false)} />
      </Container>
    </footer>
  );
};

export default Footer;

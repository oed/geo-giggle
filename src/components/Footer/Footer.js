import React from "react";

import Container from "@components/Container";
import GeoJiggleModal from "@components/Modal";
import Button from "react-bootstrap/Button";

import styles from "./Footer.module.scss";

const Footer = ({ ...rest }) => {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <footer className={styles.footer} {...rest}>
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

import React from "react";

import Container from "@components/Container";
import GeoJiggleModal from "@components/Modal";
import Button from "react-bootstrap/Button";
import Image from "next/image";

import styles from "./Footer.module.scss";

import { useComposeDB } from "../../hooks/useComposeDB";
import Leaderboard from "@components/Leaderboard";
import TagFilter from "@components/TagFilter";

const Footer = ({ newMarker, setNewMarker, tags, setTags, ...rest }) => {
  const [leaderModalShow, setLeaderModalShow] = React.useState(false);
  const [filterModalShow, setFilterModalShow] = React.useState(false);

  const { compose, isAuthenticated } = useComposeDB();

  return (
    <footer className={styles.footer} {...rest}>
      <Container className={`${styles.footerContainer} ${styles.footerLegal}`}>
        {isAuthenticated ?
          newMarker ?
            <span>Click anywhere on the map to place marker</span>
            : <Image src='/new-pin.png' alt='GeoJiggle' width={32} height={32} onClick={() => setNewMarker(true)} />
          : null
        }
        <Button variant='primary' onClick={() => setLeaderModalShow(true)}>
          Leaderboard
        </Button>
        <Button variant='primary' onClick={() => setFilterModalShow(true)}>
          Filters
        </Button>

        <GeoJiggleModal title='Leaderboard' show={leaderModalShow} onHide={() => setLeaderModalShow(false)} >
          <Leaderboard />
        </GeoJiggleModal>
        <GeoJiggleModal title='Filters' show={filterModalShow} onHide={() => setFilterModalShow(false)} >
          <TagFilter tags={tags} setTags={setTags} />
        </GeoJiggleModal>
      </Container>
    </footer>
  );
};

export default Footer;

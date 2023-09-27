import Container from "@components/Container";
import Image from "next/image";

import styles from "./Footer.module.scss";

import { useComposeDB } from "../../hooks/useComposeDB";

const Footer = ({ newMarker, setNewMarker, ...rest }) => {

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
        <p>&copy; GeoJiggle {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
};

export default Footer;

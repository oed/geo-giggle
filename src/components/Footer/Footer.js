import Container from "@components/Container";
import Image from "next/image";

import styles from "./Footer.module.scss";

const Footer = ({ ...rest }) => {
  return (
    <footer className={styles.footer} {...rest}>
      <Image src='/new-pin.png' alt='GeoJiggle' width={32} height={32} />
      <Container className={`${styles.footerContainer} ${styles.footerLegal}`}>
        <p>&copy; GeoJiggle {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
};

export default Footer;

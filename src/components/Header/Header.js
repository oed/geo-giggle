import Link from "next/link";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";

import Container from "@components/Container";

import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Image src='/geojiggle-logo.png' alt='GeoJiggle' width={32} height={32} />
          &nbsp;&nbsp;
          <Link href='/'>GeoJiggle</Link>
        </p>
        <ul className={styles.headerLinks}>
          <w3m-button balance='hide' />
        </ul>
      </Container>
    </header>
  );
};

export default Header;

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import Container from "@components/Container";

import styles from "./Header.module.scss";

const Header = () => {
  useEffect(() => {
    const element = document.getElementById("jiggleElement");

    const addJiggle = () => {
      element.classList.add(styles.jiggle);
      setTimeout(removeJiggle, 1000); // Jiggle for 1 second
    };

    const removeJiggle = () => {
      element.classList.remove(styles.jiggle);
      const randomTime = Math.floor(Math.random() * 10000) + 5000; // Random time between 5 and 15 seconds
      setTimeout(addJiggle, randomTime);
    };

    addJiggle();

    return () => {
      clearTimeout(addJiggle);
      clearTimeout(removeJiggle);
    };
  }, []);

  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Image src='/geojiggle-logo.png' alt='GeoJiggle' width={32} height={32} id='jiggleElement' />
          &nbsp;&nbsp;
          <Link href='/'>GeoJiggle</Link>
        </p>
        <w3m-button balance='hide' />
      </Container>
    </header>
  );
};

export default Header;

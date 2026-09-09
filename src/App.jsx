import React from 'react'
import Navbar from './components/Navbar.jsx'
import LeftColumn from './components/LeftColumn.jsx'
import RegistrationForm from './components/RegistrationForm.jsx'
import Footer from './components/Footer.jsx'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <Navbar />

      <main className={styles.main} id="home">
        <div className={styles.container}>
          <div className={styles.layout}>
            <LeftColumn />
            <section className={styles.right} aria-label="Registration form">
              <RegistrationForm />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

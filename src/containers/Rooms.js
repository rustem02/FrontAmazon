import React, { useState } from 'react'
import Navbar from '../components/Navbar'

export default function Rooms() {
  const [tab, setTab] = useState(1);

  return (
    <div className='rooms'>
      <Navbar/>
      <div className='rooms-container'>
        <div className='profile-nav' id='profile-nav'>
          <button className={tab === 1 ? 'active' : ''} onClick={() => setTab(1)}>
            Dormitory Infrastructure
          </button>
          <button className={tab === 2 ? 'active' : ''} onClick={() => setTab(2)}>
            Student Life
          </button>
        </div>

        {tab === 1 && (
          <>
            <section className='dorm-information'>
              <header className='dorm-information-header'>
                <div className="title-main">
                  <h1>University Dormitories in Kazakhstan</h1>
                  <p>
                    A unified model for infrastructure, document workflow, booking, and settlement operations.
                    Each university can adapt local rules while preserving one digital process.
                  </p>
                </div>
                <div className="dorm-img">
                  <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80" alt="Dormitory campus"/>
                </div>
              </header>
            </section>

            <section className='numeric-data-dorm'>
              <div className='data-dorm-item'>
                <h4>Building management</h4>
                <h1>4+</h1>
                <p>Multiple dormitory buildings can be managed in one platform instance.</p>
              </div>
              <div className='data-dorm-item'>
                <h4>Seat monitoring</h4>
                <h1>24/7</h1>
                <p>Real-time seat status is visible for students and administrators.</p>
              </div>
              <div className='data-dorm-item'>
                <h4>Verification gate</h4>
                <h1>1-step</h1>
                <p>Booking access depends on verified documents and admission status.</p>
              </div>
              <div className='data-dorm-item'>
                <h4>Digital cycle</h4>
                <h1>E2E</h1>
                <p>Submission, verification, booking, and payment are performed online.</p>
              </div>
            </section>

            <section className='instructional-videos dormitory-review'>
              <h1>Core Dormitory Zones</h1>
              <div className='docSubmissin-instructional instruction-videos-item dormitory-item'>
                <div className='docSubmissin-instructional-content'>
                  <div>
                    <h2>Living & Study Spaces</h2>
                    <p>Shared lounges and quiet study areas improve adaptation and academic routine.</p>
                  </div>
                </div>
                <div className='docSubmissin-instructional-img'>
                  <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80" alt="Living spaces"/>
                </div>
              </div>

              <div className='docSubmissin-instructional instruction-videos-item dormitory-item'>
                <div className='docSubmissin-instructional-img instructional-img-left'>
                  <img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80" alt="Dining zone"/>
                </div>
                <div className='docSubmissin-instructional-content docSubmissin-instructional-content-right'>
                  <div className='content-right'>
                    <h2>Food and Dining</h2>
                    <p>Dining and kitchen zones are part of the standard support environment for students.</p>
                  </div>
                </div>
              </div>

              <div className='docSubmissin-instructional instruction-videos-item dormitory-item'>
                <div className='docSubmissin-instructional-content'>
                  <div>
                    <h2>Health & Well-being</h2>
                    <p>Medical points and safety units remain key components of dormitory services.</p>
                  </div>
                </div>
                <div className='docSubmissin-instructional-img'>
                  <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80" alt="Health services"/>
                </div>
              </div>
            </section>
          </>
        )}

        {tab === 2 && (
          <>
            <section className='social-header'>
              <h1>Student Life in University Dormitories</h1>
              <div className='social-header-container'>
                <div className='social-header-content'>
                  <h2>Events support adaptation, communication, and wellbeing.</h2>
                  <p>Universities use common event formats that help students integrate into campus life.</p>
                </div>
                <div className='social-header-img'>
                  <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80" alt='student life'/>
                </div>
              </div>
            </section>

            <section className='social-life-boxes'>
              <div className='social-box-item'>
                <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80" alt="Orientation"/>
                <div className='social-item-content'>
                  <h3>Orientation Week</h3>
                  <p>Welcome sessions and practical guidance for first-year dorm residents.</p>
                </div>
              </div>
              <div className='social-box-item'>
                <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80" alt="Leadership"/>
                <div className='social-item-content'>
                  <h3>Leadership Day</h3>
                  <p>Team activities that develop communication and responsibility in student groups.</p>
                </div>
              </div>
              <div className='social-box-item'>
                <img src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80" alt="Community"/>
                <div className='social-item-content'>
                  <h3>Community Night</h3>
                  <p>Regular social activities focused on inclusion and student wellbeing.</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <footer className='footer'>
        <div className='footer-header'>
          <div className='footer-logo'>
            <img src={require('../img/logo-nav.png')} alt="footer-logo"/>
          </div>
          <div className='footer-team-name'>
            <p>© 2026 Dorm Hub Kazakhstan</p>
          </div>
          <div className='footer-icons'>
            <img src={require('../img/icons/icon-x.png')} alt="footer-icon1"/>
            <img src={require('../img/icons/icon-insta.png')} alt="footer-icon2"/>
            <img src={require('../img/icons/icon-facebook.png')} alt="footer-icon3"/>
          </div>
        </div>
        <div className='footer-content'>
          <div className='footer-item'>
            <h5>Dorm Hub support:</h5>
            <p>support@dormhub.kz</p>
            <p>(hotline) +7 700 000 0000</p>
          </div>
          <div className='footer-item'>
            <h5>Operations line</h5>
            <p>(mob.) +7 778 727 9567</p>
            <p>(tel.) +7 727 307 9560</p>
          </div>
          <div className='footer-item'>
            <h5>Security and Medical care:</h5>
            <p>(tel.) +7 727 307 9560 | Security</p>
            <p>(mob.) +7 778 997 5839 | Medical care</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

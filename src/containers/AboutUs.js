import React from 'react'
import Navbar from '../components/Navbar'

export default function AboutUs() {
  return (
    <div className='rooms'>
        <Navbar/>
        <div className='rooms-container'>
            <section className='dorm-information'>
                <header className='dorm-information-header'>
                    <div className="title-main">
                        <h1>Dorm Hub Kazakhstan</h1>
                        <p>
                            The platform is designed for digital dormitory operations in universities across Kazakhstan:
                            document submission, verification, room allocation, and payment tracking in one process.
                        </p>
                    </div>
                    <div className="dorm-img">
                        <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80" alt="Student community"/>
                    </div>
                </header>
            </section>
            <section className="main-points main-tasks">
                <h2>Project Mission</h2>
                <div className='main-points-container main-task-container'>
                    <div className="vision main-task-item">
                        <div className='vision-circle'></div>
                        <h3>Transparency</h3>
                        <p>Clear statuses from application to payment for students and dormitory administrators.</p>
                    </div>
                    <div className="mission main-task-item">
                        <div className='mission-circle'></div>
                        <h3>Scalability</h3>
                        <p>One architecture that can serve multiple universities and dormitory policies.</p>
                    </div>
                    <div className="mission main-task-item">
                        <div className='main-task-circle'></div>
                        <h3>Automation</h3>
                        <p>Reduced manual operations in document verification, seat allocation, and notifications.</p>
                    </div>
                    <div className="goal main-task-item">
                        <div className='goal-circle'></div>
                        <h3>Practical Value</h3>
                        <p>A deployment-ready prototype aligned with dissertation goals and reporting requirements.</p>
                    </div>
                </div>
            </section>
            <section className='author-section'>
                <h2>Project Author</h2>
                <div className='author-card'>
                    <div className='author-photo'>
                        <img src={require('../img/Rusya.jpg')} alt="Rustem Nygmet" />
                    </div>
                    <div className='author-content'>
                        <h3>Rustem Nygmet</h3>
                        <h4>Researcher and Full-Stack Developer</h4>
                        <p>
                            The project was designed and implemented as an individual dissertation work.
                            It focuses on creating a unified dormitory booking system suitable for universities across Kazakhstan.
                        </p>
                        <div className='author-tags'>
                            <span>React</span>
                            <span>Django REST</span>
                            <span>JWT Auth</span>
                            <span>Dormitory Workflow Automation</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <footer className='footer'>
             <div className='footer-header'>
                <div className='footer-logo'>
                    <img src={require('../img/logo-nav.png')}  alt="footer-logo"/>
                </div>
                <div className='footer-team-name'>
                    <p>© 2026 Dorm Hub Kazakhstan</p>
                </div>
                <div className='footer-icons'>
                    <img src={require('../img/icons/icon-x.png')}  alt="footer-icon1"/>
                    <img src={require('../img/icons/icon-insta.png')}  alt="footer-icon2"/>
                    <img src={require('../img/icons/icon-facebook.png')}  alt="footer-icon3"/>
                </div>
             </div>
             <div className='footer-content'>
                <div className='footer-item'>
                    <h5>Dorm Hub support:</h5>
                    <p>support@dormhub.kz</p>
                    <p>(hotline) +7 700 000 0000</p>
                </div>
                <div className='footer-item'>
                    <h5>Reception/ plumbing services</h5>
                    <p>(mob.) +7 778 727 9567</p>
                    <p>(tel.) +7 727 307 9560 (int. 704)</p>
                </div>
                <div className='footer-item'>
                    <h5>Security and Medical care:</h5>
                    <p>(tel.) +7 727 307 9560 (int. 199 /197) | Security</p>
                    <p>(mob.) +7 778 997 5839 | Medical care</p>
                </div>
             </div>             
        </footer>
    </div>
  )
}

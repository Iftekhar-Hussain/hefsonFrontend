import TrailerMap from "../TrailerMap/TrailerMap";
import myJson from "../../assets/landingpages/json/61a669c9777b82b07006090f_fold-map-tive-animation.txt";
import anim3 from "../../assets/landingpages/json/animation3.txt";

const Landingpage = () => {
  return (
    <div className="landingpage">
      <body className="dark">
        <div className="page-wrapper">
          <header className="header is--dark sticky p-0">
            <div
              data-animation="default"
              className="navbar w-nav"
              data-easing2="ease"
              data-easing="ease"
              data-collapse="medium"
              role="banner"
              data-no-scroll="1"
              data-duration="400"
              data-doc-height="1"
            >
              <div className="wrapper wrapper--navbar navbar-button">
                <a
                  href="index.html"
                  aria-current="page"
                  className="brand brand--mobile w-nav-brand w--current"
                >
                  <img
                    src="./assets/landingpages/lightLogo.svg"
                    loading="lazy"
                    alt="Tive"
                    className="brand_logo"
                  />
                </a>
                <nav role="navigation" className="navmenu w-nav-menu">
                  <div className="desktop-menu">
                    <a href="solution.html" className="navmenu_link w-nav-link">
                      Solution
                    </a>
                    <div className="dropdown menu-new menu-ix">
                      <div href="#" className="menu_link-nav">
                        <div className="menu-link-wrap down">
                          <div>
                            <p className="menu_p">Products</p>
                          </div>
                          <div className="c-nav_icon">
                            <div className="c-svg w-embed">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                viewBox="0 0 12.694 6.86"
                              >
                                <path
                                  id="Path_33"
                                  data-name="Path 33"
                                  d="M1529.662,3993.818l5.7,4.789,5.7-4.789"
                                  transform="translate(-1529.019 -3993.052)"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-miterlimit="10"
                                  stroke-width="2"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="dropdown-list-menu products">
                        <div className="dropdown-container">
                          <div className="dropdown-wrapper-menu-black">
                            <div className="dropdown_list">
                              <a href="/" className="dropdown_link">
                                Series F 20
                              </a>
                              <a href="/" className="dropdown_link">
                                Series N 29
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown menu-new menu-ix">
                      <div href="#" className="menu_link-nav">
                        <div className="menu-link-wrap down">
                          <div>
                            <p className="menu_p">Industries</p>
                          </div>
                          <div className="c-nav_icon">
                            <div className="c-svg w-embed">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                viewBox="0 0 12.694 6.86"
                              >
                                <path
                                  id="Path_33"
                                  data-name="Path 33"
                                  d="M1529.662,3993.818l5.7,4.789,5.7-4.789"
                                  transform="translate(-1529.019 -3993.052)"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-miterlimit="10"
                                  stroke-width="2"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="dropdown-list-menu industries">
                        <div className="dropdown-container">
                          <div className="dropdown-wrapper-menu-black">
                            <div className="dropdown_list">
                              <a
                                href="food-and-beverage-industries.html"
                                className="dropdown_link"
                              >
                                Food &amp; Beverage
                              </a>
                              <a
                                href="industries/high-value-goods.html"
                                className="dropdown_link"
                              >
                                High-Value Goods
                              </a>
                              <a
                                href="industries/pharmaceutical-industry.html"
                                className="dropdown_link"
                              >
                                Pharmaceutical
                              </a>
                              <a
                                href="industries/transportation-logistics.html"
                                className="dropdown_link"
                              >
                                Transportation &amp; Logistics
                              </a>
                              <a
                                href="industries.html"
                                className="dropdown_link"
                              >
                                View All
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="dropdown menu-new menu-ix">
                      <div href="#" className="menu_link-nav">
                        <div className="menu-link-wrap down">
                          <div>
                            <p className="menu_p">Resources</p>
                          </div>
                          <div className="c-nav_icon">
                            <div className="c-svg w-embed">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                viewBox="0 0 12.694 6.86"
                              >
                                <path
                                  id="Path_33"
                                  data-name="Path 33"
                                  d="M1529.662,3993.818l5.7,4.789,5.7-4.789"
                                  transform="translate(-1529.019 -3993.052)"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-miterlimit="10"
                                  stroke-width="2"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="dropdown-list-menu resources">
                        <div className="dropdown-container">
                          <div className="dropdown-wrapper-menu-black">
                            <div className="dropdown_list">
                              <a
                                href="customer-stories.html"
                                className="dropdown_link"
                              >
                                Customer Stories
                              </a>
                              <a href="blog.html" className="dropdown_link">
                                Blog
                              </a>
                              <a href="events.html" className="dropdown_link">
                                Events &amp; Webinars
                              </a>
                              <a
                                href="education.html"
                                className="dropdown_link"
                              >
                                Education &amp; Training
                              </a>
                              <a href="returns.html" className="dropdown_link">
                                Returns Center
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className="dropdown menu-new menu-ix">
                      <div href="#" className="menu_link-nav">
                        <div className="menu-link-wrap down">
                          <div>
                            <p className="menu_p">Company</p>
                          </div>
                          <div className="c-nav_icon">
                            <div className="c-svg w-embed">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                viewBox="0 0 12.694 6.86"
                              >
                                <path
                                  id="Path_33"
                                  data-name="Path 33"
                                  d="M1529.662,3993.818l5.7,4.789,5.7-4.789"
                                  transform="translate(-1529.019 -3993.052)"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-miterlimit="10"
                                  stroke-width="2"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="dropdown-list-menu company">
                        <div className="dropdown-container">
                          <div className="dropdown-wrapper-menu-black">
                            <div className="dropdown_list">
                              <a href="/" className="dropdown_link">
                                About us
                              </a>
                              <a href="/" className="dropdown_link">
                                Contact
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="navbar_actions">
                    <div className="weglot"></div>
                    <a
                      href="/"
                      target="_blank"
                      className="button button--light-outlined hide-tablet w-inline-block"
                    >
                      <div className="text-block-2">Sign in</div>
                    </a>
                    <a
                      href="/"
                      target="_blank"
                      className="button button--dark-outlined show-tablet w-inline-block"
                    >
                      <div className="text-block-2">Sign in</div>
                    </a>
                    <a
                      href="get-started.html"
                      className="button button--secondary navbar_button w-inline-block"
                    >
                      <div id="1234545" className="tive-nav-text">
                        Contact Sales
                      </div>
                    </a>
                  </div>
                </nav>
                <a
                  id="w-node-b5b0976c-7d6a-0718-94ad-3cf07c8e0532-7c8e04d0"
                  href="get-started.html"
                  className="button button--secondary navbar_button mobile w-inline-block"
                >
                  <div className="text-block">Contact Sales</div>
                </a>
                <div
                  data-w-id="b5b0976c-7d6a-0718-94ad-3cf07c8e0535"
                  className="menu-button w-nav-button"
                >
                  <a href="/" className="hamburger w-inline-block">
                    <div
                      data-is-ix2-target="1"
                      className="hamburger-icon"
                      data-w-id="222f82ee-cfda-f30c-b344-09df7a435df5"
                      data-animation-type="lottie"
                      data-src="./assets/landingpages/json/61806a5f1cc67d57107c6dd2_lottieflow-menu-nav-09-ffffff-easey.json"
                      data-loop="0"
                      data-direction="1"
                      data-autoplay="0"
                      data-renderer="svg"
                      data-default-duration="2.5"
                      data-duration="0"
                      data-ix2-initial-state="0"
                    ></div>
                  </a>
                </div>
              </div>
              <div className="nav_cover is--light"></div>
              <div className="nav_cover is--dark"></div>
              <div className="nav_cover-white"></div>
              <div className="w-embed w-iframe">
                {/* <!-- Google Tag Manager (noscript) --> */}
                <noscript>
                  {/* <iframe
                    src="/"
                    height="0"
                    width="0"
                    style="display: none; visibility: hidden"
                  ></iframe> */}
                </noscript>
                {/* <!-- End Google Tag Manager (noscript) --> */}
              </div>
            </div>
          </header>
          <main className="main-wrapper">
            <div className="fold wf-section">
              <div className="fold_bg">
                <div className="fold_animation-container">
                  <div
                    className="fold_animation-bg"
                    data-w-id="7f72907a-b908-52f6-85af-ff907ab1f6ce"
                    data-animation-type="lottie"
                    data-src={myJson}
                    // data-src="./assets/landingpages/json/map3.json"
                    data-loop="1"
                    data-direction="1"
                    data-autoplay="1"
                    data-is-ix2-target="0"
                    data-renderer="svg"
                    data-default-duration="60"
                    data-duration="0"
                  ></div>
                  <div className="fold_bg-gradient"></div>
                </div>
                <div className="fold_gradient"></div>
                <div
                  className="fold_animation-card"
                  data-w-id="7f72907a-b908-52f6-85af-ff907ab1f6d1"
                  data-animation-type="lottie"
                  // data-src="./assets/landingpages/json/61a669e63c6c7b39f8caf125_fold-notification-tive-animation.json"
                  data-src={myJson}
                  data-loop="1"
                  data-direction="1"
                  data-autoplay="1"
                  data-is-ix2-target="0"
                  data-renderer="svg"
                  data-default-duration="60"
                  data-duration="0"
                ></div>
              </div>
              <div className="wrapper wrapper--fold">
                <div className="fold_content flex-center bigger">
                  <h1 className="heading smaller-heading">
                    Know where your valuable shipments are.
                    <br />
                    Analyze what condition they are in.
                    <br />
                    Take action in real time.
                  </h1>
                  <p className="subtitle medium gray200">
                    Because every shipment matters.
                  </p>
                  <div className="home-mobile-cta-container hide">
                    <a
                      href="get-started-tive-tag.html"
                      className="button button--secondary navbar_button home-cta w-inline-block"
                    >
                      <div className="text-block">Check our prices</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="desktop-scroll-section wf-section">
              <div class="desktop-scroll">
                <div class="desktop-animation-container">
                  <div
                    data-w-id="abb72d5a-4154-2739-9247-91a36f5a6178"
                    class="scroll-1"
                  >
                    <div class="desktop-animation-1">
                      <div
                        data-is-ix2-target="1"
                        class="animation-1"
                        data-w-id="bd5a443a-6b33-ef91-cb56-2740f8782a14"
                        data-animation-type="lottie"
                        data-src={anim3}
                        data-loop="0"
                        data-direction="1"
                        data-autoplay="0"
                        data-renderer="svg"
                        data-default-duration="10"
                        data-duration="0"
                      ></div>
                    </div>
                  </div>
                </div>
                <div class="desktop-texts-container">
                  <div class="desktop-scroll-1">
                    <div class="wrapper">
                      <p
                        data-w-id="dc1453c7-0ec3-6c1b-711f-79f8dce4047a"
                        style={{ opacity: 0 }}
                      >
                        It starts with the push of a button.
                      </p>
                    </div>
                  </div>
                  <div class="desktop-scroll-2">
                    <div class="wrapper">
                      <p
                        data-w-id="281d93c0-485d-33ba-4e5c-4493d3315d2d"
                        style={{ opacity: 0 }}
                        class="desktop-scroll-2_text"
                      >
                        Get hyper-accurate location in real-time with cellular,
                        GPS, and WiFi.
                      </p>
                    </div>
                  </div>
                  <div class="desktop-scroll-3">
                    <div class="wrapper">
                      <p
                        data-w-id="57c67ad8-d5fa-5a86-7261-4aaf09af640f"
                        style={{ opacity: 0 }}
                        class="desktop-scroll-3_text"
                      >
                        <strong>
                          Receive real-time alerts on shipment conditions such
                          as temperature, light, shock, and more.
                        </strong>
                      </p>
                    </div>
                  </div>
                  <div class="desktop-scroll-4"></div>
                </div>
              </div>
            </div>

            {/* <section className="map">
              <div className="container">
                <TrailerMap />
              </div>
            </section> */}
            {/* <section className="bgimages1 vh-100"></section>
            <section className="bgimages2 vh-100"></section>
            <section className="bgimages3 vh-100"></section> */}
            {/* <section className="bgimages4 vh-100">
              <div className="data text-center">
                <h1>F 20 Series</h1>
                <p>Temperature & Humidity </p>
                <img src="./assets/temperature.png" alt="" />
                <p>- 40°F ~ + 120°F</p>
              </div>
            </section>
            <section className="bgvideo vh-100">
              <video autoplay="autoplay" muted loop id="seriesVideo">
                <source src="./assets/Series_F_20.mp4" type="video/mp4" />
              </video>
            </section> */}

            <section className="banner-container">
              <div className="wrapper">
                <div className="banner banner--blog">
                  <div>
                    <p className="banner_text">
                      Ensure shipments arrive on time and in full
                    </p>
                    <p className="banner_subtitle">
                      Because every shipment matters.
                    </p>
                  </div>
                  <a
                    href="get-started.html"
                    className="button button--secondary w-inline-block"
                  >
                    <div>Contact Sales</div>
                    <div className="button_icon w-embed">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 12L10 8L6 4"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </section>
          </main>
          <footer className="footer">
            <div className="wrapper wrapper--footer">
              <div className="footer_content">
                <div>
                  <a
                    href="index.html"
                    aria-current="page"
                    className="w-inline-block w--current"
                  >
                    <img
                      src="
                      ./assets/landingpages/lightLogo.svg"
                      loading="lazy"
                      height="38"
                      alt=""
                    />
                  </a>
                  <div className="footer_row">
                    <p className="small">Innovating Cold Supply Chain </p>
                    <p className="small">Because every shipment matters.</p>
                    <a
                      href="tel:+1617-631-8483"
                      className="footer-link-block w-inline-block"
                    >
                      <div className="footer-contact dark-text-footer">
                        Contact us at +1 617-631-8483
                      </div>
                    </a>
                    <div className="footer_social">
                      <a
                        href="/"
                        target="_blank"
                        className="footer_social-link w-inline-block"
                      >
                        <i class="fa-brands fa-twitter"></i>
                      </a>
                      <a
                        href="/"
                        target="_blank"
                        className="footer_social-link w-inline-block"
                      >
                        <i class="fa-brands fa-linkedin-in"></i>
                      </a>
                      <a
                        href="/"
                        target="_blank"
                        className="footer_social-link w-inline-block"
                      >
                        <i class="fa-brands fa-youtube"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <nav className="footer_menu">
                  <div className="footer_menu-links">
                    <p className="footer_title">Products</p>
                    <a href="solution.html#tracker" className="footer_link">
                      Tracker
                    </a>
                    <a href="solution.html#application" className="footer_link">
                      Platform
                    </a>
                    <a href="tag.html" className="footer_link">
                      Tive Tag
                    </a>
                  </div>
                  <div className="footer_menu-links">
                    <p className="footer_title">industries</p>
                    <a
                      href="food-and-beverage-industries.html"
                      className="footer_link"
                    >
                      Food &amp; Beverage
                    </a>
                    <a
                      href="industries/high-value-goods.html"
                      className="footer_link"
                    >
                      High-Value Goods
                    </a>
                    <a
                      href="industries/pharmaceutical-industry.html"
                      className="footer_link"
                    >
                      Pharmaceutical
                    </a>
                    <a
                      href="industries/transportation-logistics.html"
                      className="footer_link"
                    >
                      Transportation &amp; Logistics
                    </a>
                    <a href="industries.html" className="footer_link">
                      View All
                    </a>
                  </div>
                  {/* <div className="footer_menu-links">
                    <p className="footer_title">Resources</p>
                    <a href="customer-stories.html" className="footer_link">
                      Customer Stories
                    </a>
                    <a href="blog.html" className="footer_link">
                      Blog
                    </a>
                    <a href="events.html" className="footer_link">
                      Events
                    </a>
                    <a href="education.html" className="footer_link">
                      Education &amp; Training
                    </a>
                    <a href="returns.html" className="footer_link">
                      Returns Center
                    </a>
                  </div> */}
                  <div className="footer_menu-links">
                    <p className="footer_title">COMPANY</p>
                    <a href="company.html" className="footer_link">
                      About Us
                    </a>
                    <a href="contact.html" className="footer_link">
                      Contact
                    </a>
                  </div>
                </nav>
              </div>
              <div className="caption footer_navbar">
                <p>
                  © <span className="year">2023</span> hèfson is a registered
                  trademark of hèfson Inc.
                </p>
                <nav className="footer_navbar-links">
                  <a href="/" target="_blank" className="footer_navlink">
                    Healthcare Disclosure
                  </a>
                  <div>·</div>
                  <a href="privacy-policy.html" className="footer_navlink">
                    Privacy Policy
                  </a>
                  <div>·</div>
                  <a href="terms-of-use.html" className="footer_navlink">
                    Terms of Use
                  </a>
                </nav>
              </div>
            </div>
            <video autoplay="autoplay" muted loop className="bgVideo">
              <source src="./assets/footerbgvideo.mp4" type="video/mp4" />
            </video>
          </footer>
        </div>
      </body>
    </div>
  );
};

export default Landingpage;

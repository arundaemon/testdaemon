import React, { useEffect, useState, useRef } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ReactComponent as IconNavDashboard } from './../assets/icons/icon-nav-menu-dashboard.svg';
import { ReactComponent as IconNavPlanner } from './../assets/icons/icon-nav-menu-planner.svg';
import { ReactComponent as IconSchoolsPlanner } from './../assets/icons/icon-dashboard-nav-schools.svg';

const FooterMenu = props => {
 // const location = useLocation();
  const [tabId, setTabId] = useState(0);
  const [showFooter, setShowFooter] = useState(false)
  let [currentActiveTab, setCurrentActiveTab] = useState(null)
  let dashboardNavRef = useRef(null)
  let plannerNavRef = useRef(null)
  let schoolsNavRef = useRef(null)
  let waveRef = useRef(null)
  const navigate = useNavigate();

  const handleTabChange = (id) => {
    setTabId(id);
    props?.updateTabChange(id);
  }


useEffect(() => {
    
    switch(tabId){
        case 0:
            setCurrentActiveTab(dashboardNavRef?.current);
            break;
        case 1:
            setCurrentActiveTab(plannerNavRef?.current);
            break;
        case 2:
            setCurrentActiveTab(schoolsNavRef?.current);
            break;
        default:
            setCurrentActiveTab(dashboardNavRef?.current);
            break;
    }
    setTimeout(() => {
      setShowFooter(true)
    },100)
    
  },[tabId])

  return (
    <div className="dashboard-footer-menu">

      <Navbar expand="lg" fixed="bottom" className="p-0">
        <Nav
          className="me-auto footerMenu"
          fill
          variant="tabs"
          defaultActiveKey={props?.activeKey}
        //onSelect={selectedTab => openActiveKey(selectedTab)}
        >
            {/* <span className='footer-center-element' />   */}
            {showFooter ? <><div className="wave" ref={waveRef} style={{ 
                    background: `radial-gradient(circle at ${currentActiveTab?.getBoundingClientRect().x + 13}px, transparent, transparent 26px, white 27px, white)`,
                }}>
            </div>      
            </> : <div className="wave" style={{ 
                    background: `#fff`,
                    boxShadow: '0px -2px 4px #00000029'
                }}>
            </div>}
            <span className='footer-strip' />
            <NavItem
                className={`footerMenuItem ` + (tabId === 0  ? ` active` : ``)}
                onClick={() => handleTabChange(0)}
            >
                <div
                    href="#dashboard"
                    className="footer-div"
                >
                    <div style={{ width: 'fit-content', position: 'relative', paddingTop: 5 }}>
                        {tabId === 0 ? <><span className='wave-left'></span>
                        <span className='wave-right'></span>
                        <span className="footer-dot" style={{ left: `${currentActiveTab?.getBoundingClientRect().width/2 - 4}px` }}></span>
                        <span className="footer-dot-wave"></span>
                        </> : ''}
                        <IconNavDashboard ref={dashboardNavRef} className={`iconImage bottom-nav-menu-icon `}/>
                    </div>

                    <div
                        className="bottom-nav-menu-item"
                        style={{ marginBottom: 5 }}
                    >Dashboard</div>
                </div>
            </NavItem>
            <NavItem
                className={`footerMenuItem ` + (tabId === 1  ? ` active` : ``)}
                onClick={() => handleTabChange(1)}
            >
                <div
                    href="#planner"
                    className="footer-div"
                >
                    <div style={{ width: 'fit-content', position: 'relative', paddingTop: 5 }}>
                        {tabId === 1 ? <><span className='wave-left'></span>
                        <span className='wave-right'></span>
                        <span className="footer-dot" style={{ left: `${currentActiveTab?.getBoundingClientRect().width/2 - 4}px` }}></span>
                        <span className="footer-dot-wave"></span>
                        </> : ''}
                        <IconNavPlanner ref={plannerNavRef} className={`iconImage bottom-nav-menu-icon `} />
                    </div>

                    <div
                        className="bottom-nav-menu-item"
                        style={{ marginBottom: 5 }}
                    >Planner</div>
                    </div>
            </NavItem>

            <NavItem
                className={`footerMenuItem ` + (tabId === 2  ? ` active` : ``)}
                //onClick={() => handleTabChange(2)}
                onClick={() => {
                  navigate(`/authorised/school-list`, {
                    state: { currentTabType: 'schools-mobile' },
                  });
                }}
            >
                <div
                    href="#schools"
                    className="footer-div"
                >
                    <div style={{ width: 'fit-content', position: 'relative', paddingTop: 5 }}>
                        {tabId === 2 ? <><span className='wave-left'></span>
                        <span className='wave-right'></span>
                        <span className="footer-dot" style={{ left: `${currentActiveTab?.getBoundingClientRect().width/2 - 4}px` }}></span>
                        <span className="footer-dot-wave"></span>
                        </> : ''}
                        <IconSchoolsPlanner ref={schoolsNavRef} className={`iconImage bottom-nav-menu-icon `}/>
                    </div>

                    <div
                        className="bottom-nav-menu-item"
                        style={{ marginBottom: 5 }}
                    >Schools</div>
                </div>
            </NavItem>
        
          {/* {window.innerWidth <= 375 && (
            <img
              src={activeNavCircle3}
              alt=""
              className="active-dot-footer"
            />
          )}
          {window.innerWidth <= 540 && window.innerWidth > 375 && (
            <img
              src={activeNavCircle5}
              alt=""
              className="active-dot-footer"
            />
          )}
          {window.innerWidth > 540 && (
            <img
              src={activeNavCircle}
              alt=""
              className="active-dot-footer"
            />
          )} */}

        </Nav>
      </Navbar>


    </div>
  );
};

export default React.memo(FooterMenu);

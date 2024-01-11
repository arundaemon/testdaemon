import React from 'react';
import { Link } from 'react-router-dom';
// import "../../../src/index.css";


export default function ManageJourney() {
    return (
        <>
            <section className='mnj-journey-main'>
                <div className='top-card-main'>
                    <div className='card_'>
                        <h2>1</h2>
                        <Link to={'/authorised/create-journey'} className='d-none-first'>
                            <div>Create New Journey</div>
                        </Link>
                    </div>
                    <div className='card_'>
                        <h2>2</h2>
                        <Link to={'/authorised/journey-mapping/new'}>
                            <div>Map Journey to the Cycle</div>
                        </Link>
                    </div>
                    <div className='card_'>
                        <h2>3</h2>
                        <Link to={'/authorised/cycle-stage-mapping/new'}>
                            <div>Map Cycle to the Stage</div>
                        </Link>
                    </div>
                    <div className='card_'>
                        <h2>4</h2>
                        <Link to={'/authorised/edit-status/new'} className='d-none-last'>
                            <div>Map Stage to the Status</div>
                        </Link>
                    </div>
                </div>
                <span className='dotsepration-1 dotsepration'></span>
                <span className='dotsepration-2 dotsepration'></span>
                <span className='dotsepration-3 dotsepration'></span>

                <div className='mnj-journey-nested-card'>
                    <div className='card__ dashed-none'><Link to={'/authorised/journey-management'} className='managecard-dots d-none-first'>Manage a Journey</Link></div>
                    <div className='seceond position-relative'>
                        <div className='card__'><Link to={{pathname:"/authorised/cycle-management"}} 
                         className='managecard-dots'
                         state= {{modalOpen: true}}
                         >Create a Cycle</Link></div>
                        <span className='dotseprator'></span>
                        <div className='card__ dashed-none'><Link to={'/authorised/cycle-management'} className=''>Manage a Cycle</Link></div>
                    </div>
                    <div className='third position-relative'>
                        {/* <div className='card__'><a className='managecard-dots'>Request a Stage</a></div> */}
                        <span className='dotseprator'></span>
                        <div className='card__'><Link 
                        to={{pathname:"/authorised/stage-management"}} 
                        className='managecard-dots'
                        state= {{modalOpen: true}}
                        >Create a Stage</Link></div>
                        {/* <span className='dotseprator dotseprator2'></span>   */}
                        <div className='card__ dashed-none'><Link to={'/authorised/stage-management'} className=''>Manage a Stage</Link></div>
                    </div>
                    <div className='fourth position-relative'>
                        {/* <div className='card__'><a className='managecard-dots d-none-last'>Request a Status</a></div> */}
                        <span className='dotseprator'></span>
                        <div className='card__'><Link to={{pathname:"/authorised/status-management"}}  className='managecard-dots d-none-last'
                        state= {{modalOpen: true}}
                        >Create a Status</Link></div>
                        {/* <span className='dotseprator dotseprator2'></span> */}
                        <div className='card__ dashed-none'><Link to={'/authorised/status-management'} className=''>Manage a Status</Link></div>

                    </div>

                </div>

                <div className='mnj-note'>
                    <h4>Note:</h4>
                    <p>1- You can directly edit a journey by clicking on the required block.</p>

                </div>

            </section>
        </>
    )
}

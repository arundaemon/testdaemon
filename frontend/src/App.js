import Router from './routes';
import ThemeConfig from './theme';
import ReqstInterceptor from './utils/ReqstInterceptor';
import { useIdleTimer } from 'react-idle-timer'
import toast from 'react-hot-toast';
import axios from 'axios';
import { TokenReset } from './utils/tokenReset';
import React, { useEffect, useState } from 'react'
import { getAppVersion } from './config/services/config';
import { useLocation } from 'react-router-dom';
import { Provider,useSelector, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { getUserData } from './helper/randomFunction/localStorage';
import { sendEventToAppPlatform } from './helper/randomFunction/activityData';

import { appReducerActions } from './redux/reducers/appReducer';

const App = () => {
  const [appVersion, setAppVersion] = useState('')
  const routeObj = useLocation();

  const dispatch = useDispatch()
  const appEvents = useSelector(state => state.appEvents)

  const isAuthenticated = localStorage.getItem('UserToken') !== null;
  ReqstInterceptor()
  const onIdle = () => {
    if(!appEvents.appPlatform){
      let accessToken = localStorage.getItem('UserToken')
      if (accessToken) {
        toast('Session Expired, Reload the page!', { duration: Infinity, icon: '⚠️' });
        let eventObj = {
          uuid: getUserData('userData').employee_code?? getUserData('userData').lead_id,
          role: getUserData('userData').crm_role,
          login: false
        }
        sendEventToAppPlatform('loginEvent', eventObj)
        localStorage.clear()
      }
    }
    
  }

  window.updateValue = value => {
    if (value?.platform) {
      dispatch(appReducerActions.appPlatform({appPlatform:true}))
    }
  }

  window.locationTrackingStatus = value => {
    //alert(value)
    if(value){
      dispatch(appReducerActions.eventTrigger({eventFlag:true}))
    }else{
      dispatch(appReducerActions.eventTrigger({eventFlag:false}))
    }
  }

  (function () {
    let token = localStorage.getItem('UserToken')
    if (token) {
      TokenReset(routeObj);
    }  
  })()



  useIdleTimer({
    onIdle,
    timeout: 120 * 60 * 1000, //120 mins
    promptTimeout: 0,
    events: [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove',
      'visibilitychange'
    ],
    immediateEvents: [],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 200,
    element: document,
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: false,
    syncTimers: 0
  })

  // useEffect(() => {
  //   (async function () {
  //     if (isAuthenticated) {
  //       let token = localStorage.getItem('UserToken')
  //       axios.defaults.headers.common['AccessToken'] = token;
  //       await TokenReset();
  //     }
  //     else {
  //       axios.defaults.headers.common['AccessToken'] = null;
  //     }

  //   })();
  // }, [isAuthenticated]);

  /* useEffect(() => {
    if (appVersion) {
      if (appVersion != localStorage.getItem('appVersion') && !window.location.pathname.includes('login') && !window.location.pathname.includes('config-details') && !window.location.pathname.includes('forgot-password') && !window.location.pathname.includes('reset-password')) {
        localStorage.setItem('appVersion', appVersion)
        //window.location.reload(true)
      }
    }
  }, [appVersion])

  useEffect(() => {
    getAppVersion({})
      .then(
        res => {
          if (!localStorage.getItem('appVersion') && !window.location.pathname.includes('login') && !window.location.pathname.includes('config-details') && !window.location.pathname.includes('forgot-password') && !window.location.pathname.includes('reset-password')) {
            localStorage.setItem('appVersion', res?.version)
            //window.location.reload(true)
          }
          if (res?.version != appVersion) {
            setAppVersion(res.version)
          }
        }
      )
  }, [routeObj.key]) */

  return (
    <Provider store={store}>
      <ThemeConfig className="ext">
        <Router />
      </ThemeConfig>
    </Provider>
  );
}

export default App
const redis = require("redis")
const EventSource = require('eventsource');
const config = require('./config');
const { logBdeActivity } = require("./controllers/activityFormControls");
const { getConfig } = require('./functions/configFunctions');
const CallLog = require('../server/models/callLogModel')
module.exports = async (server) => {
    let source; 
    let K_URL
    let interval
    let keepAliveTimer = null; 
    const initDialerStream = async () => {
        //console.log('Init Knowlarity')        
        return getConfig()
            .then(
                dbConfig => {
                    let url = `${config.cfg.KNOWLARITY_STREAM_URL}/update-stream/${dbConfig.data[0].Authorization}/konnect`
                    console.log('Knowlarity URL',url)
                    return url
                    //return  new EventSource(url,{withCredentials:true});            
                }
            )
            .catch(
                err => {
                    console.log('Error',err)
                    return null
                }
            )
    }    

    const connectStreamingApi = async () => {
        source = ""
        gotActivity()
        source = new EventSource(K_URL)        
        source.onopen = (event) => {
            clearInterval(interval)
            console.log('Connect',event)
            interval = setInterval(() => {
                // console.log('State',source.readyState)
            },1000)
        }
        source.onmessage = function (event) {
            gotActivity()
            let data = JSON.parse(event.data) 
            if(['prod'].indexOf(config.cfg.ENVIRONMENT) < 0){
                console.log('Knowlarity',data)
            }           
            switch (data.type) {
                case 'AGENT_CALL':                                
                    //console.log('Agent Call',data)
                    break;
                case 'AGENT_ANSWER':
                    //console.log('AGENT_ANSWER',data)
                    break;
                case 'CUSTOMER_CALL':
                    //console.log('CUSTOMER_CALL',data)
                    break;
                case 'CUSTOMER_ANSWER':
                    //console.log('CUSTOMER_ANSWER',data)
                    break;
                case 'BRIDGE':
                    //console.log('Bridge',data);
                    break;
                case 'HANGUP':
                    //console.log('HANGUP',data);
                    break;
                case 'CDR':
                    //console.log('CDR', data);
                    logBdeActivity(data)
                    break;
                default:
                    console.log('Default', data);
                    break;
            }
            try{
                logCallEvent({eventType:data.type,callId:data.uuid,msgData:event.data})
            }catch(err){
                console.log(err)
            }                        
        }
    }  

    function gotActivity(){
        if(keepAliveTimer != null)clearTimeout(keepAliveTimer);
        keepAliveTimer = setTimeout(connectStreamingApi, 30 * 1000);
    }

    if(['test','prod','dev'].indexOf(config.cfg.ENVIRONMENT) >= 0){
        K_URL = await initDialerStream()
        connectStreamingApi()
    }
    
    const logCallEvent = (event) => {
        return CallLog.create(event)
    }
}
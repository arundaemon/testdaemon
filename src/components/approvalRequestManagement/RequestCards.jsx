import React,{useState} from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import moment from 'moment';
import { useEffect } from 'react';


export default function RequestCards({ requestObj, data }) { //CoupanCards
  const [fileName, setFileName] = useState('');
  console.log(data, 'this is data');

  const getFileName = () => {
    if(data?.billFile){
      const file = data?.billFile?.split('/');
      setFileName(file[file.length - 1]);
      return file[file.length - 1];
    }
    
  }

  useEffect(() => {
    getFileName();
  }, [data]);

  return (
    <>
      <div className="card" style={{
        width: "400px",
        marginRight: "10px",
        marginBottom: "10px",
        border: "1px solid black",
        padding: "10px",
        boxSizing: "border-box",
        textAlign: "left",
        display: "inline - block",
        boxShadow: "0px 0px 8px rgb(0 0 0 / 16%)",
        borderRadius: "8px",
        padding: "20px",
        paddingBottom: "50px",
        margin: "20px",
        border: 'none',
        marginLeft: '8px'

      }}>
        {Object.keys(data).map((key) => {
          console.log(key, "testKey")
          // if (key === 'Visit_Date') {
          //   return (
          //     <p>{key}: {data[key]}</p>
          //   );
          // } else if (key === 'Visit_Time_In' || key === 'Visit_Time_Out') {
          //   return (
          //     <p>{key}: {data[key]}</p>
          //   );
          // } 
          if (key === 'Unit' && data['unitLabel'] && Number(data[key]) !== 0){
            return (
              <p>{data['unitLabel']}: <b style={{ fontWeight: '600' }}>{data[key]}</b></p>
            )
          }
          else if (key === 'billFile' && data[key]){
            return (
              <p>Bill_File: <a href={data[key]} target="_blank" rel="noopener noreferrer">
          {fileName}
              </a></p>
            )
          }
          else if (key === 'unitLabel'){
            return (
              ''
            )
          }
          else if (key === 'Field') {
            return (
              ''
            )
          }
          else if (key === 'Sub_Field') {
            return (
              ''
            )
          }
          else {
            if(key && data[key]){
              return (
                !((key === 'Unit' && Number(data[key])) === 0) ?
                <p>{key}: <b style={{ fontWeight: '600' }}>{data[key]}</b></p>
                : ''
              );
            }
            
            
          }
        })}
      </div>
    </>
  );
};








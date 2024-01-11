import React from 'react';
import moment from 'moment';


export default function CoupanDetailsTable({ requestObj, properties }) {

  const detailsDisplayed = ['requestId', 'requestType', 'createdAt']
  return (
    <table>
      <tbody>
        {detailsDisplayed.map(property => (
          <tr key={property}>
            <td>{property === 'createdAt' ? 'Raised date' : property}</td>
            <td>{property === 'createdAt' ? moment(requestObj[property]).format('DD/MM/YY, (HH:mm A)') : requestObj[property]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

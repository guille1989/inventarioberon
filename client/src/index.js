import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { registerLicense } from '@syncfusion/ej2-base';
import { BrowserRouter } from 'react-router-dom';

registerLicense('Mgo+DSMBaFt+QHFqVk5rXVNbdV5dVGpAd0N3RGlcdlR1fUUmHVdTRHRcQlliSX9Rck1hW3tWd30=;Mgo+DSMBPh8sVXJ1S0d+X1lPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXpSdkRhXXdccnFVRGk=;ORg4AjUWIQA/Gnt2VFhhQlJMfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5Xd0ViW3tWcnZQRGFV;MTY3NDI5NEAzMjMxMmUzMTJlMzMzOGtRY1pIMTkxTDZNQThoNUQzTUZjcHc3ZW9HTldXdU1Yd0lPdWhFUnJRTms9;MTY3NDI5NUAzMjMxMmUzMTJlMzMzOG5EUFlZRlFIeHNZakcxcnhZaXozQ2tqbjhPNTJvSHhXRlN1Nzc0SWVBZGc9;NRAiBiAaIQQuGjN/V0d+XU9HflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TckRjWH1aeHZXQGBeWA==;MTY3NDI5N0AzMjMxMmUzMTJlMzMzOGFwQjQ3UmdKdHZJZ3RnOVJXNEtYTnlwMXlBOXFkNW1Gc1FCeFJmZHdEaUU9;MTY3NDI5OEAzMjMxMmUzMTJlMzMzOEFacjhJT24xZ0R6L3RMMHRDS1BPS1l6bDc1MktqTVUzM05NTWM2Z3l6OUU9;Mgo+DSMBMAY9C3t2VFhhQlJMfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5Xd0ViW3tWcnZTTmlV;MTY3NDMwMEAzMjMxMmUzMTJlMzMzOEgveHRJWnJWdGNsaDBZY0dNMW9Bd0Yvd1B0dDUzN0ZxNUdZMjNndU9iYVk9;MTY3NDMwMUAzMjMxMmUzMTJlMzMzOEJqaC9ZYnkzeDgzZU1PaDZubUJKSzR1Rmg0SFZ5bE56WGkvYkRYZXYyaUU9;MTY3NDMwMkAzMjMxMmUzMTJlMzMzOGFwQjQ3UmdKdHZJZ3RnOVJXNEtYTnlwMXlBOXFkNW1Gc1FCeFJmZHdEaUU9')

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

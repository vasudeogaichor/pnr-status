import React, { useState } from 'react';
import './App.css';

export function PNRHome() {
    const [pnr, setPnr] = useState('');
    const [status, setStatus] = useState([]);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handlePnr = (e) => {
        setPnr(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        if (pnr === '') {
            setError(true);
        } else {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/get_pnr_status/${pnr}`, {
                    method: "GET",
                });
                const resJson = await res.json();
                console.log('resJson - ', resJson)
                if (res.status === 200 && resJson.length) {
                    setPnr('');
                    setError(false);
                    setStatus(resJson);
                } else {
                    setErrorMsg(resJson.res);
                    setError(true);
                }
                setSubmitted(true);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const errorMessage = () => (
        <div style={{ display: error ? '' : 'none', color: 'red' }}>
            <h5>{errorMsg || 'Please enter a PNR'}</h5>
        </div>
    );

    const handleResubmit = () => {
        window.location.reload(false);
    };

    return (
        <div className="main-block">
            <h1>Enter PNR below:</h1>
            <form>
                <hr />
                <input type="text" value={pnr} onChange={handlePnr} required />
                <hr />
                <div className="btn-block">
                    <p>Click below button to find current status of the PNR.</p>
                    {!submitted ? (
                        <button type="submit" onClick={handleSubmit}>
                            Submit
                        </button>
                    ) : (
                        <button type="submit" onClick={handleResubmit}>
                            Go again
                        </button>
                    )}
                </div>
            </form>
            <div className="messages">{errorMessage()}</div>
            {status.length > 0 && (
                <div className="container">
                    <table className="responsive-table">
                        <thead>
                            <tr>
                                <th scope="col">Sr No</th>
                                <th scope="col">Current Status</th>
                                <th scope="col">Booking Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status.map((pass, index) => (
                                <tr key={index}>
                                    <th scope="row">{pass.sr_no}</th>
                                    <td>{pass.current_status}</td>
                                    <td>{pass.booking_status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
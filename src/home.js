import React from 'react';
import { useState } from 'react';
import './App.css';

export function PNRHome() {
    // set for input form
    const [pnr, setPnr] = useState('');
    // state for showing result
    // eslint-disable-next-line no-unused-vars
    const [status, setStatus] = useState([])
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('')
    const [submitted, setSubmitted] = useState(false)

    // Handling the name change
    const handlePnr = (e) => {
        setPnr(e.target.value);
    };

    // handling the submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        if (pnr === '') {
            setError(true);
        } else {
            try {
                let res = await fetch(`http://localhost:8000/get_pnr_status/${pnr}`, {
                    method: "GET",
                });
                let resJson = await res.json();
                if (res.status === 200 && resJson.length) {
                    setPnr('')
                    setError(false);
                    resJson.map(ele => status.push(ele))
                } else {
                    setErrorMsg(resJson.res)
                    setError(true);
                }
                setSubmitted(true)
            } catch (err) {
                console.log(err);
            }
        }
    };

    // Showing error message if error is true
    const errorMessage = (errorMsg) => {
        return (
            <div
                style={{
                    display: error ? '' : 'none',
                }}>
                <h5>
                    {errorMsg ? errorMsg : 'Please enter a PNR'}
                </h5>
            </div>
        );
    };

    const handleResubmit = () => {
        window.location.reload(false);
    }

    return (
        <div class="main-block">
            <h1>Enter PNR below:</h1>
            <form>
                <hr />
                <input type="text" value={pnr} onChange={handlePnr} required />
                <hr />
                <div class="btn-block">
                    <p>Click below button to find current status of the PNR.</p>
                    {!submitted && <button type="submit" onClick={handleSubmit}>Submit</button>}
                    {submitted && <button type="submit" onClick={handleResubmit}>Go again</button>}
                </div>
            </form>
            <div className="messages">
                {errorMessage(errorMsg)}
            </div>
            {status.length ?
                <div class="container">
                    <table class="responsive-table">
                        <thead>
                            <tr>
                                <th scope="col">Sr No</th>
                                <th scope="col">Current Status</th>
                                <th scope="col">Booking Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status.map(pass => 
                            {
                                return(
                                    <tr>
                                    <th scope="row">{pass.sr_no}</th>
                                    <td>{pass.current_status}</td>
                                    <td>{pass.booking_status}</td>
                                </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>
             : null}
        </div>
    )
}
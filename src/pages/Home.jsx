import axios from 'axios'
import moment from 'moment'
import React, { Component } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Loader from './Loader'

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            senderAccountNumber: "",
            amount: "",
            notes: "",
            transactions: []
        }
    }

    componentDidMount() {
        const token = localStorage.getItem("userToken")
        axios({
            method: "POST",
            url: "https://rank-bank-bkqombvhm-codemaine.vercel.app/vertify-token",
            data: {
                accountToken: token
            }
        }).then(data => {
            this.setState({ user: data.data.data })
            console.log(this.state.user);
        }).catch(err => console.log(err))
        
        axios({
            method: "GET",
            url: "https://rank-bank-bkqombvhm-codemaine.vercel.app/view-transactions",
            data: {
                accountToken: token
            },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(data => { 
            console.log(data.data.message)
            switch (data.data.message) {
                case "data found":
                    this.setState({ transactions: data.data.data })
                    console.log(data.data.data);
                    break;
                case "no data found":
                    this.setState({ transactions: [] })
                    break;
                default:
                    break;
            }
         }).catch(err => console.log(err))
    }
    
    copyTextToClipboard(text, e) {
        e.preventDefault();
        /* Get the text field */
  var copyText = document.getElementById("an_field");

  /* Select the text field */
  copyText.select(); 
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);

  toast.success("Account number copied!")
    }

    sendMoney = (e) => {
        e.preventDefault();
        const data = {
            name: this.state.user.name,
            accountNumber: this.state.user.accountNumber,
            senderAccountNumber: this.state.senderAccountNumber,
            amount: this.state.amount,
            notes: this.state.notes,
            timeSent: new Date()
        };
        const token = localStorage.getItem("userToken")

        axios({
            method: "POST",
            url: "https://rank-bank-bkqombvhm-codemaine.vercel.app/send-money",
            headers: {
                "Access-Control-Allow-Origin": true,
                "Authorization": `Bearer ${token}`,
            },
            data
        }).then(data => {
            console.log(data)
            switch (data.data.message) {
                case "money sent successfully":
                    toast.success("Money sent successfully")
                    break;
            
                default:
                    break;
            }
        }).catch(err => console.log(err))
    }
    
    logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("userToken")
        window.location.replace('/login')
    }

    render() {
        if (this.state.user && this.state.transactions) {
            return (
                <div className="container-fluid">
                    <nav className="navbar navbar-light bg-light">
                        <div className="container-fluid">
                            <a href="/" className="navbar-brand">Rank Bank</a>
                            <form className="d-flex">   
                                <input className="form-control me-2" value={this.state.user.accountNumber} readOnly placeholder="Search" id="an_field" aria-label="Search" />
                                <button className="btn btn-outline-success me-1" type="submit" onClick={(e) => this.copyTextToClipboard(this.state.user.accountNumber, e)}>Copy</button>
                                <button className="btn btn-primary" onClick={(e) => this.logout(e)}>Logout</button>
                            </form>
                        </div>
                    </nav>


                    <div className="row">
                        <div className="col">
                            <div className="card col">
                                <div className="card-body">
                                    <h2 className="card-title">Send money</h2>
                                    <form onSubmit={(e) => this.sendMoney(e)}>
                                        <div class="mb-3">
                                            <label for="exampleInputEmail1" class="form-label">Name</label>
                                            <input value={this.state.user.name} type="name" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" readOnly />
                                        </div>
                                        <div class="mb-3">
                                            <label for="exampleInputEmail1" class="form-label">Account Number</label>
                                            <input value={this.state.user.accountNumber} type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" readOnly />
                                        </div>
                                        <div class="mb-3">
                                            <label for="exampleInputEmail1" class="form-label">Sender Account Number</label>
                                            <input type="number" onChange={text => this.setState({ senderAccountNumber: text.target.value })} value={this.state.senderAccountNumber} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                        </div>
                                        <div class="mb-3">
                                            <label for="exampleInputEmail1" class="form-label">Amount</label>
                                            <input type="number" class="form-control" onChange={text => this.setState({ amount: text.target.value })} value={this.state.amount} id="exampleInputEmail1" aria-describedby="emailHelp" />
                                        </div>
                                        <div class="mb-3">
                                            <label for="exampleFormControlTextarea1" class="form-label">Notes</label>
                                            <textarea class="form-control" id="exampleFormControlTextarea1" onChange={text => this.setState({ notes: text.target.value })} value={this.state.notes} style={{ resize: "none" }} rows="3"></textarea>
                                        </div>
                                        <button type="submit" class="btn btn-primary">Send</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="card col-sm-8 col-8" style={{ height: "100vh" }}>
                            <div className="card-body">
                                <h1 className="card-title">Transactions</h1>
                                <div class="row">
                                    {!this.state.transactions.length === 0 ? this.state.transactions.map((item) => {
                                       return (
                                        <div class="col mt-2">
                                        <div className="card" style={{ width: '18rem' }}>
                                            <div className="card-body">
                                                <h5 className="card-title">${item.amount} sent by {item.name}</h5>
                                                <h6 className="card-subtitle mb-2 text-muted">{item.accountNumber}</h6>
                                                <p className="card-text">{item.notes}
                                                    <p className="card-text text-muted fs-6 fw-light">Sent {moment(item.timeSent).fromNow()}</p>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                       )
                                   }):<p>No money sent to your account</p> }
                                </div>
                            </div>
                        </div>
                    </div>
                    <Toaster
                    toastOptions={{
                        success: {
                            duration: 8000
                        }
                    }}
                     />
                </div>

            )
        } else {
            return <Loader />
        }
    }
}

export default Home

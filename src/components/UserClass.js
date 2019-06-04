import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {selectContractInstance } from '../web3';
import Traceability from "../truffle/build/contracts/Traceability";

class UserClass extends Component{

    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            username: '',
            recycle: false,
            dev: [],
            noDev: 0,
            deviceType: '',
            manufacturer: '',
            serial: '',
            model: '',
            deviceUri: '',
            buyer: '0x0'
        };

        this.insertDevice = this.insertDevice.bind(this);
        this.checkDevices = this.checkDevices.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleMananufacturer = this.handleMananufacturer.bind(this);
        this.handleSerial = this.handleSerial.bind(this);
        this.handleModel = this.handleModel.bind(this);
        this.checkRecycled = this.checkRecycled.bind(this);
        this.handleTransfer = this.handleTransfer.bind(this);
        this.transfer = this.transfer.bind(this);
        this.handleBuyer = this.handleBuyer.bind(this);
        this.handleUri = this.handleUri.bind(this);
    }

    async componentDidMount() {
        this.traceability = await selectContractInstance(Traceability);
        this.setState({account : this.props.location.state.account});
        this.setState({username : this.props.location.state.username});
        await this.checkDevices(0);
        await this.checkRecycled();
    }

    async checkRecycled(){
        const users = await this.traceability.addressToUsers(this.state.account);
        if(users[2] === true) {
            this.setState({
                recycle: true
            });
        }
    }

    async checkDevices(first){
        let n = await this.traceability.noDevices();
        for (let i = 0; i < n; i++) {
            const task = await this.traceability.devices(i);
            let id = task[3];
            const owner = await this.traceability.deviceToOwner(id);
            if(first === 0){
                if(owner === this.state.account) {
                    this.setState({
                        dev: [...this.state.dev, task]
                    });
                    this.setState(prevState => {
                        return {noDev: prevState.noDev + 1}
                    })
                }
            }else{
                if(owner === this.state.account && i > this.state.noDev) {
                    this.setState({
                        dev: [...this.state.dev, task]
                    });
                    this.setState(prevState => {
                        return {noDev: prevState.noDev + 1}
                    });
                }
            }
        }
    }

    async insertDevice(){
        try {
            await this.traceability.insertNewDevice(
                String(this.state.deviceType),
                String(this.state.manufacturer),
                String(this.state.serial),
                String(this.state.model),
                {from: this.state.account}
                )
                .then(function(err, ret) {
                    console.log("ret " +ret);
                    console.log("err " + err);
                })
        }catch(e){
            console.log(e);
        }
        await this.checkDevices(1);
    }

    async transfer( _tokenID, _to){
        await this.traceability.transferFrom(this.state.account, _to, _tokenID, {from : this.state.account})
            .then(function(err,ret){
                console.log("ret " +ret);
                console.log("err " + err);
            });
    }

    handleType(event) {
        this.setState({deviceType: event.target.value});
    }

    handleMananufacturer(event) {
        this.setState({manufacturer: event.target.value});
    }

    handleSerial(event) {
        this.setState({serial: event.target.value});
    }

    handleModel(event) {
        this.setState({model: event.target.value});
    }

    handleBuyer(event){
        this.setState({buyer: event.target.value});
    }

    handleUri(event){
        this.setState({deviceUri: event.target.value});
    }

    handleTransfer(event) {
        alert('A device is going to be transferred ');
        event.preventDefault();
        if(this.state.deviceUri === '' || this.state.buyer === '0x0'){
            alert('Device Uri and To must be not empty');
            return null;
        }else {
            for(let i=0; i < this.state.noDev ; i++){
                if(this.state.dev[i][2] === this.state.deviceUri){
                    this.transfer(this.state.dev[i][3], this.state.buyer).then(res =>{
                        console.log(res);
                    });
                }
            }
        }
    }


    handleSubmit(event){
        alert('A  new device was submitted: ');
        event.preventDefault();
        this.insertDevice()
            .then(ret =>{
                console.log(ret);
            });
    }

    render() {
        return (
            <div className="User_class">
                <header>
                    <button onClick={() => this.props.history.push({
                        pathname: "/championship",
                        state: {
                            account: this.state.account,
                            username: this.state.username
                        }
                    })}>
                         Home
                    </button>
                    <h1> {this.state.username} </h1>
                    <img
                        src={require('../user-silhouette.png')}
                        alt=' '
                    />
                </header>
                <br/>
                <div className="device-list">
                    {   (this.state.noDev!== 0)?
                        <div >
                            <div className="transfer">
                                <form >
                                    <label>
                                        Device Uri:
                                        <input
                                            name="deviceUri"
                                            type="text"
                                            value={this.state.deviceUri}
                                            onChange={this.handleUri}
                                        />
                                    </label>
                                    <br/>
                                    <label>
                                        To:
                                        <input
                                            name="buyer"
                                            type="text"
                                            placeholder="Address"
                                            onChange={this.handleBuyer}
                                        />
                                    </label>
                                    <br/>
                                    <button
                                        onClick={this.handleTransfer}
                                    >Transfer</button>
                                </form>
                            </div>
                            <ul>
                                {
                                    this.state.dev.map((dev) => {
                                        return(
                                            <div key={String(dev[3])}  className="list-element">
                                                <label> Device type: {dev[0]} </label>
                                                <br/>
                                                <label> Device Uri: {dev[2]} </label>
                                            </div>
                                        );
                                    })}
                            </ul>
                        </div>:
                        <label>You don't have any device registered yet </label>
                    }
                </div>
                {(this.state.recycle === true) ?
                    <div> </div> :
                    <div className="device-form">
                        <form>
                            <label>
                                Device type:
                                <br/>
                                <input
                                    name="deviceType"
                                    type="text"
                                    value={this.state.deviceType}
                                    onChange={this.handleType}
                                />
                            </label>
                            <br/>
                            <label>
                                Manufacturer:
                                <br/>
                                <input
                                    name="manufacturer"
                                    type="text"
                                    value={this.state.manufacturer}
                                    onChange={this.handleMananufacturer}
                                />
                            </label>
                            <br/>
                            <label>
                                Serial Number:
                                <br/>
                                <input
                                    name="name"
                                    type="text"
                                    value={this.state.serial}
                                    onChange={this.handleSerial}
                                />
                            </label>
                            <br/>
                            <label>
                                Model:
                                <br/>
                                <input
                                    name="model"
                                    type="text"
                                    value={this.state.model}
                                    onChange={this.handleModel}
                                />
                            </label>
                            <br/>
                            <button onClick={this.handleSubmit}>
                                Insert device
                            </button>
                        </form>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(UserClass);
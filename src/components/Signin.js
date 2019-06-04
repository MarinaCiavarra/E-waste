import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import web3 ,{selectContractInstance} from "../web3";
import Traceability from "../truffle/build/contracts/Traceability";

class Sign extends Component {
    constructor(props){
        super(props);
        this.state = {
            value:'',
            isRecycling: false,
            account: '',
            loading: false
        };

        this.handleName = this.handleName.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.insertUser = this.insertUser.bind(this);
    }

    async componentDidMount() {
        this.traceability = await selectContractInstance(Traceability);
    }

    componentWillMount() {
        this.setState({account : this.props.location.state.account});
    }

    handleCheck(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleName(event) {
        this.setState({value: event.target.value});
    }

    async insertUser(){
        await this.traceability.insertNewUser(this.state.account, this.state.value, this.state.isRecycling, {from: web3.eth.accounts[0]} )
            .then(() =>{
                this.setState({loading: false});
            });
        return true;
    }

    handleSubmit(event){
        alert('A name was submitted: ' + this.state.value +' check is ' + this.state.isRecycling);
        event.preventDefault();
        this.insertUser()
            .then(ret =>{
                this.setState({loading:ret})
            });
        this.props.history.push({
            pathname: "/championship",
            state: {
                account: this.state.account,
                username: this.state.value
            }
        })
    }

    render() {
        return(
            <div id="sign">
                <h2>  Your account address is: {this.state.account} </h2>
                <form>
                <label>
                    Name:
                    <input
                        name="name"
                        type="text"
                        value={this.state.value}
                        onChange={this.handleName}
                    />
                </label>
                <br/>
                <br/>
                <label>
                    Recycling Facility :
                    <input
                        name="isRecycling"
                        type="checkbox"
                        value={this.state.isRecycling}
                        onChange={this.handleCheck}
                    />
                </label>
                <br/>
                <br/>
                    <button onClick={this.handleSubmit}>
                        Join!
                    </button>
                </form>
                { this.state.loading ?
                    <div>
                        <img className="load" src={require('../load.gif')} alt="loading..." />
                        <h1>Sending transaction to the Ethereum Blockchain </h1>
                    </div>: <div> </div> }
            </div>
        );
    }
}
export default withRouter(Sign);
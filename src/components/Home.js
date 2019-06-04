import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import web3, {selectContractInstance} from "../web3";
import Traceability from "../truffle/build/contracts/Traceability";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            username: '',
            loading: true,
            userAddress : '0x0',
            registered : false
        };
        this.checkAccount = this.checkAccount.bind(this);
        this.redirectTo = this.redirectTo.bind(this);
    }

    async componentWillMount() {
        this.traceability = await selectContractInstance(Traceability);
        this.setState({loading : false});
        this.setState({account: window.ethereum.selectedAddress});
        await this.checkAccount();
    }

    async checkAccount(){
        await this.traceability.getUserInfo(this.state.account, {from: web3.eth.accounts[0]} )
            .then(info =>{
                if(info[0] === ''){
                    this.setState({registered: false});
                }else{
                    this.setState({registered: true});
                    this.setState({username : info[0]})
                }
            });
    }

    redirectTo(){
        if(this.state.registered === false) {
            this.props.history.push({
                pathname: "/sign",
                state: {
                    account: this.state.account
                }
            })
        }else{
            this.props.history.push({
                pathname: "/championship",
                state: {
                    account: this.state.account,
                    username: this.state.username
                }
            })
        }
    }

    render() {
        if(this.state.loading === true){
            return(
                <div id="load">
                    <img
                        src={require('../load.gif')}
                        alt="loading..."
                    />
                    <h1>Web3 is loading </h1>
                </div>
            );
        }
        return(
            <div id="home">
                <p>
                    We love our planet and we want to do whatever it is possible to save it.
                    Every year different tons of E-waste are generated worldwide. Only a small percentage is reused or
                    recycled.
                    We want to reduce this waste and we have crate this championship to raise awareness in people.
                </p>
                <h2> Would you enter in the E-Waste championship? </h2>
                <button onClick={this.redirectTo}>
                    Let's save the planet!
                </button>
            </div>
        );
    }
}
export default withRouter(Home);
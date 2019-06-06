import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {selectContractInstance} from '../web3';
import Traceability from "../truffle/build/contracts/Traceability.json";

class Championship extends Component{

    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            username: '',
            members: [],
            users: [],
            noUsers: 0
        };
        this.redirectTo = this.redirectTo.bind(this);
    }

    async componentDidMount() {
        this.user = await selectContractInstance(Traceability);
        this.setState({account : this.props.location.state.account});
        this.setState({username : this.props.location.state.username});
        let n = await this.user.noMembers();
        this.setState({noUsers: n});
        for (let i = 0; i < n; i++) {
            const task = await this.user.memberAddresses(i);
            this.setState({
                members: [...this.state.members, task]
            });
            const users = await this.user.addressToUsers(this.state.members[i]);
            if(users[2] === false) {
                /*Only standard user enter the Championship*/
                this.setState({
                    users: [...this.state.users, users]
                });
            }
        }
    }


    redirectTo(){
        this.props.history.push({
            pathname: "/userPage",
            state: {
                account: this.state.account,
                username: this.state.username
            }
        });
    }

    render() {
        return (
            <div className="Championship">
                <header>
                    <h1>The green championship!</h1>
                    <button onClick={this.redirectTo}>
                        <img
                            src={require('../user-silhouette.png')}
                            alt=' '
                        />
                        {this.state.username}
                    </button>
                </header>
                <h3>Total points - Name</h3>
                <ol id="list">
                    {this.state.users.map((user) => {
                        let k = parseInt(String(user[1]));
                        return(
                            <div  key={k}>
                                <li> {k} - {user[0]} </li>
                            </div>
                        );
                    }).sort((a, b) => a[1] > b[1] ? 1 : -1 )
                    }
                </ol>
            </div>
        );
    }
}

export default withRouter(Championship);

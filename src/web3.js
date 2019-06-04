import Web3 from 'web3';
import contract from 'truffle-contract';


const provider = new Web3.providers.HttpProvider('http://localhost:7545');

const web3 = new Web3(provider);
web3.eth.defaultAccount = web3.eth.accounts[0];

export default web3;

export const selectContractInstance = (contractBuild) => {
    return new Promise(res => {
        const myContract = contract(contractBuild);
        myContract.setProvider(provider);
        myContract.defaults({
            gasLimit: "3000000"
        });
        myContract
            .deployed()
            .then(instance => res(instance));
    })
};

pragma solidity  >=0.4.22;

import "./Ownable.sol";
import "./SafeMath.sol";

contract User is Ownable {
    using SafeMath for uint256;

    event NewUser(address userAddress, string name, uint points, bool recycle);

    struct People{
        string name;
        uint256 points;
        bool recycle;
    }

    uint256 public noMembers = 0;
    address[] public memberAddresses;
    mapping (address => People) public addressToUsers;
   
    function _createUser(address _user, string memory _name, bool _recycler) internal {
        addressToUsers[_user].name = _name;
        addressToUsers[_user].points = 0;
        addressToUsers[_user].recycle = _recycler;
        memberAddresses.push(_user);
        noMembers = memberAddresses.length;
        emit NewUser(_user, _name, 0, _recycler);
    }
  
    function insertNewUser (address _user, string memory _name, bool _recycler) public {
        _createUser(_user, _name, _recycler);
    }
    
    function getUserInfo(address _user) external view returns (string memory, uint256) {
        return (addressToUsers[_user].name, addressToUsers[_user].points);
   }
}
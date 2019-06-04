pragma solidity  >=0.4.22;

import "./DeviceFactory.sol";
import "./ERC721.sol";
import "./SafeMath.sol";
import "./User.sol";

contract Traceability is User, DeviceFactory, ERC721{
    
    using SafeMath for uint256;
    
    mapping (uint => address) deviceApprovals;

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerDeviceCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return deviceToOwner[_tokenId];
    }
    
    modifier onlyOwnerOf(uint _tokenId) {
        require(msg.sender == deviceToOwner[_tokenId]);
        _;
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerDeviceCount[_to] = ownerDeviceCount[_to].add(1);
        ownerDeviceCount[msg.sender] = ownerDeviceCount[msg.sender].sub(1);
        deviceToOwner[_tokenId] = _to;
        devices[_tokenId].owners[devices[_tokenId].hops] = _to;
        devices[_tokenId].hops = devices[_tokenId].hops.add(1);
        emit Transfer(_from, _to, _tokenId);
    }
    
    function _releasePoints(uint256 _tokenId) private{
        uint j=2;
        for(uint8 i=0; i<devices[_tokenId].hops; i++){
            address _user =  getOwner(_tokenId,i);
            addressToUsers[_user].points += ((i+1)*3-j);
            j++;
        }
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require (deviceToOwner[_tokenId] == msg.sender || deviceApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
        if(addressToUsers[_to].recycle == true)
            _releasePoints(_tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
        deviceApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

}

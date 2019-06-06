pragma solidity  >=0.4.22 <0.6.0; 

import "./SafeMath.sol";

contract DeviceFactory{
    
    using SafeMath for uint256;
    
    event NewDevice(string name, string hid, address owner);
    
    struct Device{
        string deviceType;
        uint256 hops;
        string deviceUri;
        uint256 deviceId;
        mapping (uint => address) owners;
    }

    uint256 public noDevices = 0;
    Device[] public devices;
    mapping (uint => address) public deviceToOwner;
    mapping (address => uint) public ownerDeviceCount;
    
    function getOwner(uint256 _idDev, uint8 _idOw) public view returns(address){
        return devices[_idDev].owners[_idOw];
    }
    
    function _createDevice(string memory _type, string memory _manufacturer, string memory _serial, string memory _model) internal {
        string memory _hid = string(abi.encodePacked(_manufacturer,"-", _serial,"-", _model));
        uint256 deviceId = devices.length;
        uint id = devices.push(Device(_type, 1, _hid, deviceId)) - 1;
        devices[id].owners[0] = msg.sender;
        noDevices = devices.length;
        deviceToOwner[id] = msg.sender;
        ownerDeviceCount[msg.sender] = ownerDeviceCount[msg.sender].add(1);
        emit NewDevice(_type, _hid, msg.sender);
  }
  
  /*The HID is the concatenation of, in the exact order: 
        -the manufacturer name 
        -the serial number
        -the model
    joined with hyphens*/
  function insertNewDevice (string memory _type, string memory _manufacturer, string memory _serial, string memory _model) public {
        _createDevice(_type, _manufacturer, _serial, _model);
  }
}

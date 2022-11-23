//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Hexagon {

    modifier OnlyManufacturer() {
        require(_manufacturersId[msg.sender] > 0, "only merchants can call thus function!");
        _;
    }

    struct Manufacturer {
        uint id;
        string name;
        address wallet;
        uint[] products;
    }

    struct Product {
        uint id;
        string name;
        string url;
        uint manufacturer;
        bytes32[] items;
    }

    struct Item {
        bytes32 codeHash;
        uint product;
        bool bougth;
    }

    mapping(uint => Manufacturer) private _manufacturers;
    mapping(address => uint) private _manufacturersId;
    mapping(bytes32 => Item) private _items;
    uint public totalManufacturers = 1;
    uint public totalProducts;
    mapping(uint => Product) private _products;

    function register(string memory name) public {
        _manufacturers[totalManufacturers].id = totalManufacturers;
        _manufacturers[totalManufacturers].name = name;
        _manufacturers[totalManufacturers].wallet = msg.sender;

        totalManufacturers++;
    }


    function createProduct(string memory name, string memory url) public OnlyManufacturer {
        _products[totalProducts].id = totalProducts;
        _products[totalProducts].name = name;
        _products[totalProducts].url = url;
        _products[totalProducts].manufacturer = _manufacturersId[msg.sender];

        totalProducts++;
    }

    function updateProduct(uint productId, string memory url) public OnlyManufacturer {
        _products[productId].url = url;
    }

    function createItem(uint productId, bytes32 codeHash) public OnlyManufacturer {
        require(!(_items[codeHash].codeHash.length > 0), "codeHash invalid!");
        _items[codeHash].product = productId;
        _items[codeHash].codeHash = codeHash;
    }

    function checkAuthenticity(bytes32 code) public {
        bytes32 _codeHash = keccak256(abi.encode(code));
        require(_items[_codeHash].codeHash.length > 0, "code invalid!");
        require(_items[_codeHash].bougth == false, "product bought!");

        _items[_codeHash].bougth = true;
    }

    function getManufacturer(uint id) public view returns(uint, string memory, address){
        string memory name = _manufacturers[id].name;
        address wallet = _manufacturers[id].wallet;
        return(id, name, wallet);
    }

    function getProduct(uint id) public view returns(uint, string memory, string memory) {
        string memory name = _products[id].name;
        string memory url = _products[id].url;
        return(id, name, url);
    }

    function getInfo(uint id) public view returns(string memory)  {
        string memory url = _products[id].url;
        return url;
    }

}
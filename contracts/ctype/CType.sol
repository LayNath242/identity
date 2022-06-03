// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";

contract CType is Context {
    struct CTypeMetadata {
        uint256 orgId;
        uint256 CTypeId;
        address issuer;
        string propertiesURI;
        string propertiesHash;
        bool transferable;
        bool revokable;
        bool expirable;
    }
    CTypeMetadata Cmetadata;

    mapping(uint256 => CTypeMetadata) public _CtypeMetadata;

    mapping(uint256 => uint256) private _ctypes;

    mapping(uint256 => uint256[]) private _ctypeList;

    function ctypeLists(uint256 orgId)
        public
        view
        virtual
        returns (uint256[] memory)
    {
        return _ctypeList[orgId];
    }

    function ctypeOf(uint256 orgId) public view virtual returns (uint256) {
        return _ctypes[orgId];
    }

    function _create(
        address issuer,
        uint256 orgId,
        uint256 CTypeId,
        string memory propertiesURI,
        string memory propertiesHash,
        bool transferable,
        bool revokable,
        bool expirable
    ) internal virtual {
        Cmetadata = CTypeMetadata(
            orgId,
            CTypeId,
            issuer,
            propertiesURI,
            propertiesHash,
            transferable,
            revokable,
            expirable
        );
        _CtypeMetadata[CTypeId] = Cmetadata;
        _ctypeList[orgId].push(CTypeId);
        _ctypes[orgId] += 1;
    }

    function _delete(uint256 orgId, uint256 CTypeId) internal virtual {
        _ctypes[orgId] -= 1;
        delete _CtypeMetadata[CTypeId];
        _deleteCtypeFromList(orgId, CTypeId);
    }

    function _deleteCtypeFromList(uint256 orgId, uint256 CTypeId)
        internal
        virtual
    {
        for (uint256 index = 0; index < _ctypeList[orgId].length; index++) {
            if (_ctypeList[orgId][index] == CTypeId) {
                _remove(orgId, index);
                break;
            }
        }
    }

    function _remove(uint256 orgId, uint256 _index) internal virtual {
        require(_index < _ctypeList[orgId].length, "index out of bound");

        for (uint256 i = _index; i < _ctypeList[orgId].length - 1; i++) {
            _ctypeList[orgId][i] = _ctypeList[orgId][i + 1];
        }
        _ctypeList[orgId].pop();
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";

contract CType is Context {
    enum credentialTypeStatus {
        archived,
        active
    }

    struct CTypeMetadata {
        uint256 orgId;
        uint256 CTypeId;
        address issuer;
        string propertiesURI;
        string propertiesHash;
        bool transferable;
        bool revokable;
        bool expirable;
        uint256 lifespan;
        credentialTypeStatus status;
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
        bool expirable,
        uint256 lifespan
    ) internal virtual {
        Cmetadata = CTypeMetadata(
            orgId,
            CTypeId,
            issuer,
            propertiesURI,
            propertiesHash,
            transferable,
            revokable,
            expirable,
            lifespan,
            credentialTypeStatus.active
        );
        _CtypeMetadata[CTypeId] = Cmetadata;
        _ctypeList[orgId].push(CTypeId);
        _ctypes[orgId] += 1;
    }

    function _delete(uint256 CTypeId) internal virtual {
        _CtypeMetadata[CTypeId].status = credentialTypeStatus.archived;
    }
}

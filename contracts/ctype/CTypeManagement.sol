// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "./CType.sol";
import "../organazation/ORGManagement.sol";

contract CTypeManagement is Context, CType, ORGManagement {
    using Counters for Counters.Counter;

    Counters.Counter private _ctypeTracker;

    function createCtype(
        uint256 organizationId,
        string memory propertiesURI,
        string memory propertiesHash,
        bool transferable,
        bool revokable,
        bool expirable
    ) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender(), organizationId),
            "must have Admin role in organazation to create credential type"
        );
        _create(
            _msgSender(),
            organizationId,
            _ctypeTracker.current(),
            propertiesURI,
            propertiesHash,
            transferable,
            revokable,
            expirable
        );
        _ctypeTracker.increment();
    }

    function deleteCtype(uint256 organizationId, uint256 ctypeId)
        public
        virtual
    {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender(), organizationId),
            "must have Admin role in organazation to delete credential type"
        );
        _delete(organizationId, ctypeId);
    }
}

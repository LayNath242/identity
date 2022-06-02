// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (access/AccessControlEnumerable.sol)

pragma solidity ^0.8.0;

import "./IAccessControlEnumerable.sol";
import "./AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

abstract contract AccessControlEnumerable is
    IAccessControlEnumerable,
    AccessControl
{
    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(bytes32 => mapping(uint256 => EnumerableSet.AddressSet))
        private _roleMembers;

    function getRoleMember(
        bytes32 role,
        uint256 index,
        uint256 organizationId
    ) public view virtual override returns (address) {
        return _roleMembers[role][organizationId].at(index);
    }

    function getRoleMemberCount(bytes32 role, uint256 organizationId)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _roleMembers[role][organizationId].length();
    }

    function _grantRole(
        bytes32 role,
        address account,
        uint256 organizationId
    ) internal virtual override {
        super._grantRole(role, account, organizationId);
        _roleMembers[role][organizationId].add(account);
    }

    function grantAdminRole(address account, uint256 organizationId)
        internal
        virtual
    {
        _grantRole(DEFAULT_ADMIN_ROLE, account, organizationId);
    }

    /**
     * @dev Overload {_revokeRole} to track enumerable memberships
     */
    function _revokeRole(
        bytes32 role,
        address account,
        uint256 organizationId
    ) internal virtual override {
        super._revokeRole(role, account, organizationId);
        _roleMembers[role][organizationId].remove(account);
    }
}

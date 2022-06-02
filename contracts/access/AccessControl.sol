// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.6.0) (access/AccessControl.sol)

pragma solidity ^0.8.0;

import "./IAccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

abstract contract AccessControl is Context, IAccessControl {
    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => mapping(uint256 => RoleData)) private _roles;

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    modifier onlyRole(bytes32 role, uint256 organizationId) {
        _checkRole(role, organizationId);
        _;
    }

    function hasRole(
        bytes32 role,
        address account,
        uint256 organizationId
    ) public view virtual override returns (bool) {
        return _roles[role][organizationId].members[account];
    }

    function _checkRole(bytes32 role, uint256 organizationId)
        internal
        view
        virtual
    {
        _checkRole(role, _msgSender(), organizationId);
    }

    function _checkRole(
        bytes32 role,
        address account,
        uint256 organizationId
    ) internal view virtual {
        if (!hasRole(role, account, organizationId)) {
            revert(
                string(
                    abi.encodePacked(
                        "AccessControl: account ",
                        Strings.toHexString(uint160(account), 20),
                        " is missing role ",
                        Strings.toHexString(uint256(role), 32)
                    )
                )
            );
        }
    }

    function getRoleAdmin(bytes32 role, uint256 organizationId)
        public
        view
        virtual
        override
        returns (bytes32)
    {
        return _roles[role][organizationId].adminRole;
    }

    function grantRole(
        bytes32 role,
        address account,
        uint256 organizationId
    )
        public
        virtual
        override
        onlyRole(getRoleAdmin(role, organizationId), organizationId)
    {
        _grantRole(role, account, organizationId);
    }

    function revokeRole(
        bytes32 role,
        address account,
        uint256 organizationId
    )
        public
        virtual
        override
        onlyRole(getRoleAdmin(role, organizationId), organizationId)
    {
        _revokeRole(role, account, organizationId);
    }

    function _setupRole(
        bytes32 role,
        address account,
        uint256 organizationId
    ) internal virtual {
        _grantRole(role, account, organizationId);
    }

    function _setRoleAdmin(
        bytes32 role,
        bytes32 adminRole,
        uint256 organizationId
    ) internal virtual {
        bytes32 previousAdminRole = getRoleAdmin(role, organizationId);
        _roles[role][organizationId].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    function _grantRole(
        bytes32 role,
        address account,
        uint256 organizationId
    ) internal virtual {
        if (!hasRole(role, account, organizationId)) {
            _roles[role][organizationId].members[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }

    function _revokeRole(
        bytes32 role,
        address account,
        uint256 organizationId
    ) internal virtual {
        if (hasRole(role, account, organizationId)) {
            _roles[role][organizationId].members[account] = false;
            emit RoleRevoked(role, account, _msgSender());
        }
    }
}

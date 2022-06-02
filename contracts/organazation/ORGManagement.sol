// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "./ORG.sol";
import "../access/AccessControlEnumerable.sol";

contract ORGManagement is Context, AccessControlEnumerable, ORG {
    bytes32 public constant VERYFYIER_ROLE = keccak256("VERYFYIER_ROLE");
    using Counters for Counters.Counter;

    Counters.Counter private _organizationIdTracker;

    function createOrg(
        string memory name,
        string memory desc,
        string memory uri
    ) public virtual {
        grantAdminRole(_msgSender(), _organizationIdTracker.current());
        _createOrg(
            _msgSender(),
            name,
            desc,
            uri,
            _organizationIdTracker.current()
        );
        _organizationIdTracker.increment();
    }

    function deleteOrg(uint256 organizationId) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender(), organizationId),
            "must have Admin role to delete orgazaion"
        );
        _deleteOrg(organizationId);
    }

    function transferOrg(address to, uint256 organizationId) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender(), organizationId),
            "must have Admin role to transfer orgazaion"
        );
        _transfer(to, organizationId);
    }
}

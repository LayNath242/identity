// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IORG {
    /**
     * @dev Emitted when `organizationId` organization is transferred from `from` to `to`.
     */
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed organizationId
    );

    function ownerOf(uint256 orgazaionId) external view returns (address owner);

    function organizationOf(address owner)
        external
        view
        returns (uint256 _organizations);

    function organizationLists()
        external
        view
        returns (uint256[] memory _organizationsList);
}

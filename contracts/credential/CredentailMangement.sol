// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "./credential.sol";
import "../ctype/CTypeManagement.sol";

contract CreadentialManagement is Context, Credentia, CTypeManagement {
    using Counters for Counters.Counter;

    Counters.Counter private _credentialTracker;

    function issueCredential(
        uint256 credentialid,
        uint256 ctypeId,
        address to,
        string memory name,
        string memory propertyURI,
        string memory propertyHash
    ) public virtual {
        require(
            hasRole(
                DEFAULT_ADMIN_ROLE,
                _msgSender(),
                _CtypeMetadata[ctypeId].orgId
            ) ||
                hasRole(
                    VERYFYIER_ROLE,
                    _msgSender(),
                    _CtypeMetadata[ctypeId].orgId
                ),
            "must me have role in organazation to create credential type"
        );
        _issueCredential(
            credentialid,
            _credentialTracker.current(),
            to,
            name,
            propertyURI,
            propertyHash
        );

        _credentialTracker.increment();
    }

    function revokeCredential(uint256 credentialid) public virtual {
        require(
            hasRole(
                DEFAULT_ADMIN_ROLE,
                _msgSender(),
                _CtypeMetadata[_credentiallMetadata[credentialid].ctypeId].orgId
            ) ||
                hasRole(
                    VERYFYIER_ROLE,
                    _msgSender(),
                    _CtypeMetadata[_credentiallMetadata[credentialid].ctypeId]
                        .orgId
                ),
            "must me have role in organazation to create credential type"
        );
        require(
            _CtypeMetadata[_credentiallMetadata[credentialid].ctypeId]
                .revokable == true,
            "must me be revokeable credential type"
        );
        _revokeCredential(credentialid);
    }

    function unRevokeCredential(uint256 credentialid) public virtual {
        require(
            hasRole(
                DEFAULT_ADMIN_ROLE,
                _msgSender(),
                _CtypeMetadata[_credentiallMetadata[credentialid].ctypeId].orgId
            ) ||
                hasRole(
                    VERYFYIER_ROLE,
                    _msgSender(),
                    _CtypeMetadata[_credentiallMetadata[credentialid].ctypeId]
                        .orgId
                ),
            "must me have role in organazation to create credential type"
        );
        require(
            _CtypeMetadata[_credentiallMetadata[credentialid].ctypeId]
                .revokable == true,
            "must me be revokeable credential type"
        );
        _unrevokeCredential(credentialid);
    }

    function transfer(uint256 credentialid) public virtual {
        require(
            _CtypeMetadata[_credentiallMetadata[credentialid].ctypeId]
                .transferable == true,
            "must me be transferable credential type"
        );
        require(
            _msgSender() == ownerOfCredential(credentialid),
            "must me be transferable credential type"
        );
        _unrevokeCredential(credentialid);
    }
}

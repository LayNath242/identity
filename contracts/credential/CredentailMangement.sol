// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "./credential.sol";
import "../ctype/CTypeManagement.sol";

contract CreadentialManagement is Context, Credentia, CTypeManagement {
    using Counters for Counters.Counter;

    Counters.Counter private _credentialTracker;

    event TransferCredential(
        address to,
        uint256 credentialid
    );

    function issueCredential(
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
            "must be org member"
        );
        _issueCredential(
            _credentialTracker.current(),
            ctypeId,
            to,
            name,
            propertyURI,
            propertyHash
        );

        _credentialTracker.increment();
    }

    function toggleRevokeCredential(uint256 credentialid, bool revoke) public virtual {
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
           "must be org member"
        );
        require(
            _CtypeMetadata[_credentiallMetadata[credentialid].ctypeId]
                .revokable == true,
           "not revokable type"
        );
        if(revoke) {
            _unrevokeCredential(credentialid);
        } else {
            _revokeCredential(credentialid);
        }
    }

    function transfer(uint256 credentialid, address to) public virtual {
        require(
            _CtypeMetadata[_credentiallMetadata[credentialid].ctypeId]
                .transferable == true,
            "not transferable type"
        );
        require(
            _msgSender() == ownerOfCredential(credentialid),
            "only owner"
        );
        _credentialTransfer(to, credentialid);
        emit TransferCredential(to, credentialid);

    }
}

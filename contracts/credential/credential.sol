
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Arrays.sol";
import "./ICredentailReceiver.sol";

contract Credentia is Context {
    using Address for address;
    using Arrays for uint256[];


    enum credentialStatus
    {
        revoked,
        valid
    } 

    struct CredentialMetadata {
        uint256 credentialid;
        uint256 ctypeId;
        address owner;
        string name;   
        string propertyURI;
        string propertyHash;
        uint256 createdAt;
        credentialStatus status;
    }

    CredentialMetadata credentialMetadata;

    // Mapping from credential credentialid to owner address
    mapping(uint256 => address) private _credentailowners;

    // Mapping from credential metadata hash to credential credentialid
    mapping(uint256 => CredentialMetadata) public _credentiallMetadata;

    // Mapping owner address to credential count
    mapping(address => uint256) private _credentials;

    // Mapping owner address to credential list
    mapping(address => uint256[]) private _credentialsList;
    
    // Mapping ctypes to users 
    mapping(uint256 => uint256[]) private _credentialsByCType;

    function usersByCTypes(uint256 ctypeId) public view returns(uint256[] memory) {
        return _credentialsByCType[ctypeId];
    }

    function ownerOfCredential(uint256 credentialid)
        public
        view
        virtual
        returns (address)
    {
        address owner = _credentailowners[credentialid];
        require(owner != address(0), "owner query for nonexistent credential");
        return owner;
    }

    function credentialsList(address owner)
        public
        view
        virtual
        returns (uint256[] memory)
    {
        return _credentialsList[owner];
    }

    function _issueCredential(
        uint256 credentialid,
        uint256 ctypeId,
        address to,
        string memory name,
        string memory propertyURI,
        string memory propertyHash
    ) internal virtual {
        require(to != address(0), "create to the zero address");
        credentialMetadata = CredentialMetadata(credentialid, ctypeId, to, name, propertyURI, propertyHash, block.timestamp, credentialStatus.valid);
        _credentiallMetadata[credentialid] = credentialMetadata;
        _credentialsList[to].push(credentialid);
        _credentialsByCType[ctypeId].push(credentialid);
        _issue(to, credentialid);

    }

    function _revokeCredential(uint256 credentialid) internal virtual {
        _credentiallMetadata[credentialid].status = credentialStatus.revoked;
    }

    function _unrevokeCredential(uint256 credentialid) internal virtual {
        _credentiallMetadata[credentialid].status = credentialStatus.valid;
    }

    function _credentialTransfer(address to, uint256 credentialid) internal virtual {
        _safeCTransfer(_msgSender(), to, credentialid, "");
    }

    function _safeCTransfer(
        address from,
        address to,
        uint256 credentialid,
        bytes memory data
    ) internal virtual {
        _ctransfer(from, to, credentialid);
        require(
            _checkOnCredentiaReceived(from, to, credentialid, data),
            "transfer to non OnCredentiaReceived  implementer"
        );
    }

    function _ctransfer(
        address from,
        address to,
        uint256 credentialId
    ) internal virtual {
        require(
            Credentia.ownerOfCredential(credentialId) == from,
            "Credentia: transfer from incorrect owner"
        );
        require(to != address(0), "ORG: transfer to the zero address");

        _beforecredentialTransfer(from, to, credentialId);

        _deletecredentialList(from, credentialId);
        _credentialsList[to].push(credentialId);

        _credentials[from] -= 1;
        _credentials[to] += 1;
        _credentailowners[credentialId] = to;

        _aftercredentialTransfer(from, to, credentialId);
    }

    function _issue(address to, uint256 credentialId) internal virtual {
        require(to != address(0), "create to the zero address");

        _beforecredentialTransfer(address(0), to, credentialId);

        _credentailowners[credentialId] = to;
        _credentials[to] += 1;

        _aftercredentialTransfer(address(0), to, credentialId);
    }


    function _deletecredentialList(address owner, uint256 credentialid)
        internal
        virtual
    {
        for (
            uint256 index = 0;
            index < _credentialsList[owner].length;
            index++
        ) {
            if (_credentialsList[owner][index] == credentialid) {
                _cremove(owner, index);
                break;
            }
        }
    }

    function _cremove(address owner, uint256 _index) internal virtual {
        require(
            _index < _credentialsList[owner].length,
            "index out of bound"
        );

        for (
            uint256 i = _index;
            i < _credentialsList[owner].length - 1;
            i++
        ) {
            _credentialsList[owner][i] = _credentialsList[owner][i + 1];
        }
        _credentialsList[owner].pop();
    }

    function _checkOnCredentiaReceived(
        address from,
        address to,
        uint256 credentialId,
        bytes memory data
    ) private returns (bool) {
        if (to.isContract()) {
            try
                ICredentialReceiver(to).onCredentialReceived(
                    _msgSender(),
                    from,
                    credentialId,
                    data
                )
            returns (bytes4 retval) {
                return retval == ICredentialReceiver.onCredentialReceived.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ORG: transfer to non ORGReceiver implementer");
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    function _beforecredentialTransfer(
        address from,
        address to,
        uint256 credentialId
    ) internal virtual {}

    function _aftercredentialTransfer(
        address from,
        address to,
        uint256 credentialId
    ) internal virtual {}

}
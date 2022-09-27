// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Identity {
    event Minted(uint256 id, address owner, Type ctype, State state);
    event Transfered(
        uint256 id,
        address from,
        address to,
        Type ctype,
        State state
    );
    event Burnt(uint256 id, address from, Type ctype, State state);
    event Validated(uint256 did, uint256 org, address owner, Attest status);
    // P: Permanent;
    // E: Expirable;
    // R: Revokable;
    // RE: ExpirableAndRevokable;
    // T: Transferable;
    enum State {
        Permanent,
        Expirable,
        Revokable,
        ExpirableAndRevokable,
        Transferable
    }

    // O: Orgnaization;
    // S: Schema;
    // C: Credential;
    enum Type {
        Orgnaization,
        Schema,
        Credential
    }

    // R: Revoked
    // I: Invalid
    // V: Valid
    enum Attest {
        I,
        V
    }

    struct CredMeta {
        Type ctype;
        State state;
        uint256 parent;
    }

    uint256 public lastID;
    mapping(uint256 => string) private dids;
    mapping(uint256 => CredMeta) private metaOf;
    mapping(string => address) private ownerOf;
    mapping(address => uint256[]) private didsOf;
    mapping(uint256 => mapping(uint256 => Attest)) private attesations;
    mapping(uint256 => uint256[]) private requests;

    function getAssetsOf(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        return didsOf[_owner];
    }

    function getOwnerOf(string memory cid) public view returns (address) {
        return ownerOf[cid];
    }

    function getContentOf(uint256 did) public view returns (string memory) {
        return dids[did];
    }

    function getMetaOf(uint256 did) public view returns (CredMeta memory) {
        return metaOf[did];
    }

    function getRequests(uint256 orgId) public view returns (uint256[] memory) {
        return requests[orgId];
    }

    function verify(uint256 did) external view returns (bool) {
        uint256 schema = metaOf[did].parent;
        uint256 orgId = metaOf[schema].parent;
        Attest validity = attesations[orgId][did];

        if (uint256(validity) == 1) {
            return true;
        }

        return false;
    }

    function mintData(
        string memory cid,
        uint256 ctype,
        uint256 state,
        uint256 parent
    ) internal {
        address owner = ownerOf[cid];
        uint256 _lastId = lastID;

        if (owner != address(0)) {
            revert("Address not avaiable!");
        }

        dids[_lastId] = cid;
        ownerOf[cid] = msg.sender;
        metaOf[_lastId] = CredMeta(Type(ctype), State(state), parent);
        didsOf[msg.sender].push(_lastId);

        lastID = lastID + 1;
        emit Minted(
            _lastId,
            msg.sender,
            metaOf[_lastId].ctype,
            metaOf[_lastId].state
        );
    }

    function mintOrganization(string memory cid) external payable {
        // string memory cid, uint ctype, uint state, uint256 parent
        mintData(cid, 0, 4, 0);
    }

    function mintSchema(
        string memory cid,
        uint256 state,
        uint256 orgId
    ) external payable isOrg(orgId){
        // string memory cid, uint ctype, uint state, uint256 parent
        mintData(cid, 1, state, orgId);
    }

    function mintDocument(string memory cid, uint256 ctypeId) external payable isSchema(ctypeId) {
        // string memory cid, uint ctype, uint state, uint256 parent
        mintData(cid, 2, uint256(metaOf[ctypeId].state), ctypeId);
    }

    function _transfer(uint256 did, address to, address currentOwner) internal {
        ownerOf[dids[did]] = to;
        didsOf[to].push(did);
        _removeFromArr(currentOwner, did);

        emit Transfered(
            did,
            currentOwner,
            to,
            metaOf[did].ctype,
            metaOf[did].state
        );
    }

    function transferOrganzation(uint256 did, address to) external payable isOrg(did) {

        string memory data = dids[did];
        address currentOwner = ownerOf[data];
        require(msg.sender == currentOwner, "Unauthorized");

        uint256[] memory _assets = getAssetsOf(currentOwner);
        uint256 _schemas;
        for(uint256 a = 0; a < _assets.length; a++) {
            if(metaOf[_assets[a]].ctype == Type.Schema && metaOf[_assets[a]].parent == did) {
                _schemas = _schemas + 1;
            }
        }

        if(_schemas > 0) {
            revert("Schemas exist. Please transfer schemas first.");
        }

        _transfer(did, to, currentOwner);
    }

    function transferSchema(uint256 did, uint256 parent, address to) external payable isSchema(did) {
        string memory data = dids[did];
        address currentOwner = ownerOf[data];
        require(msg.sender == currentOwner, "Unauthorized");
        metaOf[did].parent = parent;
        _transfer(did, to, currentOwner);
    }

    function transferCredential(uint256 did, address to) external payable isCredential(did) isTransferable(did) {
        string memory data = dids[did];
        address currentOwner = ownerOf[data];
        require(msg.sender == currentOwner, "Unauthorized");

        _transfer(did, to, currentOwner);
    }

    function burn(uint256 did) public {
        string memory data = dids[did];
        address currentOwner = ownerOf[data];

        require(msg.sender == currentOwner, "Unauthorized");

        CredMeta memory meta = metaOf[did];
        require(meta.ctype == Type.Credential, "Only credential can be burnt.");
        uint256 burnt = did;
        uint256 s = meta.parent;
        uint256 o = metaOf[s].parent;
        State state = meta.state;
        Type _type = meta.ctype;

        emit Burnt(burnt, currentOwner, _type, state);

        delete dids[did];
        delete metaOf[did];
        delete ownerOf[data];
        delete attesations[o][did];
        _removeFromArr(currentOwner, did);
    }

    function attestRequest(uint256 did, uint256 org)
        public
        isOrg(org)
        notOrgOwner(org)
        isOwner(did)
    {
        requests[org].push(did);
    }

    function attestValidate(
        uint256 did,
        uint256 org,
        uint256 status
    ) public isOrg(org) isOwner(org) {
        attesations[org][did] = Attest(status);
        _removeFromReq(did, org);
        emit Validated(did, org, ownerOf[dids[did]], Attest(status));
    }

    function attestCancel(uint256 did, uint256 org)
        public
        isOrg(org)
        isOwner(did)
    {
        _removeFromReq(did, org);
    }

    function _removeFromReq(uint256 did, uint256 org) internal {
        for (uint256 i; i < requests[org].length; i++) {
            if (requests[org][i] == did) {
                uint256 last = requests[org].length - 1;
                requests[org][i] = requests[org][last];
                requests[org].pop();
            }
        }
    }

    function _removeFromArr(address owner, uint256 value) internal {
        for (uint256 i; i < didsOf[owner].length; i++) {
            if (didsOf[owner][i] == value) {
                uint256 last = didsOf[owner].length - 1;
                didsOf[owner][i] = didsOf[owner][last];
                didsOf[owner].pop();
            }
        }
    }

    modifier isOwner(uint256 did) {
        require(ownerOf[dids[did]] == msg.sender, "Unauthorized! Only owner allowed!");
        _;
    }
    modifier isOrg(uint256 org) {
        require(org < lastID, "ID not exist");
        require(metaOf[org].ctype == Type.Orgnaization, "DID is not an orgnaization.");
        _;
    }

    modifier isSchema(uint256 did) {
        require(did < lastID, "ID not exist");
        require(metaOf[did].ctype == Type.Schema, "DID is not a schema.");
        _;
    }

    modifier isCredential(uint256 did) {
        require(did < lastID, "ID not exist");
        require(metaOf[did].ctype == Type.Credential, "DID is not a credential.");
        _;
    }

    modifier notOrgOwner(uint256 org) {
        require(
            ownerOf[dids[org]] != msg.sender,
            "Org owner use attestValidate instead"
        );
        _;
    }

    modifier isTransferable(uint256 did) {
        require(metaOf[did].state == State.Transferable, "Not transferable type");
        _;
    }
}

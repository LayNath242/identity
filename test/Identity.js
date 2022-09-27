const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");

describe("Identity", function () {
  describe("Deployment", async function () {
    it("Should has an address", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const contractAddr = id.address;
      expect(hre.ethers.utils.isAddress(contractAddr)).to.equal(true);
    });
  });

  describe("Minting organization", async function () {
    it("Should mint an organization", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const selendra = await id.getMetaOf(0);
      expect(selendra.ctype).to.equal(0);
    });

    it("Should minted name Selendra", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const selendra = await id.getContentOf(0);
      expect(selendra).to.equal("selendra");
    });
  });

  describe("Minting schema", async function () {
    it("Should mint a schema", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 0, 0);
      await schema.wait();

      const master = await id.getMetaOf(1);
      expect(master.ctype).to.equal(1);
    });
  });

  describe("Minting document", async function () {
    it("Should mint a master ID", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 0, 0);
      await schema.wait();

      const _id = await id.mintDocument("brilliant", 1);
      await _id.wait();

      const identity = await id.getMetaOf(2);

      expect(identity.state).to.equal(0);
      expect(identity.ctype).to.equal(2);
      expect(identity.parent).to.equal(1);
    });
  });

  describe("Minting Events", async function () {
    it("Should emit minted event", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = id.mintOrganization("selendra");
      await expect(org).to.emit(id, "Minted").withArgs(0, alice.address, 1, 5);
    });
  });

  describe("Transfers", async function () {
    it("Should transfer selendra from alice to bob", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const tx = await id.transfer(0, bob.address);
      await tx.wait();

      const owner = await id.getOwnerOf("selendra");
      expect(owner).to.equal(bob.address);
    });

    it("Should not transfer schema", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 0, 0);
      await schema.wait();

      const tx = id.transfer(1, bob.address);

      await expect(tx).to.be.revertedWith("Not transferable type");
    });

    it("Should not transfer if state not transferable", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 0, 0);
      await schema.wait();

      const _id = await id.mintDocument("brilliant", 1);
      await _id.wait();

      const tx = id.transfer(1, bob.address);

      await expect(tx).to.be.revertedWith("Not transferable type");
    });

    it("Should transfer document", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 5, 0);
      await schema.wait();

      const _id = await id.mintDocument("brilliant", 1);
      await _id.wait();

      const tx = await id.transfer(2, bob.address);
      await tx.wait();

      const owner = await id.getOwnerOf("brilliant");
      expect(owner).to.equal(bob.address);
    });

    it("Should not transfer if not owner", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 5, 0);
      await schema.wait();

      const _id = await id.mintDocument("brilliant", 1);
      await _id.wait();

      const tx1 = await id.transfer(2, bob.address);
      await tx1.wait();

      const tx2 = id.transfer(2, alice.address);
      await expect(tx2).to.be.revertedWith("Unauthorized");
    });
  });

  describe("Transfers Events", async function () {
    it("Should emit transfered event", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 5, 0);
      await schema.wait();

      const _id = await id.mintDocument("brilliant", 1);
      await _id.wait();

      const tx1 = id.transfer(2, bob.address);
      await expect(tx1)
        .to.emit(id, "Transfered")
        .withArgs(2, alice.address, bob.address, 3, 5);
    });
  });

  describe("Burn", async function () {
    it("Should not burn organization", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const burn = id.burn(0);
      await expect(burn).to.be.revertedWith("Only credential can be burnt.");
    });

    it("Should not burn schema", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 5, 0);
      await schema.wait();

      const burn = id.burn(1);
      await expect(burn).to.be.revertedWith("Only credential can be burnt.");
    });

    it("Should burn asset", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 5, 0);
      await schema.wait();

      const _id = await id.mintDocument("brilliant", 1);
      await _id.wait();

      const burn = await id.burn(2);
      await burn.wait();

      const owner = await id.getOwnerOf("brilliant");
      expect(owner).to.equal(hre.ethers.constants.AddressZero);
    });
  });

  describe("Burn Events", async function () {
    it("Should emit burn event", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 2, 0);
      await schema.wait();

      const _id = await id.mintDocument("brilliant", 1);
      await _id.wait();

      const burnt = id.burn(2);
      await expect(burnt).to.emit(id, "Burnt").withArgs(2, alice.address, 3, 2);
    });
  });

  describe("Attestions", async function () {
    it("Should not add attest of org owner request", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 2, 0);
      await schema.wait();

      const _id = await id.mintDocument("brilliant", 1);
      await _id.wait();

      const req = id.attestRequest(2, 0);
      await expect(req).to.be.revertedWith(
        "Org owner use attestValidate instead"
      );
    });

    it("Should add attest request for others", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 2, 0);
      await schema.wait();

      const bid = id.connect(bob);

      const _id = await bid.mintDocument("brilliant", 1);
      await _id.wait();

      const req = await bid.attestRequest(2, 0);
      await req.wait();

      const requests = await id.getRequests(0);

      expect(requests[0]).to.equal(2);
    });

    it("Should cancel attestRequest", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 2, 0);
      await schema.wait();

      const bid = id.connect(bob);

      const _id = await bid.mintDocument("brilliant", 1);
      await _id.wait();

      const req = await bid.attestRequest(2, 0);
      await req.wait();

      const cancel = await bid.attestCancel(2, 0);
      await cancel.wait();

      const requests = await id.getRequests(0);

      expect(requests.length).to.equal(0);
    });

    it("Should approve request", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 2, 0);
      await schema.wait();

      const bid = id.connect(bob);

      const _id = await bid.mintDocument("brilliant", 1);
      await _id.wait();

      const req = await bid.attestRequest(2, 0);
      await req.wait();

      const confirm = await id.attestValidate(2, 0, 3);
      await confirm.wait();

      const valid = await id.verify(2);

      expect(valid).to.equal(true);
    });

    it("Should revoken request", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 2, 0);
      await schema.wait();

      const bid = id.connect(bob);

      const _id = await bid.mintDocument("brilliant", 1);
      await _id.wait();

      const req = await bid.attestRequest(2, 0);
      await req.wait();

      const confirm = await id.attestValidate(2, 0, 3);
      await confirm.wait();

      const revoke = await id.attestValidate(2, 0, 2);
      await revoke.wait();

      const valid = await id.verify(2);

      expect(valid).to.equal(false);
    });
  });

  describe("Validate Events", async function () {
    it("Should emit validate event", async function () {
      const [alice, bob, john] = await hre.ethers.getSigners();

      const ID = await hre.ethers.getContractFactory("Identity");
      const id = await ID.deploy();

      const org = await id.mintOrganization("selendra");
      await org.wait();

      const schema = await id.mintSchema("Master ID", 2, 0);
      await schema.wait();

      const bid = id.connect(bob);

      const _id = await bid.mintDocument("brilliant", 1);
      await _id.wait();

      const req = await bid.attestRequest(2, 0);
      await req.wait();

      const confirm = id.attestValidate(2, 0, 3);

      await expect(confirm)
        .to.emit(id, "Validated")
        .withArgs(2, 0, bob.address, 3);
    });
  });
});

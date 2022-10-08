# AMAZE-X CTF Walkthrough

## Table of contents
1. [Intro to the series](https://medium.com/@mattaereal/a-maze-x-ctf-walkthrough-part-0-d73338e6809) — Part 0 (posted 21/09)
2. [Challenge0.VToken](https://medium.com/@mattaereal/amaze-x-ctf-walkthrough-part-i-cdd3a5292a14) — Part I (posted 22/09)
3. [Challenge1.lenderpool](https://medium.com/@mattaereal/a-maze-x-ctf-walkthrough-part-ii-c4d3dcc6f700) — Part II (posted 27/09)
4. [Challenge2.DEX](https://medium.com/@mattaereal/a-maze-x-ctf-walkthrough-part-iii-dd8997b7b5bf) — Part III (posted 4/10)
5. [Challenge3.borrow_system](https://medium.com/@mattaereal/a-maze-x-ctf-walkthrough-part-iv-last-407f5de236f8) — Part IV (posted 08/10)


# Introduction

Hi and welcome! The intention of the following articles is to share real personal experiences written in a way that it reads almost like a story, including all the mistakes I make along the road.

## Some context
Last week I attended the second edition of the local convention called GEERS. It is targeted at blockchain curious that want to delve deeper into the technical side of the Ethereum ecosystem.

There I met Alan Verbner, Co-Founder y CTO of Atix Lab, a company recently acquired by Globant, and he mentioned something about a friend making a CTF for a workshop.

# The CTF
The challenges that will discuss in this series were hosted on the past 25 of August by Stanford University as part of Defi Security 101, built by @eugenioclrc and @luksgrin.

## Important note (by the authors)

This set of challenges aren’t set for competitive purposes. Their main objective is to showcase scenarios involving DeFi, Solidity concepts and common vulnerabilities.

Focus on learning and having fun!

# How to play
At the moment of this writing, there are at least 6 different ways of playing. I decided to pick the option where you run the challenges locally with Hardhat 💛.

```
git clone git@github.com:eugenioclrc/DeFi-Security-Summit-Stanford.git
cd DeFi-Security-Summit-Stanford
git checkout hardhat
yarn
```

## Solving a challenge (from the GitHub repo)
Challenge contracts are located under the hardhat_flavor/contracts/ directory. Do not modify them, as it may lead to unexpected behaviors within the challenges.

To solve a challenge, you must do the following:

Create an exploit contract(s) within the appropriate `hardhat_flavor/contracts/exploits/ExploitX.sol` file.
Complete the necessary JavaScript code (in the signalized area) within the appropriate `hardhat_flavor/test/solveChallengeX.js` file.
Note that this procedure has to be done for each challenge.

Then, to check if the challenge has been solved, execute the following command
`npx hardhat test test/solveChallengeX.js`

If the solution criteria have been reached, it shall display the following message

```
Solve Challenge X
    ✔ Check if required condition has been met (XXXms)
  1 passing (XXXms)
```

Alternatively, to check if all challenges have been solved, execute the following command:

`npx hardhat test`
which will return the test results for all challenges in order.

## Tips
If you checked out the repository you probably saw that besides the solutions for the challenges, which are provided in every flavor — in our case that would be Hardhat —, there are some tips for each exercise.

I suggest not looking at any of them and using them only as a last resource. And don't worry, I am going to mention the tips for each challenge eventually.

# My offer to you
As I mentioned above, the approach I am going to use will be documenting the process as much as possible, even my wrong turns, but trying to be as brief as that can be in order to keep it entertained.

To ease the content on this occasion we will try to use as few tools as possible, and guess as many things as we can before diving in.

So… are you ready for the first challenge?

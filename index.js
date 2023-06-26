import { ethers } from "./ethers-5.7.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connect-button");
const fundButton = document.getElementById("fund-button");
const withdrawButton = document.getElementById("withdraw-button");
const balanceButton = document.getElementById("balance-button");

connectButton.onclick = connect;
fundButton.onclick = fund;
withdrawButton.onclick = withdraw;
balanceButton.onclick = balance;

console.log(ethers);

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        connectButton.innerHTML = "Connected!";
    } else {
        console.log("No metamask!");
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding with ${ethAmount}`);

    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done!");
        } catch (exception) {
            console.log(exception);
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);

    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReciept) => {
            console.log(
                `Completed with ${transactionReciept.confirmations} confirmations`
            );
            resolve();
        });
    });
}

async function withdraw() {
    console.log("Withdrawing");
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const transactionResponse = await contract.withdraw();
        await transactionResponse.wait(1);
        console.log("Successful");
    }
}

async function balance() {
    console.log("Showing contract balance");
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        let balance = await contract.provider.getBalance(contract.address);
        balance /= 1000000000000000000;
        //await transactionResponse.wait(1);
        console.log(balance.toString());
    }
}

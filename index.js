import { ethers } from "./ethers-5.7.esm.min.js";

const connectButton = document.getElementById("connect-button");
const fundButton = document.getElementById("fund-button");
connectButton.onclick = connect;
fundButton.onclick = fund;

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

async function fund(ethAmount) {
    console.log(`Funding with ${ethAmount}`);

    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.provider.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(signer);
    }
}

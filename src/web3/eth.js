import { ethers } from "ethers";
import { ABIDecoder } from "./ABIDecoder";
import {CHAIN_ID, RPC} from "../config";
import { BP106Address, BP106ProxyAddress, PlatformAddress } from "./address";

let provider,
    signer,
    BP106Proxy,
    BP106,
    PlatformAddressContract;


// export
export async function getAccount() {
    return await signer.getAddress()
}

export async function onConnect() {

    if (window.ethereum) {

        // Request Metamask for accounts
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let chainId = await window.ethereum.request({ method: "eth_chainId"});
        // if (chainId != 1) {
        //     window.ethereum.request({
        //         method: 'wallet_switchEthereumChain',
        //         params: [
        //             {
        //                 chainId: '0x1'
        //             },
        //         ],
        //     })
        // }
    } else {
     
    }
}

export async function initContract() {

    if (window.ethereum) {

        // SetProvider
        provider = new ethers.providers.Web3Provider(window.ethereum);

        window.ethereum.on("accountsChanged", () => {
            window.location.reload();
        })

        window.ethereum.on("chainChanged", (chainId) => {
            if (chainId != 1) {
                window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                        {
                            chainId: '0x1'
                        },
                    ],
                })
            }

        })

        // Set Current Signer
        signer = provider.getSigner();
    } else {
       
    }
    signer = provider.getSigner();
    // instance contract

    BP106Proxy = new ethers.Contract(BP106ProxyAddress, require("./abi/BP106.json"), signer);
    PlatformAddressContract = new ethers.Contract(PlatformAddress, require("./abi/PlatformAddress.json"), signer);
}

// export contract instance
export {
    provider,
    signer,
    BP106Proxy,
    PlatformAddressContract
}
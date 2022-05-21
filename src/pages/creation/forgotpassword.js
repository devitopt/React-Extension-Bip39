import styles from "./forgotpassword.module.css";
import { useGloabalStateContext } from "../../context/provider";
import { chainName, chainSymbol } from "../../context/config";
import { BuyIcon, SendIcon } from "../../context/svgs";
import { goTo } from "react-chrome-extension-router";
import Login from "../login";
import Btn from "../../components/button";

import { randomBytes } from "crypto";
import * as bip39 from "bip39";
import { HDKey, BitcoinAddress, EthereumAddress, versions } from "wallet.ts";
import { useEffect, useState } from "react";
import Reset from "./reset";

// const MNEMONIC =
//   "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon";
// const SEED = bip39.mnemonicToSeedSync(MNEMONIC);

const ForgotPassword = () => {
  const [mnemonic, setMnemonic] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const generateSeed = () => {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    console.log("mnemonic generated:", mnemonic);
    console.assert(bip39.validateMnemonic(mnemonic));
    return seed;
  };

  const getHDkey = () => {
    const seed = generateSeed();
    const masterKey = HDKey.parseMasterSeed(seed);
    const btcWallet = masterKey.derive("m/44'/1'/0'/0/3");
    const ethWallet = masterKey.derive("m/44'/60'/0'/0/2"); //index:0
    const btcKeys = {
      priv: btcWallet.privateKey.toString("hex"),
      pub: btcWallet.publicKey.toString("hex"),
      address: BitcoinAddress.from(btcWallet.publicKey, versions.bitcoinTest)
        .address,
    };
    const ethKeys = {
      priv: ethWallet.privateKey.toString("hex"),
      pub: ethWallet.publicKey.toString("hex"),
      address: EthereumAddress.from(ethWallet.publicKey).address,
    };

    console.log("BTC:", btcKeys, "\nETH:", ethKeys);
    if (btcKeys.address && ethKeys.address) {
      console.log("assertion for address");
      console.assert(BitcoinAddress.isValid(btcKeys.address));
      console.assert(EthereumAddress.isValid(ethKeys.address));
    }
  };

  const onNext = () => {
    // localStorage.setItem("enp", mnemonic);
    goTo(Reset);
  };

  const changeNemonic = (e, index) => {
    let _mnemoic = [...mnemonic];
    _mnemoic[index] = e.target.value;
    setMnemonic([..._mnemoic]);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Reset Wallet</div>
      <div className={styles.secretForm}>
        {mnemonic.map((word, index) => (
          <input key={index} value={word} onChange={(e) => changeNemonic(e, index)} />
        ))}
      </div>
      <div className={styles.btns_wrapper}>
        <Btn title="Next" onClick={onNext} />
      </div>
    </div>
  );
};

export default ForgotPassword;

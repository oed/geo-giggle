import { createContext, useContext } from "react";
import { useWalletClient } from 'wagmi'
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'

import { CeramicClient } from "@ceramicnetwork/http-client"
import { ComposeClient } from "@composedb/client";

import { definition } from "../__artifacts__/definition.js";

const CERAMIC_URL = 'https://ceramic-blessclub.hirenodes.io/'



/**
 * Configure ceramic Client & create context.
 */
const ceramic = new CeramicClient(CERAMIC_URL);

const compose = new ComposeClient({ ceramic, definition });

let isAuthenticated = false
const Context = createContext({ compose, isAuthenticated });

async function authenticate() {
  const { data: walletClient, isError, isLoading } = useWalletClient()

  if (walletClient) {
    const accountId = await getAccountId(walletClient, walletClient.account.address)
    const authMethod = await EthereumWebAuth.getAuthMethod(walletClient, accountId)
    // change to use specific resource
    const session = await DIDSession.get(accountId, authMethod, { resources: compose.resources }) 
    ceramic.did = session.did
    console.log('Auth\'d:', session.did.parent)
    isAuthenticated = true
  }
}


export const ComposeDB = ({ children }) => {
  authenticate()
  return (
    <Context.Provider value={{ compose, isAuthenticated }}>
      {children}
    </Context.Provider>
  );
};


export const useComposeDB = () => useContext(context);


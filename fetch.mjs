import fs from 'fs';
import axios from 'axios';

const walletAddresses = fs.readFileSync('wallet.txt', 'utf8').split('\n').map(line => line.trim()).filter(Boolean);
const headers = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9",
  "priority": "u=1, i",
  "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "Referer": "https://www.grassfoundation.io/",
  "Referrer-Policy": "origin-when-cross-origin",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
};

async function fetchAirdropAllocation(walletAddress) {
  const url = `https://api.getgrass.io/airdropAllocations?input=%7B%22walletAddress%22:%22${walletAddress}%22%7D`;

  try {
    const response = await axios.get(url, {
      headers
    });
    return { walletAddress, data: response.data };
  } catch (error) {
    console.error(`Error fetching data for wallet ${walletAddress}:`, error);
    return { walletAddress, error: error.message };
  }
}

async function processWallets() {
  const results = [];

  for (const walletAddress of walletAddresses) {
    console.log(`Fetching data for wallet: ${walletAddress}`);
    const result = await fetchAirdropAllocation(walletAddress);
    results.push(result);
    
    fs.appendFileSync('response.txt', `${JSON.stringify(result, null, 2)}\n\n`, 'utf8');
  }

  console.log('All wallet data has been processed.');
}

processWallets();

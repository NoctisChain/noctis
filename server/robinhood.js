// Robinhood Chain anchor: every ANCHOR_EVERY blocks the node sends a zero-value transaction to itself on Robinhood Chain
// whose calldata is "noctis-1:<height>:<block hash>", signed by RH_KEY. Anyone can open it on the Robinhood Chain explorer
// and compare it with the NOCTIS explorer, so NOCTIS's history is pinned to Robinhood Chain and can't be quietly rewritten.
import { createWalletClient, createPublicClient, http, defineChain, toHex } from 'viem'; import { privateKeyToAccount } from 'viem/accounts';

export const RH_RPC_DEFAULT = 'https://rpc.mainnet.chain.robinhood.com';
export const RH_EXPLORER = 'https://explorer.mainnet.chain.robinhood.com';
export function anchorer(S, save) {
  const raw = (process.env.RH_KEY || '').trim(), rpc = process.env.RH_RPC || RH_RPC_DEFAULT;
  const chain = defineChain({ id: 4663, name: 'Robinhood Chain', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: { default: { http: [rpc] } } });
  let acct = null; try { if (raw) acct = privateKeyToAccount(raw.startsWith('0x') ? raw : '0x' + raw); } catch (e) { console.error('RH_KEY unreadable: ' + e.message); }
  const wallet = acct ? createWalletClient({ account: acct, chain, transport: http(rpc, { retryCount: 4, retryDelay: 800 }) }) : null, pub = acct ? createPublicClient({ chain, transport: http(rpc) }) : null;
  const queue = []; let busy = false, err = null; S.anchors ||= {};
  async function drain() { if (busy || !wallet) return; busy = true;
    while (queue.length) { const [h, hash] = queue[0];
      try { const tx = await wallet.sendTransaction({ to: acct.address, value: 0n, data: toHex(`noctis-1:${h}:${hash}`) }); await pub.waitForTransactionReceipt({ hash: tx, timeout: 120_000 });
        S.anchors[h] = { hash, sig: tx, ts: Date.now() }; queue.shift(); err = null; save(); console.log('anchored block ' + h + ' to Robinhood Chain ' + tx);
      } catch (e) { err = String(e.shortMessage || e.message || e).slice(0, 200); console.error('anchor failed: ' + err); await new Promise((r) => setTimeout(r, 30_000)); } }
    busy = false; }
  return {
    push(h, hash) { if (!wallet) return; queue.push([h, hash]); drain(); },
    info() { const hs = Object.keys(S.anchors).map(Number), last = hs.length ? Math.max(...hs) : null;
      return { enabled: !!wallet, chain: 'robinhood', chainId: 4663, explorer: RH_EXPLORER, signer: acct ? acct.address : null, every: +process.env.ANCHOR_EVERY || 100, count: hs.length, last: last == null ? null : { height: last, ...S.anchors[last] }, pending: queue.length, error: err }; },
  };
}

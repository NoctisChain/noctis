// writes brand/X-KIT.md and checks every tweet is ≤245 characters.  node _studio/tweets.cjs
'use strict';
const fs = require('fs'), path = require('path'), len = (s) => [...s].length;
const SITE = 'https://noctischain.org', HANDLE = '@NoctisRH';
const BIO = 'A private chain mined by proof of proof. Every note hides sender, receiver and amount, and the history is anchored to Robinhood Chain. $NOCT';
const DEX = 'NOCTIS is a private blockchain mined by proof of proof, the Nockchain model: miners win blocks by proving a 1,024-step computation over the Goldilocks field, and every node checks the proof in milliseconds. 2^32 supply, no premine. Every transaction hides the sender (ring of 16), the receiver (stealth notes) and the amount (Pedersen commitments + range proofs), with ML-KEM-768 quantum-safe addresses. Every 100 blocks the chain writes its block hash to Robinhood Chain. Prove blocks in your browser at noctischain.org/mine.';
const T = [
['Hype (video)', 'noctis-hype-18s.mp4', `The proof is the work.
The note is dark.

NOCTIS: a private chain where miners prove a computation, every transfer hides who and how much, and Robinhood Chain keeps the receipts.

${SITE}

$NOCT`],
['App demo (video)', 'noctis-app-demo.mp4', `The whole NOCTIS app, start to finish:

create keys → faucet → prove a block in your browser → send privately to a quantum address → verify the tx and the block proof yourself

${SITE}/wallet

$NOCT`],
['ATH comparison', 'noctis-g09-ath.png', `Privacy is a sector, not a niche.

Zcash peaked near $21.7B.
Monero near $13.4B.
Dash near $11.6B.

NOCTIS brings Monero-grade privacy, quantum-safe receive, proved blocks and Robinhood Chain anchors.

$NOCT`],
['ATH comparison (video)', 'noctis-ath-12s.mp4', `Zcash, Monero, Dash: billions in peak market cap, all mined by hashing.

NOCTIS is the first private chain mined by proof of proof, pinned to Robinhood Chain.

${SITE}

$NOCT`],
['Live network', 'noctis-g10-live.png', `noctis-1 is live.

Blocks every ~20s, each carrying a proof.
Proof check: ~4 ms on any machine.
Browser prover at /mine.
Robinhood Chain anchors every 100 blocks.

${SITE}/explorer

$NOCT`],
['Proof (video)', 'noctis-proof-15s.mp4', `Seed. Run. Commit. Beat the target. Open 32 steps.

That's a NOCTIS block. No proof, no block.

${SITE}/mine

$NOCT`],
['Notes (video)', 'noctis-notes-14s.mp4', `Sender: 1 of 16, unknown.
Receiver: never written.
Amount: a commitment.

That's every NOCTIS transfer, and you can verify one yourself in your browser.

$NOCT`],
['Anchors (video)', 'noctis-anchor-12s.mp4', `Every 100 blocks NOCTIS writes its fingerprint onto Robinhood Chain. One calldata tx, open on the Robinhood Chain explorer.

Proved on NOCTIS. Pinned to Robinhood Chain.

${SITE}/explorer#/anchors

$NOCT`],
['Pinned · intro', 'noctis-g01-keyart.png', `Hash grinding proves you burned power.
NOCTIS's miners prove they ran the program.

Proof-of-proof blocks. Every note private. History pinned to Robinhood Chain.

Prove a block in your browser:
${SITE}/mine

$NOCT`],
['Proof of proof', 'noctis-g02-proof.png', `How a NOCTIS block is won:

1. seed from header + nonce
2. 1,023 rounds of (a+b)⁷ + c over Goldilocks
3. Merkle the whole trace
4. root beats the difficulty
5. open 32 Fiat–Shamir steps

Nodes check it in ~4 ms.

$NOCT`],
['Nockchain model', 'noctis-g03-nock.png', `Nockchain showed proof of work can be proof of proof.

NOCTIS keeps the model: Goldilocks field, 2³² supply, no premine, notes.

And adds what it lacks: rings of 16, hidden amounts, ML-KEM addresses, Robinhood Chain anchors.

$NOCT`],
['Fair launch', 'noctis-g04-launch.png', `4,294,967,296 NOCT. That's 2³².

Premine: 0
Presale: 0
Team allocation: 0

Every coin comes out of a block somebody proved. The reward is what's left ÷ 2¹⁹, with a 2 NOCT tail forever.

$NOCT`],
['Private notes', 'noctis-g05-notes.png', `What the ledger sees in a NOCTIS transfer:

which note was spent: 1 of 16, unknown
receiver address: never written
amounts: commitments only

What you can do: press "verify in your browser" and re-check it yourself.

$NOCT`],
['Robinhood Chain anchors', 'noctis-g06-robinhood.png', `Every 100 blocks, NOCTIS writes its own fingerprint onto Robinhood Chain:

noctis-1:<height>:<block hash>

One tx per anchor, open on the explorer. Rewriting NOCTIS's history would mean contradicting Robinhood Chain.

$NOCT`],
['Comparison', 'noctis-g07-compare.png', `Nockchain: proof of proof, public notes.
Monero: private notes, hash mining.
Zcash: shielded pool, founders' reward.

NOCTIS: proof of proof + ring-16 private notes + ML-KEM receive + Robinhood Chain anchors. No premine.

$NOCT`],
['Browser prover', 'noctis-g01-keyart.png', `No rig. No pool. No download.

Open ${SITE}/mine, paste your address, press start. Each thread runs the same program and proof the node runs, and blocks pay straight to your private address.

$NOCT`],
['Verify the proof', 'noctis-g02-proof.png', `Don't trust the node.

Open any block on the NOCTIS explorer and press "verify proof in your browser": your machine re-derives the seed, the commitment and all 32 challenges, then re-checks every opened step.

$NOCT`],
['Quantum', 'noctis-g05-notes.png', `Record a chain today, break it with a quantum computer later.

NOCTIS's noctq1 addresses find payments with ML-KEM-768, NIST's lattice standard. That recording stays unlinkable after Q-day.

$NOCT`],
['Roadmap', 'noctis-g08-roadmap.png', `NOCTIS roadmap:

✓ proof-of-proof blocks
✓ private notes, ring 16, ML-KEM
✓ browser + CLI provers
✓ Robinhood Chain anchors
→ full STARK per block
→ proof aggregation, p2p nodes
→ NOCTIS ⇄ Robinhood Chain bridge

$NOCT`],
['Launch', 'noctis-og.png', `$NOCT is live on Robinhood Chain.

The proof is the work. The note is dark.

CA: 

${SITE}`],
];
let bad = 0, md = `# NOCTIS X kit\n\n## Handle\n\`\`\`\n${HANDLE}\n\`\`\`\n\n## Display name\n\`\`\`\nNOCTIS | $NOCT\n\`\`\`\n\n## Bio (${len(BIO)}/160)\n\`\`\`\n${BIO}\n\`\`\`\n\n## Website\n\`\`\`\n${SITE}\n\`\`\`\n\n## DexScreener description\n\`\`\`\n${DEX}\n\`\`\`\n\n## Profile images\n- Avatar: \`noctis-pfp.png\`\n- Header: \`noctis-banner.png\`\n\n## Tweets (all ≤245)\n`;
T.forEach(([name, media, text], i) => { const n = len(text); if (n > 245) { bad++; console.log('TOO LONG', i + 1, n); } console.log(i + 1, n, name); md += `\n### ${i + 1}. ${name} · ${n} chars · media: \`${media}\`\n\`\`\`\n${text}\n\`\`\`\n`; });
if (len(BIO) > 160) { bad++; console.log('BIO TOO LONG', len(BIO)); }
fs.writeFileSync(path.join(__dirname, '..', 'brand', 'X-KIT.md'), md); console.log(bad ? 'FIX' : 'all fit', 'bio', len(BIO));

import { NextRequest, NextResponse } from "next/server";
import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
import { createPublicClient, http } from "viem";

const kit = new AppKit();

export async function POST(req: NextRequest) {
  try {
    const { tokenIn, tokenOut, amountIn } = await req.json();

    if (!tokenIn || !tokenOut || !amountIn) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const kitKey = process.env.KIT_KEY ?? process.env.NEXT_PUBLIC_KIT_KEY!;

    const adapter = createViemAdapterFromPrivateKey({
      privateKey: "0x0000000000000000000000000000000000000000000000000000000000000001",
      getPublicClient: ({ chain }) =>
        createPublicClient({
          chain,
          transport: http("https://rpc.testnet.arc.network"),
        }),
    });

    const estimate = await kit.estimateSwap({
      from:     { adapter, chain: "Arc_Testnet" },
      tokenIn,
      tokenOut,
      amountIn,
      config:   { kitKey },
    });

    return NextResponse.json({
      estimatedOutput: estimate.estimatedOutput,
      stopLimit:       estimate.stopLimit,
      fees:            estimate.fees,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Quote failed";
    console.error("[swap-quote] ERROR:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

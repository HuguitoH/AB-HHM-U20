import { ApiDataFetcher } from "./ApiDataFetcher.js";
import { StationParser } from "./StationParser.js";
import { StationRepository } from "./StationRepository.js";
import { PROVINCES, PRODUCTS } from "./config.js";

/**
 * Entry point for the CLI
 * Usage: npm run dev -- --date DD-MM-YYYY
 * If --date is not provided, defaults to today. 
 */


function getTodayFormatted(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
}

function parseDateArg(args: string[]): string {
    const idx = args.indexOf('--date');
    if (idx !== -1 && args[idx + 1]) {
        return args[idx + 1] as string;
    }
    return getTodayFormatted();
}

async function main(): Promise<void> {
    const date = parseDateArg(process.argv.slice(2));
    console.log(`\nFuel Price Analyzer - Data for ${date}\n`);

    const fetcher = new ApiDataFetcher();
    const parser = new StationParser();
    const repository = new StationRepository(fetcher, parser);

    for (const province of PROVINCES) {
        for (const product of PRODUCTS) {
            const stations = await repository.getByProvinceAndProduct(
                date,
                province.id,
                product.id,
                product.name
            );

            console.log(`[${province.name} / ${product.name}]`);
            console.log(`  Total stations: ${stations.length}`);

            if (stations.length > 0) {
                const first = stations[0];
                console.log(`First: ${first?.name} | ${first?.address}  | ${first?.price} €/L`);
            }

            console.log('');
        }
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});



import fuzzball, { FuzzballAsyncExtractObjectOptions } from "fuzzball";
import { uniqBy } from "lodash";
import { inPlaceSort } from "fast-sort";

import { Company } from "./company";

type ExtractResult = { choice: Company, score: number, key: number };

// eslint-disable-next-line import/prefer-default-export
export class SpellingService {

    // eslint-disable-next-line no-useless-constructor
    constructor(
        private choices: Company[]
    ) {}

    async search(query: string, limit = 10, cutoff = 0.7): Promise<Company[]> {
        // Extract the best matches
        const extracted = await SpellingService.extract(query, this.choices, limit, cutoff)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const unique: ExtractResult[] = uniqBy(extracted, (item: ExtractResult) => item.choice.name)

        inPlaceSort(unique).by([
            { desc: u => u.score }
        ])

        return unique.map(item => item.choice)
    }

    static extract(query: string, choices: Company[], limit: number, cutoff: number): Promise<ExtractResult[]> {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,no-return-assign,no-param-reassign
            fuzzball.extractAsync(query, choices.map((choice) => {
                    // eslint-disable-next-line no-param-reassign
                    choice.name = choice.name.toLowerCase()
                    return choice
                }),
                {
                    processor: (item: Company) => item.name.toLowerCase(),
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                    scorer: fuzzball.partial_ratio,
                    limit,
                    cutoff,
                    unsorted: false,
                    returnObjects: true
                } as FuzzballAsyncExtractObjectOptions,
                (err, results: ExtractResult[]) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(results)
                })
        })
    }
}

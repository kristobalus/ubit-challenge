import assert from "assert"

import companies from "./data/companies.json";
import { SpellingService } from "./spelling-service";

describe('SpellingService', () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    it('should filter by misplaced char', async () => {
        const service = new SpellingService(companies)
        const result = await service.search("graup", 100, 0.5)
        assert(result.length)
    })

    it('should filter with missed char', async () => {
        const service = new SpellingService(companies)
        const result = await service.search("goup", 100, 0.5)
        assert(result.length)
    })
})

import assert from "assert"

import { SpellingService } from "./spelling-service";
import { Company } from "./company";

describe('SpellingService', () => {

    const companies: Company[] = [
        {
            id: 1,
            coins: [ "e1", "e2", "e3" ],
            name: "company",
            logoUrl: "url"
        },
        {
            id: 2,
            coins: [ "e1", "e2", "e3" ],
            name: "group",
            logoUrl: "url"
        }
    ]

    // eslint-disable-next-line @typescript-eslint/require-await
    it('should filter by 1 missed char', async () => {
        const service = new SpellingService(companies)
        const result = await service.search("grop", 100, 0.5)
        assert(result.length)
    })

    it('should filter by 1 misplaced char', async () => {
        const service = new SpellingService(companies)
        const result = await service.search("gorup", 100, 0.5)
        assert(result.length)
    })

    it('should filter with 2 or more missed char', async () => {
        const service = new SpellingService(companies)
        const [ company ] = await service.search("cmp", 100, 0.5)
        assert(company)
        assert.equal(company.name, companies[0].name)
    })
})

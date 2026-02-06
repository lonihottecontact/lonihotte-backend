class AirtableService {
    constructor() {
        this.baseUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;
        this.headers = {
            'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json'
        };
        this.cache = new Map();
        this.CACHE_TTL = 5 * 60 * 1000;
    }

    async request(method, endpoint, body = null) {
        const options = { method, headers: this.headers };
        if (body) { options.body = JSON.stringify(body); }
        const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Airtable ${method} ${endpoint} - HTTP ${response.status}: ${errorText}`);
        }
        return await response.json();
    }

    async getAll(table, options = {}) {
        const cacheKey = `${table}_${JSON.stringify(options)}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            console.log(`Cache HIT: ${table}`);
            return cached.data;
        }
        console.log(`Airtable FETCH: ${table}`);
        let allRecords = [];
        let offset = null;
        do {
            let url = table;
            const params = [];
            if (options.sort) {
                options.sort.forEach((s, i) => {
                    params.push(`sort%5B${i}%5D%5Bfield%5D=${encodeURIComponent(s.field)}`);
                    params.push(`sort%5B${i}%5D%5Bdirection%5D=${s.direction || 'desc'}`);
                });
            }
            if (options.filterByFormula) {
                params.push(`filterByFormula=${encodeURIComponent(options.filterByFormula)}`);
            }
            if (options.fields) {
                options.fields.forEach(f => { params.push(`fields%5B%5D=${encodeURIComponent(f)}`); });
            }
            if (options.maxRecords) {
                params.push(`maxRecords=${options.maxRecords}`);
            }
            if (offset) { params.push(`offset=${offset}`); }
            if (params.length > 0) { url += '?' + params.join('&'); }
            const response = await this.request('GET', url);
            allRecords = allRecords.concat(response.records || []);
            offset = response.offset;
        } while (offset);
        const result = { records: allRecords };
        this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
    }

    async getById(table, id) { return await this.request('GET', `${table}/${id}`); }

    async create(table, fields) {
        const result = await this.request('POST', table, { fields });
        this.invalidateCache(table);
        return result;
    }

    async update(table, id, fields) {
        const result = await this.request('PATCH', `${table}/${id}`, { fields });
        this.invalidateCache(table);
        return result;
    }

    async delete(table, id) {
        const result = await this.request('DELETE', `${table}/${id}`);
        this.invalidateCache(table);
        return result;
    }

    invalidateCache(table) {
        for (const key of this.cache.keys()) {
            if (key.startsWith(table)) { this.cache.delete(key); }
        }
    }

    clearCache() { this.cache.clear(); }
}

module.exports = new AirtableService();

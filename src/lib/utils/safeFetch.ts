// A really basic fetch wrapper which throws on non-ok response codes

export default async function safeFetch(input: RequestInfo | URL, options?: RequestInit) {
    const req = await fetch(input, options);
    if (!req.ok) throw new Error("Request returned non-ok");
    return req;
}
// A really basic fetch wrapper which throws on non-ok response codes

export default async function safeFetch(input: RequestInfo, options?: RequestInit) {
    const req = await fetch(input, options);
    if (!req.ok) throw new Error("Request returned non-ok");
    return req;
}
import {apiAddress} from "../../../../config.js";

export function parsePropfindXML(xmlText) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    function parseTag(element, tag) {
        return element.getElementsByTagNameNS("DAV:", tag)
    }

    function parseTagFirst(element, tag) {
        return parseTag(element, tag)?.[0]
    }

    const responses = [...parseTag(xml, "response")];

    return responses.map(response => {

        const get = (tag) =>
            parseTagFirst(response, tag)?.textContent || "";

        const prop = parseTagFirst(response, "prop");

        const href = get("href");
        const name = decodeURIComponent(get("displayname"));
        const size = parseInt(get("getcontentlength")) || 0;
        const etag = get("getetag");
        const lastModified = new Date(get("getlastmodified"));
        const mimeType = get("getcontenttype");
        const isFolder = !!parseTagFirst(prop, "collection");
        const url = (apiAddress + href).replace(/([^:]\/)\/+/g, '$1')

        return {name, isFolder, href, size, etag, mimeType, lastModified, url};
    })
}
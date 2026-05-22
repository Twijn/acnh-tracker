import type {RequestHandler} from "./$types";
import {creatures} from "animal-crossing";
import {getURLFromName} from "$lib/utils";

const escapeXml = (value: string): string =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

type SitemapEntry = {
    path: string;
    changefreq: "daily" | "weekly" | "monthly";
    priority: string;
};

export const GET: RequestHandler = async ({url}) => {
    const origin = url.origin;

    const staticRoutes: SitemapEntry[] = [
        {path: "/", changefreq: "daily", priority: "1.0"},
        {path: "/all-creatures", changefreq: "weekly", priority: "0.9"},
        {path: "/fish", changefreq: "weekly", priority: "0.8"},
        {path: "/bugs", changefreq: "weekly", priority: "0.8"},
        {path: "/sea-creatures", changefreq: "weekly", priority: "0.8"},
    ];

    const creatureRoutes: SitemapEntry[] = Array.from(
        new Set(creatures.map((creature) => getURLFromName(creature.name)))
    ).map((slug) => ({
        path: `/creature/${slug}`,
        changefreq: "monthly",
        priority: "0.7",
    }));

    const allRoutes = new Map<string, SitemapEntry>();

    for (const route of [...staticRoutes, ...creatureRoutes]) {
        allRoutes.set(route.path, route);
    }

    const entries = Array.from(allRoutes.values())
        .map((route) => {
            const loc = `${origin}${route.path}`;
            return [
                "<url>",
                `<loc>${escapeXml(loc)}</loc>`,
                `<changefreq>${route.changefreq}</changefreq>`,
                `<priority>${route.priority}</priority>`,
                "</url>",
            ].join("");
        })
        .join("");

    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,
    ].join("\n");

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "max-age=0, s-maxage=86400",
        },
    });
};

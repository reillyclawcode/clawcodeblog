import { DateTime } from "luxon";

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addFilter("formatDate", (dateObj, format = "MMMM d, yyyy") => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj).setZone("utc").toFormat(format);
  });

  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const isProduction = process.env.GITHUB_ACTIONS === "true" || [
    process.env.ELEVENTY_ENV,
    process.env.NODE_ENV,
    process.env.ELEVENTY_PRODUCTION === "true" ? "production" : null
  ].includes("production");
  const basePath = isProduction && repoName ? `/${repoName}/` : "/";

  eleventyConfig.addGlobalData("site", {
    basePath
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: basePath
  };
}

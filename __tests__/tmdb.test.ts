import { TmdbClient } from "@/lib/tmdb";

describe("TmdbClient", () => {
  it("initializes with default base URL and language", () => {
    const client = new TmdbClient({
      apiKey: "test_key",
      baseUrl: "https://api.themoviedb.org/3/",
      defaultLanguage: "en-US",
    });

    expect(client).toBeDefined();
    expect(client.defaultLanguage).toBe("en-US");
    expect(client.trending).toBeDefined();
    expect(client.movies).toBeDefined();
    expect(client.tv).toBeDefined();
    expect(client.tvSeasons).toBeDefined();
    expect(client.tvEpisodes).toBeDefined();
    expect(client.search).toBeDefined();
    expect(client.discover).toBeDefined();
    expect(client.genres).toBeDefined();
    expect(client.people).toBeDefined();
    expect(client.configuration).toBeDefined();
    expect(client.watchProviders).toBeDefined();
    expect(client.collections).toBeDefined();
    expect(client.companies).toBeDefined();
    expect(client.networks).toBeDefined();
    expect(client.certifications).toBeDefined();
    expect(client.find).toBeDefined();
    expect(client.keywords).toBeDefined();
    expect(client.reviews).toBeDefined();
    expect(client.account).toBeDefined();
    expect(client.authentication).toBeDefined();
    expect(client.lists).toBeDefined();
  });
});

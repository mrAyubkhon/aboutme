// Game Statistics API Service
class GameStatsService {
  constructor() {
    this.steamApiKey = import.meta.env.VITE_STEAM_API_KEY;
    this.faceitApiKey = import.meta.env.VITE_FACEIT_API_KEY;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Steam API Methods
  async getSteamProfile(steamId) {
    const cacheKey = `steam_profile_${steamId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.steamApiKey}&steamids=${steamId}`
      );
      
      if (!response.ok) {
        throw new Error(`Steam API error: ${response.status}`);
      }
      
      const data = await response.json();
      const profile = data.response.players[0];
      
      this.setCachedData(cacheKey, profile);
      return profile;
    } catch (error) {
      console.error('Error fetching Steam profile:', error);
      return null;
    }
  }

  async getSteamGames(steamId) {
    const cacheKey = `steam_games_${steamId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${this.steamApiKey}&steamid=${steamId}&format=json&include_appinfo=true`
      );
      
      if (!response.ok) {
        throw new Error(`Steam API error: ${response.status}`);
      }
      
      const data = await response.json();
      const games = data.response?.games || [];
      
      this.setCachedData(cacheKey, games);
      return games;
    } catch (error) {
      console.error('Error fetching Steam games:', error);
      return [];
    }
  }

  // Faceit API Methods
  async getFaceitProfile(faceitNickname) {
    const cacheKey = `faceit_profile_${faceitNickname}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(faceitNickname)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.faceitApiKey}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Faceit API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching Faceit profile:', error);
      return null;
    }
  }

  async getFaceitStats(faceitPlayerId, game = 'csgo') {
    const cacheKey = `faceit_stats_${faceitPlayerId}_${game}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `https://open.faceit.com/data/v4/players/${faceitPlayerId}/stats/${game}`,
        {
          headers: {
            'Authorization': `Bearer ${this.faceitApiKey}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Faceit API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching Faceit stats:', error);
      return null;
    }
  }

  async getFaceitMatches(faceitPlayerId, limit = 20) {
    const cacheKey = `faceit_matches_${faceitPlayerId}_${limit}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `https://open.faceit.com/data/v4/players/${faceitPlayerId}/history?game=csgo&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.faceitApiKey}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Faceit API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching Faceit matches:', error);
      return null;
    }
  }

  // Combined Data Methods
  async getAllGameData(steamId, faceitNickname) {
    try {
      const [steamProfile, steamGames, faceitProfile] = await Promise.all([
        this.getSteamProfile(steamId),
        this.getSteamGames(steamId),
        this.getFaceitProfile(faceitNickname)
      ]);

      let faceitStats = null;
      let faceitMatches = null;

      if (faceitProfile?.player_id) {
        const [stats, matches] = await Promise.all([
          this.getFaceitStats(faceitProfile.player_id),
          this.getFaceitMatches(faceitProfile.player_id)
        ]);
        faceitStats = stats;
        faceitMatches = matches;
      }

      return {
        steam: {
          profile: steamProfile,
          games: steamGames
        },
        faceit: {
          profile: faceitProfile,
          stats: faceitStats,
          matches: faceitMatches
        }
      };
    } catch (error) {
      console.error('Error fetching all game data:', error);
      return null;
    }
  }

  // Cache Management
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Utility Methods
  formatPlaytime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  calculateWinRate(wins, total) {
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
  }

  getRecentGames(games, limit = 6) {
    return games
      .filter(game => game.playtime_forever > 0)
      .sort((a, b) => b.rtime_last_played - a.rtime_last_played)
      .slice(0, limit);
  }

  getRecentMatches(matches, limit = 10) {
    return matches?.items?.slice(0, limit) || [];
  }
}

// Create singleton instance
const gameStatsService = new GameStatsService();

export default gameStatsService;
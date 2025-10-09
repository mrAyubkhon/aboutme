/**
 * Real API Service for Steam and Faceit Integration
 * Uses actual API endpoints with environment variables
 */

// Environment variables from .env file
const STEAM_API_KEY = import.meta.env.VITE_STEAM_API_KEY;
const FACEIT_API_KEY = import.meta.env.VITE_FACEIT_API_KEY;
const STEAM_ID = import.meta.env.VITE_STEAM_ID;
const FACEIT_NICK = import.meta.env.VITE_FACEIT_NICK;

// API Base URLs
const STEAM_API_BASE = 'https://api.steampowered.com';
const FACEIT_API_BASE = 'https://open.faceit.com/data/v4';

/**
 * Steam API Service
 */
class SteamApiService {
  /**
   * Get Steam profile information
   * @param {string} steamId - Steam ID64
   * @returns {Promise<Object>} Profile data
   */
  static async getSteamProfile(steamId = STEAM_ID) {
    try {
      const response = await fetch(
        `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
      );
      
      if (!response.ok) {
        throw new Error(`Steam API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response.players[0] || null;
    } catch (error) {
      console.error('Error fetching Steam profile:', error);
      throw error;
    }
  }

  /**
   * Get recently played games from Steam
   * @param {string} steamId - Steam ID64
   * @returns {Promise<Array>} List of recent games
   */
  static async getSteamRecentGames(steamId = STEAM_ID) {
    try {
      const response = await fetch(
        `${STEAM_API_BASE}/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&count=10`
      );
      
      if (!response.ok) {
        throw new Error(`Steam API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response.games || [];
    } catch (error) {
      console.error('Error fetching Steam recent games:', error);
      throw error;
    }
  }

  /**
   * Get all owned games from Steam
   * @param {string} steamId - Steam ID64
   * @returns {Promise<Array>} List of all games
   */
  static async getSteamOwnedGames(steamId = STEAM_ID) {
    try {
      const response = await fetch(
        `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
      );
      
      if (!response.ok) {
        throw new Error(`Steam API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response.games || [];
    } catch (error) {
      console.error('Error fetching Steam owned games:', error);
      throw error;
    }
  }

  /**
   * Get Steam level
   * @param {string} steamId - Steam ID64
   * @returns {Promise<number>} Steam level
   */
  static async getSteamLevel(steamId = STEAM_ID) {
    try {
      const response = await fetch(
        `${STEAM_API_BASE}/IPlayerService/GetSteamLevel/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}`
      );
      
      if (!response.ok) {
        throw new Error(`Steam API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response.player_level || 0;
    } catch (error) {
      console.error('Error fetching Steam level:', error);
      return 0;
    }
  }
}

/**
 * Faceit API Service
 */
class FaceitApiService {
  /**
   * Get Faceit player profile by nickname
   * @param {string} nickname - Faceit nickname
   * @returns {Promise<Object>} Player profile data
   */
  static async getFaceitProfile(nickname = FACEIT_NICK) {
    try {
      const response = await fetch(
        `${FACEIT_API_BASE}/players?nickname=${encodeURIComponent(nickname)}`,
        {
          headers: {
            'Authorization': `Bearer ${FACEIT_API_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Faceit API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Faceit profile:', error);
      throw error;
    }
  }

  /**
   * Get Faceit CS2 statistics
   * @param {string} playerId - Faceit player ID
   * @returns {Promise<Object>} CS2 statistics
   */
  static async getFaceitStats(playerId) {
    try {
      const response = await fetch(
        `${FACEIT_API_BASE}/players/${playerId}/stats/cs2`,
        {
          headers: {
            'Authorization': `Bearer ${FACEIT_API_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Faceit API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Faceit stats:', error);
      throw error;
    }
  }

  /**
   * Get Faceit match history
   * @param {string} playerId - Faceit player ID
   * @param {number} limit - Number of matches to fetch
   * @returns {Promise<Object>} Match history
   */
  static async getFaceitMatches(playerId, limit = 20) {
    try {
      const response = await fetch(
        `${FACEIT_API_BASE}/players/${playerId}/history?game=cs2&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${FACEIT_API_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Faceit API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Faceit matches:', error);
      throw error;
    }
  }

  /**
   * Get Faceit player by Steam ID
   * @param {string} steamId - Steam ID64
   * @returns {Promise<Object>} Player data
   */
  static async getFaceitPlayerBySteamId(steamId = STEAM_ID) {
    try {
      const response = await fetch(
        `${FACEIT_API_BASE}/players?game=cs2&game_player_id=${steamId}`,
        {
          headers: {
            'Authorization': `Bearer ${FACEIT_API_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Faceit API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Faceit player by Steam ID:', error);
      throw error;
    }
  }
}

/**
 * Combined API Service
 */
class GameStatsApiService {
  /**
   * Get all game statistics (Steam + Faceit)
   * @returns {Promise<Object>} Combined game statistics
   */
  static async getAllGameStats() {
    try {
      console.log('🚀 Fetching real game statistics...');
      console.log('📋 Using Steam ID:', STEAM_ID);
      console.log('📋 Using Faceit Nick:', FACEIT_NICK);

      // Fetch Steam data
      const [steamProfile, steamRecentGames, steamOwnedGames, steamLevel] = await Promise.all([
        SteamApiService.getSteamProfile(),
        SteamApiService.getSteamRecentGames(),
        SteamApiService.getSteamOwnedGames(),
        SteamApiService.getSteamLevel()
      ]);

      // Fetch Faceit data
      let faceitProfile = null;
      let faceitStats = null;
      let faceitMatches = null;

      try {
        faceitProfile = await FaceitApiService.getFaceitProfile();
        
        if (faceitProfile?.player_id) {
          [faceitStats, faceitMatches] = await Promise.all([
            FaceitApiService.getFaceitStats(faceitProfile.player_id),
            FaceitApiService.getFaceitMatches(faceitProfile.player_id)
          ]);
        }
      } catch (faceitError) {
        console.warn('Faceit API error, using Steam ID fallback:', faceitError.message);
        
        try {
          const faceitPlayerBySteam = await FaceitApiService.getFaceitPlayerBySteamId();
          if (faceitPlayerBySteam?.player_id) {
            faceitProfile = faceitPlayerBySteam;
            [faceitStats, faceitMatches] = await Promise.all([
              FaceitApiService.getFaceitStats(faceitProfile.player_id),
              FaceitApiService.getFaceitMatches(faceitProfile.player_id)
            ]);
          }
        } catch (steamIdError) {
          console.warn('Faceit Steam ID lookup failed:', steamIdError.message);
        }
      }

      const result = {
        steam: {
          profile: {
            ...steamProfile,
            level: steamLevel
          },
          recentGames: steamRecentGames,
          ownedGames: steamOwnedGames,
          totalGames: steamOwnedGames?.length || 0,
          totalPlaytime: steamOwnedGames?.reduce((acc, game) => acc + (game.playtime_forever || 0), 0) || 0
        },
        faceit: {
          profile: faceitProfile,
          stats: faceitStats,
          matches: faceitMatches,
          elo: faceitProfile?.games?.cs2?.faceit_elo || 0,
          skillLevel: faceitProfile?.games?.cs2?.skill_level || 0,
          totalMatches: faceitStats?.lifetime?.Matches || 0,
          winRate: faceitStats?.lifetime?.Average || 0,
          kdRatio: faceitStats?.lifetime?.['Average K/D Ratio'] || 0
        }
      };

      console.log('✅ Successfully fetched game statistics:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching game statistics:', error);
      throw error;
    }
  }

  /**
   * Format playtime in minutes to hours and minutes
   * @param {number} minutes - Playtime in minutes
   * @returns {string} Formatted playtime
   */
  static formatPlaytime(minutes) {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Format timestamp to relative time
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Relative time string
   */
  static formatRelativeTime(timestamp) {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
}

// Export services
export default GameStatsApiService;
export { SteamApiService, FaceitApiService };

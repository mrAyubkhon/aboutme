/**
 * Game Statistics Service for Steam and Faceit integration
 */

class GameStatsService {
  constructor() {
    this.steamApiKey = import.meta.env.VITE_STEAM_API_KEY || '';
    this.faceitApiKey = import.meta.env.VITE_FACEIT_API_KEY || '';
    this.steamBaseUrl = 'https://api.steampowered.com';
    this.faceitBaseUrl = 'https://open.faceit.com/data/v4';
  }

  // Check API configuration status
  getApiStatus() {
    return {
      steam: {
        configured: !!this.steamApiKey,
        key: this.steamApiKey ? `${this.steamApiKey.substring(0, 8)}...` : 'Not configured'
      },
      faceit: {
        configured: !!this.faceitApiKey,
        key: this.faceitApiKey ? `${this.faceitApiKey.substring(0, 8)}...` : 'Not configured'
      }
    };
  }

  // Test API connectivity
  async testSteamApi() {
    if (!this.steamApiKey) {
      return { success: false, error: 'Steam API key not configured' };
    }

    try {
      // Test with a simple request
      const url = `${this.steamBaseUrl}/ISteamUser/GetPlayerSummaries/v0002/?key=${this.steamApiKey}&steamids=76561199132216007`;
      const response = await this.request(url);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testFaceitApi() {
    if (!this.faceitApiKey) {
      return { success: false, error: 'Faceit API key not configured' };
    }

    try {
      const url = `${this.faceitBaseUrl}/players?nickname=Ayu6i`;
      const response = await this.request(url, {
        headers: {
          'Authorization': `Bearer ${this.faceitApiKey}`,
        },
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async request(url, options = {}) {
    try {
      console.log(`🔄 Making API request to: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Ayubi-Dashboard/1.0',
          ...options.headers,
        },
        ...options,
      });

      console.log(`📊 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ API request successful`);
      return data;
    } catch (error) {
      console.error('❌ Game stats request failed:', error);
      throw error;
    }
  }

  // Steam API methods
  async getSteamUser(steamId) {
    if (!this.steamApiKey) {
      console.warn('⚠️ Steam API key not configured, using mock data');
      throw new Error('Steam API key not configured');
    }

    console.log(`🎮 Fetching Steam user data for ID: ${steamId}`);
    
    // Clean steamId - remove any URL parts
    const cleanSteamId = steamId.replace(/[^0-9]/g, '');
    
    const url = `${this.steamBaseUrl}/ISteamUser/GetPlayerSummaries/v0002/?key=${this.steamApiKey}&steamids=${cleanSteamId}`;
    const response = await this.request(url);
    
    if (response.response && response.response.players && response.response.players.length > 0) {
      const user = response.response.players[0];
      console.log(`✅ Steam user found: ${user.personaname}`);
      return user;
    }
    
    throw new Error('Steam user not found');
  }

  async getSteamGameStats(steamId, gameId) {
    if (!this.steamApiKey) {
      throw new Error('Steam API key not configured');
    }

    const url = `${this.steamBaseUrl}/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${gameId}&key=${this.steamApiKey}&steamid=${steamId}`;
    
    try {
      const response = await this.request(url);
      return response.playerstats;
    } catch (error) {
      // Game might not have stats available
      console.warn('Steam game stats not available:', error);
      return null;
    }
  }

  async getSteamOwnedGames(steamId) {
    if (!this.steamApiKey) {
      throw new Error('Steam API key not configured');
    }

    const url = `${this.steamBaseUrl}/IPlayerService/GetOwnedGames/v0001/?key=${this.steamApiKey}&steamid=${steamId}&format=json&include_appinfo=true`;
    const response = await this.request(url);
    
    return response.response?.games || [];
  }

  // Faceit API methods
  async getFaceitPlayer(nickname) {
    if (!this.faceitApiKey) {
      console.warn('⚠️ Faceit API key not configured, using mock data');
      throw new Error('Faceit API key not configured');
    }

    console.log(`🏆 Fetching Faceit player data for: ${nickname}`);
    
    const url = `${this.faceitBaseUrl}/players?nickname=${encodeURIComponent(nickname)}`;
    const response = await this.request(url, {
      headers: {
        'Authorization': `Bearer ${this.faceitApiKey}`,
      },
    });

    console.log(`✅ Faceit player found: ${response.nickname}`);
    return response;
  }

  async getFaceitStats(playerId, gameId = 'csgo') {
    if (!this.faceitApiKey) {
      throw new Error('Faceit API key not configured');
    }

    const url = `${this.faceitBaseUrl}/players/${playerId}/stats/${gameId}`;
    const response = await this.request(url, {
      headers: {
        'Authorization': `Bearer ${this.faceitApiKey}`,
      },
    });

    return response;
  }

  async getFaceitMatches(playerId, gameId = 'csgo', limit = 10) {
    if (!this.faceitApiKey) {
      throw new Error('Faceit API key not configured');
    }

    const url = `${this.faceitBaseUrl}/players/${playerId}/history?game=${gameId}&limit=${limit}`;
    const response = await this.request(url, {
      headers: {
        'Authorization': `Bearer ${this.faceitApiKey}`,
      },
    });

    return response;
  }

  // Utility methods
  getSteamIdFromUrl(profileUrl) {
    // Extract Steam ID from various Steam profile URL formats
    const steamIdRegex = /steamcommunity\.com\/(?:profiles|id)\/([^\/\?]+)/;
    const match = profileUrl.match(steamIdRegex);
    
    if (match) {
      const identifier = match[1];
      
      // If it's numeric, it's already a Steam ID
      if (/^\d+$/.test(identifier)) {
        return identifier;
      }
      
      // If it's a custom URL, we need to resolve it (this would require additional API call)
      // For now, we'll return the identifier and handle it in the calling code
      return identifier;
    }
    
    throw new Error('Invalid Steam profile URL');
  }

  formatSteamPlaytime(minutes) {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m`;
    }
  }

  formatFaceitElo(elo) {
    const rank = this.getFaceitRankFromElo(elo);
    return {
      elo,
      rank,
      rankName: this.getFaceitRankName(rank)
    };
  }

  getFaceitRankFromElo(elo) {
    if (elo < 800) return 1;
    if (elo < 950) return 2;
    if (elo < 1100) return 3;
    if (elo < 1250) return 4;
    if (elo < 1400) return 5;
    if (elo < 1550) return 6;
    if (elo < 1700) return 7;
    if (elo < 1850) return 8;
    if (elo < 2000) return 9;
    if (elo < 2150) return 10;
    return 10;
  }

  getFaceitRankName(rank) {
    const rankNames = {
      1: 'Silver I',
      2: 'Silver II',
      3: 'Silver III',
      4: 'Silver IV',
      5: 'Silver Elite',
      6: 'Silver Elite Master',
      7: 'Gold Nova I',
      8: 'Gold Nova II',
      9: 'Gold Nova III',
      10: 'Gold Nova Master'
    };
    
    return rankNames[rank] || 'Unknown';
  }

  // Mock data for development/testing
  getMockSteamData() {
    return {
      steamid: '76561198000000000',
      personaname: 'TestUser',
      profileurl: 'https://steamcommunity.com/id/testuser/',
      avatar: 'https://avatars.steamstatic.com/avatar.jpg',
      personastate: 1,
      realname: 'Test User',
      loccountrycode: 'US',
      ownedGames: [
        {
          appid: 730,
          name: 'Counter-Strike: Global Offensive',
          playtime_forever: 1440,
          playtime_2weeks: 120,
          img_icon_url: 'csgo_icon.jpg',
          img_logo_url: 'csgo_logo.jpg'
        },
        {
          appid: 570,
          name: 'Dota 2',
          playtime_forever: 2880,
          playtime_2weeks: 60,
          img_icon_url: 'dota2_icon.jpg',
          img_logo_url: 'dota2_logo.jpg'
        }
      ],
      gameStats: {
        csgo: {
          stats: [
            { name: 'total_kills', value: 1250 },
            { name: 'total_deaths', value: 1100 },
            { name: 'total_wins', value: 180 },
            { name: 'total_rounds_played', value: 400 }
          ]
        }
      }
    };
  }

  getMockFaceitData() {
    return {
      player_id: 'test-player-id',
      nickname: 'TestFaceitUser',
      avatar: 'https://faceit.com/avatar.jpg',
      country: 'US',
      games: {
        csgo: {
          faceit_elo: 1850,
          skill_level: 8,
          region: 'EU',
          game_player_id: 'csgo-test-id',
          game_player_name: 'TestCSGO',
          skill_level_label: 'Gold Nova II',
          regions: {
            EU: {
              selected_ladder_id: 'eu-ladder-id',
              selected_ladder_name: 'EU Ladder'
            }
          }
        }
      },
      matches: [
        {
          match_id: 'test-match-1',
          game_id: 'csgo',
          region: 'EU',
          match_type: '5v5',
          teams: {
            faction1: {
              team_id: 'team1',
              nickname: 'Team Alpha',
              avatar: 'team1_avatar.jpg',
              players: [
                {
                  player_id: 'test-player-id',
                  nickname: 'TestFaceitUser',
                  avatar: 'player_avatar.jpg',
                  skill_level: 8,
                  skill_level_label: 'Gold Nova II'
                }
              ]
            },
            faction2: {
              team_id: 'team2',
              nickname: 'Team Beta',
              avatar: 'team2_avatar.jpg',
              players: []
            }
          },
          started_at: Math.floor(Date.now() / 1000) - 3600,
          finished_at: Math.floor(Date.now() / 1000) - 1800,
          status: 'finished'
        }
      ]
    };
  }
}

export default new GameStatsService();

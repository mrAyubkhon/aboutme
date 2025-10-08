# Game Statistics Setup Guide

## Overview
The Game Statistics page allows you to track your gaming performance across Steam and Faceit platforms. This guide will help you set up the integration.

## Features
- **Steam Integration**: View your Steam profile, games library, and playtime statistics
- **Faceit Integration**: Track your competitive gaming performance, ELO, and match history
- **Real-time Data**: Automatic data refresh and caching
- **Demo Mode**: Works without API keys using mock data for demonstration

## Setup Instructions

### 1. Steam API Setup

1. **Get Steam API Key**:
   - Visit [Steam Web API Key](https://steamcommunity.com/dev/apikey)
   - Sign in with your Steam account
   - Enter a domain name (can be localhost for development)
   - Copy your API key

2. **Get Your Steam ID**:
   - Visit your Steam profile page
   - Copy your Steam ID from the URL
   - Format: `76561198000000000` (17-digit number)
   - Or use your profile URL: `https://steamcommunity.com/id/yourusername`

### 2. Faceit API Setup

1. **Get Faceit API Key**:
   - Visit [Faceit Developer Portal](https://developers.faceit.com/)
   - Sign up for a developer account
   - Create a new application
   - Copy your API key

2. **Get Your Faceit Nickname**:
   - Visit your Faceit profile
   - Copy your exact nickname (case-sensitive)

### 3. Environment Configuration

Create a `.env` file in the project root:

```env
# Game Statistics API Keys
REACT_APP_STEAM_API_KEY=your_steam_api_key_here
REACT_APP_FACEIT_API_KEY=your_faceit_api_key_here
```

### 4. Application Configuration

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Navigate to Game Statistics**:
   - Click on "Game Stats" in the navigation
   - Go to the "Settings" tab

3. **Configure your accounts**:
   - Enter your Steam ID or profile URL
   - Enter your Faceit nickname
   - Click "Save" for each account

## API Endpoints

### Backend Endpoints

- `GET /api/v1/game-stats/health` - Health check for game stats services
- `GET /api/v1/game-stats/steam/{steam_id}` - Steam statistics (placeholder)
- `GET /api/v1/game-stats/faceit/{nickname}` - Faceit statistics (placeholder)

### Frontend Integration

The frontend uses the `gameStatsService.js` to communicate with both Steam and Faceit APIs:

```javascript
// Steam API calls
gameStatsService.getSteamUser(steamId)
gameStatsService.getSteamOwnedGames(steamId)
gameStatsService.getSteamGameStats(steamId, gameId)

// Faceit API calls
gameStatsService.getFaceitPlayer(nickname)
gameStatsService.getFaceitStats(playerId)
gameStatsService.getFaceitMatches(playerId)
```

## Data Structure

### Steam Data
```javascript
{
  profile: {
    steamid: "76561198000000000",
    personaname: "Player Name",
    avatar: "avatar_url",
    realname: "Real Name",
    loccountrycode: "US",
    timecreated: 1234567890
  },
  games: [
    {
      appid: 730,
      name: "Counter-Strike 2",
      playtime_forever: 2847,
      playtime_2weeks: 45,
      img_icon_url: "game_icon_url"
    }
  ],
  stats: {
    total_games: 156,
    total_playtime: 8923,
    games_played_2weeks: 12,
    playtime_2weeks: 234
  }
}
```

### Faceit Data
```javascript
{
  player: {
    player_id: "player_id",
    nickname: "PlayerNickname",
    avatar: "avatar_url",
    country: "US",
    membership_type: "premium"
  },
  csgo_stats: {
    game_id: "csgo",
    region: "EU",
    skill_level: 8,
    faceit_elo: 2456,
    matches: 423,
    wins: 267,
    losses: 156,
    win_rate: 63.1,
    avg_kd: 1.34,
    avg_hs: 45.2,
    recent_results: ["W", "W", "L", "W", "L", "W", "W", "W"]
  }
}
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**:
   - Verify your API keys are correctly set in `.env`
   - Restart the development server after adding environment variables
   - Check that API keys are valid and have proper permissions

2. **Steam ID Not Found**:
   - Ensure your Steam profile is public
   - Verify the Steam ID format (17 digits)
   - Try using your Steam profile URL instead

3. **Faceit Data Not Loading**:
   - Check that your Faceit nickname is exact (case-sensitive)
   - Ensure your Faceit profile is public
   - Verify your API key has proper permissions

4. **CORS Issues**:
   - The frontend makes direct API calls to Steam/Faceit
   - If CORS issues occur, consider using a proxy or backend integration

### Demo Mode

If API keys are not configured, the application will show demo data:
- Mock Steam profile and games
- Sample Faceit statistics
- All features work but with placeholder data

## Security Notes

- **Never commit API keys to version control**
- **Use environment variables for sensitive data**
- **Consider rate limiting for production use**
- **Implement proper error handling**

## Future Enhancements

- [ ] Backend proxy for API calls (avoid CORS)
- [ ] Data caching and persistence
- [ ] Historical statistics tracking
- [ ] Achievement system integration
- [ ] Team statistics
- [ ] Tournament tracking
- [ ] Export functionality

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify API keys and account information
3. Test API endpoints directly
4. Check network connectivity

For additional help, refer to:
- [Steam Web API Documentation](https://developer.valvesoftware.com/wiki/Steam_Web_API)
- [Faceit API Documentation](https://developers.faceit.com/docs)

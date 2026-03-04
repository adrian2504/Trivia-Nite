# 🎮 Trivia Game Night

A fun, interactive trivia game website with a beautiful glass-morphism UI and funny animations!

## Features

✨ **Complete Game Flow**
- Welcome screen with smooth animations
- Create custom questions or import from JSON file
- Set up multiple teams with custom names, players, and colors
- Flexible point system with optional negative marking
- Turn-based gameplay with visual feedback
- Animated answer reveals
- Top 3 podium display with rankings

🎨 **Beautiful UI**
- Glass-morphism design
- Smooth animations and transitions
- Responsive layout for all devices
- Colorful gradient backgrounds
- Funny popup messages throughout the game

😄 **Fun Elements**
- Random funny messages during gameplay
- Celebration animations for correct answers
- Encouraging messages for wrong answers
- Bouncing and sliding animations

## How to Use

1. **Open the game**: Simply open `index.html` in your web browser

2. **Start a new game**: Click "Start New Game" on the welcome screen

3. **Set up questions**:
   - Click "Create Questions" to manually add questions
   - OR click "Import from File" to load questions from a JSON file (see format below)

4. **Configure teams**:
   - Enter the number of teams (2-10)
   - Set team names, player names, and colors
   - Choose points per question
   - Enable/disable negative marking

5. **Play the game**:
   - Each team takes turns answering questions
   - Click on an answer option
   - See the correct answer revealed
   - Move to the next question

6. **View results**:
   - See the top 3 teams on the podium
   - View complete rankings

## JSON File Format

To import questions, create a JSON file with this structure:

```json
{
  "questions": [
    {
      "question": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}
```

- `correctAnswer` is the index (0-3) of the correct option
- See `game-data.json` for a complete example

## Customization

You can easily customize:
- Colors in `styles.css`
- Funny messages in `app.js` (funnyMessages, wrongAnswerMessages, correctAnswerMessages arrays)
- Animation speeds and effects in `styles.css`
- Point values and game rules

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Credits

Designed by Adrian Dsouza

---

Enjoy your trivia game night! 🎉

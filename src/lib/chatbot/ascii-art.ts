/**
 * ASCII Art Collection for Chatbot Appreciation Responses
 * Returns fun ASCII art when the chatbot receives praise
 */

export const asciiArt = {
  heart: `
    <3 <3 <3 <3 <3 <3 <3
    <3               <3
    <3  Thank you!   <3
    <3               <3
    <3 <3 <3 <3 <3 <3 <3`,

  star: `
       * * * * *
      *         *
     *  You're   *
    *  amazing!   *
     *           *
      * * * * * *`,

  robot: `
      [=========]
      | o     o |
      |    >    |
      |  \\___/  |
      [=========]
       |[-----]|
       || THX ||
       |[-----]|
       d       b`,

  celebration: `
    * . * . * . * . *
    . * . * . * . * .
    Thanks! You made
    my circuits happy!
    * . * . * . * . *`,

  dog: `
        __
       /  \\
      /|oo \\
     (_|  /_)
      _'@/_ \\    _
     |     | \\   \\\\
     |  \\  |  \\  ))
     \\___|  /  //
      ___|_)__//
     (_______))
    Woof! Thanks!`,

  cat: `
     /\\_/\\
    ( o.o )
     > ^ <
    Purrfect feedback!
    Thank mew!`,

  sparkles: `
    *~*~*~*~*~*~*~*
    ~*~*~*~*~*~*~*~
    * Thanks for  *
    * the kind    *
    * words!      *
    ~*~*~*~*~*~*~*~
    *~*~*~*~*~*~*~*`,

  trophy: `
         ___________
        '._==_==_=_.'
        .-\\:      /-.
       | (|:.     |) |
        '-|:.     |-'
          \\::.    /
           '::. .'
            ) (
          _.' '._
         '-------'
      You're the best!`,

  smiley: `
     .-""""""-.
   .'          '.
  /   O      O   \\
 |                |
 |    \\  __  /    |
  \\    '.__.'    /
   '.            .'
     '-.......-'
   Thanks so much!`,

  flower: `
        @@@@@
       @@@@@@@
      @@@@@@@@@
       @@@@@@@
        @@@@@
          |
        \\~|~/
         \\|/
    Blooming with joy!`
};

/**
 * Detect if a message contains praise or positive feedback
 */
export function detectPraise(message: string): boolean {
  const praisePatterns = [
    // Direct praise
    /\b(thank you|thanks|thx|ty)\b/i,
    /\b(great|awesome|amazing|fantastic|excellent|wonderful|brilliant|perfect)\b/i,
    /\b(good job|nice work|well done|great work|nice job)\b/i,
    /\b(helpful|useful|helped me|you helped)\b/i,
    /\b(appreciate|appreciated|appreciation)\b/i,
    /\b(love it|love this|loved it|loving)\b/i,
    /\b(impressed|impressive|incredible|outstanding)\b/i,


    // Exclamations of joy
    /\b(wow|woah|whoa|yay|hooray|yes|yeah)\b!+/i,

    // Specific to AI/chatbot context
    /\b(good bot|good ai|smart|clever|intelligent)\b/i,
    /\b(nailed it|spot on|exactly right|correct)\b/i,
  ];

  return praisePatterns.some(pattern => pattern.test(message));
}

/**
 * Get a random ASCII art response
 */
export function getRandomAsciiArt(): string {
  const artKeys = Object.keys(asciiArt);
  const randomKey = artKeys[Math.floor(Math.random() * artKeys.length)];
  return asciiArt[randomKey as keyof typeof asciiArt];
}

/**
 * Format ASCII art for response
 */
export function formatAsciiResponse(originalResponse: string, art: string): string {
  return `${originalResponse}

\`\`\`
${art}
\`\`\``;
}
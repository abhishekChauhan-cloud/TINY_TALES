// Tiny Tales — Procedural Demo Story Engine
// Crafts heartwarming, original, 120-180 word stories across all genres and moods.

function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function capitalize(str) {
  if (!str) return 'The Little Spark';
  return str.split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function extractSubject(prompt) {
  let clean = prompt.trim().replace(/[.!?]+$/, '');
  clean = clean.replace(/^(a|an|the)\s+/i, '');
  
  const clauseMatch = clean.match(/^([a-z0-9\s-]+?)(?:\s+(?:who|which|that|where|collects|collecting|with|wearing|living|flying|hidden|sitting|at|in|on|beside|under|inside)\b)/i);
  if (clauseMatch && clauseMatch[1].trim().length >= 3) {
    clean = clauseMatch[1].trim();
  } else {
    const words = clean.split(/\s+/);
    if (words.length > 3) {
      clean = words.slice(0, 3).join(' ');
    }
  }
  return capitalize(clean);
}

const templates = {
  Fantasy: {
    Cozy: [
      {
        title: (s) => `The Secret Hearth of ${s}`,
        paragraphs: (p, s) => [
          `Tucked beyond the mossy stone archway of the whispering woods lived ${p}. While the rest of the kingdom endlessly chased after polished crowns and dragon hoard gold, quiet afternoons here were spent listening to the soft humming of kettle tea on a river-stone hearth. The cottage walls smelled comfortably of dried cloves, sweet honey, and ancient parchment scrolls.`,
          `One golden dusk, a wandering sprite lost its way in the chilly silver mist. Guided solely by the warm amber glow radiating through the cottage window, the weary traveler tapped gently against the sill. Without a single second of hesitation, a steaming ceramic mug of spiced cider and a gentle smile were offered in welcoming comfort.`,
          `In that snug corner of the enchanted valley, true magic was not measured in lightning strikes or grand spells, but in the peaceful stillness of an open heart. Some treasures, it turns out, are meant to be felt rather than found in dusty chests.`
        ]
      },
      {
        title: (s) => `A Lantern for ${s}`,
        paragraphs: (p, s) => [
          `Deep inside the elder glade where fireflies guard forgotten dreams, ${p} had built a haven of soft velvet blankets, braided sweetgrass, and dried lavender. Every evening when twilight painted the mossy canopy in shades of warm plum, a quiet ritual began that delighted the gentle woodland spirits of the forest.`,
          `A small glass lantern was lit, not with ordinary fire, but with the warm laughter of old friends. It cast dancing amber circles across the forest floor, inviting small woodland creatures, weary badgers, and timid field mice to sit together and rest their tired paws after a long day of foraging.`,
          `Here, far away from the bustling kingdoms of humankind, the simplest wonders were always the grandest. As the night crickets tuned their sleepy violins under the silver stars, every single breath felt like coming home at last to a place where you truly belonged.`
        ]
      }
    ],
    Exciting: [
      {
        title: (s) => `The Awakening of ${s}`,
        paragraphs: (p, s) => [
          `A sudden crack of blue thunder echoed across the jagged granite peaks, where ${p} stood face to face with the ancient rune circle. The stone tablets had remained silent for seven hundred winters, but tonight they pulsed with wild sapphire light and crackling magical lightning that lit up the craggy cliffs.`,
          `With hearts pounding and heavy leather boots skidding across frosted gravel, the decisive moment arrived without warning. Reaching forward with steady hands, the sleeping sigil was touched. A fierce rush of wind whipped through the mountain valley, unraveling a map of forgotten constellation gates in the churning night sky overhead.`,
          `The hidden path into the uncharted mystical realm was finally thrown wide open before them. There was no time for second guessing—the great horizon was calling out like a war horn, and destiny waited just beyond the burning stars.`
        ]
      },
      {
        title: (s) => `The Flight of ${s}`,
        paragraphs: (p, s) => [
          `High above the singing cliffs of Eldoria, winds whipped fiercely around ${p} as the crystalline beacon flared into blazing life. A colossal shadow swept across the clouds, revealing the silver-crested griffin diving downward with feathers shining like polished steel armor in the golden sunset glow.`,
          `Leaping across the jagged chasm without looking down, fingers gripped the leather reins just in the nick of time. The great winged beast caught the updraft with a triumphant screech that scattered the storm clouds in every direction, revealing an emerald valley untouched by mortal hands for a thousand years.`,
          `Gliding through the sea of mist at breathtaking speed, every trace of fear surrendered to pure exhilarating freedom. The forgotten realm was saved, and the real flight across the sky was only just beginning.`
        ]
      }
    ],
    Funny: [
      {
        title: (s) => `The Great Mischief of ${s}`,
        paragraphs: (p, s) => [
          `Nobody in the High Council of Sorcery could have predicted the sheer havoc caused by ${p}. It all began when an enchantment for levitating teacups took a bizarre turn, resulting in seventeen singing biscuits ricocheting directly off the Arch-Mage’s ceremonial velvet hat with hilarious precision.`,
          `Panic dissolved into bewildered giggles as the castle guards attempted to catch the runaway cinnamon treats using silver soup ladles and velvet curtains. Every time someone lunged, another biscuit burst into a cheerful opera chorus that echoed through the grand corridors and startled the royal parrots.`,
          `By sunset, the Grand Hall was covered in powdered sugar, spilled chamomile tea, and helpless belly laughter. Even the strictest wizard admitted that a little accidental chaos was far better than another boring lecture on levitation safety.`
        ]
      },
      {
        title: (s) => `When ${s} Learned Magic`,
        paragraphs: (p, s) => [
          `The academy apprentice handbook was very explicit: never recite ancient spell formulas while sneezing. Unfortunately, ${p} was dusting the historical library just as a cloud of powdered black pepper drifted through the high arched window on a mischievous afternoon breeze.`,
          `The resulting sneeze turned the headmaster’s stern stone gargoyles into bright yellow rubber duckies that let out indignant squeaks whenever anyone walked past. Meanwhile, heavy spellbooks fluttered around the ceiling like confused leather pigeons, dropping parchment homework sheets all over the bewildered dean.`,
          `Rather than handing out detentions, the academy declared an impromptu recess to chase the floating textbooks with giant butterfly nets and wooden brooms. It was universally voted the most productive wizard exam in three centuries of school history.`
        ]
      }
    ],
    Spooky: [
      {
        title: (s) => `Shadows Beside ${s}`,
        paragraphs: (p, s) => [
          `The grandfather clock struck midnight with a dull, hollow chime in the dusty attic where ${p} was kept hidden away. Dust motes twirled like miniature specters in the pale moonlight slanting through cracked stained glass windows, painting jagged patterns on the dark wood floorboards.`,
          `A soft scratching sound stirred behind the walnut paneling. Footsteps—or something pretending to have footsteps—drew closer, hesitating just beneath the doorway shadow. A chill breeze ruffled the velvet curtains though every single latch and window lock was firmly secured against the chilly autumn night.`,
          `When the lantern was raised with trembling fingers, two luminous violet eyes blinked back from the gloom. It wasn’t a fearsome ghoul after all, but a spectral kitten looking for someone brave enough to scratch behind its translucent ears and share a saucer of warm milk.`
        ]
      },
      {
        title: (s) => `The Whispering Library of ${s}`,
        paragraphs: (p, s) => [
          `Flickering taper candles cast long, dancing shadows across the forgotten archives where ${p} had been left undisturbed for over a century. The air smelled of cold stone, dried autumn roses, and ancient secrets that refused to stay quiet beneath their leather bindings.`,
          `From the darkest row of towering mahogany shelves came a faint rustling sound, like paper turning without any breeze. A cool draft whispered across the back of the neck, and mysterious words seemed to form upon the dusty mirror glass in silvery condensation mist.`,
          `Stepping closer with cautious breath, the frightening phantom revealed a gentle demeanor. It was simply the ghost of the old archivist, holding out a lost golden bookmark and asking politely for the latest news from the sunny world outside.`
        ]
      }
    ],
    Hopeful: [
      {
        title: (s) => `The Dawn of ${s}`,
        paragraphs: (p, s) => [
          `For as long as anyone in the valley could remember, the gray hills had known only endless drizzle and drooping flowerbeds. Yet right in the cobblestone town square stood ${p}, steadfast against the chill winds, waiting patiently for the long-awaited turn of the seasons.`,
          `Then, on an ordinary morning that felt just like every other, a hairline crack split the heavy clouds. A single beam of sunbeam gold touched down, warming the chilly stones and coaxing the first green sprout from the sleepy earth with gentle persistence.`,
          `Neighbors stepped onto their doorsteps, wiping the mist from their eyes in disbelief and shared joy. Winter had yielded at last, proving that no shadow, however tall or stubborn, can ever outlast a patient seed that believes in the spring.`
        ]
      },
      {
        title: (s) => `A New Spark for ${s}`,
        paragraphs: (p, s) => [
          `The ancient hearth stone had grown cold during the long drought of winter, but ${p} remained nestled quietly in the center of the hearth. An entire village had gathered around, holding hands and hoping for a sign that brighter days would soon return to their home.`,
          `Kneeling close, a child cupped their hands and blew a single gentle breath of warm air. From the gray ash, a tiny spark of amber fire spiraled upward, blooming into a warm, crackling flame that filled the entire hall with dancing golden light.`,
          `Tears gave way to smiling embraces as music filled the streets once more into the night. Light had returned not by force or loud commands, but through gentleness, trust, and the quiet promise of tomorrow's sunrise.`
        ]
      }
    ]
  },

  Mystery: {
    Cozy: [
      {
        title: (s) => `The Curious Case of ${s}`,
        paragraphs: (p, s) => [
          `Rain tapped a soothing waltz against the bay window of Miss Maple’s tearoom, where ${p} had mysteriously vanished from the velvet armchair. Inspector Higgins adjusted his round spectacles, smoothed his mustache, and took a contemplative sip of steaming Earl Grey tea.`,
          `The clues were delightfully subtle: a faint smudge of cinnamon sugar near the bookshelf, a tiny brass thimble, and an oddly deliberate paw print pointing directly toward the warm pantry. No locks were picked; no window latches had been disturbed in the slightest.`,
          `Following the sweet trail behind a row of blackberry preserves, the puzzle unraveled with a squeak. The neighborhood stray tabby had borrowed the item to make a warm nest for her three new kittens, closing the case with contented purrs and a saucer of cream.`
        ]
      },
      {
        title: (s) => `The Mystery of ${s}’s Key`,
        paragraphs: (p, s) => [
          `Inside the antique clock shop where brass pendulums hummed in harmonious rhythm, ${p} was found resting beside a small brass key with no obvious matching keyhole. Mrs. Gable wiped down the polished counter and pondered the sweet riddle over freshly baked cinnamon scones.`,
          `Every carved drawer and wooden bureau had been tested, yet the little key fit none of them. Just as the church bells rang four o’clock, a ginger cat jumped onto the mantle, bumping a hidden secret panel behind the grandfather clock.`,
          `The brass key slipped in smoothly, turning with a wonderfully satisfying click. Inside lay a bundle of lost love letters and a bag of peppermint drops from 1920, solving the century-old neighborhood puzzle with warm smiles and happy tears.`
        ]
      }
    ],
    Exciting: [
      {
        title: (s) => `The Midnight Cipher of ${s}`,
        paragraphs: (p, s) => [
          `The cipher was stamped into the underside of ${p}, visible only when the street lantern flickered at a precise forty-five degree angle. Time was bleeding away fast; the midnight cargo train was already blowing its departure whistle at the foggy harbor docks.`,
          `Deciphering the final gear sequence with steady fingers, a hidden mechanical latch clicked open with sharp metallic precision. Inside rested the royal seal that could exonerate the whole harbor guild before sunrise, proving their innocence beyond a shadow of doubt.`,
          `Footsteps pounded on the wet cobbles outside. Darting into the labyrinth of fog-drenched alleyways, victory tasted like sea salt, cold mist, and pure adrenaline. The truth had finally been wrested from the shadows in the nick of time.`
        ]
      },
      {
        title: (s) => `The Pursuit of ${s}`,
        paragraphs: (p, s) => [
          `Tires screeched as the suspect vanished into the neon-lit warehouse district, clutching ${p} tightly beneath a dark trench coat. Detective Vance leaped over the security turnstile, laser-focused on the glimmering trail left behind across the wet asphalt pavement.`,
          `A maze of shipping containers offered countless hiding spots, but a faint ticking sound betrayed the runner's exact location. Cornered against the waterfront pier with nowhere left to sprint, the suspect turned with hands raised as police headlights illuminated the misty rain.`,
          `The long-sought artifact was recovered completely intact without a single scratch or dent. The city was safe once again, and tomorrow’s morning headline had already found its triumphant front-page victory story.`
        ]
      }
    ],
    Funny: [
      {
        title: (s) => `Who Swapped ${s}?`,
        paragraphs: (p, s) => [
          `The village detective club assembled with utmost gravity to investigate the sudden disappearance of ${p}. Suspects were interrogated with intense scrutiny: Mrs. Higgins the baker, the local postman, and an unusually nervous basset hound named Barnaby who avoided eye contact.`,
          `The prime evidence was damning: a trail of breadcrumbs leading directly to Barnaby’s favorite wooden doghouse. Underneath his woolen blanket lay not only the missing item, but five mismatched slippers, a garden gnome, and a squeaky yellow rubber duck.`,
          `Barnaby thumped his tail proudly, clearly convinced he had done the entire town an invaluable curatorial service. The court awarded him a dog biscuit for sheer dedication to his craft, and dismissed all charges with roaring laughter.`
        ]
      },
      {
        title: (s) => `The Bizarre Clue of ${s}`,
        paragraphs: (p, s) => [
          `Chief Inspector Pringle declared the crime scene utterly baffling. How on earth could ${p} have ended up perched atop the church steeple in broad daylight without a single soul noticing the daring ascent?`,
          `Footprints were discovered along the gutter, but they belonged entirely to a mischievous family of squirrels wearing doll shoes. The local mayor held an emergency council meeting while the squirrels watched from an oak branch, munching walnuts smugly and chirping in mockery.`,
          `Eventually, a long wooden ladder and a jar of chunky peanut butter resolved the crisis peacefully. The mystery was recorded in the town ledger as the 'Nuttiest Heist of the Century', much to everyone's lasting amusement.`
        ]
      }
    ],
    Spooky: [
      {
        title: (s) => `The Phantom Behind ${s}`,
        paragraphs: (p, s) => [
          `The fog rolled in thick as chowder off the jagged black rocks, concealing the old lighthouse where ${p} had been last spotted before the storm. Every floorboard groan sounded like a hollow voice trying to remember its name in the wind.`,
          `A pocket mirror lay shattered on the spiral stairs, its silver shards reflecting strange shadows that didn’t match the empty room. Someone had been here moments before, leaving behind a cold iron key coated in salty sea brine and dried kelp.`,
          `When the key slipped into the attic padlock, the door swung open without a sound. Standing on the sill was an old sea captain’s raven, croaking the lost coordinates to safe harbor before disappearing into the swirling mist.`
        ]
      },
      {
        title: (s) => `The Footprints Beside ${s}`,
        paragraphs: (p, s) => [
          `Deep in the cellar of Blackwood Manor, wet footprints appeared on the flagstones leading straight to ${p}, yet no footsteps were ever heard. The air chilled rapidly until breath formed icy plumes in the darkness.`,
          `Following the mysterious trail to a bricked-up archway, a faint tapping sound echoed from within the old mortar. A single brick was loose, cool to the touch and covered in luminescent moss that glowed pale green in the shadows.`,
          `Prying it loose revealed not a sinister curse, but a long-lost diary detailing how the manor was founded on generosity and kindness. The cold dissipated instantly, leaving behind only the peaceful sigh of an old spirit set free.`
        ]
      }
    ],
    Hopeful: [
      {
        title: (s) => `The Missing Piece of ${s}`,
        paragraphs: (p, s) => [
          `For ten long years, the puzzle of ${p} had remained unsolved, filed away in an accordion folder tied with faded yellow ribbon. Most folks in town had stopped looking, but Clara refused to let the memory dim into history.`,
          `Cleaning behind the church organ on an ordinary spring morning, her broom struck something hollow beneath the floorboards. Behind a loose oak panel rested an engraved tin box, containing the handwritten letters everyone thought were lost forever in the fire.`,
          `By evening, the town square was filled with joyful reunions as families read words of forgiveness and hope sent across generations. Sometimes answers aren’t gone—they’re just waiting patiently for someone to look with love.`
        ]
      },
      {
        title: (s) => `The Truth About ${s}`,
        paragraphs: (p, s) => [
          `Whispers had circulated for months about what happened to ${p}, causing neighbors to glance sideways in quiet suspicion. But young Leo believed there was a gentle explanation waiting to be discovered if someone took the time to listen.`,
          `Piece by piece, he assembled the overlooked clues: a dropped flower petal, a sewing needle, and a newly repaired garden trellis. Following the quiet trail to the community garden, the full picture came into focus at last.`,
          `The missing item had been borrowed to mend the community greenhouse roof just before the first frost. Suspicion melted away into deep gratitude, reminding the whole village how much goodness lives in quiet, unsung deeds.`
        ]
      }
    ]
  },

  Adventure: {
    Exciting: [
      {
        title: (s) => `The Journey for ${s}`,
        paragraphs: (p, s) => [
          `The rope bridge swayed precariously over the roaring canyon gorge, but ${p} lay on the opposing cliff face, glinting beneath the midday sun. One deep breath, a quick knot check on the harness, and the perilous crossing began without hesitation.`,
          `Halfway across, a sudden gust of mountain wind snapped a side plank into the abyss below. Clinging tightly to the hemp railing, boots found purchase on a sturdy rock outcrop just in time as hearts raced with fierce, pure focus.`,
          `Reaching the summit stone at last, hands closed firmly around the prize. Looking back across the vast sapphire canyon as eagles soared below, the dangerous climb felt worth every scrape. The grand quest had truly begun.`
        ]
      },
      {
        title: (s) => `The Rapids of ${s}`,
        paragraphs: (p, s) => [
          `White water crashed against the reinforced hull of the river raft as ${p} was secured tightly beneath the waterproof canvas. Ahead lay the notorious Dragon's Throat rapids, a winding gauntlet of spray, foaming eddies, and jagged granite boulders.`,
          `Paddles dug into the churning turquoise current with synchronized precision. The raft plunged down a six-foot drop, spraying freezing mountain water across everyone's faces before shooting cleanly into a tranquil sunlit pool.`,
          `Catching their breath under the soaring pine canyon, triumphant cheers broke out that echoed along the riverbanks. The roughest stretch of the expedition was behind them, and the golden shores of the lake were in sight.`
        ]
      }
    ],
    Cozy: [
      {
        title: (s) => `The Gentle Trail of ${s}`,
        paragraphs: (p, s) => [
          `Equipped with a sturdy canvas rucksack, a thermos of spiced cider, and a hand-drawn map, the quiet journey with ${p} got underway at first robin call. The trail wound peacefully through groves of wild blackberries and sun-dappled birch trees.`,
          `Every fork in the winding path offered a small, delightful discovery: a family of field mice taking a cozy nap inside a hollow stump, and a spring of water sweet enough to rival wildflower honey on a summer afternoon.`,
          `At the crest of the grassy hill, a patchwork quilt was laid out to catch the gentle afternoon breeze. Not all great adventures conquer towering mountains; some are simply an afternoon shared peacefully with the natural world.`
        ]
      },
      {
        title: (s) => `Along the Brook with ${s}`,
        paragraphs: (p, s) => [
          `Walking along the pebbled stream with ${p} tucked inside an old woven basket, the morning unfolded with gentle warmth and birdsong. Flat stones skipped three times across the clear water, rippling the reflection of blue skies and fluffy clouds.`,
          `Stopping beneath an ancient weeping willow, homemade sandwiches wrapped in wax paper were unwrapped while iridescent dragonflies darted over blooming water lilies. The sweet scent of damp pine needles filled the afternoon air with comfort.`,
          `By the time twilight shadows lengthened across the meadow, our boots were muddy and our pockets were full of smooth river stones. It was an expedition measured not in miles, but in quiet moments of pure happiness.`
        ]
      }
    ],
    Funny: [
      {
        title: (s) => `The Misadventure with ${s}`,
        paragraphs: (p, s) => [
          `Setting off into the untamed wilderness with ${p} sounded glorious in theory during Sunday breakfast. In practice, our compass immediately pointed directly toward Mrs. Gable’s prized pumpkin patch, where a belligerent rooster guarded the perimeter with fierce determination.`,
          `An attempt to execute a stealth crawl resulted in an involuntary slide down a muddy embankment, landing headfirst into a fragrant patch of wild clover. The rooster simply cocked his head, flapped his wings, and crowed in utter critique.`,
          `We surrendered with muddy knees, bruised pride, and pockets full of dandelion crowns. It wasn’t the daring conquest we had drawn up on paper napkins, but it was certainly the loudest we had ever laughed together.`
        ]
      },
      {
        title: (s) => `When the Map Misplaced ${s}`,
        paragraphs: (p, s) => [
          `We were promised an uncharted cavern of rare crystals, but thanks to ${p}, our daring expedition led directly into the annual picnic of the retired postmasters association at the town park.`,
          `Instead of fighting off mountain trolls, we were handed loaded potato salad and grilled sausages on paper plates. The postmasters were thrilled to have unexpected guests and insisted on showing us their vintage stamp albums for three straight hours.`,
          `We returned home without any ancient gold, but with two jars of homemade strawberry jam and shiny honorary postmaster pins. Adventure, it seems, has a marvelous sense of humor when you least expect it.`
        ]
      }
    ],
    Spooky: [
      {
        title: (s) => `The Cavern of ${s}`,
        paragraphs: (p, s) => [
          `The entrance to the obsidian cavern yawned like an open jaw beneath the twisted cypress trees. Deep within its damp tunnels lay ${p}, shielded by centuries of eerie echoes and phosphorescent lichen that clung to the damp walls.`,
          `Each step through the darkness sounded like wet whispers against the stone. Shadows stretched along the cavern walls, mimicking towering guardians with hollow eyes that seemed to track every single breath we took in the cold silence.`,
          `Yet pushing past the trembling fear, an underground chamber revealed itself—not filled with nightmares, but millions of glowworms turning the vaulted cavern ceiling into a breathtaking starry night sky that took our breath away.`
        ]
      },
      {
        title: (s) => `The Foggy Ridge of ${s}`,
        paragraphs: (p, s) => [
          `Thick fog completely erased the footpath along the razor ridge where ${p} had reportedly fallen during the midnight tremor. Distant wails of night birds sounded uncomfortably close in the blinding white vapor that swirled around our knees.`,
          `Groping forward along the cold limestone shelf, a shadowy silhouette loomed suddenly through the mist, tall and motionless as a petrified giant. Hearts stopped beating for three agonizing seconds of pure terror.`,
          `A sudden gust of wind cleared the air, revealing an old wooden trail marker wrapped in climbing ivy. Relieved laughter broke the tension, and the lost item was spotted nestled safely among the roots below.`
        ]
      }
    ],
    Hopeful: [
      {
        title: (s) => `Over the Horizon with ${s}`,
        paragraphs: (p, s) => [
          `The small wooden sailboat named The Pioneer carried ${p} across the emerald waves toward an uncharted island. Storm clouds had tested the sails for days, but the little vessel refused to yield to the turbulent ocean.`,
          `As morning broke, the heavy storm fog lifted like a stage curtain, revealing pristine white sands and palm groves swaying beneath a peaceful lavender sky. A flock of white sea gulls circled overhead in warm greeting.`,
          `Stepping barefoot onto the warm shore, a profound sense of peace washed over the tired crew. The rough seas were behind them; ahead lay a fresh start, filled with limitless promise, sweet fruit, and golden sunshine.`
        ]
      },
      {
        title: (s) => `The Peak Above ${s}`,
        paragraphs: (p, s) => [
          `Every muscle ached after five days of relentless climbing, but reaching the summit with ${p} was a promise made to the whole valley below. The final rocky ledge required one last push of courage and faith.`,
          `Pulling upward onto the flat granite crest, the entire continent unrolled beneath in a stunning panorama of emerald valleys, winding silver rivers, and snow-capped peaks kissed by the rising morning sun.`,
          `Planting the small marker stone in the sunlit breeze, exhaustion turned into quiet triumph. The long uphill struggle was finished; from this breathtaking height, every road forward looked beautiful, open, and clear.`
        ]
      }
    ]
  },

  Comedy: {
    Funny: [
      {
        title: (s) => `The Catastrophe of ${s}`,
        paragraphs: (p, s) => [
          `If anyone tells you that introducing ${p} to the annual Sunday bake-off is a sensible idea, do not trust them for a second. Within four minutes of arrival, a chain reaction of culinary chaos was ignited in the hall.`,
          `A bowl of vanilla meringue achieved supersonic speed, plastering the village mayor’s spectacles in fluffy white peaks. Meanwhile, the prize-winning strawberry tart ended up serving as a jaunty hat for the local postal carrier who ducked too late.`,
          `Rather than issuing disqualifications, the judges awarded a blue ribbon for 'Most Spectacular Theatrics'. We celebrated the afternoon by eating the sugary wreckage with dessert spoons straight off the banquet table.`
        ]
      },
      {
        title: (s) => `Never Trust ${s}`,
        paragraphs: (p, s) => [
          `The instructions were remarkably simple: 'Keep ${p} away from shiny objects.' Naturally, that warning was immediately tested when a magpie flew by carrying an oversized mirrored disco ball stolen from the community center.`,
          `What followed was a dizzying spectacle that stopped all traffic on Main Street. Delivery bicycles swerved, pigeons applauded from gutters, and the local trombone player somehow ended up playing a lively polka in tempo with the madness.`,
          `By the time everyone caught their breath, the whole town was dancing in the middle of the street. Sometimes the most ridiculous accidents make the fondest memories of our entire lives.`
        ]
      }
    ],
    Cozy: [
      {
        title: (s) => `A Warm Chuckle with ${s}`,
        paragraphs: (p, s) => [
          `Sunday breakfast was supposed to be a peaceful affair, until ${p} decided to assist with the blueberry pancakes. Flipping the batter resulted in three pancakes adhering firmly to the wooden kitchen ceiling like culinary stalactites.`,
          `Grandpa looked up from his morning newspaper, squinted through his bifocals, and calmly reached for the maple syrup, remarking that modern architecture had finally arrived in our kitchen.`,
          `We sat in our woolen slippers, giggling until our tea went cold, catching each pancake with a plate as gravity eventually intervened. It was the sweetest and silliest family breakfast of the entire year.`
        ]
      },
      {
        title: (s) => `The Teapot and ${s}`,
        paragraphs: (p, s) => [
          `Aunt Clara's musical teapot began whistling a cheerful tune the instant ${p} was set on the table, only it wouldn't stop whistling even after the piping hot tea was poured into four porcelain cups.`,
          `Every time someone tried to take a sip, the spout whistled a high note that tickled our noses, causing cousin Oliver to snort tea all over his knitted cardigan. That set off Aunt Clara into uncontrollable wheezing laughter.`,
          `We spent the whole afternoon trying to out-whistle the teapot with funny harmony notes. The tea grew cold, but our hearts were delightfully warm and full of good cheer.`
        ]
      }
    ],
    Exciting: [
      {
        title: (s) => `The Great Escape of ${s}`,
        paragraphs: (p, s) => [
          `It was the wildest chase in borough history, sparked by none other than ${p}. What began as a mild disagreement in the pet shop erupted into a high-speed pursuit involving three rollerbladers and an escaped poodle named Barnaby.`,
          `Around tight street corners they zoomed, dodging fruit stands and leaping over sidewalk puddles with Olympic agility. Bystanders cheered wildly from their balconies as if watching the final lap of the Monaco Grand Prix on a sunny afternoon.`,
          `The pursuit concluded at the gelato cart, where all parties unanimously called a truce in exchange for double-scoops of salted caramel. Victory had never tasted so sweet or looked so delightfully absurd.`
        ]
      },
      {
        title: (s) => `The Runaway Wagon of ${s}`,
        paragraphs: (p, s) => [
          `Nobody realized the wooden parking brake was loose when ${p} was loaded into the delivery wagon at the crest of Blueberry Hill. One tiny bump from a passing goat, and the wagon began rolling down the slope at breakneck speed.`,
          `Steering with an old broomstick and screaming with joyful terror, the wagon navigated three tight turns, narrowly missing Farmer McGregor's prized cabbage patch by mere inches before zooming across the village bridge.`,
          `The ride came to a gentle halt inside a giant pile of freshly raked autumn leaves. Emerging with twigs in our hair and grins from ear to ear, everyone immediately asked: 'Can we please do that again?'`
        ]
      }
    ],
    Spooky: [
      {
        title: (s) => `The Hilariously Haunted ${s}`,
        paragraphs: (p, s) => [
          `The rumors insisted that ${p} was cursed by an irritable eighteenth-century ghost. However, instead of bone-chilling wails, this particular poltergeist specialized entirely in terrible dad jokes delivered through the chimney.`,
          `Doors would slam shut with a bang, followed by an ethereal whisper: 'Why don't skeletons fight each other? Because they don't have the guts!' The family dog wouldn't even bother barking; he just rolled on his back in pure amusement.`,
          `By week two, the spooky old mansion had become the most popular comedy venue in town. People queued outside with thermoses of hot cocoa just to hear a phantom roast the town mayor.`
        ]
      },
      {
        title: (s) => `The Poltergeist in ${s}`,
        paragraphs: (p, s) => [
          `The eerie organ music started playing backwards whenever ${p} entered the parlor. We prepared ourselves for a frightful night of floating chandeliers and chains, but the ghost mostly just wanted to reorganize our pantry alphabetically.`,
          `Cereal boxes were stacked in neat towers, and the ghost kept hiding all the spicy pickles in the laundry hamper while chuckling softly from behind the floral living room curtains.`,
          `We left out a plate of butter cookies with a thank-you note for the tidy shelves. The ghost left a spectral smiley face drawn in flour, proving that even phantoms appreciate polite manners.`
        ]
      }
    ],
    Hopeful: [
      {
        title: (s) => `The Bright Side of ${s}`,
        paragraphs: (p, s) => [
          `Everything that could go sideways with ${p} went sideways, backwards, and completely upside down. The paint was the wrong shade of lavender, the ladder fell into the blackberry hedge, and rain washed the sign away before it even dried.`,
          `Sitting on the porch drenched and covered in lilac paint, we looked at the colorful mess and simply started laughing until our stomachs ached. It wasn't the picture-perfect postcard we planned, but it was entirely, wonderfully ours.`,
          `Neighbors strolling by couldn't help but join in the laughter, pitching in with dry towels, umbrellas, and warm spiced cider. It proved that a joyful spirit can turn any disaster into a heartfelt celebration.`
        ]
      },
      {
        title: (s) => `When Smiles Found ${s}`,
        paragraphs: (p, s) => [
          `The community play rehearsal was an absolute disaster. Props fell off tables, lines were mixed up, and ${p} ended up rolling straight off the stage into the orchestra pit, striking the bass drum with a booming thud.`,
          `The entire auditorium fell dead silent for two seconds—then everyone erupted into roaring applause and standing ovations, genuinely believing it was the most brilliant physical comedy stunt ever staged.`,
          `Taking a bow with flushed cheeks and wide smiles, we learned that perfection is hopelessly overrated. The best memories in life often happen when everything goes delightfully and unexpectedly off script.`
        ]
      }
    ]
  },

  'Sci-Fi': {
    Cozy: [
      {
        title: (s) => `Orbiting Beside ${s}`,
        paragraphs: (p, s) => [
          `Aboard the orbital greenhouse station Asteria-4, ${p} had found a peaceful niche between the hydroponic strawberries and the zero-gravity fern beds. Earth rolled below like a great glowing marble of lapis and sapphire against the velvet blackness.`,
          `While automated maintenance drones hummed softly in the corridor, a cup of synthetic mint tea was brewed to the perfect temperature. Outside the thick observation dome, stellar dust drifted like quiet snow across the infinite vacuum of space.`,
          `Here, thirty thousand kilometers above the bustling noise of humanity, the galaxy felt neither cold nor lonely. It felt as warm, familiar, and comforting as a quiet evening beside the hearth back home.`
        ]
      },
      {
        title: (s) => `The Starlight Cafe of ${s}`,
        paragraphs: (p, s) => [
          `Station Kepler-9 was known throughout the asteroid belt for its quiet comfort, thanks in no small part to ${p}. Exhausted asteroid miners would kick off their heavy mag-boots and sink into warm gravity-cushioned armchairs.`,
          `Vintage jazz streamed softly across the communications channel while colorful nebulas painted magenta streaks across the viewport. A warm bowl of cinnamon nutrient porridge was served with a friendly smile that spanned lightyears of travel.`,
          `Out here in the deep cosmic expanse, home was never a planet or a coordinate. Home was the cozy glow of friendly voices sharing tales while distant constellations wheeled peacefully overhead.`
        ]
      }
    ],
    Exciting: [
      {
        title: (s) => `The Pulse of ${s}`,
        paragraphs: (p, s) => [
          `Alarms trilled urgently across the command bridge as ${p} activated the dormant hyper-drive core. The navigational hologram turned glowing crimson, mapping a narrow quantum corridor directly through the heart of the collapsing nebula.`,
          `'Brace for warp jump sequence!' shouted the pilot, wrenching the manual thruster controls past the safety threshold. Space-time folded like parchment around the titanium hull in a blinding flash of turquoise brilliance that rattled every rivet.`,
          `When the stabilizer hum returned to normal, the vessel slipped cleanly into the tranquil rings of a twin-star system. Against all astronomical odds, the impossible jump had succeeded and the crew cheered.`
        ]
      },
      {
        title: (s) => `The Solar Flare and ${s}`,
        paragraphs: (p, s) => [
          `A class-X solar flare erupted from the red giant star, sending a colossal wave of electromagnetic fire directly toward the research cruiser carrying ${p}. The deflector shields were dropping at twelve percent per second under the intense radiation.`,
          `Rerouting backup auxiliary conduits through the cooling manifold, the chief engineer engaged the deflector coils manually with sparks flying across the console. Every single second felt like an eternity under the blazing light.`,
          `With a thunderous groan of the magnetic field, the solar shockwave broke harmlessly around the ship's nose. Cheering erupted across the bridge as telemetry confirmed all crew members and scientific samples were completely safe.`
        ]
      }
    ],
    Funny: [
      {
        title: (s) => `The Robot Who Loved ${s}`,
        paragraphs: (p, s) => [
          `Unit 7B was designed to calculate complex dark matter trajectories, but after encountering ${p}, its neural processor developed an unprogrammed obsession with knitting cozy socks for the ship's equipment.`,
          `The ship's captain walked into the engine room to find the cooling pipes lovingly dressed in hand-knitted woolen cozies of fluorescent pink and lime green stripes. The robot whirred proudly in cheerful binary code.`,
          `Attempts to reflash its firmware were abandoned when the ship's temperature efficiency inexplicably improved by eighteen percent. As it turns out, even warp engines perform significantly better when their toes are kept warm.`
        ]
      },
      {
        title: (s) => `Alien Manners and ${s}`,
        paragraphs: (p, s) => [
          `First contact with the Gelatinous Collective of Sector 9 was proceeding with diplomatic dignity until ${p} was accidentally translated by the computer as an official declaration of intergalactic tickle warfare.`,
          `Before the human diplomats could explain, the alien ambassadors unfolded seventy tentacle arms and began tickling the entire landing party with zero-gravity feathers. Dignified generals were instantly reduced to breathless snorting on the floor.`,
          `A treaty of eternal friendship was signed twenty minutes later, sealed over shared chocolate ice cream sundaes. It was recorded as the least bloody and most hilarious diplomatic summit in the history of the galaxy.`
        ]
      }
    ],
    Spooky: [
      {
        title: (s) => `The Signal from ${s}`,
        paragraphs: (p, s) => [
          `Deep in the quiet void between solar systems, the deep-space probe picked up an anomaly emanating from ${p}. It wasn't binary code, nor stellar radiation; it was a rhythmic broadcast that sounded eerily like a slow heartbeat.`,
          `The science team adjusted the audio filters in breathless silence. Shadows flickered on the monitoring terminal as the static parted to reveal a faint melodic chime, repeating every forty-four seconds without fail across the darkness.`,
          `When the camera feed finally locked focus, no alien fleet was lurking in the dark. It was a centuries-old musical time capsule launched from Earth, drifting home through the stars like a forgotten lullaby.`
        ]
      },
      {
        title: (s) => `The Derelict of ${s}`,
        paragraphs: (p, s) => [
          `The derelict freighter had drifted for two centuries in the shadow of Saturn’s icy rings before our salvage crew docked beside ${p}. Frost covered the airlock, and the artificial gravity hummed at a dying, eerie frequency.`,
          `Shadowy shapes seemed to dart between the flickering emergency lights of the cavernous cargo bay. Hand scanners beeped erratically, indicating non-human movement directly behind the sealed titanium bulkheads.`,
          `Breaching the storage vault, the 'monsters' revealed themselves: a thriving colony of bio-luminescent space butterflies, fluttering silently in zero-G like floating emeralds that lit up the forgotten ship with peaceful wonder.`
        ]
      }
    ],
    Hopeful: [
      {
        title: (s) => `A New Star for ${s}`,
        paragraphs: (p, s) => [
          `Generations had lived beneath the artificial dome of the colony ship, dreaming of the day ${p} would guide them to terra firma. Today, the atmospheric sensors finally registered fresh nitrogen, oxygen, and sweet water vapor.`,
          `The great airlock doors unsealed with a deep hiss that had waited two centuries. Cool morning wind rushed into the hangar, carrying the rich, earthy scent of damp soil and blooming violet lilies under a blue sky.`,
          `Children reached out their hands, touching genuine raindrops for the very first time in their lives. The long journey across the dark expanse was over; their new home had welcomed them with open arms.`
        ]
      },
      {
        title: (s) => `The Terraforming of ${s}`,
        paragraphs: (p, s) => [
          `The barren red desert of Planet Nova had stretched endlessly for ten decades of difficult labor, with ${p} standing proudly at the heart of the central atmospheric tower. Many had doubted the seeds would ever take root.`,
          `At sunrise, the automated irrigation sprinklers activated with a soft hiss across the plains. As the morning mist burned away, a carpet of emerald green clover was visible stretching as far as the eye could see.`,
          `Engineers threw their hardhats into the air with tears of joy streaming down their dusty faces. Life had taken root on a brand new world, lighting a beacon of hope for all future generations.`
        ]
      }
    ]
  },

  Bedtime: {
    Cozy: [
      {
        title: (s) => `The Moonlit Slumber of ${s}`,
        paragraphs: (p, s) => [
          `The evening star had just peeked through the velvet curtains when ${p} settled down for the night. The chimney smoke curled like sleepy ribbons toward the silver crescent moon, carrying the scent of cedar wood into the evening air.`,
          `A soft breeze sang a lullaby through the willow leaves, rocking the sleepy sparrow in its nest and tucking the little pond under a blanket of silver mist. Every little worry of the day dissolved into the quiet dark.`,
          `Eyes grew delightfully heavy; breathing became slow, gentle, and steady. The world was safe, warm, and resting, saving all its marvelous adventures for the golden sunshine of tomorrow morning.`
        ]
      },
      {
        title: (s) => `Goodnight to ${s}`,
        paragraphs: (p, s) => [
          `One by one, the lanterns in the village were gently extinguished until only ${p} remained bathed in amber warmth. A cup of chamomile tea sat cooling beside an open storybook on the wooden nightstand in the bedroom.`,
          `The night watchman walked his quiet rounds, nodding sleepily to the barn owl perched on the stone bridge. Even the winding river seemed to slow its pace, whispering soothing secrets to the sleeping riverbanks.`,
          `Underneath the patchwork quilt, eyelids grew wonderfully heavy. With a soft sigh of contentment, sleep arrived like a warm hug, carrying gentle dreams across the starlit sky until the morning sun arose.`
        ]
      }
    ],
    Hopeful: [
      {
        title: (s) => `Starlight Wishes for ${s}`,
        paragraphs: (p, s) => [
          `High above the sleeping world, the moon smoothed a silver blanket over ${p}. The little clock on the nightstand ticked with a steady, comforting rhythm, keeping time with peaceful dreams and gentle breaths.`,
          `Whatever hurdles or worries today brought had now drifted away like paper boats down a quiet brook. The night came not to end the joy, but to restore weary hearts with quiet grace, healing rest, and deep peace.`,
          `Close your eyes and let the starlight carry you safely through the night. Tomorrow is waiting with brand new pages, and it will be as lovely and bright as the morning dew on fresh grass.`
        ]
      },
      {
        title: (s) => `A Gentle Tomorrow for ${s}`,
        paragraphs: (p, s) => [
          `A blanket of soft stardust settled over the rooftops as ${p} nestled into bed. Outside the window, a mother deer guided her fawn through the quiet meadow toward safe, sheltered resting grounds beneath the pines.`,
          `Every heartbeat was a reassuring reminder that you are cared for, and that you are right where you belong. The night guards your sleep with gentle hands, turning the page toward a brighter chapter.`,
          `Breathe in the calm; let go of all the noise. Sleep peacefully tonight, knowing that the morning sun will rise with warmth, kindness, and wonderful new possibilities for everyone.`
        ]
      }
    ],
    Spooky: [
      {
        title: (s) => `The Friendly Ghost of ${s}`,
        paragraphs: (p, s) => [
          `In the cozy clocktower bedroom, the floorboards gave their customary bedtime creak as ${p} curled beneath the feather duvet. Outside, a gentle night owl hooted softly from the ivy-covered stone trellis.`,
          `A friendly shadow danced along the floral wallpaper, shaping funny bunny ears in the moonlight to wish the sleepy room pleasant dreams. No monsters lived in this gentle dark—only sleepy spirits keeping watch until sunrise.`,
          `With a soft yawn, the heavy velvet curtains rustled closed. The friendly whispers of the night watched over the dreamer until the shadows melted peacefully into the lavender dawn of a new day.`
        ]
      },
      {
        title: (s) => `Night Whispers with ${s}`,
        paragraphs: (p, s) => [
          `Wind gently tapped an ivy branch against the glass, making a sound like a quiet tapping toe, while ${p} pulled the woolen quilt up to the chin. A bedside candle gave one last amber flicker before resting.`,
          `In the twilight corner, the coat rack looked for a moment like an old wizard tipping his hat in polite goodnight. The shadows were not scary; they were just the room's way of dimming the lights for sleep.`,
          `Drifting off to the soft rhythm of rain on the roof, the dark felt like a warm velvet cloak keeping out the chill. Pleasant dreams arrived on soft phantom paws to guide the sleeper till dawn.`
        ]
      }
    ],
    Funny: [
      {
        title: (s) => `The Sheep Who Counted ${s}`,
        paragraphs: (p, s) => [
          `Barnaby the sleepy hedgehog tried counting sheep to fall asleep, but the sheep were far too busy investigating ${p}. Instead of jumping neatly over the white picket fence, sheep number four stopped to show off an energetic tap-dance routine.`,
          `Sheep number five brought along a platter of midnight chocolate chip cookies, while sheep number six put on a fluffy nightcap and began snoring loudly before anyone else could even blink an eye.`,
          `Barnaby chuckled into his pillow, shook his head in amusement, and finally drifted into slumber, surrounded by the fluffiest, silliest dreamers in the entire meadow having a cozy slumber party.`
        ]
      },
      {
        title: (s) => `The Pillow Fight of ${s}`,
        paragraphs: (p, s) => [
          `Bedtime was officially declared at eight o'clock, but ${p} accidentally triggered an impromptu pillow duel when a stray feather tickled the sleeping golden retriever's nose and caused a giant sneeze.`,
          `Feathers floated like indoor snowflakes as flannel pajamas rustled and giggles bounced off the bedroom walls. Even the stern grandfather clock in the corner seemed to tick with a suppressed chuckle.`,
          `When the giggles finally subsided, everyone collapsed into a mountain of fluffy pillows and soft down blankets. The room went silent in sixty seconds, with everyone sleeping more soundly than ever before.`
        ]
      }
    ],
    Exciting: [
      {
        title: (s) => `Dream Flight with ${s}`,
        paragraphs: (p, s) => [
          `Just as sleep took hold, ${p} sprouted pairs of iridescent butterfly wings made of pure spun stardust. Slipping through the bedroom skylight, a gentle flight through the indigo night sky began in wonder.`,
          `Sailing over velvet hills and silver rivers, the stars seemed close enough to scoop into a teacup. The night wind hummed an enchanting melody of midnight freedom, wonder, and weightless joy that lifted the spirit.`,
          `When the journey circled back toward the cozy bed, pillows were softer and dreams were sweeter than ever before. The greatest adventures, after all, are the ones that take flight while we rest peacefully.`
        ]
      },
      {
        title: (s) => `The Star Sailor and ${s}`,
        paragraphs: (p, s) => [
          `Closing eyes tightly beneath the bedsheets, the bed transformed into a clipper ship sailing across the Milky Way with ${p} at the wooden helm. Comets zipped past like playful silver dolphins in the dark.`,
          `Catching a solar breeze, the starship navigated between glowing rings of distant planets, collecting starlight in glass jars to bring back to earth. The thrill of cosmic discovery made hearts soar with excitement.`,
          `Drifting slowly into the harbor of deep sleep, the anchor dropped into soft velvet clouds. It was an unforgettable voyage across the cosmos, experienced right from the cozy comfort of home.`
        ]
      }
    ]
  }
};

// Atmospheric codas tailored to each genre and mood to guarantee 120-180 words
const codas = {
  Fantasy: {
    Cozy: "In the gentle hush that followed, the quiet magic of the enchanted woods seemed to hum in harmony with every beating heart, leaving behind a golden warmth that lingered long into the night.",
    Exciting: "Standing triumphant atop the windswept mountain peak with lightning still tingling in the air, the wild call of adventure echoed across the realm, promising that greater wonders were yet to come.",
    Funny: "Even as the castle bells rang the evening hour, muffled chuckles could still be heard from behind tapestry curtains, proving that a little harmless magic makes the whole kingdom brighter.",
    Spooky: "Underneath the pale moonlight filtering through the high canopy, the eerie shadows surrendered their fright, transforming the haunted woods into a tranquil sanctuary of quiet dreams.",
    Hopeful: "With the first golden rays of dawn cresting the horizon, hope blossomed like fresh wildflowers across the valley, banishing every lingering shadow of yesterday with gentle warmth."
  },
  Mystery: {
    Cozy: "Sipping the last sweet drops of tea beside the warm hearth, a peaceful sigh settled over the room, celebrating yet another quiet riddle lovingly solved among friends.",
    Exciting: "As the sirens echoed in the distance and the harbor lights cut through the dense ocean fog, the rush of victory settled into a deep, well-earned sense of triumph.",
    Funny: "Walking back through the village cobbles with grins that stretched from ear to ear, everyone agreed that some mysteries are far more fun when the answers turn out ridiculous.",
    Spooky: "The chilling sea breeze softened into a calm whisper, carrying away the ghostly secrets of the old lighthouse and leaving only the quiet rhythmic sound of waves below.",
    Hopeful: "Looking at the restored letters resting on the table, it was clear that truth and forgiveness had triumphed, weaving a fresh bond of trust across the whole neighborhood."
  },
  Adventure: {
    Cozy: "Sitting side by side on the grassy knoll as the sun dipped beneath the hills, the journey felt complete, proving that the sweetest expeditions are the ones taken at your own gentle pace.",
    Exciting: "With hearts still thumping to the wild rhythm of the rapids, paddles were raised in proud victory against the setting sun, sealing a memory that would never be forgotten.",
    Funny: "Even with muddy trousers, dandelion-stained sleeves, and sore cheeks from giggling, we agreed that getting hopelessly lost was the single best part of the entire afternoon.",
    Spooky: "Stepping back out into the cool evening air under the safe light of the crescent moon, the dark caves behind us seemed less like a nightmare and more like a secret realm of wonders.",
    Hopeful: "Standing upon the sun-drenched summit with the endless horizon spread wide before our eyes, every difficult climb in life suddenly felt entirely and beautifully worthwhile."
  },
  Comedy: {
    Cozy: "By the time the kitchen was swept and the last stray drops of syrup were wiped away, everyone was smiling, bound together by the sweet and sticky magic of a shared laugh.",
    Exciting: "Catching our breath while sharing cold lemonade on the park bench, the wild sprint down Main Street was crowned an instant legend that folks would talk about for decades.",
    Funny: "Waving goodnight to neighbors who were still wiping away tears of helpless laughter, the evening proved once and for all that life is far too delightful to take too seriously.",
    Spooky: "Long after the friendly phantom retreated into the clocktower for the night, the warm laughter from our parlor lingered like cozy incense in the October air.",
    Hopeful: "Taking one last look at the colorful, chaotic mess before turning in, we knew that love isn't about everything going right—it's about finding joy together when everything goes delightfully wrong."
  },
  'Sci-Fi': {
    Cozy: "Watching the distant starlight shimmer through the panoramic observation glass, the vast emptiness of the cosmos felt less like an abyss and more like a cozy home for humanity.",
    Exciting: "Telemetry sensors flashed green across the navigation board, confirming that against all cosmic odds, our little crew had carved a brand new highway through the stars.",
    Funny: "As the captain sipped coffee from a freshly insulated mug, the bridge crew couldn't help but smile, realizing that even in the twenty-fourth century, good humor keeps the universe running.",
    Spooky: "With the transmission safely decoded and archived, the quiet vacuum of deep space seemed to hum a peaceful lullaby, bridging centuries of distance with a single melody of hope.",
    Hopeful: "Standing beneath the open sky of a brand new world as gentle rain fell upon the soil, humanity had finally found a home where peace, wonder, and discovery could flourish forever."
  },
  Bedtime: {
    Cozy: "Tucked snugly beneath the heavy velvet quilt, with the gentle rhythm of the rain outside, the mind drifted peacefully away into the soft, comforting embrace of sweet dreams.",
    Exciting: "Sailing smoothly back into the quiet bedroom as the celestial wings folded softly away, sleep arrived instantly, rich with memories of a flight across the golden stars.",
    Funny: "Chuckling one last time into the fluffy down pillow, the silly meadow sheep finally laid down their tap shoes, letting the whole world rest in tranquil silence until dawn.",
    Spooky: "The night shadows settled like gentle guards around the bedposts, keeping watch with friendly eyes until the moon bowed low and welcomed the lavender morning light.",
    Hopeful: "With calm breaths and a grateful heart, eyelids closed against the silver starlight, knowing that tomorrow would arrive with a fresh dawn full of boundless grace and warmth."
  }
};

function ensureStoryLength(paragraphs, genre, mood) {
  const cloned = [...paragraphs];
  let words = countWords(cloned.join('\n\n'));

  if (words < 125) {
    const genreCodas = codas[genre] || codas.Fantasy;
    const coda = genreCodas[mood] || genreCodas.Cozy || Object.values(genreCodas)[0];
    cloned[cloned.length - 1] = `${cloned[cloned.length - 1]} ${coda}`;
    words = countWords(cloned.join('\n\n'));
  }

  if (words < 120) {
    cloned[cloned.length - 1] += ` And in that quiet moment, all was truly well with the world.`;
  }

  return cloned;
}

function generateDemoStory(userPrompt, genre = 'Fantasy', mood = 'Cozy', variation = 0) {
  const cleanPrompt = userPrompt.trim().replace(/[.!?]+$/, '');
  const subject = extractSubject(userPrompt);

  const genreSet = templates[genre] || templates.Fantasy;
  const moodList = genreSet[mood] || genreSet.Cozy || Object.values(genreSet)[0];

  const index = Math.abs(parseInt(variation, 10) || 0) % moodList.length;
  const chosen = moodList[index];

  const title = chosen.title(subject);
  const rawParagraphs = chosen.paragraphs(cleanPrompt, subject);
  const paragraphs = ensureStoryLength(rawParagraphs, genre, mood);
  const fullStory = paragraphs.join('\n\n');
  const wordCount = countWords(fullStory);

  return {
    title,
    story: fullStory,
    paragraphs,
    wordCount,
    readingTimeMinutes: 1,
    genre,
    mood,
    mode: 'demo'
  };
}

module.exports = {
  countWords,
  extractSubject,
  generateDemoStory
};
